#!/usr/bin/env node

/**
 * Script de Processamento de Screenshots - AgilMove UCA
 * Processa screenshots para diferentes dispositivos conforme requisitos das stores
 * 
 * Requisitos Google Play Store:
 * - Celular: 16:9 ou 9:16, 320-3840px cada lado, até 8MB
 * - Tablet 7": 16:9 ou 9:16, 320-3840px cada lado, até 8MB  
 * - Tablet 10": 16:9 ou 9:16, 1080-7680px cada lado, até 8MB
 */

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

console.log('📱 Processamento de Screenshots - AgilMove UCA\n');

class ScreenshotProcessor {
  constructor() {
    this.inputDir = path.join(__dirname, '..', 'public', 'screen-shots');
    this.outputDir = this.inputDir; // Salvar na mesma pasta
    
    // Configurações para diferentes dispositivos
    this.deviceConfigs = {
      phone: {
        name: 'celular',
        suffix: 'phone',
        minSize: 320,
        maxSize: 3840,
        maxFileSize: 8 * 1024 * 1024, // 8MB
        orientations: {
          portrait: { width: 1080, height: 1920 }, // 9:16
          landscape: { width: 1920, height: 1080 } // 16:9
        }
      },
      tablet7: {
        name: 'tablet-7pol',
        suffix: 'tablet7',
        minSize: 320,
        maxSize: 3840,
        maxFileSize: 8 * 1024 * 1024, // 8MB
        orientations: {
          portrait: { width: 1200, height: 2133 }, // 9:16
          landscape: { width: 2133, height: 1200 } // 16:9
        }
      },
      tablet10: {
        name: 'tablet-10pol',
        suffix: 'tablet10',
        minSize: 1080,
        maxSize: 7680,
        maxFileSize: 8 * 1024 * 1024, // 8MB
        orientations: {
          portrait: { width: 1600, height: 2844 }, // 9:16
          landscape: { width: 2844, height: 1600 } // 16:9
        }
      }
    };
  }

