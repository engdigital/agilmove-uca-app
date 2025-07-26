@echo off
setlocal enabledelayedexpansion

REM ========================================
REM BUILD COMPLETO PARA GOOGLE PLAY STORE
REM AgilMove UCA App - Versao 1.0.4
REM Com Ofuscacao R8/ProGuard Habilitada
REM ========================================

echo.
echo ==========================================
echo BUILD PARA GOOGLE PLAY STORE - v1.0.4
echo Com Ofuscacao de Codigo (R8/ProGuard)
echo ==========================================
echo.

REM Definir variaveis
set VERSION=v1.0.4
set PROJECT_ROOT=%~dp0..\..\..
set BUILD_DIR=%~dp0%VERSION%
set APK_SOURCE=%PROJECT_ROOT%\android\app\build\outputs\apk\release
set AAB_SOURCE=%PROJECT_ROOT%\android\app\build\outputs\bundle\release
set MAPPING_SOURCE=%PROJECT_ROOT%\android\app\build\outputs\mapping\release

echo Pasta do projeto: %PROJECT_ROOT%
echo Pasta de saida: %BUILD_DIR%
echo.

REM Ir para a raiz do projeto
cd /d "%PROJECT_ROOT%"

echo Passo 1: Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% neq 0 (
        echo ERRO: Falha na instalacao das dependencias!
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencias ja instaladas
)

echo.
echo Passo 2: Limpando cache do Next.js...
rmdir /s /q .next 2>nul
rmdir /s /q out 2>nul

echo.
echo Passo 3: Build do Next.js...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha no build do Next.js!
    echo.
    echo POSSIVEL SOLUCAO:
    echo 1. Verifique se todos os componentes UI estao instalados
    echo 2. Execute: npm install @radix-ui/react-tabs @radix-ui/react-toast
    echo 3. Ou execute: npx shadcn-ui@latest add button card badge tabs
    echo.
    pause
    exit /b 1
)

echo.
echo Passo 4: Sincronizando com Capacitor...
call npx cap sync
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na sincronizacao do Capacitor!
    pause
    exit /b 1
)

echo.
echo Passo 5: Gerando APK assinado...
cd android
call gradlew.bat assembleRelease
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha no build do APK!
    cd /d "%PROJECT_ROOT%"
    pause
    exit /b 1
)

echo.
echo Passo 6: Gerando AAB para Google Play Store...
call gradlew.bat bundleRelease
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha no build do AAB!
    cd /d "%PROJECT_ROOT%"
    pause
    exit /b 1
)

cd /d "%PROJECT_ROOT%"

echo.
echo Passo 7: Organizando arquivos para Google Play Store...

REM Criar estrutura de pastas
if not exist "%BUILD_DIR%" mkdir "%BUILD_DIR%"
if not exist "%BUILD_DIR%\apk" mkdir "%BUILD_DIR%\apk"
if not exist "%BUILD_DIR%\aab" mkdir "%BUILD_DIR%\aab"
if not exist "%BUILD_DIR%\assets" mkdir "%BUILD_DIR%\assets"
if not exist "%BUILD_DIR%\screenshots" mkdir "%BUILD_DIR%\screenshots"
if not exist "%BUILD_DIR%\mapping" mkdir "%BUILD_DIR%\mapping"
if not exist "%BUILD_DIR%\mapping" mkdir "%BUILD_DIR%\mapping"

REM Copiar APK
if exist "%APK_SOURCE%\app-release.apk" (
    copy "%APK_SOURCE%\app-release.apk" "%BUILD_DIR%\apk\agilmove-uca-v1.0.4.apk"
    echo ✓ APK copiado para: %BUILD_DIR%\apk\
) else (
    echo ⚠ APK nao encontrado em: %APK_SOURCE%
)

REM Copiar AAB
if exist "%AAB_SOURCE%\app-release.aab" (
    copy "%AAB_SOURCE%\app-release.aab" "%BUILD_DIR%\aab\agilmove-uca-v1.0.4.aab"
    echo ✓ AAB copiado para: %BUILD_DIR%\aab\
) else (
    echo ⚠ AAB nao encontrado em: %AAB_SOURCE%
)

