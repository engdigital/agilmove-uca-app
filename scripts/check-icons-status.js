const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração de ícones UCA - Pergaminhos...\n');

const publicDir = path.join(__dirname, '../public');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');

// Verificar ícone fonte
const sourceImage = path.join(publicDir, 'app-icon.png');
if (fs.existsSync(sourceImage)) {
  console.log('✅ Ícone fonte encontrado: public/app-icon.png');
} else {
  console.log('❌ Ícone fonte não encontrado: public/app-icon.png');
}

// Verificar ícones PWA
const pwaIconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
let pwaIconsOk = 0;
console.log('\n📱 Ícones PWA:');
pwaIconSizes.forEach(size => {
  const iconPath = path.join(publicDir, `icon-${size}x${size}.png`);
  if (fs.existsSync(iconPath)) {
    console.log(`✅ icon-${size}x${size}.png`);
    pwaIconsOk++;
  } else {
    console.log(`❌ icon-${size}x${size}.png`);
  }
});

// Verificar ícones Android
const androidDensities = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
let androidIconsOk = 0;
console.log('\n🤖 Ícones Android:');
androidDensities.forEach(density => {
  const launcherPath = path.join(androidResDir, density, 'ic_launcher.png');
  const roundPath = path.join(androidResDir, density, 'ic_launcher_round.png');
  const foregroundPath = path.join(androidResDir, density, 'ic_launcher_foreground.png');
  
  if (fs.existsSync(launcherPath) && fs.existsSync(roundPath) && fs.existsSync(foregroundPath)) {
    console.log(`✅ ${density}/ic_launcher.png, ic_launcher_round.png, ic_launcher_foreground.png`);
    androidIconsOk++;
  } else {
    console.log(`❌ ${density}/ - ícones incompletos`);
  }
});

// Verificar configurações XML
const anydpiDir = path.join(androidResDir, 'mipmap-anydpi-v26');
const launcherXml = path.join(anydpiDir, 'ic_launcher.xml');
const roundXml = path.join(anydpiDir, 'ic_launcher_round.xml');
const backgroundXml = path.join(androidResDir, 'values', 'ic_launcher_background.xml');

console.log('\n⚙️ Configurações Android:');
if (fs.existsSync(launcherXml)) {
  console.log('✅ mipmap-anydpi-v26/ic_launcher.xml');
} else {
  console.log('❌ mipmap-anydpi-v26/ic_launcher.xml');
}

if (fs.existsSync(roundXml)) {
  console.log('✅ mipmap-anydpi-v26/ic_launcher_round.xml');
} else {
  console.log('❌ mipmap-anydpi-v26/ic_launcher_round.xml');
}

if (fs.existsSync(backgroundXml)) {
  console.log('✅ values/ic_launcher_background.xml');
} else {
  console.log('❌ values/ic_launcher_background.xml');
}

// Resumo final
console.log('\n📊 Resumo:');
console.log(`PWA Icons: ${pwaIconsOk}/${pwaIconSizes.length} ícones`);
console.log(`Android Icons: ${androidIconsOk}/${androidDensities.length} densidades`);

if (pwaIconsOk === pwaIconSizes.length && androidIconsOk === androidDensities.length) {
  console.log('\n🎉 Configuração de ícones COMPLETA!');
  console.log('✅ O ícone do punho deve aparecer corretamente no Android');
  console.log('\n📋 Para testar:');
  console.log('1. npx cap open android');
  console.log('2. Build > Clean Project');
  console.log('3. Build > Rebuild Project');
  console.log('4. Build APK e instalar no dispositivo');
} else {
  console.log('\n⚠️ Configuração INCOMPLETA - Execute: npm run icons:setup');
}

console.log('\n');
