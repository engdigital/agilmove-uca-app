/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Headers de segurança críticos para PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy - Proteção contra XSS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval necessário para Next.js dev
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Proteção contra MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Proteção contra clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Proteção XSS para navegadores legados
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // HSTS - Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          // Controle de Referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy - Controla APIs do navegador
          {
            key: 'Permissions-Policy',
            value: [
              'geolocation=()',
              'microphone=()',
              'camera=()',
              'fullscreen=(self)',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'accelerometer=()',
              'gyroscope=()',
              'notifications=(self)'
            ].join(', ')
          },
          // Headers PWA específicos
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          }
        ]
      }
    ]
  },
  // Configuração de exportação para PWA - comentado temporariamente para suportar rotas dinâmicas
  // output: 'export',
  trailingSlash: true,
  // Configuração de compressão
  compress: true,
  // Configuração de otimização
  swcMinify: true,
  // Configuração experimental para PWA
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion'],
  },
}

export default nextConfig
