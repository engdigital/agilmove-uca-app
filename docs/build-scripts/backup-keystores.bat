@echo off
echo.
echo ========================================
echo 💾 BACKUP AUTOMÁTICO - KEYSTORES
echo ========================================
echo.

echo ℹ️  Este script faz backup dos keystores de forma segura
echo.

:: Criar diretório de backup se não existir
if not exist "backup" mkdir backup
if not exist "backup\keystores" mkdir backup\keystores

:: Data e hora para o backup
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set today=%%c-%%b-%%a
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set now=%%a-%%b
set timestamp=%today%_%now::=-%

echo 🔄 Criando backup dos keystores...

:: Backup do keystore principal
if exist "android\agilmove-release.keystore" (
    copy "android\agilmove-release.keystore" "backup\keystores\agilmove-release_%timestamp%.keystore" >nul
    echo ✅ Backup do keystore principal criado
) else (
    echo ⚠️  Keystore principal não encontrado
)

:: Backup do upload key (se existir)
if exist "android\upload-key.keystore" (
    copy "android\upload-key.keystore" "backup\keystores\upload-key_%timestamp%.keystore" >nul
    echo ✅ Backup do upload key criado
) else (
    echo ℹ️  Upload key não encontrado (normal se ainda não criado)
)

:: Backup das configurações
if exist "android\keystore.properties" (
    copy "android\keystore.properties" "backup\keystores\keystore_%timestamp%.properties" >nul
    echo ✅ Backup das configurações criado
)

if exist "android\upload-key.properties" (
    copy "android\upload-key.properties" "backup\keystores\upload-key_%timestamp%.properties" >nul
    echo ✅ Backup das configurações do upload key criado
)

:: Backup do certificado (se existir)
if exist "android\upload_certificate.pem" (
    copy "android\upload_certificate.pem" "backup\keystores\upload_certificate_%timestamp%.pem" >nul
    echo ✅ Backup do certificado criado
)

echo.
echo 🔄 Verificando integridade dos keystores...

:: Verificar keystore principal
if exist "android\agilmove-release.keystore" (
    echo ℹ️  Verificando keystore principal...
    keytool -list -v -keystore "android\agilmove-release.keystore" -storepass AgilMove2025!@# | findstr "Válido até\|Valid until" >nul
    if %ERRORLEVEL% equ 0 (
        echo ✅ Keystore principal íntegro
    ) else (
        echo ⚠️  Keystore principal pode estar corrompido
    )
)

:: Verificar upload key
if exist "android\upload-key.keystore" (
    echo ℹ️  Verificando upload key...
    keytool -list -v -keystore "android\upload-key.keystore" -storepass AgilMoveUpload2025!@# | findstr "Válido até\|Valid until" >nul
    if %ERRORLEVEL% equ 0 (
        echo ✅ Upload key íntegro
    ) else (
        echo ⚠️  Upload key pode estar corrompido
    )
)

echo.
echo 📋 Criando relatório de backup...

:: Criar relatório de backup
echo # Relatório de Backup - %timestamp% > "backup\keystores\backup-report_%timestamp%.txt"
echo. >> "backup\keystores\backup-report_%timestamp%.txt"
echo ## Arquivos de Backup: >> "backup\keystores\backup-report_%timestamp%.txt"

dir "backup\keystores\*_%timestamp%.*" /b >> "backup\keystores\backup-report_%timestamp%.txt" 2>nul

echo. >> "backup\keystores\backup-report_%timestamp%.txt"
echo ## Localização: >> "backup\keystores\backup-report_%timestamp%.txt"
echo %cd%\backup\keystores\ >> "backup\keystores\backup-report_%timestamp%.txt"

echo. >> "backup\keystores\backup-report_%timestamp%.txt"
echo ## Instruções de Recuperação: >> "backup\keystores\backup-report_%timestamp%.txt"
echo 1. Para restaurar o keystore principal: >> "backup\keystores\backup-report_%timestamp%.txt"
echo    copy backup\keystores\agilmove-release_%timestamp%.keystore android\agilmove-release.keystore >> "backup\keystores\backup-report_%timestamp%.txt"
echo. >> "backup\keystores\backup-report_%timestamp%.txt"
echo 2. Para restaurar o upload key: >> "backup\keystores\backup-report_%timestamp%.txt"
echo    copy backup\keystores\upload-key_%timestamp%.keystore android\upload-key.keystore >> "backup\keystores\backup-report_%timestamp%.txt"

echo.
echo 🎉 ========================================
echo ✅ BACKUP CONCLUÍDO COM SUCESSO!
echo 🎉 ========================================
echo.
echo 📁 Localização: backup\keystores\
echo 📊 Relatório: backup\keystores\backup-report_%timestamp%.txt
echo.
echo 💡 RECOMENDAÇÕES:
echo    1. Faça backup em local externo (nuvem, USB)
echo    2. Execute este script regularmente
echo    3. Teste a restauração periodicamente
echo    4. Mantenha múltiplas cópias em locais diferentes
echo.
echo ⚠️  LEMBRE-SE:
echo    - SEM o keystore, NÃO é possível atualizar o app
echo    - Mantenha as senhas em local seguro
echo    - NUNCA compartilhe os keystores
echo.
pause
