#!/usr/bin/env node

/**
 * Script de Relatório de Screenshots - AgilMove UCA
 * Mostra um resumo completo dos screenshots disponíveis
 */

const fs = require('fs');
const path = require('path');

console.log('📱 Relatório de Screenshots - AgilMove UCA\n');

class ScreenshotReporter {
  constructor() {
    this.screenshotsDir = path.join(__dirname, '..', 'public', 'screen-shots');
  }

  getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2);
  }

  organizeScreenshots() {
    if (!fs.existsSync(this.screenshotsDir)) {
      console.error(`❌ Diretório não encontrado: ${this.screenshotsDir}`);
      return null;
    }

    const files = fs.readdirSync(this.screenshotsDir);
    
    const organized = {
      original: files.filter(f => /\.(jpg|jpeg|png)$/i.test(f) && 
                              !f.includes('-phone-') && 
                              !f.includes('-tablet7-') && 
                              !f.includes('-tablet10-')),
      processed: {
        phone: files.filter(f => f.includes('-phone-')),
        tablet7: files.filter(f => f.includes('-tablet7-')),
        tablet10: files.filter(f => f.includes('-tablet10-'))
      }
    };

    return organized;
  }

  displayReport() {
    const screenshots = this.organizeScreenshots();
    
    if (!screenshots) {
      return false;
    }

    // Imagens originais
    console.log('📷 Imagens Originais:');
    console.log('=' .repeat(50));
    
    if (screenshots.original.length === 0) {
      console.log('❌ Nenhuma imagem original encontrada');
    } else {
      screenshots.original.forEach(file => {
        const filePath = path.join(this.screenshotsDir, file);
        const sizeMB = this.getFileSize(filePath);
        console.log(`   📄 ${file} (${sizeMB}MB)`);
      });
    }

    console.log();

    // Screenshots processados
    const deviceNames = {
      phone: '📱 Celular',
      tablet7: '📱 Tablet 7"',
      tablet10: '📱 Tablet 10"'
    };

    Object.entries(screenshots.processed).forEach(([device, files]) => {
      console.log(`${deviceNames[device]} (${files.length} arquivos):`);
      console.log('=' .repeat(50));
      
      if (files.length === 0) {
        console.log('❌ Nenhum screenshot processado');
      } else {
        // Agrupar por orientação
        const portrait = files.filter(f => f.includes('-portrait.'));
        const landscape = files.filter(f => f.includes('-landscape.'));
        
        if (portrait.length > 0) {
          console.log('   📱 Portrait:');
          portrait.forEach(file => {
            const filePath = path.join(this.screenshotsDir, file);
            const sizeMB = this.getFileSize(filePath);
            console.log(`      ✅ ${file} (${sizeMB}MB)`);
          });
        }
        
        if (landscape.length > 0) {
          console.log('   🖥️  Landscape:');
          landscape.forEach(file => {
            const filePath = path.join(this.screenshotsDir, file);
            const sizeMB = this.getFileSize(filePath);
            console.log(`      ✅ ${file} (${sizeMB}MB)`);
          });
        }
      }
      
      console.log();
    });

    // Estatísticas
    const totalOriginal = screenshots.original.length;
    const totalProcessed = Object.values(screenshots.processed).reduce((sum, files) => sum + files.length, 0);
    
    console.log('📊 Estatísticas:');
    console.log('=' .repeat(50));
    console.log(`📷 Imagens originais: ${totalOriginal}`);
    console.log(`📱 Screenshots processados: ${totalProcessed}`);
    console.log(`🏭 Taxa de processamento: ${totalOriginal > 0 ? Math.round((totalProcessed / (totalOriginal * 6)) * 100) : 0}%`);
    
    // Comandos úteis
    console.log('\n🛠️  Comandos Úteis:');
    console.log('=' .repeat(50));
    console.log('npm run screenshots:process     # Processar screenshots');
    console.log('npm run screenshots:validate    # Validar screenshots');
    console.log('npm run screenshots:clean       # Limpar e reprocessar');
    
    // Instruções para upload
    if (totalProcessed > 0) {
      console.log('\n🚀 Para Upload no Google Play:');
      console.log('=' .repeat(50));
      console.log('1. Acesse: https://play.google.com/console');
      console.log('2. Store listing > Screenshots');
      console.log('3. Selecione categoria de dispositivo:');
      console.log('   • Phone screenshots → use *-phone-*.png');
      console.log('   • 7-inch tablet → use *-tablet7-*.png');
      console.log('   • 10-inch tablet → use *-tablet10-*.png');
      console.log('4. Upload mínimo 2 screenshots para phones');
      console.log('5. Screenshots de tablet são opcionais mas recomendados');
    }

    // Estrutura de pastas
    console.log('\n📁 Estrutura de Arquivos:');
    console.log('=' .repeat(50));
    console.log('public/screen-shots/');
    console.log('├── 📷 Originais:');
    screenshots.original.forEach(file => {
      console.log(`│   ├── ${file}`);
    });
    
    if (totalProcessed > 0) {
      console.log('├── 📱 Processados:');
      Object.entries(screenshots.processed).forEach(([device, files]) => {
        if (files.length > 0) {
          console.log(`│   ├── ${deviceNames[device].replace('📱 ', '')}:`);
          files.slice(0, 2).forEach(file => {
            console.log(`│   │   ├── ${file}`);
          });
          if (files.length > 2) {
            console.log(`│   │   └── ... (${files.length - 2} mais)`);
          }
        }
      });
    }

    return totalProcessed > 0;
  }
}

// Executar relatório
const reporter = new ScreenshotReporter();
const hasScreenshots = reporter.displayReport();

if (!hasScreenshots) {
  console.log('\n💡 Para começar:');
  console.log('1. Coloque imagens em public/screen-shots/');
  console.log('2. Execute: npm run screenshots:process');
  console.log('3. Valide: npm run screenshots:validate');
  process.exit(1);
} else {
  console.log('\n✅ Screenshots prontos para upload nas stores!');
  process.exit(0);
}
