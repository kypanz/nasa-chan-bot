const ffmpeg = require('fluent-ffmpeg');

const inputFilename = 'texto_hablado.mp3';
const outputFilename = 'acelerado.mp3';

ffmpeg(inputFilename)
  .audioFilters('atempo=2') // Ajusta la velocidad de reproducción cambiando este valor
  .output(outputFilename)
  .on('end', () => {
    console.log('Proceso de ajuste de velocidad finalizado.');
  })
  .on('error', (err) => {
    console.error(err);
  })
  .run(); 
