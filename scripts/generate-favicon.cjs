// Script pour générer le favicon
// Ce script crée une image PNG qui peut être convertie en .ico

const fs = require('fs');
const path = require('path');

// Créer un simple HTML qui génère l'image via Canvas
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Generate Favicon</title>
</head>
<body>
  <canvas id="canvas" width="32" height="32"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Fond orange avec coins arrondis
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(0, 0, 32, 32, 4);
    ctx.fill();

    // Texte "21" en blanc
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('21', 16, 18);

    // Afficher l'image
    document.body.appendChild(document.createElement('p')).textContent =
      'Clic droit sur l\'image ci-dessous > Enregistrer sous > favicon.ico';
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    document.body.appendChild(img);
  </script>
</body>
</html>
`;

// Sauvegarder le fichier HTML
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'generate-favicon.html'),
  html
);

console.log('✅ Fichier HTML créé : public/generate-favicon.html');
console.log('📌 Ouvrez ce fichier dans un navigateur pour générer le favicon.ico');
console.log('');
console.log('Ou utilisez un service en ligne :');
console.log('  - https://favicon.io/favicon-converter/');
console.log('  - https://realfavicongenerator.net/');
console.log('');
console.log('Uploadez le fichier public/favicon.svg pour obtenir le .ico');
