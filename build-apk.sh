#!/bin/bash

# Script para build do APK do AgilMove UCA
# Uso: ./build-apk.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}
APP_NAME="AgilMove UCA"
PACKAGE_ID="br.com.agilmove.uca"

echo "🚀 Iniciando build do APK para $APP_NAME"
echo "📦 Package ID: $PACKAGE_ID"
echo "🔧 Tipo de build: $BUILD_TYPE"
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Fazer build do projeto web
echo "🔨 Fazendo build do projeto web..."
npm run build

# Sincronizar com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync

# Verificar se o Android Studio está disponível
if command -v studio &> /dev/null || command -v "android-studio" &> /dev/null; then
    echo "✅ Android Studio encontrado"
else
    echo "⚠️  Android Studio não encontrado. Certifique-se de que está instalado."
    echo "   Você pode baixar em: https://developer.android.com/studio"
fi

# Preparar instruções para o usuário
echo ""
echo "✅ Projeto preparado com sucesso!"
echo ""
echo "📱 Para gerar o APK:"
echo "   1. Execute: npm run android:open"
echo "   2. No Android Studio, aguarde o Gradle sincronizar"
echo "   3. Vá em: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "   4. O APK estará em: android/app/build/outputs/apk/$BUILD_TYPE/"
echo ""
echo "🔧 Ou execute automaticamente:"
echo "   npm run android:build"
echo ""

# Tentar abrir o Android Studio automaticamente
read -p "🤔 Deseja abrir o Android Studio agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Abrindo Android Studio..."
    npm run android:open
fi

echo "🎉 Build preparado com sucesso!"
