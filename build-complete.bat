@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 BUILD COMPLETO DO AGILMOVE UCA
echo ========================================
echo.

echo 📋 Etapa 1: Configurando ícones...
cd scripts
call node generate-icons.js
cd ..

echo.
echo 📋 Etapa 2: Fazendo build do Next.js...
call npm run build

echo.
echo 📋 Etapa 3: Sincronizando com Capacitor...
call npx cap sync

echo.
echo 📋 Etapa 4: Gerando APK de Debug...
cd android
call gradlew.bat assembleDebug
cd ..

echo.
echo 🎉 ========================================
echo ✅ BUILD CONCLUÍDO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📱 Resultados:
echo    • PWA: out/index.html
echo    • APK Debug: android/app/build/outputs/apk/debug/app-debug.apk
echo    • Ícones: Configurados para todos os dispositivos
echo.
echo 🔄 Próximos passos:
echo    1. Teste o PWA: npm run dev
echo    2. Instale o APK no dispositivo Android
echo    3. Teste a instalação do PWA no navegador
echo    4. Para APK de produção, configure o keystore
echo.
pause
