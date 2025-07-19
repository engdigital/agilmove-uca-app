const sharp = require('sharp');
const path = require('path');

async function createWideScreenshot() {
  try {
    console.log('🖥️ Criando screenshot wide para desktop...');
    
    const inputPath = path.join(__dirname, '..', 'public', 'images', 'home-screen.png');
    const outputPath = path.join(__dirname, '..', 'public', 'images', 'desktop-screenshot.png');
    
    // Criar uma versão wide rotacionada da home-screen
    await sharp(inputPath)
      .rotate(90)  // Rotacionar 90 graus para landscape
      .resize(1920, 1080, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(outputPath);
    
    console.log('✅ Screenshot wide criado: desktop-screenshot.png (1920x1080px)');
    
  } catch (error) {
    console.error('❌ Erro ao criar screenshot wide:', error.message);
    
    // Fallback: copiar uma imagem existente e redimensionar
    try {
      console.log('🔄 Tentando fallback...');
      const fallbackInput = path.join(__dirname, '..', 'public', 'images', 'team-photo.png');
      const outputPath = path.join(__dirname, '..', 'public', 'images', 'desktop-screenshot.png');
      
      await sharp(fallbackInput)
        .resize(1920, 1080, { 
          fit: 'cover'
        })
        .png()
        .toFile(outputPath);
        
      console.log('✅ Screenshot wide criado via fallback');
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError.message);
    }
  }
}

createWideScreenshot();
