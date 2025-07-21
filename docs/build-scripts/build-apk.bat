@echo off
setlocal enabledelayedexpansion

:: Script para build do APK do UCA - Pergaminhos
:: Uso: build-apk.bat [debug|release]

set "BUILD_TYPE=%1"
if "%BUILD_TYPE%"=="" set "BUILD_TYPE=debug"
set "APP_NAME=UCA - Pergaminhos"
set "PACKAGE_ID=br.com.agilmove.uca"

echo 🚀 Iniciando build do APK para %APP_NAME%
echo 📦 Package ID: %PACKAGE_ID%
echo 🔧 Tipo de build: %BUILD_TYPE%
echo.

:: Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

:: Verificar se o npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não está instalado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

:: Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install --legacy-peer-deps
)

:: Configurar ícones PWA + Android
echo 🎨 Configurando ícones PWA + Android...
npm run icons:setup
if %errorlevel% neq 0 (
    echo ⚠️ Aviso: Erro na configuração de ícones (continuando build...)
)

:: Fazer build do projeto web
echo 🔨 Fazendo build do projeto web...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build do projeto web
    pause
    exit /b 1
)

:: Sincronizar com Capacitor
echo 🔄 Sincronizando com Capacitor...
npx cap sync
if %errorlevel% neq 0 (
    echo ❌ Erro na sincronização com Capacitor
    pause
    exit /b 1
)

:: Verificar se o Android Studio está disponível
where studio >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Android Studio encontrado
) else (
    echo ⚠️  Android Studio não encontrado. Certifique-se de que está instalado.
    echo    Você pode baixar em: https://developer.android.com/studio
)

:: Preparar instruções para o usuário
echo.
echo ✅ Projeto preparado com sucesso!
echo.
echo 📱 Para gerar o APK:
echo    1. Execute: npm run android:open
echo    2. No Android Studio, aguarde o Gradle sincronizar
echo    3. Vá em: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo    4. O APK estará em: android\app\build\outputs\apk\%BUILD_TYPE%\
echo.
echo 🔧 Ou execute automaticamente:
echo    npm run android:build
echo.

:: Tentar abrir o Android Studio automaticamente
set /p choice="🤔 Deseja abrir o Android Studio agora? (y/n): "
if /i "%choice%"=="y" (
    echo 🚀 Abrindo Android Studio...
    npm run android:open
)

echo 🎉 Build preparado com sucesso!
pause
