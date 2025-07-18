# Configuração de Ícones do Aplicativo

Este documento explica como configurar e personalizar os ícones do aplicativo AgilMove UCA para todas as plataformas.

## 📱 Plataformas Suportadas

- **PWA (Progressive Web App)** - Navegadores web
- **Android** - Todas as densidades de tela
- **iOS** - Apple Touch Icon
- **Favicon** - Navegadores desktop

## 🚀 Como Usar

### Configuração Automática (Recomendado)

1. **Coloque sua imagem na pasta `public/`**
   - Nome do arquivo: `app-icon.png`
   - Formato: PNG
   - Tamanho recomendado: 512x512 pixels ou maior
   - Formato: Quadrado (1:1)

2. **Execute o script de configuração**
   ```bash
   npm run icons:setup
   ```

3. **Faça o build do projeto**
   ```bash
   npm run build
   ```

### Configuração Manual

Se você preferir configurar manualmente cada etapa:

```bash
# Gerar apenas os ícones
npm run icons:generate

# Atualizar apenas o manifest.json
npm run icons:manifest
```

## 📋 Ícones Gerados

### PWA (Progressive Web App)
- `icon-72x72.png` - Dispositivos pequenos
- `icon-96x96.png` - Dispositivos médios
- `icon-128x128.png` - Dispositivos grandes
- `icon-144x144.png` - Tablets pequenos
- `icon-152x152.png` - iPad
- `icon-192x192.png` - Android Chrome
- `icon-384x384.png` - Splash screens
- `icon-512x512.png` - Telas grandes

### Android
- `mipmap-ldpi/` - 36x36px (densidade baixa)
- `mipmap-mdpi/` - 48x48px (densidade média)
- `mipmap-hdpi/` - 72x72px (densidade alta)
- `mipmap-xhdpi/` - 96x96px (densidade extra alta)
- `mipmap-xxhdpi/` - 144x144px (densidade extra extra alta)
- `mipmap-xxxhdpi/` - 192x192px (densidade extra extra extra alta)

### iOS
- `apple-touch-icon.png` - 180x180px (iPhone/iPad)

### Navegadores
- `favicon.png` - 32x32px (favicon)

## 🔧 Personalização

### Alterando a Imagem Base

1. Substitua o arquivo `public/app-icon.png` pela sua imagem
2. Execute `npm run icons:setup` novamente
3. Faça o build: `npm run build`

### Requisitos da Imagem

- **Formato**: PNG (recomendado) ou SVG
- **Tamanho**: Mínimo 512x512 pixels
- **Proporção**: 1:1 (quadrado)
- **Fundo**: Transparente ou sólido (será adaptado automaticamente)
- **Qualidade**: Alta resolução para melhor resultado

### Configuração Avançada

Para configurações mais específicas, edite o arquivo `scripts/generate-icons.js`:

```javascript
// Exemplo: Alterar qualidade de compressão
.png({ quality: 90 })

// Exemplo: Alterar modo de redimensionamento
.resize(size, size, {
  fit: 'cover',      // ou 'contain', 'fill', 'inside', 'outside'
  position: 'center' // ou 'top', 'bottom', 'left', 'right'
})
```

## 🏗️ Build e Deploy

### Para PWA
```bash
npm run build
```

### Para Android
```bash
npm run android:build
```

### Para desenvolvimento
```bash
npm run dev
```

## 📝 Verificação

Após configurar os ícones, verifique:

1. **PWA**: Abra o navegador e vá para Developer Tools > Application > Manifest
2. **Android**: Compile o APK e verifique o ícone na tela inicial
3. **iOS**: Teste em Safari e verifique o ícone ao adicionar à tela inicial

## 🔍 Troubleshooting

### Problemas Comuns

1. **Ícones não aparecem no Android**
   - Verifique se executou `npm run android:build`
   - Limpe o cache: `./gradlew clean`

2. **PWA não mostra ícones**
   - Verifique se executou `npm run build`
   - Limpe o cache do navegador

3. **Erro ao gerar ícones**
   - Verifique se a imagem `app-icon.png` existe
   - Confirme que o Sharp está instalado: `npm install sharp`

### Logs de Debug

Para ver logs detalhados durante a geração:

```bash
DEBUG=* npm run icons:setup
```

## 📁 Estrutura de Arquivos

```
public/
├── app-icon.png          # Sua imagem base
├── icon-72x72.png        # Ícones PWA gerados
├── icon-96x96.png
├── ... (outros tamanhos)
├── apple-touch-icon.png  # Ícone iOS
├── favicon.png           # Favicon
└── manifest.json         # Configuração PWA

android/app/src/main/res/
├── mipmap-ldpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── ... (outras densidades)

scripts/
├── generate-icons.js     # Gerador de ícones
├── update-manifest.js    # Atualizar manifest
└── setup-app-icons.js   # Script principal
```

## 🎨 Dicas de Design

1. **Simplicidade**: Ícones simples funcionam melhor em tamanhos pequenos
2. **Contraste**: Use cores contrastantes para melhor visibilidade
3. **Consistência**: Mantenha o estilo consistente com a identidade da marca
4. **Teste**: Teste em diferentes tamanhos e dispositivos

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do console
2. Consulte a documentação do Capacitor
3. Teste em diferentes dispositivos
4. Verifique as configurações do manifest.json
