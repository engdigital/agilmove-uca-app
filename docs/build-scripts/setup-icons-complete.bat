@echo off
echo.
echo ====================================================
echo  🎨 UCA - Pergaminhos - Configuracao Completa de Icones
echo ====================================================
echo.

echo 📋 Verificando arquivos necessarios...
if not exist "public\app-icon.png" (
    echo ❌ Arquivo app-icon.png nao encontrado em public/
    echo 📋 Por favor, coloque a imagem do punho como app-icon.png na pasta public/
    pause
    exit /b 1
)

echo ✅ app-icon.png encontrado!
echo.

echo 🔄 Etapa 1: Gerando icones PWA...
call npm run icons:generate
if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar icones PWA
    pause
    exit /b 1
)

echo.
echo 🤖 Etapa 2: Configurando icones Android...
call npm run icons:android
if %errorlevel% neq 0 (
    echo ❌ Erro ao configurar icones Android
    pause
    exit /b 1
)

echo.
echo 🏗️ Etapa 3: Build da aplicacao...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo.
echo 🔄 Etapa 4: Sincronizando com Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ❌ Erro na sincronizacao
    pause
    exit /b 1
)

echo.
echo 🎉 Configuracao de icones concluida com sucesso!
echo.
echo 📋 Proximos passos para testar no Android:
echo 1. Abrir Android Studio: npx cap open android
echo 2. No Android Studio: Build ^> Clean Project
echo 3. No Android Studio: Build ^> Rebuild Project  
echo 4. Gerar APK: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 5. Instalar APK no dispositivo e verificar icone
echo.
echo ✅ O icone do punho deve aparecer agora no Android!
echo.
pause
