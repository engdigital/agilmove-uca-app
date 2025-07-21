@echo off
echo.
echo ========================================
echo 🔍 VALIDADOR GOOGLE PLAY APP SIGNING
echo ========================================
echo.

set /a total_checks=0
set /a passed_checks=0

echo 📋 Verificando requisitos do Google Play App Signing...
echo.

:: ===== SEÇÃO 1: KEYSTORE E ASSINATURA =====
echo 🔐 1. KEYSTORE E ASSINATURA
echo ----------------------------------------

set /a total_checks+=1
if exist "android\agilmove-release.keystore" (
    echo ✅ Keystore principal existe
    set /a passed_checks+=1
) else (
    echo ❌ Keystore principal não encontrado
)

set /a total_checks+=1
if exist "android\keystore.properties" (
    echo ✅ Configuração do keystore existe
    set /a passed_checks+=1
) else (
    echo ❌ Configuração do keystore não encontrada
)

:: Verificar se keystore está íntegro
set /a total_checks+=1
if exist "android\agilmove-release.keystore" (
    keytool -list -keystore "android\agilmove-release.keystore" -storepass AgilMove2025!@# >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Keystore íntegro e acessível
        set /a passed_checks+=1
    ) else (
        echo ❌ Keystore corrompido ou senha incorreta
    )
) else (
    echo ❌ Não é possível verificar integridade (keystore não existe)
)

echo.

:: ===== SEÇÃO 2: CONFIGURAÇÃO ANDROID =====
echo 📱 2. CONFIGURAÇÃO ANDROID
echo ----------------------------------------

set /a total_checks+=1
findstr "applicationId.*br.com.agilmove.uca" "android\app\build.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Package ID único configurado
    set /a passed_checks+=1
) else (
    echo ❌ Package ID não configurado corretamente
)

set /a total_checks+=1
findstr "minSdkVersion" "android\variables.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ minSdkVersion configurado
    set /a passed_checks+=1
) else (
    echo ❌ minSdkVersion não encontrado
)

set /a total_checks+=1
findstr "targetSdkVersion" "android\variables.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ targetSdkVersion configurado
    set /a passed_checks+=1
) else (
    echo ❌ targetSdkVersion não encontrado
)

set /a total_checks+=1
findstr "versionCode.*1" "android\app\build.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Versioning configurado
    set /a passed_checks+=1
) else (
    echo ❌ Versioning não configurado
)

echo.

:: ===== SEÇÃO 3: ANDROID APP BUNDLE =====
echo 📦 3. ANDROID APP BUNDLE (AAB)
echo ----------------------------------------

set /a total_checks+=1
findstr "bundle" "android\app\build.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Configuração AAB habilitada
    set /a passed_checks+=1
) else (
    echo ❌ Configuração AAB não encontrada
)

set /a total_checks+=1
if exist "build-bundle.bat" (
    echo ✅ Script de build AAB existe
    set /a passed_checks+=1
) else (
    echo ❌ Script de build AAB não encontrado
)

set /a total_checks+=1
findstr "cap:bundle" "package.json" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Comando npm para AAB configurado
    set /a passed_checks+=1
) else (
    echo ❌ Comando npm para AAB não configurado
)

echo.

:: ===== SEÇÃO 4: ASSINATURA AUTOMÁTICA =====
echo ✍️  4. ASSINATURA AUTOMÁTICA
echo ----------------------------------------

set /a total_checks+=1
findstr "signingConfigs" "android\app\build.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Configuração de assinatura no build.gradle
    set /a passed_checks+=1
) else (
    echo ❌ Configuração de assinatura não encontrada
)

set /a total_checks+=1
findstr "signingConfig signingConfigs.release" "android\app\build.gradle" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Assinatura automática para release
    set /a passed_checks+=1
) else (
    echo ❌ Assinatura automática não configurada
)

echo.

:: ===== SEÇÃO 5: SEGURANÇA AVANÇADA =====
echo 🔒 5. SEGURANÇA AVANÇADA (Opcional)
echo ----------------------------------------

set /a total_checks+=1
if exist "android\upload-key.keystore" (
    echo ✅ Upload Key separado criado
    set /a passed_checks+=1
) else (
    echo ⚠️  Upload Key separado não criado (recomendado)
)

set /a total_checks+=1
if exist "backup\keystores" (
    echo ✅ Sistema de backup configurado
    set /a passed_checks+=1
) else (
    echo ⚠️  Sistema de backup não configurado
)

set /a total_checks+=1
if exist "setup-upload-key.bat" (
    echo ✅ Script para Upload Key disponível
    set /a passed_checks+=1
) else (
    echo ❌ Script para Upload Key não encontrado
)

echo.

:: ===== SEÇÃO 6: CAPACITOR E BUILD =====
echo 🔧 6. CAPACITOR E BUILD
echo ----------------------------------------

set /a total_checks+=1
if exist "capacitor.config.ts" (
    echo ✅ Configuração Capacitor existe
    set /a passed_checks+=1
) else (
    echo ❌ Configuração Capacitor não encontrada
)

set /a total_checks+=1
findstr "br.com.agilmove.uca" "capacitor.config.ts" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ App ID configurado no Capacitor
    set /a passed_checks+=1
) else (
    echo ❌ App ID não configurado no Capacitor
)

set /a total_checks+=1
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo ✅ APK de release já foi gerado
    set /a passed_checks+=1
) else (
    echo ℹ️  APK de release ainda não foi gerado
)

echo.

:: ===== CÁLCULO DO SCORE =====
set /a percentage=(%passed_checks% * 100) / %total_checks%

echo ========================================
echo 📊 RELATÓRIO FINAL
echo ========================================
echo.
echo ✅ Passou: %passed_checks%/%total_checks% verificações
echo 📈 Score: %percentage%%%
echo.

if %percentage% geq 90 (
    echo 🎉 EXCELENTE! Projeto pronto para Google Play Store
    echo 💡 Status: Implementação quase completa
) else if %percentage% geq 75 (
    echo ✅ BOM! Projeto quase pronto para Google Play Store
    echo 💡 Status: Alguns itens opcionais pendentes
) else if %percentage% geq 50 (
    echo ⚠️  PARCIAL. Projeto precisa de mais configurações
    echo 💡 Status: Implementação básica completa
) else (
    echo ❌ INSUFICIENTE. Projeto precisa de configurações essenciais
    echo 💡 Status: Configuração inicial necessária
)

echo.
echo 📋 PRÓXIMOS PASSOS RECOMENDADOS:
echo.

if not exist "android\upload-key.keystore" (
    echo 1. Execute: setup-upload-key.bat
    echo    ^(Criar Upload Key separado^)
)

if not exist "backup\keystores" (
    echo 2. Execute: backup-keystores.bat
    echo    ^(Configurar backup automático^)
)

echo 3. Criar conta Google Play Developer ^($25 USD^)
echo 4. Configurar Play App Signing no Play Console
echo 5. Upload do primeiro AAB: build-bundle.bat

echo.
echo ⚠️  REQUISITOS EXTERNOS ^(não validados aqui^):
echo    - Conta Google Play Developer
echo    - Play App Signing configurado
echo    - 2FA na conta Google
echo.
pause
