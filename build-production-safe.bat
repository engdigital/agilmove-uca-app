@echo off
setlocal enabledelayedexpansion

echo ========================================
echo BUILD DE PRODUCAO - UCA PERGAMINHOS
echo ========================================
echo.

REM Verificar se estamos no diretorio correto
if not exist "package.json" (
    echo ERRO: Execute este script na raiz do projeto!
    echo Certifique-se de estar em: agilmove-uca-app\
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    pause
    exit /b 1
)

echo Passo 1: Instalando dependencias (se necessario)...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo ERRO: Falha na instalacao de dependencias!
        pause
        exit /b 1
    )
)

echo.
echo Passo 2: Configurando icones...
npm run icons:setup
if !errorlevel! neq 0 (
    echo AVISO: Problema na configuracao de icones. Continuando...
)

echo.
echo Passo 3: Build do Next.js...
npm run build
if !errorlevel! neq 0 (
    echo ERRO: Falha no build do Next.js!
    echo.
    echo Dicas para resolver:
    echo 1. Verifique erros de TypeScript/ESLint acima
    echo 2. Execute: npm run lint
    echo 3. Execute: npm run dev para testar
    pause
    exit /b 1
)

echo.
echo Passo 4: Sincronizando com Capacitor...
npx cap sync
if !errorlevel! neq 0 (
    echo ERRO: Falha na sincronizacao do Capacitor!
    echo.
    echo Dicas para resolver:
    echo 1. Verifique se Capacitor esta instalado
    echo 2. Execute: npm install @capacitor/cli @capacitor/core
    pause
    exit /b 1
)

echo.
echo Passo 5: Verificando projeto Android...
if not exist "android" (
    echo ERRO: Pasta android nao encontrada!
    echo Execute: npx cap add android
    pause
    exit /b 1
)

echo.
echo Passo 6: Gerando APK de producao...
cd android

REM Verificar se gradlew existe
if not exist "gradlew.bat" (
    echo ERRO: gradlew.bat nao encontrado!
    echo Certifique-se de que o projeto Android foi configurado corretamente.
    cd ..
    pause
    exit /b 1
)

REM Tentar build de producao
call gradlew.bat assembleRelease
if !errorlevel! neq 0 (
    echo ERRO: Falha no build do APK!
    echo.
    echo Dicas para resolver:
    echo 1. Verifique se Android SDK esta instalado
    echo 2. Verifique JAVA_HOME e ANDROID_HOME
    echo 3. Execute: gradlew.bat clean
    echo 4. Abra o projeto no Android Studio para mais detalhes
    cd ..
    pause
    exit /b 1
)

cd ..

REM Verificar se APK foi gerado
set "APK_PATH=android\app\build\outputs\apk\release\app-release.apk"
if exist "%APK_PATH%" (
    echo.
    echo ========================================
    echo BUILD CONCLUIDO COM SUCESSO!
    echo ========================================
    echo.
    echo APK GERADO: %APK_PATH%
    
    REM Mostrar tamanho do arquivo
    for %%I in ("%APK_PATH%") do (
        set "size=%%~zI"
        set /a "sizeMB=!size! / 1048576"
        echo Tamanho: !sizeMB! MB
    )
    
    echo Assinado: Sim
    echo Pronto para distribuicao!
    echo.
    echo Proximos passos:
    echo 1. Teste o APK em dispositivo Android
    echo 2. Para Play Store: Use o APK gerado
    echo 3. Para Bundle: Execute build-bundle.bat
) else (
    echo ERRO: APK nao foi gerado!
    echo Verifique os logs de erro acima.
)

echo.
pause
