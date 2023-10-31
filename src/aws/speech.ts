import AWS, { AWSError } from 'aws-sdk';
import fs from 'fs';
import logger from '../winston/configWinston';

interface IData {
    AudioStream : Buffer;
}

export async function saySomething(msg: string | null) {

    const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: 'us-east-1'
    });

    const params = {
        'Engine': 'neural',
        'Text': msg || 'can you say me that again please ?, i have issues in my code',
        'OutputFormat': 'mp3',
        'VoiceId': 'Ivy'
    }

    await new Promise((resolve, reject) => {
        Polly.synthesizeSpeech(params, (err : AWSError, data : AWS.Polly.Types.SynthesizeSpeechOutput) => {
            if (err) {
                console.log(err.code)
                reject('error');
                logger.error(err);
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    fs.writeFile("./nasa-speak.mp3", data.AudioStream, function (err) {
                        if (err) {
                            return console.log(err)
                        }
                        resolve('done');
                    });
                }
            }
        });
    })
}
