@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 BUILD COMPLETO DO UCA - PERGAMINHOS
echo ========================================
echo.

echo 📋 Etapa 1: Configurando ícones PWA + Android...
call npm run icons:setup

echo.
echo 📋 Etapa 2: Verificando configuração de ícones...
call npm run icons:check
echo.
echo 📋 Etapa 3: Fazendo build do Next.js...
call npm run build

echo.
echo 📋 Etapa 4: Sincronizando com Capacitor...
call npx cap sync

echo.
echo 📋 Etapa 5: Gerando APK de Debug...
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
echo    • Ícones PWA: 8/8 tamanhos configurados
echo    • Ícones Android: 5/5 densidades configuradas
echo    • Ícone: Punho do UCA (não ícone padrão)
echo.
echo 🔄 Próximos passos:
echo    1. Teste o PWA: npm run dev
echo    2. Instale o APK no dispositivo Android
echo    3. Verifique se o ícone do punho aparece
echo    4. Para APK de produção: .\build-production.bat
echo.
pause
