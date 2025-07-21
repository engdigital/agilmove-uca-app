#!/usr/bin/env node

/**
 * Script de Validação de Screenshots - AgilMove UCA
 * Verifica se os screenshots atendem aos requisitos das stores
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

console.log('🔍 Validação de Screenshots - AgilMove UCA\n');

class ScreenshotValidator {
  constructor() {
    this.screenshotsDir = path.join(__dirname, '..', 'public', 'screen-shots');
    
    // Requisitos das stores
    this.requirements = {
      phone: {
        name: 'Phone',
        minWidth: 320,
        maxWidth: 3840,
        minHeight: 320,
        maxHeight: 3840,
        maxFileSize: 8 * 1024 * 1024,
        ratios: ['16:9', '9:16']
      },
      tablet7: {
        name: '7" Tablet',
        minWidth: 320,
        maxWidth: 3840,
        minHeight: 320,
        maxHeight: 3840,
        maxFileSize: 8 * 1024 * 1024,
        ratios: ['16:9', '9:16']
      },
      tablet10: {
        name: '10" Tablet',
        minWidth: 1080,
        maxWidth: 7680,
        minHeight: 1080,
        maxHeight: 7680,
        maxFileSize: 8 * 1024 * 1024,
        ratios: ['16:9', '9:16']
      }
    };
  }

  async getImageInfo(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      const stats = fs.statSync(filePath);
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        fileSize: stats.size,
        ratio: this.calculateRatio(metadata.width, metadata.height)
      };
    } catch (error) {
      return null;
    }
  }

  calculateRatio(width, height) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    const w = width / divisor;
    const h = height / divisor;
    
    // Normalizar para ratios conhecidos
    if (Math.abs(w/h - 16/9) < 0.1) return '16:9';
    if (Math.abs(w/h - 9/16) < 0.1) return '9:16';
    
    return `${w}:${h}`;
  }

  validateScreenshot(info, deviceType) {
    const req = this.requirements[deviceType];
    const issues = [];
    
    // Verificar dimensões
    if (info.width < req.minWidth || info.width > req.maxWidth) {
      issues.push(`Largura ${info.width}px fora do range ${req.minWidth}-${req.maxWidth}px`);
    }
    
    if (info.height < req.minHeight || info.height > req.maxHeight) {
      issues.push(`Altura ${info.height}px fora do range ${req.minHeight}-${req.maxHeight}px`);
    }
    
    // Verificar tamanho do arquivo
    if (info.fileSize > req.maxFileSize) {
      const sizeMB = (info.fileSize / (1024 * 1024)).toFixed(2);
      issues.push(`Arquivo ${sizeMB}MB excede limite de 8MB`);
    }
    
    // Verificar ratio
    if (!req.ratios.includes(info.ratio)) {
      issues.push(`Proporção ${info.ratio} não suportada (use ${req.ratios.join(' ou ')})`);
    }
    
    return issues;
  }

  async validateAllScreenshots() {
    try {
      if (!fs.existsSync(this.screenshotsDir)) {
        console.error(`❌ Diretório não encontrado: ${this.screenshotsDir}`);
        return false;
      }

      // Encontrar screenshots gerados
      const screenshotFiles = fs.readdirSync(this.screenshotsDir)
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
        .filter(file => file.includes('-phone-') || file.includes('-tablet7-') || file.includes('-tablet10-'));

      if (screenshotFiles.length === 0) {
        console.log('❌ Nenhum screenshot processado encontrado');
        console.log('💡 Execute: npm run screenshots:process');
        return false;
      }

      console.log(`📷 Validando ${screenshotFiles.length} screenshots...\n`);

      const results = {
        phone: { files: [], valid: 0, invalid: 0 },
        tablet7: { files: [], valid: 0, invalid: 0 },
        tablet10: { files: [], valid: 0, invalid: 0 }
      };

      let totalValid = 0;
      let totalInvalid = 0;

      // Validar cada screenshot
      for (const filename of screenshotFiles) {
        const filePath = path.join(this.screenshotsDir, filename);
        const info = await this.getImageInfo(filePath);
        
        if (!info) {
          console.log(`❌ ${filename}: Erro ao ler arquivo`);
          continue;
        }

        // Determinar tipo de dispositivo
        let deviceType;
        if (filename.includes('-phone-')) deviceType = 'phone';
        else if (filename.includes('-tablet7-')) deviceType = 'tablet7';
        else if (filename.includes('-tablet10-')) deviceType = 'tablet10';

        const issues = this.validateScreenshot(info, deviceType);
        const isValid = issues.length === 0;
        
        const sizeMB = (info.fileSize / (1024 * 1024)).toFixed(2);
        const status = isValid ? '✅' : '❌';
        
        console.log(`${status} ${filename}`);
        console.log(`   📏 ${info.width}x${info.height}px (${info.ratio})`);
        console.log(`   📦 ${sizeMB}MB`);
        
        if (!isValid) {
          issues.forEach(issue => console.log(`   ⚠️  ${issue}`));
          results[deviceType].invalid++;
          totalInvalid++;
        } else {
          results[deviceType].valid++;
          totalValid++;
        }
        
        results[deviceType].files.push({
          filename,
          isValid,
          info,
          issues
        });
        
        console.log();
      }

      // Relatório final
      console.log('📊 Resumo da Validação:');
      console.log('=' .repeat(60));
      
      Object.entries(results).forEach(([device, data]) => {
        const deviceName = this.requirements[device].name;
        const total = data.valid + data.invalid;
        
        if (total > 0) {
          console.log(`📱 ${deviceName}: ${data.valid}/${total} válidos`);
          
          if (data.invalid > 0) {
            const invalidFiles = data.files.filter(f => !f.isValid);
            invalidFiles.forEach(file => {
              console.log(`   ❌ ${file.filename}: ${file.issues.join(', ')}`);
            });
          }
        }
      });

      const totalFiles = totalValid + totalInvalid;
      const successRate = Math.round((totalValid / totalFiles) * 100);

      console.log('\n🎯 Score Geral:');
      console.log('=' .repeat(60));
      
      const scoreEmoji = successRate >= 100 ? '🟢' : successRate >= 80 ? '🟡' : '🔴';
      const scoreText = successRate >= 100 ? 'Perfeito' : successRate >= 80 ? 'Bom' : 'Necessita Correção';
      
      console.log(`${scoreEmoji} ${successRate}% - ${scoreText} (${totalValid}/${totalFiles} válidos)`);

      // Recomendações
      if (totalInvalid > 0) {
        console.log('\n💡 Recomendações:');
        console.log('1. Execute: npm run screenshots:process');
        console.log('2. Verifique se as imagens originais estão corretas');
        console.log('3. Considere ajustar as configurações do script');
      }

      // Instruções para upload
      if (successRate >= 80) {
        console.log('\n🚀 Pronto para Upload:');
        console.log('1. Acesse Google Play Console');
        console.log('2. Vá em Store listing > Screenshots');
        console.log('3. Upload por categoria de dispositivo');
        console.log('4. Use screenshots válidos apenas');
      }

      return successRate >= 80;

    } catch (error) {
      console.error('❌ Erro durante validação:', error.message);
      return false;
    }
  }

  async generateValidationReport() {
    const timestamp = new Date().toISOString();
    // Implementar geração de relatório JSON se necessário
  }
}

// Executar validação
async function main() {
  const validator = new ScreenshotValidator();
  const success = await validator.validateAllScreenshots();
  process.exit(success ? 0 : 1);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { ScreenshotValidator };
