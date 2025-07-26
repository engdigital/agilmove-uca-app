@echo off
echo ========================================
echo BUILD APK PRODUCAO - UCA PERGAMINHOS
echo ========================================
echo.

REM Ir para o diretorio raiz do projeto
cd /d "d:\engdigital\agilmove-uca-app"

echo Verificando arquivos necessarios...
if not exist "package.json" (
    echo ERRO: package.json nao encontrado na raiz!
    echo Copiando do diretorio docs/reports...
    copy "docs\reports\package.json" "package.json"
)

echo.
echo Passo 1: Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao instalado!
    pause
    exit /b 1
)

echo.
echo Passo 2: Instalando dependencias...
npm install --legacy-peer-deps

echo.
echo Passo 3: Executando build...
npm run build

echo.
echo Passo 4: Sincronizando Capacitor...
npx cap sync

echo.
echo Passo 5: Gerando APK...
cd android
call gradlew.bat assembleRelease
cd ..

echo.
echo ========================================
echo Verifique o APK em:
echo android\app\build\outputs\apk\release\
echo ========================================
echo.
pause
