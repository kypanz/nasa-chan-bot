import AWS, { AWSError } from 'aws-sdk';
import fs from 'fs';
import logger from '../winston/configWinston';

export async function saySomething(msg: string | null) {

  const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
  });

  const params = {
    'Engine': 'neural',
    'Text': msg || 'i have issues in my code',
    'OutputFormat': 'mp3',
    'VoiceId': 'Ivy'
  }

  await new Promise((resolve, reject) => {
    Polly.synthesizeSpeech(
      params,
      (
        err: AWSError,
        data: AWS.Polly.Types.SynthesizeSpeechOutput
      ) => {
        if (err) {
          console.error(err.code)
          reject('error');
          logger.error(err);
        } else if (data) {
          if (data.AudioStream instanceof Buffer) {
            fs.writeFile("./nasa-speak.mp3", data.AudioStream, function(err) {
              if (err) {
                return console.error(err)
              }
              resolve('done');
            });
          }
        }
      });
  })
}
