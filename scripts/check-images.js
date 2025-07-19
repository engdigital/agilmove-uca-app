const fs = require('fs');
const path = require('path');

// Função simples para ler dimensões de PNG (basic parser)
function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // PNG signature check
    if (buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') {
      return null;
    }
    
    // IHDR chunk starts at offset 8, width and height are at 16 and 20
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    
    return { width, height };
  } catch (error) {
    return null;
  }
}

// Verificar imagens dos screenshots
const screenshotsPath = path.join(__dirname, '..', 'public', 'images');
const screenshots = ['home-screen.png', 'reading-screen.png'];

console.log('📸 Verificando dimensões dos screenshots:');
screenshots.forEach(filename => {
  const filePath = path.join(screenshotsPath, filename);
  if (fs.existsSync(filePath)) {
    const dimensions = getPngDimensions(filePath);
    if (dimensions) {
      console.log(`✅ ${filename}: ${dimensions.width}x${dimensions.height}px`);
    } else {
      console.log(`❌ ${filename}: Não foi possível ler as dimensões`);
    }
  } else {
    console.log(`❌ ${filename}: Arquivo não encontrado`);
  }
});
