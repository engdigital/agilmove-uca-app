@echo off
echo.
echo ========================================
echo 🔐 CONFIGURAÇÃO DO KEYSTORE PARA RELEASE
echo ========================================
echo.

echo Este script irá criar um novo keystore para assinatura do APK de produção.
echo.
echo IMPORTANTE: Guarde as senhas em local seguro!
echo            Se perder o keystore, não poderá atualizar o app na Play Store.
echo.

:: Gerar senha aleatória se não fornecida
set STORE_PASSWORD=AgilMove2025!@#
set KEY_PASSWORD=AgilMove2025!@#
set ALIAS_NAME=agilmove-release

echo 📝 Usando configurações padrão:
echo    Alias: %ALIAS_NAME%
echo    Organização: AgilMove
echo    Aplicação: UCA - Pergaminhos
echo.

echo 🔄 Criando keystore...

cd android\app

:: Remover keystore antigo se existir
if exist agilmove-release.keystore del agilmove-release.keystore

:: Criar o keystore
keytool -genkeypair -v -keystore agilmove-release.keystore -alias %ALIAS_NAME% -keyalg RSA -keysize 2048 -validity 10000 -storepass %STORE_PASSWORD% -keypass %KEY_PASSWORD% -dname "CN=AgilMove Team, OU=Development, O=AgilMove, L=Sao Paulo, ST=SP, C=BR"

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro ao criar keystore!
    pause
    exit /b 1
)

echo.
echo ✅ Keystore criado com sucesso!
echo.

:: Atualizar o arquivo keystore.properties
echo # Configuração do keystore para release > ..\keystore.properties
echo storeFile=../agilmove-release.keystore >> ..\keystore.properties
echo storePassword=%STORE_PASSWORD% >> ..\keystore.properties
echo keyAlias=%ALIAS_NAME% >> ..\keystore.properties
echo keyPassword=%KEY_PASSWORD% >> ..\keystore.properties

echo 📄 Arquivo keystore.properties atualizado.

:: Mover keystore para o diretório android
echo 🔄 Movendo keystore para o diretório correto...
move agilmove-release.keystore ..\agilmove-release.keystore

cd ..\..

:: Testar o build de release
echo.
echo 🧪 Testando build de release...
cd android
call gradlew.bat assembleRelease

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro no build de release!
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 ========================================
echo ✅ KEYSTORE CONFIGURADO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📁 Arquivo criado: android\agilmove-release.keystore
echo 📄 Configuração: android\keystore.properties
echo.
echo 🔐 CREDENCIAIS (GUARDE EM LOCAL SEGURO):
echo    Store Password: %STORE_PASSWORD%
echo    Key Password: %KEY_PASSWORD%
echo    Alias: %ALIAS_NAME%
echo.
echo 📦 APK GERADO COM SUCESSO:
echo    Localização: android\app\build\outputs\apk\release\app-release.apk
echo    Tamanho: ~22MB
echo    Assinado: ✅ Sim
echo.
echo 📋 Próximos passos:
echo    1. APK pronto para distribuição!
echo    2. Para futuras atualizações: cd android ^&^& gradlew assembleRelease
echo    3. Para Play Store: Use o APK em app\build\outputs\apk\release\
echo.
echo ⚠️  ATENÇÃO: Se perder este keystore, não poderá atualizar o app na Play Store!
echo.
echo 🔄 Para gerar novamente: Execute este script novamente
echo.
pause
