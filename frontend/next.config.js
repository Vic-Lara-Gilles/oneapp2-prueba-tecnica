/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de producción
  poweredByHeader: false, // Remover X-Powered-By header por seguridad
  compress: true, // Habilitar compresión gzip
  
  // Optimización de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Experimental features para mejor performance
  experimental: {
    optimizeCss: true, // CSS optimization
  },
};

module.exports = nextConfig;
