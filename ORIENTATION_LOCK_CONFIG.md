# Configuração de Orientação Portrait 📱

## Resumo
O aplicativo UCA foi configurado para funcionar **exclusivamente em modo retrato (portrait)**. Quando o dispositivo for girado, o aplicativo manterá a orientação vertical e não acompanhará a rotação da tela.

## Implementações Realizadas

### 1. Android Native (AndroidManifest.xml) ✅
- Adicionado `android:screenOrientation="portrait"` na MainActivity
- Garante bloqueio nativo no Android

### 2. Capacitor Configuration ✅
- Plugin `@capacitor/screen-orientation` instalado
- Configuração `ScreenOrientation.orientation: "portrait-primary"` nos arquivos:
  - `capacitor.config.ts`
  - `capacitor.config.json`

### 3. PWA/Web Configuration ✅
- Meta tag `<meta name="screen-orientation" content="portrait" />` no HTML
- Meta tag `<meta name="orientation" content="portrait" />` para compatibilidade
- Manifest.json já tinha `"orientation": "portrait-primary"`

### 4. CSS Portrait Lock ✅
- Estilos CSS que forçam layout portrait
- Classe `.portrait-lock` aplicada ao body
- Media queries para detectar e corrigir orientação landscape
- Overflow-x bloqueado para prevenir scroll horizontal

### 5. JavaScript API Integration ✅
- Hook personalizado `useOrientationLock()` criado
- Componente `<OrientationLock>` para aplicação automática
- Suporte para múltiplas APIs:
  - Capacitor ScreenOrientation (apps nativos)
  - Screen Orientation API (browsers modernos)
  - Fallbacks para APIs antigas (webkit, moz, etc.)

## Arquivos Modificados

### Configuração Android:
- `android/app/src/main/AndroidManifest.xml`

### Configuração Capacitor:
- `capacitor.config.ts`
- `capacitor.config.json`

### Código React/Next.js:
- `app/layout.tsx` (meta tags + OrientationLock wrapper)
- `app/globals.css` (estilos portrait-lock)
- `hooks/use-orientation-lock.ts` (hook personalizado)
- `components/orientation-lock.tsx` (componente wrapper)

### Dependências:
- `@capacitor/screen-orientation` (plugin instalado)

## Como Funciona

### 1. **App Nativo (Android)**
```xml
<activity android:screenOrientation="portrait" />
```
Bloqueia a orientação diretamente no sistema Android.

### 2. **Capacitor/Híbrido**
```typescript
await ScreenOrientation.lock({ orientation: 'portrait-primary' })
```
Usa a API nativa do Capacitor quando disponível.

### 3. **PWA/Web**
```typescript
await screen.orientation.lock('portrait-primary')
```
Usa a Screen Orientation API do browser quando suportada.

### 4. **CSS Fallback**
```css
@media screen and (orientation: landscape) {
  /* Força layout portrait mesmo em landscape */
}
```
Previne quebras de layout quando APIs não estão disponíveis.

## Compatibilidade

- ✅ **Android App**: Bloqueio total via AndroidManifest
- ✅ **iOS App**: Suporte via Capacitor plugin
- ✅ **PWA Chrome/Edge**: Screen Orientation API
- ✅ **PWA Safari**: CSS fallback
- ✅ **PWA Firefox**: Webkit fallback

## Testando

### Android:
```bash
npm run cap:build
npx cap open android
# Girar o dispositivo - app deve manter orientação portrait
```

### PWA:
```bash
npm run dev
# Abrir DevTools, simular dispositivo móvel
# Girar orientação - layout deve manter portrait
```

## Observações

- O bloqueio é aplicado automaticamente no carregamento da página
- Funciona tanto em dispositivos físicos quanto em simuladores
- Listeners de orientação reforçam o bloqueio se necessário
- Configuração robusta com múltiplos fallbacks para máxima compatibilidade
