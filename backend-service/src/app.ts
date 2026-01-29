import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import { errorHandler } from './middleware/errorHandler'
import responseRoutes from './routes/responseRoutes'
import { checkConnection } from './services/database'

const app: Express = express()

// Middleware de logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
  })
  
  next()
})

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }))

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkConnection()
  
  res.json({ 
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/responses', responseRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  })
})

// Error handler (debe ser el último middleware)
app.use(errorHandler)

export default app
