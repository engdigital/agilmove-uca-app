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
  // Headers de segurança - removidos porque não funcionam com output: export
  // Para usar headers de segurança, você precisaria de um servidor web que os configure
  // Configuração de exportação para PWA
  output: 'export',
  trailingSlash: true,
  // Configuração de rewrites - removida porque não funciona com output: export
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
