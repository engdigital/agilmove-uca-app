@echo off
echo.
echo ========================================
echo 🔐 CONFIGURAÇÃO UPLOAD KEY SEPARADO
echo ========================================
echo.

echo ℹ️  Este script cria um Upload Key separado do App Signing Key
echo ℹ️  Recomendado pelo Google para maior segurança
echo.

set /p confirm="🤔 Deseja continuar com a criação do Upload Key? (y/n): "
if /i "%confirm%" neq "y" (
    echo ❌ Operação cancelada.
    pause
    exit /b 0
)

echo.
echo 🔄 Criando Upload Key separado...

cd android

:: Criar upload key
keytool -genkeypair -v ^
    -keystore upload-key.keystore ^
    -alias upload ^
    -keyalg RSA ^
    -keysize 2048 ^
    -validity 10000 ^
    -keypass AgilMoveUpload2025!@# ^
    -storepass AgilMoveUpload2025!@# ^
    -dname "CN=AgilMove Upload Team, OU=Development, O=AgilMove, L=Sao Paulo, ST=SP, C=BR"

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro ao criar Upload Key!
    pause
    exit /b 1
)

echo.
echo 🔄 Exportando certificado do Upload Key...

:: Exportar certificado para registro no Play Console
keytool -export -rfc -keystore upload-key.keystore -alias upload -file upload_certificate.pem -storepass AgilMoveUpload2025!@#

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro ao exportar certificado!
    pause
    exit /b 1
)

echo.
echo 🔄 Criando configuração do Upload Key...

:: Criar arquivo de propriedades para upload key
echo # Configuração do Upload Key > upload-key.properties
echo storeFile=../upload-key.keystore >> upload-key.properties
echo storePassword=AgilMoveUpload2025!@# >> upload-key.properties
echo keyAlias=upload >> upload-key.properties
echo keyPassword=AgilMoveUpload2025!@# >> upload-key.properties

cd ..

echo.
echo 🎉 ========================================
echo ✅ UPLOAD KEY CRIADO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📁 Arquivos criados:
echo    android/upload-key.keystore        # Upload Key
echo    android/upload-key.properties      # Configuração
echo    android/upload_certificate.pem     # Certificado para Play Console
echo.
echo 🔐 Credenciais do Upload Key:
echo    Store Password: AgilMoveUpload2025!@#
echo    Key Password: AgilMoveUpload2025!@#
echo    Alias: upload
echo.
echo 📋 Próximos passos:
echo    1. No Play Console, vá em Release Management > App Signing
echo    2. Faça upload do certificado: android/upload_certificate.pem
echo    3. Configure o Play App Signing
echo    4. Use o Upload Key para futuros uploads
echo.
echo ⚠️  IMPORTANTE:
echo    - MANTENHA o keystore atual como App Signing Key
echo    - USE o Upload Key apenas para uploads futuros
echo    - BACKUP ambos os keystores em local seguro
echo.
pause
