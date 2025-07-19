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

// Verificar todas as imagens para encontrar uma wide
const imagesPath = path.join(__dirname, '..', 'public', 'images');
const files = fs.readdirSync(imagesPath).filter(f => f.endsWith('.png'));

console.log('📸 Verificando todas as imagens para encontrar formato wide:');
files.forEach(filename => {
  const filePath = path.join(imagesPath, filename);
  const dimensions = getPngDimensions(filePath);
  if (dimensions) {
    const ratio = dimensions.width / dimensions.height;
    const isWide = ratio > 1.2; // Landscape/wide format
    console.log(`${isWide ? '🖥️ ' : '📱'} ${filename}: ${dimensions.width}x${dimensions.height}px (ratio: ${ratio.toFixed(2)})`);
  }
});