REM Copiar arquivo de mapping (desobfuscacao) se existir
if exist "%MAPPING_SOURCE%\mapping.txt" (
    copy "%MAPPING_SOURCE%\mapping.txt" "%BUILD_DIR%\mapping\mapping.txt"
    echo ✓ Arquivo de mapping (desobfuscacao) copiado
    
    REM Criar arquivo ZIP para upload no Google Play Console
    echo Criando arquivo ZIP para Google Play Console...
    cd /d "%BUILD_DIR%\mapping"
    powershell -Command "Compress-Archive -Path 'mapping.txt' -DestinationPath 'mapping-symbols-v1.0.4.zip' -Force"
    if exist "mapping-symbols-v1.0.4.zip" (
        echo ✓ Arquivo ZIP criado: mapping-symbols-v1.0.4.zip
    ) else (
        echo ⚠ Falha ao criar arquivo ZIP
    )
    cd /d "%PROJECT_ROOT%"
) else (
    echo ⚠ Arquivo de mapping nao encontrado - Normal se ofuscacao nao estiver habilitada
)

REM Copiar icones e assets
copy "public\icon-512x512.png" "%BUILD_DIR%\assets\app-icon-512.png" 2>nul
copy "public\app-icon.png" "%BUILD_DIR%\assets\app-icon.png" 2>nul
copy "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" "%BUILD_DIR%\assets\android-icon.png" 2>nul

REM Copiar screenshots se existirem
if exist "public\screen-shots\*.png" (
    copy "public\screen-shots\*.png" "%BUILD_DIR%\screenshots\" 2>nul
    echo ✓ Screenshots copiados
)

REM Criar arquivo de informacoes
echo Criando arquivo de informacoes...
(
echo ==========================================
echo AGILMOVE UCA APP - VERSAO 1.0.4
echo ==========================================
echo.
echo Data de Build: %date% %time%
echo Versao: 1.0.4
echo.
echo ARQUIVOS PARA GOOGLE PLAY STORE:
echo.
echo 1. AAB ^(RECOMENDADO^):
echo    Arquivo: aab\agilmove-uca-v1.0.4.aab
echo    Uso: Upload principal no Google Play Console
echo.
echo 2. APK ^(ALTERNATIVO^):
echo    Arquivo: apk\agilmove-uca-v1.0.4.apk
echo    Uso: Testes ou distribuicao direta
echo.
echo 3. ASSETS:
echo    - app-icon-512.png ^(Icone da app^)
echo    - android-icon.png ^(Icone Android^)
echo.
echo 4. SCREENSHOTS:
echo    - Capturas de tela da app
echo.
echo 5. MAPPING ^(DESOBFUSCACAO^):
echo    - mapping.txt ^(Arquivo original^)
echo    - mapping-symbols-v1.0.4.zip ^(Para upload no Google Play^)
echo.
echo OBSERVACOES:
echo - AAB gerado com ofuscacao R8/ProGuard habilitada
echo - Arquivo de mapping incluso para desobfuscacao
echo - Arquivo ZIP criado automaticamente para Google Play Console
echo - Tamanho do app otimizado automaticamente
echo - Version Code: 2 ^(incrementado automaticamente^)
echo.
echo UPLOAD NO GOOGLE PLAY CONSOLE:
echo 1. Upload do AAB: Use o arquivo aab\agilmove-uca-v1.0.4.aab
echo 2. Simbolos de depuracao: Use mapping\mapping-symbols-v1.0.4.zip
echo.
echo PROXIMO PASSO:
echo 1. Acesse: https://play.google.com/console
echo 2. Faca upload do arquivo AAB
echo 3. Configure as informacoes da app
echo 4. Envie para revisao
echo.
) > "%BUILD_DIR%\README-GOOGLE-PLAY.txt"

echo.
echo ==========================================
echo BUILD CONCLUIDO COM SUCESSO!
echo ==========================================
echo.
echo Pasta de saida: %BUILD_DIR%
echo.
echo ARQUIVOS GERADOS:
if exist "%BUILD_DIR%\aab\agilmove-uca-v1.0.4.aab" echo ✓ AAB para Google Play Store ^(com ofuscacao^)
if exist "%BUILD_DIR%\apk\agilmove-uca-v1.0.4.apk" echo ✓ APK assinado
if exist "%BUILD_DIR%\assets" echo ✓ Assets e icones
if exist "%BUILD_DIR%\mapping" echo ✓ Arquivo de mapping para desobfuscacao
if exist "%BUILD_DIR%\README-GOOGLE-PLAY.txt" echo ✓ Guia de upload
echo.
echo PROXIMO PASSO:
echo 1. Abra a pasta: %BUILD_DIR%
echo 2. Use o arquivo AAB para upload no Google Play Store
echo 3. Leia o arquivo README-GOOGLE-PLAY.txt
echo.

REM Abrir pasta de destino
explorer "%BUILD_DIR%"

pause
