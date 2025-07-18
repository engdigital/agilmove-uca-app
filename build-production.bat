@echo off
echo.
echo ========================================
echo 🚀 BUILD DE PRODUÇÃO - AGILMOVE UCA
echo ========================================
echo.

echo 📋 Este script irá:
echo    1. Fazer build do Next.js
echo    2. Sincronizar com Capacitor
echo    3. Gerar APK de produção assinado
echo.

echo 🔄 Passo 1: Build do Next.js...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no build do Next.js!
    pause
    exit /b 1
)

echo.
echo 🔄 Passo 2: Sincronizando com Capacitor...
call npx cap sync

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro na sincronização do Capacitor!
    pause
    exit /b 1
)

echo.
echo 🔄 Passo 3: Gerando APK de produção...
cd android
call gradlew.bat assembleRelease

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no build do APK!
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 ========================================
echo ✅ BUILD CONCLUÍDO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📦 APK GERADO:
echo    Localização: android\app\build\outputs\apk\release\app-release.apk
echo    Assinado: ✅ Sim
echo    Pronto para distribuição!
echo.
echo 📋 Próximos passos:
echo    1. Teste o APK em dispositivo Android
echo    2. Para Play Store: Use o APK gerado
echo    3. Para updates: Execute este script novamente
echo.
pause
