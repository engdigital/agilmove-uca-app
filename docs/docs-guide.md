# 📚 Guia de Documentação - AgilMove UCA App

Este documento serve como um índice completo de toda a documentação organizada do projeto AgilMove UCA App. A documentação foi estruturada em categorias para facilitar a navegação e manutenção.

## 📁 Estrutura da Documentação

### 🤖 `/android/`
**Documentação específica para desenvolvimento Android**
- `ANDROID_ICONS_FIXED.md` - Correções e configurações de ícones Android
- `BUILD_ANDROID.md` - Processo de build para Android
- `CAPACITOR_ANDROID.md` - Configuração e uso do Capacitor para Android

### 🛠️ `/build-scripts/`
**Scripts de automação para build e deploy**
- `backup-keystores.bat` - Script para backup de keystores
- `build-apk.bat` - Build automatizado de APK
- `build-apk.sh` - Build automatizado de APK (Shell)
- `build-bundle.bat` - Build de Android App Bundle
- `build-complete.bat` - Build completo da aplicação
- `build-production.bat` - Build para produção
- `setup-icons-complete.bat` - Configuração completa de ícones
- `setup-keystore.bat` - Configuração de keystore
- `setup-upload-key.bat` - Configuração de chave de upload
- `validate-compliance-critical.bat` - Validação de compliance crítico
- `validate-google-play-signing.bat` - Validação de assinatura do Google Play

### 🏪 `/google-play/`
**Documentação relacionada ao Google Play Store**
- `GOOGLE_PLAY_COMPLIANCE_REPORT.md` - Relatório de compliance do Google Play
- `GOOGLE_PLAY_SIGNING_CHECKLIST.md` - Checklist de assinatura para publicação
- `GOOGLE_PLAY_SIGNING_FINAL_REPORT.md` - Relatório final do processo de assinatura

### 📊 `/monitoring/`
**Documentação de monitoramento e métricas**
- `MONITORING.md` - Configuração e uso do sistema de monitoramento

### 📋 `/reports/`
**Relatórios e documentos de fases do projeto**
- `COMPLIANCE_CRITICAL_VALIDATION_REPORT.md` - Relatório de validação crítica de compliance
- `CORRECOES_FASE_1.md` - Documentação das correções realizadas na Fase 1
- `FASE_1_COMPLETA.md` - Relatório de conclusão da Fase 1
- `FASE_1_PWA_IMPLEMENTADA.md` - Documentação da implementação PWA na Fase 1
- `VERIFICACAO_AUTOMATICA_AJUSTE_FINO.md` - Documentação de verificação automática e ajustes

### 🔒 `/security/`
**Documentação e scripts de segurança**
- `SECURE_HOOKS.md` - Documentação sobre hooks de segurança
- `SECURITY_IMPROVEMENTS.md` - Melhorias de segurança implementadas
- `security-check.js` - Script de verificação de segurança (atual)
- `security-check-fixed.js` - Script de verificação de segurança (versão corrigida)
- `security-check-old.js` - Script de verificação de segurança (versão anterior)

### ⚙️ `/setup-guides/`
**Guias de configuração e setup**
- `ICON_CONFIGURATION.md` - Guia de configuração de ícones
- `ICON_SETUP.md` - Setup inicial de ícones
- `KEYSTORE_PRODUCTION.md` - Configuração de keystore para produção
- `ORIENTATION_LOCK_CONFIG.md` - Configuração de bloqueio de orientação
- `README_APK.md` - Documentação específica para geração de APK
- `SCREENSHOTS_GUIDE.md` - Guia para criação de screenshots
- `SCREENSHOTS_SETUP.md` - Setup para captura de screenshots

### 🎨 `/assets/`
**Recursos visuais e assets de documentação**
- `google-play-icon-1024x500.png` - Ícone oficial para Google Play Store

## 🗂️ Categorização por Tipo de Conteúdo

### 📖 Documentação Técnica
- Configurações: `/setup-guides/`
- Android: `/android/`
- Segurança: `/security/`
- Monitoramento: `/monitoring/`

### 🚀 Automação e Scripts
- Scripts de Build: `/build-scripts/`
- Scripts de Segurança: `/security/` (arquivos .js)

### 📊 Relatórios e Análises
- Relatórios de Projeto: `/reports/`
- Compliance Google Play: `/google-play/`

### 🎯 Como Usar Este Guia

1. **Para Desenvolvedores Novos**: Comece pelos guias em `/setup-guides/` para configurar o ambiente
2. **Para Build e Deploy**: Use os scripts em `/build-scripts/` e consulte `/android/` para específicos do Android
3. **Para Publicação**: Consulte `/google-play/` para processo de publicação na store
4. **Para Monitoramento**: Veja `/monitoring/` para configurar alertas e métricas
5. **Para Segurança**: Consulte `/security/` para implementações e verificações de segurança

## 🔄 Manutenção da Documentação

- **Novos documentos**: Adicione na pasta apropriada e atualize este guia
- **Scripts obsoletos**: Mova para subpasta `deprecated/` ao invés de deletar
- **Relatórios antigos**: Mantenha em `/reports/` com data no nome do arquivo
- **Atualizações**: Sempre atualize a data de modificação nos documentos alterados

## 📞 Referências Rápidas

### Comandos Essenciais
```bash
# Build para produção
./docs/build-scripts/build-production.bat

# Verificação de segurança
node ./docs/security/security-check.js

# Backup de keystores
./docs/build-scripts/backup-keystores.bat
```

### Links Importantes
- Configuração Principal: `README.md` (raiz do projeto)
- Capacitor Config: `capacitor.config.ts` (raiz do projeto)
- Scripts de Build: `/docs/build-scripts/`

---

**Última atualização:** 21 de Julho de 2025  
**Versão do Guia:** 1.0  
**Mantido por:** Equipe de Desenvolvimento AgilMove