  async getImageDimensions(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      };
    } catch (error) {
      console.error(`❌ Erro ao ler dimensões de ${path.basename(filePath)}:`, error.message);
      return null;
    }
  }

  isPortrait(width, height) {
    return height > width;
  }

  calculateTargetDimensions(originalWidth, originalHeight, targetWidth, targetHeight) {
    const originalRatio = originalWidth / originalHeight;
    const targetRatio = targetWidth / targetHeight;
    
    let finalWidth, finalHeight;
    
    if (originalRatio > targetRatio) {
      // Imagem mais larga - ajustar pela altura
      finalHeight = targetHeight;
      finalWidth = Math.round(targetHeight * originalRatio);
    } else {
      // Imagem mais alta - ajustar pela largura
      finalWidth = targetWidth;
      finalHeight = Math.round(targetWidth / originalRatio);
    }
    
    return { width: finalWidth, height: finalHeight };
  }

  async processImageForDevice(inputPath, deviceConfig, orientation) {
    try {
      const inputName = path.basename(inputPath, path.extname(inputPath));
      const originalDims = await this.getImageDimensions(inputPath);
      
      if (!originalDims) {
        return null;
      }

      const isOriginalPortrait = this.isPortrait(originalDims.width, originalDims.height);
      const targetOrientation = orientation || (isOriginalPortrait ? 'portrait' : 'landscape');
      const targetDims = deviceConfig.orientations[targetOrientation];
      
      // Calcular dimensões mantendo proporção
      const finalDims = this.calculateTargetDimensions(
        originalDims.width, 
        originalDims.height,
        targetDims.width,
        targetDims.height
      );

      // Verificar se as dimensões estão dentro dos limites
      if (finalDims.width < deviceConfig.minSize || finalDims.height < deviceConfig.minSize ||
          finalDims.width > deviceConfig.maxSize || finalDims.height > deviceConfig.maxSize) {
        
        // Ajustar para os limites
        const scale = Math.min(
          deviceConfig.maxSize / Math.max(finalDims.width, finalDims.height),
          deviceConfig.minSize / Math.min(finalDims.width, finalDims.height)
        );
        
        finalDims.width = Math.round(finalDims.width * scale);
        finalDims.height = Math.round(finalDims.height * scale);
      }

      // Nome do arquivo de saída
      const outputName = `${inputName}-${deviceConfig.suffix}-${targetOrientation}.png`;
      const outputPath = path.join(this.outputDir, outputName);

      // Processar imagem
      let quality = 90;
      let outputBuffer;
      
      do {
        outputBuffer = await sharp(inputPath)
          .resize(finalDims.width, finalDims.height, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png({ quality, compressionLevel: 9 })
          .toBuffer();
          
        // Se o arquivo for muito grande, reduzir qualidade
        if (outputBuffer.length > deviceConfig.maxFileSize && quality > 70) {
          quality -= 10;
        } else {
          break;
        }
      } while (quality >= 70);

      // Salvar arquivo
      await fs.promises.writeFile(outputPath, outputBuffer);
      
      const fileSizeMB = (outputBuffer.length / (1024 * 1024)).toFixed(2);
      
      console.log(`   ✅ ${outputName}: ${finalDims.width}x${finalDims.height}px (${fileSizeMB}MB)`);
      
      return {
        outputPath,
        dimensions: finalDims,
        fileSize: outputBuffer.length,
        quality
      };

    } catch (error) {
      console.error(`   ❌ Erro ao processar para ${deviceConfig.name}:`, error.message);
      return null;
    }
  }

  async processAllImages() {
    try {
      // Verificar se o diretório existe
      if (!fs.existsSync(this.inputDir)) {
        console.error(`❌ Diretório não encontrado: ${this.inputDir}`);
        return false;
      }

      // Listar arquivos de imagem
      const imageFiles = fs.readdirSync(this.inputDir)
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .filter(file => !file.includes('-phone-') && !file.includes('-tablet7-') && !file.includes('-tablet10-'))
        .map(file => path.join(this.inputDir, file));

      if (imageFiles.length === 0) {
        console.log('❌ Nenhuma imagem original encontrada para processar');
        return false;
      }

      console.log(`📷 Encontradas ${imageFiles.length} imagens para processar:`);
      imageFiles.forEach(file => console.log(`   - ${path.basename(file)}`));
      console.log();

      let totalProcessed = 0;
      let totalGenerated = 0;

      // Processar cada imagem
      for (const imagePath of imageFiles) {
        const imageName = path.basename(imagePath);
        console.log(`🔄 Processando: ${imageName}`);

        let imageGenerated = 0;

        // Processar para cada tipo de dispositivo
        for (const [deviceKey, deviceConfig] of Object.entries(this.deviceConfigs)) {
          console.log(`   📱 ${deviceConfig.name}:`);

          // Gerar versões portrait e landscape
          for (const orientation of ['portrait', 'landscape']) {
            const result = await this.processImageForDevice(imagePath, deviceConfig, orientation);
            if (result) {
              imageGenerated++;
              totalGenerated++;
            }
          }
        }

        if (imageGenerated > 0) {
          totalProcessed++;
        }

        console.log();
      }

      // Relatório final
      console.log('📊 Relatório de Processamento:');
      console.log('=' .repeat(60));
      console.log(`📷 Imagens originais processadas: ${totalProcessed}/${imageFiles.length}`);
      console.log(`📱 Screenshots geradas: ${totalGenerated}`);
      console.log(`📁 Pasta de saída: ${this.outputDir}`);

      // Listar arquivos gerados
      const generatedFiles = fs.readdirSync(this.outputDir)
        .filter(file => file.includes('-phone-') || file.includes('-tablet7-') || file.includes('-tablet10-'));

      if (generatedFiles.length > 0) {
        console.log('\n📱 Screenshots geradas:');
        console.log('=' .repeat(60));
        
        // Agrupar por tipo de dispositivo
        const byDevice = {
          phone: generatedFiles.filter(f => f.includes('-phone-')),
          tablet7: generatedFiles.filter(f => f.includes('-tablet7-')),
          tablet10: generatedFiles.filter(f => f.includes('-tablet10-'))
        };

        Object.entries(byDevice).forEach(([device, files]) => {
          if (files.length > 0) {
            const deviceName = this.deviceConfigs[device].name;
            console.log(`\n📱 ${deviceName} (${files.length} arquivos):`);
            files.forEach(file => {
              const filePath = path.join(this.outputDir, file);
              const stats = fs.statSync(filePath);
              const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
              console.log(`   ✅ ${file} (${sizeMB}MB)`);
            });
          }
        });
      }

      console.log('\n🎉 Processamento concluído com sucesso!');
      console.log('\n📋 Para usar nas stores:');
      console.log('1. Google Play Console > Store listing > Screenshots');
      console.log('2. Selecionar tipo de dispositivo (Phone/7" tablet/10" tablet)');
      console.log('3. Upload das imagens correspondentes');
      console.log('4. Verificar que cada arquivo é menor que 8MB');

      return true;

    } catch (error) {
      console.error('❌ Erro durante processamento:', error.message);
      return false;
    }
  }

  async cleanOldScreenshots() {
    try {
      const filesToClean = fs.readdirSync(this.outputDir)
        .filter(file => file.includes('-phone-') || file.includes('-tablet7-') || file.includes('-tablet10-'))
        .map(file => path.join(this.outputDir, file));

      if (filesToClean.length > 0) {
        console.log(`🧹 Limpando ${filesToClean.length} screenshots antigos...`);
        for (const file of filesToClean) {
          fs.unlinkSync(file);
        }
        console.log('✅ Screenshots antigos removidos\n');
      }
    } catch (error) {
      console.warn('⚠️ Erro ao limpar screenshots antigos:', error.message);
    }
  }
}

// Executar o script
async function main() {
  const processor = new ScreenshotProcessor();
  
  // Verificar argumentos
  const args = process.argv.slice(2);
  const shouldClean = args.includes('--clean');
  
  if (shouldClean) {
    await processor.cleanOldScreenshots();
  }
  
  const success = await processor.processAllImages();
  process.exit(success ? 0 : 1);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { ScreenshotProcessor };
