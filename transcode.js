const sox = require('sox');

console.log('iniciando transcode');
const filePath = 'texto_hablado.mp3';

// Aceleracion de audio
const outputFilePath = './audio_acelerado.mp3';
const job = sox.transcode(filePath, outputFilePath, {
    tempo: 1.5, // Ajusta la velocidad aquí (acelera en un 50%)
    format: 'mp3',
    channelCount: 2,
    bitRate: 192 * 1024,
    compressionQuality: 5,
});
console.log(job);
job.on('error', (err) => {
    console.error(err);
});
job.on('progress', function(amountDone, amountTotal) {
    console.log("progress", amountDone, amountTotal);
});
job.on('end', () => {
    console.log('Proceso de ajuste de velocidad finalizado.');
});
console.log('finalizando transcode');