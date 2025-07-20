const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createStoreIcon() {
  try {
    const sourceIcon = path.join(__dirname, '../public/app-icon.png');
    const outputPath = path.join(__dirname, '../google-play-icon-1024x500.png');
    
    // Verificar se o arquivo fonte existe
    if (!fs.existsSync(sourceIcon)) {
      console.log('❌ Arquivo app-icon.png não encontrado em public/');
      console.log('📍 Procurando em outros locais...');
      
      // Verificar locais alternativos
      const alternativePaths = [
        path.join(__dirname, '../src/assets/app-icon.png'),
        path.join(__dirname, '../assets/app-icon.png'),
        path.join(__dirname, '../public/icons/app-icon.png'),
        path.join(__dirname, '../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')
      ];
      
      let foundIcon = null;
      for (const altPath of alternativePaths) {
        if (fs.existsSync(altPath)) {
          foundIcon = altPath;
          console.log('✅ Ícone encontrado em:', altPath);
          break;
        }
      }
      
      if (!foundIcon) {
        console.log('❌ Nenhum ícone encontrado. Criando ícone placeholder...');
        await createPlaceholderIcon(outputPath);
        return;
      }
      
      sourceIcon = foundIcon;
    }
    
    console.log('🎨 Criando ícone da Google Play Store...');
    console.log('📂 Fonte:', sourceIcon);
    console.log('📂 Destino:', outputPath);
    
    // Obter informações da imagem fonte
    const metadata = await sharp(sourceIcon).metadata();
    console.log(`📏 Dimensões originais: ${metadata.width}x${metadata.height}`);
    
    // Criar ícone 1024x500 para Google Play Store
    await sharp({
      create: {
        width: 1024,
        height: 500,
        channels: 4,
        background: { r: 245, g: 245, b: 245, alpha: 1 } // Fundo cinza claro
      }
    })
    .composite([
      {
        input: await sharp(sourceIcon)
          .resize(400, 400, { 
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Fundo transparente
          })
          .png()
          .toBuffer(),
        left: 312, // Centralizado horizontalmente (1024-400)/2
        top: 50,   // Centralizado verticalmente (500-400)/2
      }
    ])
    .png({ quality: 100 })
    .toFile(outputPath);
    
    console.log('✅ Ícone da Google Play Store criado com sucesso!');
    console.log('📍 Localização:', outputPath);
    console.log('📏 Dimensões: 1024x500px');
    console.log('💾 Pronto para upload no Google Play Console');
    
    // Verificar tamanho do arquivo
    const stats = fs.statSync(outputPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Tamanho do arquivo: ${fileSizeMB} MB`);
    
    if (stats.size > 15 * 1024 * 1024) {
      console.log('⚠️  Aviso: Arquivo maior que 15MB - otimizando...');
      await optimizeIcon(outputPath);
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar ícone:', error.message);
    console.log('🔧 Tentando criar ícone placeholder...');
    await createPlaceholderIcon(path.join(__dirname, '../google-play-icon-1024x500.png'));
  }
}

async function createPlaceholderIcon(outputPath) {
  console.log('🎨 Criando ícone placeholder para UCA - Pergaminhos...');
  
  // Criar SVG do ícone placeholder
  const svgIcon = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="60" fill="url(#grad1)"/>
      <circle cx="200" cy="160" r="50" fill="white" opacity="0.9"/>
      <rect x="150" y="220" width="100" height="8" rx="4" fill="white" opacity="0.8"/>
      <rect x="130" y="240" width="140" height="6" rx="3" fill="white" opacity="0.7"/>
      <rect x="140" y="260" width="120" height="6" rx="3" fill="white" opacity="0.6"/>
      <text x="200" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">UCA</text>
      <text x="200" y="350" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.8">Pergaminhos</text>
    </svg>
  `;
  
  await sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 4,
      background: { r: 248, g: 250, b: 252, alpha: 1 }
    }
  })
  .composite([
    {
      input: Buffer.from(svgIcon),
      left: 312,
      top: 50,
    }
  ])
  .png({ quality: 100 })
  .toFile(outputPath);
  
  console.log('✅ Ícone placeholder criado com sucesso!');
}

async function optimizeIcon(filePath) {
  const outputPath = filePath.replace('.png', '-optimized.png');
  await sharp(filePath)
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath);
  
  fs.renameSync(outputPath, filePath);
  console.log('✅ Ícone otimizado para menos de 15MB');
}

// Executar o script
createStoreIcon();
