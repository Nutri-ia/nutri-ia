/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração corrigida para Next.js 15
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Configuração para evitar problemas de roteamento
  trailingSlash: false,
  
  // Otimizações para build
  poweredByHeader: false
};

export default nextConfig;