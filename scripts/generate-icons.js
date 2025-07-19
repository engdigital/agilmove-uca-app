const fs = require('fs');
const path = require('path');

// Verificar se sharp está disponível
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('⚠️  Sharp não está instalado. Usando ícones placeholder...');
  
  // Função para criar ícones placeholder sem sharp
  const createPlaceholderIcons = () => {
    const publicDir = path.join(__dirname, '../public');
    const placeholderPath = path.join(publicDir, 'placeholder.jpg');
    
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    if (fs.existsSync(placeholderPath)) {
      iconSizes.forEach(size => {
        const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
        try {
          fs.copyFileSync(placeholderPath, outputPath);
          console.log(`✅ Criado placeholder: icon-${size}x${size}.png`);
        } catch (err) {
          console.log(`❌ Erro ao criar ${size}x${size}: ${err.message}`);
        }
      });
      
      // Criar favicon e apple-touch-icon
      try {
        fs.copyFileSync(placeholderPath, path.join(publicDir, 'favicon.png'));
        fs.copyFileSync(placeholderPath, path.join(publicDir, 'apple-touch-icon.png'));
        console.log('✅ Criados: favicon.png e apple-touch-icon.png');
      } catch (err) {
        console.log(`❌ Erro ao criar ícones especiais: ${err.message}`);
      }
      
      console.log('🎉 Ícones placeholder criados! Para ícones reais, coloque app-icon.png na pasta public/');
    } else {
      console.log('❌ Arquivo placeholder.jpg não encontrado');
    }
  };
  
  createPlaceholderIcons();
  return;
}

// Tamanhos de ícones necessários para PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Caminhos
const publicDir = path.join(__dirname, '../public');
const sourceImage = path.join(publicDir, 'app-icon.png');

async function generateIcons() {
  try {
    // Verificar se a imagem base existe
    if (!fs.existsSync(sourceImage)) {
      console.log('❌ Arquivo app-icon.png não encontrado em public/');
      console.log('📋 Por favor, coloque a imagem do punho como app-icon.png na pasta public/');
      console.log('🔄 Criando ícones placeholder...');
      
      // Usar placeholder como fallback
      const fallbackSource = path.join(publicDir, 'placeholder.jpg');
      if (fs.existsSync(fallbackSource)) {
        console.log('⚠️  Usando placeholder.jpg como base');
        
        // Gerar ícones usando placeholder
        for (const size of iconSizes) {
          const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
          
          await sharp(fallbackSource)
            .resize(size, size, {
              fit: 'cover',
              position: 'center'
            })
            .png({ quality: 90 })
            .toFile(outputPath);
          
          console.log(`✅ Gerado placeholder: icon-${size}x${size}.png`);
        }
        
        // Gerar favicon e apple-touch-icon
        await sharp(fallbackSource)
          .resize(32, 32)
          .png()
          .toFile(path.join(publicDir, 'favicon.png'));
        console.log('✅ Gerado: favicon.png');

        await sharp(fallbackSource)
          .resize(180, 180)
          .png()
          .toFile(path.join(publicDir, 'apple-touch-icon.png'));
        console.log('✅ Gerado: apple-touch-icon.png');
        
        console.log('🎉 Ícones placeholder gerados! Substitua app-icon.png pela imagem real do punho.');
        return;
      } else {
        console.log('❌ Nenhuma imagem base encontrada (app-icon.png ou placeholder.jpg)');
        return;
      }
    }

    console.log('🎨 Gerando ícones PWA com app-icon.png...');

    // Gerar ícones para cada tamanho
    for (const size of iconSizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`✅ Gerado: icon-${size}x${size}.png`);
    }

    // Gerar favicon
    await sharp(sourceImage)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✅ Gerado: favicon.png');

    // Gerar Apple Touch Icon
    await sharp(sourceImage)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Gerado: apple-touch-icon.png');

    console.log('🎉 Todos os ícones PWA foram gerados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
