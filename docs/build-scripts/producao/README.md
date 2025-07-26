# 🚀 Build para Google Play Store

## Como usar

1. **Execute o script principal:**
   ```
   .\build-google-play.bat
   ```

2. **O script fará automaticamente:**
   - ✅ Configuração de ícones PWA e Android
   - ✅ Build do Next.js
   - ✅ Sincronização do Capacitor
   - ✅ Geração do APK assinado
   - ✅ Geração do AAB para Google Play Store
   - ✅ Organização dos arquivos na pasta da versão

## Estrutura de saída

```
v1.0.0/
├── aab/
│   └── agilmove-uca-v1.0.0.aab    ← ARQUIVO PRINCIPAL PARA GOOGLE PLAY
├── apk/
│   └── agilmove-uca-v1.0.0.apk    ← APK para testes
├── assets/
│   ├── app-icon-512.png
│   ├── app-icon.png
│   └── android-icon.png
├── screenshots/
│   └── *.png
└── README-GOOGLE-PLAY.txt          ← Instruções de upload
```

## Upload no Google Play Store

1. Acesse: https://play.google.com/console
2. Use o arquivo: `v1.0.0/aab/agilmove-uca-v1.0.0.aab`
3. O AAB é o formato recomendado pelo Google Play Store

## Versionamento

Para uma nova versão:
1. Atualize a `version` no `package.json`
2. Modifique a variável `VERSION` no script
3. Execute novamente o build

## Troubleshooting

- **Erro no Gradle**: Verifique se o Android SDK está configurado
- **Erro de assinatura**: Verifique se o keystore está no local correto
- **APK/AAB não encontrado**: Verifique se o build do Android foi bem-sucedido
