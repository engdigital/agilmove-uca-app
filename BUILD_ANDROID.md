# Guia para Gerar APK do AgilMove UCA

## Pré-requisitos

1. **Android Studio** - Instale a versão mais recente do Android Studio
2. **Java Development Kit (JDK)** - Versão 11 ou superior
3. **Android SDK** - Instalado através do Android Studio

## Instruções Passo a Passo

### 1. Preparar o Projeto

```bash
# Instalar dependências
npm install

# Fazer build do projeto web
npm run build

# Preparar para mobile (inclui build e sync)
npm run mobile:prepare
```

### 2. Abrir no Android Studio

```bash
# Abrir o projeto Android no Android Studio
npm run android:open
```

### 3. Gerar APK no Android Studio

1. **Abrir o projeto** no Android Studio (já deve estar aberto)
2. **Aguardar** o Gradle sincronizar (pode levar alguns minutos)
3. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. **Aguardar** o build completar
5. **Localizar o APK** em: `android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Gerar APK Assinado para Produção

1. **Build > Generate Signed Bundle / APK**
2. **Selecionar** APK
3. **Criar** uma nova keystore ou usar uma existente
4. **Preencher** os dados do keystore
5. **Selecionar** build variant (release)
6. **Aguardar** o build completar

## Scripts Disponíveis

- `npm run mobile:prepare` - Prepara o projeto para mobile
- `npm run android:open` - Abre o projeto no Android Studio
- `npm run android:dev` - Executa o app em um dispositivo conectado
- `npm run android:build` - Prepara e faz build do Android

## Estrutura do Projeto

```
android/
├── app/
│   ├── build/
│   │   └── outputs/
│   │       └── apk/
│   │           ├── debug/
│   │           │   └── app-debug.apk
│   │           └── release/
│   │               └── app-release.apk
│   └── src/
│       └── main/
│           └── assets/
│               └── public/  # Arquivos web compilados
└── ...
```

## Troubleshooting

### Erro de SDK não encontrado
```bash
# Verificar se o ANDROID_HOME está configurado
echo $ANDROID_HOME  # Linux/Mac
echo %ANDROID_HOME% # Windows

# Configurar se necessário
export ANDROID_HOME=/path/to/android/sdk  # Linux/Mac
set ANDROID_HOME=C:\path\to\android\sdk   # Windows
```

### Erro de Java
```bash
# Verificar versão do Java
java --version

# Deve ser versão 11 ou superior
```

### Erro de Gradle
```bash
# Limpar cache do Gradle
cd android
./gradlew clean  # Linux/Mac
gradlew.bat clean # Windows
```

## Configurações do App

- **Nome do App**: União, Compromentimento, Ação
- **Package ID**: br.com.agilmove.uca
- **Versão**: 1.0.0
- **Plataforma mínima**: Android 7.0 (API 24)

## Recursos Incluídos

- ✅ PWA (Progressive Web App)
- ✅ Offline capability
- ✅ Security headers
- ✅ Manifest.json configurado
- ✅ Ícones para diferentes tamanhos
- ✅ Service Worker
- ✅ Tema escuro/claro
- ✅ Responsivo para mobile

## Próximos Passos

1. **Testar o APK** em um dispositivo Android
2. **Subir para Google Play Store** (se necessário)
3. **Configurar CI/CD** para builds automatizados
4. **Adicionar testes** automatizados
5. **Implementar analytics** e crash reporting
