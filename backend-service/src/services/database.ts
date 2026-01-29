import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'

// Configuración del pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL para producción
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  // Configuración del pool optimizada para desarrollo local
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '10000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000', 10),
  // Forzar IPv4 para evitar errores ECONNREFUSED en ::1
  host: 'localhost',
  allowExitOnIdle: true
})

// Manejo de errores del pool (silenciar logs innecesarios)
pool.on('error', (err: Error) => {
  // Solo loggear errores críticos
  if (err.message !== 'terminating connection due to administrator command') {
    console.error('Error inesperado en cliente inactivo de PostgreSQL:', err)
  }
})

pool.on('connect', () => {
  console.log('Nueva conexión establecida con PostgreSQL')
})

// Función helper para queries con logging
export async function query<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    
    console.log('Query ejecutada', {
      text: text.substring(0, 100),
      duration: `${duration}ms`,
      rows: result.rowCount
    })
    
    return result
  } catch (error) {
    console.error('Error ejecutando query:', {
      text,
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
}

// Función para transacciones
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Cerrar pool (para testing/shutdown)
export async function closePool(): Promise<void> {
  console.log('Cerrando pool de conexiones...')
  await pool.end()
  console.log('Pool cerrado')
}

// Verificar conexión
export async function checkConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()')
    console.log('Conexión a PostgreSQL exitosa:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error)
    return false
  }
}

export default pool
