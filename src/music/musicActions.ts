import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import logger from '../winston/configWinston';
import { Readable } from 'stream';

interface IJoin {
  channel: any,
  channelText: any,
  songLink: string
}

export const join = async ({
  channel,
  channelText,
  songLink: link
}: IJoin) => {

  try {

    if (!ytdl.validateURL(link)) throw "Wrong URL";

    // Preparing Song
    const conection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    // Info music
    const info = await ytdl.getInfo(link);

    // Playing song
    const song = await ytdl(
      link,
      { filter: 'audio', quality: 'highestaudio' }
    );

    // Chunks music
    const buffer: Buffer[] = [];

    song.on('data', (data) => {
      buffer.push(data);
    })

    song.on('error', (error) => {
      console.error('paso un error => ', error);
      logger.error(error);
    })

    song.on('end', () => {
      const fullBuffer = Buffer.concat(buffer);
      const bufferStream = new Readable();
      bufferStream.push(fullBuffer);
      bufferStream.push(null);
      player.play(createAudioResource(song));
      player.play(createAudioResource(bufferStream));
      conection.subscribe(player);
    });

    // Messages
    const msg_out = ` \`\`\`fix\n Now => ${info.videoDetails.title} \n\`\`\` `
    channelText.send(`${msg_out}`);

    logger.info(`Playing music ${info.videoDetails.title}`);

  } catch (error) {

    const msg_out = `Error please try another link or again in few seconds`;
    channelText.send(` \`\`\`diff\n-${msg_out} \n\`\`\` `);
    console.error(error);
    logger.info(error);

  }

}
