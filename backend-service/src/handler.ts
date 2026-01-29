import serverlessExpress from '@codegenie/serverless-express'
import 'dotenv/config'
import app from './app'

// Singleton para reutilizar en warm starts de Lambda
let serverlessExpressInstance: ReturnType<typeof serverlessExpress>

/**
 * Setup asíncrono - se ejecuta una vez en cold start
 */
async function setup() {
  console.log('Inicializando Lambda handler...')
  
  // Verificar variables de entorno críticas
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada')
  }
  
  console.log('Variables de entorno cargadas')
  console.log('Environment:', process.env.NODE_ENV || 'development')
  
  // Crear instancia de serverless-express
  serverlessExpressInstance = serverlessExpress({ app })
  
  console.log('Lambda handler inicializado exitosamente')
  return serverlessExpressInstance
}

/**
 * Handler principal de Lambda
 * Reutiliza la instancia en warm starts
 */
export const handler = async (event: any, context: any) => {
  // Cold start: crear instancia
  if (!serverlessExpressInstance) {
    try {
      serverlessExpressInstance = await setup()
    } catch (error) {
      console.error('Error en setup:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error de inicialización del servidor',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }
  
  // Warm start: reutilizar instancia existente
  return serverlessExpressInstance(event, context)
}
