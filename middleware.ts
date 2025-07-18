/* 
MIDDLEWARE DESABILITADO - NÃO FUNCIONA COM output: export
Para usar este middleware, remova output: export do next.config.mjs

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Adicionar headers de segurança adicionais
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Verificar se é uma requisição válida
  const userAgent = request.headers.get('user-agent')
  
  // Bloquear bots maliciosos conhecidos
  if (userAgent && /bot|crawler|spider/i.test(userAgent)) {
    const allowedBots = [
      'googlebot',
      'bingbot',
      'slurp',
      'duckduckbot',
      'baiduspider',
      'yandexbot',
      'facebookexternalhit',
      'twitterbot',
      'linkedinbot',
      'whatsapp',
      'telegrambot'
    ]
    
    const isAllowedBot = allowedBots.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    )
    
    if (!isAllowedBot) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }
  
  // Verificar rate limiting básico
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip
  
  // Bloquear IPs suspeitos (exemplo básico)
  const suspiciousIPs = [
    '0.0.0.0',
    '127.0.0.1'
  ]
  
  if (ip && suspiciousIPs.includes(ip)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  // Verificar métodos HTTP permitidos
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
  if (!allowedMethods.includes(request.method)) {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }
  
  return response
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
*/

// Arquivo middleware vazio para evitar conflitos com output: export
// Para reativar o middleware, descomente o código acima e remova output: export do next.config.mjs
export {}
