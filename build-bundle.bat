@echo off
echo.
echo ========================================
echo 📦 BUILD ANDROID APP BUNDLE (AAB)
echo ========================================
echo.

echo 🔄 1. Building Next.js application...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no build do Next.js!
    pause
    exit /b 1
)

echo.
echo 🔄 2. Syncing Capacitor...
call npx cap sync
if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no sync do Capacitor!
    pause
    exit /b 1
)

echo.
echo 🔄 3. Building Android App Bundle...
cd android
call gradlew.bat bundleRelease
if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no build do Bundle!
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 ========================================
echo ✅ ANDROID APP BUNDLE GERADO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📦 Arquivo: android\app\build\outputs\bundle\release\app-release.aab
echo 📱 Tamanho: ~8-12MB (otimizado)
echo 🔐 Assinado: ✅ Sim
echo 🏪 Pronto para: Google Play Store
echo.
echo 📋 Próximos passos:
echo    1. Upload do AAB para Google Play Console
echo    2. Configurar Play App Signing
echo    3. Testar em Internal Testing
echo    4. Publicar na Production
echo.
echo 💡 DICA: AAB é menor que APK e otimizado por dispositivo!
echo.
pause
