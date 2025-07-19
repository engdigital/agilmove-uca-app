import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Arquivo middleware vazio para evitar conflitos com output: export
// Para reativar o middleware, descomente o código acima e remova output: export do next.config.mjs
