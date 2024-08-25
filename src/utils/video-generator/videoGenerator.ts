import videoshow from 'videoshow';
import { promises as fs } from 'fs';

var videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: true,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

export async function generateVideo({ amount }: { amount: number }) {
  try {

    for (let index = 0; index < amount; index++) {

      const images = await pickImages();
      await new Promise((resolve, reject) => {
        const random_name = `video_n${new Date().toString()}`;
        videoshow(images, videoOptions)
          .audio('./audios/audio.mp3')
          .save(`./videos/${random_name}.mp4`)
          .on('start', function(command: any) {
            console.log('ffmpeg process started:', command)
          })
          .on('error', function(err: any, stdout: any, stderr: any) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
            reject();
          })
          .on('end', function(output: any) {
            console.error('Video created in:', output)
            resolve(true);
          });
      });

    }
    console.log('success on generate video');
  } catch (error) {
    console.error(error);
  }
}


export async function pickImages() {
  try {
    const files = await fs.readdir('./images');
    console.log('archivos encontrados');
    const result = files.map((cont) => `./images/${cont}`)
      .sort((a, b) => 0.5 - Math.random());
    console.log('result => ', result);
    return result;
  } catch (error) {
    console.error('cant pick images');
    console.error(error);
  }
}
