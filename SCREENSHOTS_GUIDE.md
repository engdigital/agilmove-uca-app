# 📱 Screenshots para Google Play Store - AgilMove UCA

## 🎯 Resumo

Script de processamento automático que gera screenshots otimizados para diferentes tipos de dispositivos conforme os requisitos do Google Play Store.

## 📦 Arquivos Gerados

### 📱 Celular (Phone)
**Arquivos:** `*-phone-portrait.png` e `*-phone-landscape.png`
- **Resolução Portrait:** 1200x1920px (9:16)
- **Resolução Landscape:** 1920x3072px (16:9) 
- **Requisitos:** 320-3840px cada lado, até 8MB
- **Formato:** PNG otimizado

### 📱 Tablet 7" 
**Arquivos:** `*-tablet7-portrait.png` e `*-tablet7-landscape.png`
- **Resolução Portrait:** 1333x2133px (9:16)
- **Resolução Landscape:** 2133x3413px (16:9)
- **Requisitos:** 320-3840px cada lado, até 8MB
- **Formato:** PNG otimizado

### 📱 Tablet 10"
**Arquivos:** `*-tablet10-portrait.png` e `*-tablet10-landscape.png`
- **Resolução Portrait:** 1778x2844px (9:16)
- **Resolução Landscape:** 2844x4550px (16:9)
- **Requisitos:** 1080-7680px cada lado, até 8MB
- **Formato:** PNG otimizado

## 🚀 Como Usar

### 1. Processar Screenshots
```bash
# Processar todas as imagens da pasta screen-shots
npm run screenshots:process

# Limpar screenshots antigos e processar novamente
npm run screenshots:clean
```

### 2. Upload no Google Play Console

#### Passo 1: Acessar Store Listing
1. Abra o [Google Play Console](https://play.google.com/console)
2. Selecione seu app
3. Vá em **Store listing** no menu lateral

#### Passo 2: Screenshots por Dispositivo

**📱 Para Phones:**
- Clique em "Phone screenshots"
- Upload dos arquivos `*-phone-portrait.png` (obrigatório)
- Upload dos arquivos `*-phone-landscape.png` (opcional)
- Mínimo: 2 screenshots | Máximo: 8 screenshots

**📱 Para 7-inch tablets:**
- Clique em "7-inch tablet screenshots"
- Upload dos arquivos `*-tablet7-portrait.png`
- Upload dos arquivos `*-tablet7-landscape.png`
- Mínimo: 1 screenshot | Máximo: 8 screenshots

**📱 Para 10-inch tablets:**
- Clique em "10-inch tablet screenshots"
- Upload dos arquivos `*-tablet10-portrait.png`
- Upload dos arquivos `*-tablet10-landscape.png`
- Mínimo: 1 screenshot | Máximo: 8 screenshots

## 📊 Screenshots Disponíveis

### 🖼️ Telas Processadas:
1. **detalis-calendar** - Tela de detalhes com calendário
2. **home-pergaminhos** - Tela inicial com pergaminhos
3. **home** - Tela inicial principal
4. **reading-guide-bottom** - Guia de leitura (parte inferior)
5. **reading-guide-top** - Guia de leitura (parte superior)

### 📏 Dimensões por Dispositivo:

| Dispositivo | Portrait | Landscape | Tamanho Máximo |
|-------------|----------|-----------|----------------|
| Phone | 1200x1920 | 1920x3072 | ~0.35MB |
| Tablet 7" | 1333x2133 | 2133x3413 | ~0.45MB |
| Tablet 10" | 1778x2844 | 2844x4550 | ~0.73MB |

## ⚙️ Configurações Técnicas

### Otimizações Aplicadas:
- ✅ Compressão PNG com qualidade 90%
- ✅ Redimensionamento mantendo proporção
- ✅ Fundo branco para áreas vazias
- ✅ Verificação automática de tamanho (máx 8MB)
- ✅ Ajuste automático de qualidade se necessário

### Aspectos Ratio Suportados:
- **Portrait:** 9:16 (mais alto que largo)
- **Landscape:** 16:9 (mais largo que alto)

## 🔧 Estrutura do Script

### Localização:
```
scripts/process-screenshots.js
```

### Comandos NPM:
```json
{
  "screenshots:process": "node scripts/process-screenshots.js",
  "screenshots:clean": "node scripts/process-screenshots.js --clean"
}
```

### Dependências:
- **Sharp** - Processamento de imagens
- **Node.js** - Runtime
- **Path/FS** - Manipulação de arquivos

## 📋 Checklist para Store

### ✅ Screenshots Prontos:
- [x] Phone Portrait (obrigatório - mín. 2)
- [x] Phone Landscape (opcional)
- [x] Tablet 7" Portrait/Landscape (opcional)
- [x] Tablet 10" Portrait/Landscape (opcional)
- [x] Todos os arquivos < 8MB
- [x] Proporções corretas (16:9 ou 9:16)
- [x] Dimensões dentro dos limites

### 📱 Próximos Passos:
1. **Revisar screenshots** - Verificar se as telas representam bem o app
2. **Upload no Play Console** - Seguir ordem de importância
3. **Adicionar descrições** - Descrever o que cada screenshot mostra
4. **Testar preview** - Ver como aparece na loja

## 🎨 Recomendações de Upload

### Ordem Sugerida (Phone):
1. `home-phone-portrait.png` - Tela principal
2. `home-pergaminhos-phone-portrait.png` - Funcionalidade principal
3. `reading-guide-top-phone-portrait.png` - Como usar
4. `detalis-calendar-phone-portrait.png` - Recursos extras
5. `reading-guide-bottom-phone-portrait.png` - Mais detalhes

### Para Tablets:
- Usar principalmente versões portrait
- Incluir landscape apenas se agregar valor
- Focar nas telas mais importantes (máx 3-4 screenshots)

## 🚨 Troubleshooting

### Se o script falhar:
1. Verificar se Sharp está instalado: `npm list sharp`
2. Reinstalar Sharp se necessário: `npm install sharp`
3. Verificar permissões da pasta `public/screen-shots`
4. Executar com `--clean` para remover cache

### Se os arquivos forem rejeitados:
1. Verificar dimensões mínimas/máximas
2. Confirmar proporção 16:9 ou 9:16
3. Verificar tamanho < 8MB
4. Usar formato PNG (mais compatível)

## 📞 Suporte

Para problemas com o processamento:
1. Execute: `npm run screenshots:process` 
2. Verifique os logs de erro
3. Confirme que os arquivos originais estão em `public/screen-shots/`
4. Verifique se não há arquivos corrompidos

---

**✨ Última atualização:** Scripts otimizados para Google Play Store requirements
**📊 Status:** 30 screenshots gerados com sucesso (5 originais × 6 variações)
