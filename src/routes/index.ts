
import { FastifyInstance } from 'fastify';
import authRoutes from './auth.ts';

export default async function registerRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      };
    } catch (error) {
      reply.code(503);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      };
    }
  });

  fastify.register(authRoutes, { prefix: '/api/auth' });
}
