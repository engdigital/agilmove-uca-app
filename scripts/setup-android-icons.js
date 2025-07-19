const fs = require('fs');
const path = require('path');

// Verificar se sharp está disponível
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('❌ Sharp não está instalado. Instale com: npm install sharp');
  process.exit(1);
}

console.log('🎨 Configurando ícones Android para UCA - Pergaminhos...');

// Caminhos
const publicDir = path.join(__dirname, '../public');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');
const sourceImage = path.join(publicDir, 'app-icon.png');

// Mapeamento de ícones Android por densidade
const androidIconSizes = {
  'mipmap-mdpi': 48,      // 48x48
  'mipmap-hdpi': 72,      // 72x72  
  'mipmap-xhdpi': 96,     // 96x96
  'mipmap-xxhdpi': 144,   // 144x144
  'mipmap-xxxhdpi': 192   // 192x192
};

async function setupAndroidIcons() {
  try {
    // Verificar se a imagem base existe
    if (!fs.existsSync(sourceImage)) {
      console.log('❌ Arquivo app-icon.png não encontrado em public/');
      console.log('📋 Por favor, coloque a imagem do punho como app-icon.png na pasta public/');
      return;
    }

    console.log('🔍 Verificando diretórios Android...');

    // Criar/verificar diretórios mipmap
    for (const [dirName, size] of Object.entries(androidIconSizes)) {
      const mipmapDir = path.join(androidResDir, dirName);
      
      // Criar diretório se não existir
      if (!fs.existsSync(mipmapDir)) {
        fs.mkdirSync(mipmapDir, { recursive: true });
        console.log(`📁 Criado diretório: ${dirName}`);
      }

      // Gerar ic_launcher.png
      const launcherPath = path.join(mipmapDir, 'ic_launcher.png');
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90 })
        .toFile(launcherPath);
      console.log(`✅ Gerado: ${dirName}/ic_launcher.png (${size}x${size})`);

      // Gerar ic_launcher_round.png (versão redonda)
      const roundPath = path.join(mipmapDir, 'ic_launcher_round.png');
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90 })
        .toFile(roundPath);
      console.log(`✅ Gerado: ${dirName}/ic_launcher_round.png (${size}x${size})`);

      // Gerar ic_launcher_foreground.png (para adaptive icons)
      const foregroundPath = path.join(mipmapDir, 'ic_launcher_foreground.png');
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          position: 'center',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({ quality: 90 })
        .toFile(foregroundPath);
      console.log(`✅ Gerado: ${dirName}/ic_launcher_foreground.png (${size}x${size})`);
    }

    // Atualizar arquivos XML de configuração adaptive icon
    const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

    const anydpiDir = path.join(androidResDir, 'mipmap-anydpi-v26');
    if (!fs.existsSync(anydpiDir)) {
      fs.mkdirSync(anydpiDir, { recursive: true });
    }

    // Atualizar ic_launcher.xml
    fs.writeFileSync(
      path.join(anydpiDir, 'ic_launcher.xml'),
      adaptiveIconXml,
      'utf8'
    );
    console.log('✅ Atualizado: mipmap-anydpi-v26/ic_launcher.xml');

    // Atualizar ic_launcher_round.xml
    fs.writeFileSync(
      path.join(anydpiDir, 'ic_launcher_round.xml'),
      adaptiveIconXml,
      'utf8'
    );
    console.log('✅ Atualizado: mipmap-anydpi-v26/ic_launcher_round.xml');

    // Verificar/atualizar cores de fundo
    const valuesDir = path.join(androidResDir, 'values');
    const backgroundColorXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>`;

    if (!fs.existsSync(valuesDir)) {
      fs.mkdirSync(valuesDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(valuesDir, 'ic_launcher_background.xml'),
      backgroundColorXml,
      'utf8'
    );
    console.log('✅ Atualizado: values/ic_launcher_background.xml');

    console.log('');
    console.log('🎉 Configuração de ícones Android concluída!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');
    console.log('3. npx cap open android');
    console.log('4. Build > Clean Project no Android Studio');
    console.log('5. Build > Rebuild Project no Android Studio');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao configurar ícones Android:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupAndroidIcons();
}

module.exports = { setupAndroidIcons };
