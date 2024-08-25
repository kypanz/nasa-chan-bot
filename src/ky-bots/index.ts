/* eslint-disable no-console */
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  DiscordGatewayAdapterCreator,
  AudioPlayerStatus,
} from '@discordjs/voice';
import logger from '../winston/configWinston';
import fs from 'fs';
import { Readable } from 'stream';
import bots from './ky-bots.json';
import { Client, GatewayIntentBits } from 'discord.js';



export type IChannel = {
  id: string;
  guild: {
    id: string;
    voiceAdapterCreator: DiscordGatewayAdapterCreator;
  }
}

let result: Buffer[] = []; // This buffer contain he main messages
const data: Buffer[] = []; // Split messages depending the chunk size

export const speak = async (channel: IChannel) => {

  try {

    if (channel == undefined) {
      throw "[ function speak ] channel undefinded, so cant read the message"
    }
    const bufferStream = fs.createReadStream(
      './nasa-speak.mp3',
      {
        highWaterMark: (128 * 1024) * 5
      }
    );

    bufferStream.on('open', () => {
      console.log('buffer open ...');
    })

    bufferStream.on('data', (data: Buffer) => {
      result.push(data);
    })

    bufferStream.on('end', () => {
      console.log('a finalizado ...');
      //await splitChunks(); // check if this is solved firs
      processChunks(channel);
    })

    bufferStream.on('error', (error) => {
      console.log(error);
      logger.error(error);
    });

  } catch (error) {

    console.log(error);
    logger.info(error);

  }

}

async function splitChunks() {
  await new Promise((resolve, reject) => {
    try {
      const perChunk = 300;
      if (result.length > 0) {
        for (let index = 0; index < result.length; index += perChunk) {
          //console.log('index actual => ', index);
          const buffer = result[index].slice(index, index + perChunk);
          console.log('el buffer que se va a pushear => ', buffer);
          data.push(buffer);
        }
      }
      console.log(result);
      result = [];
      resolve(true);
    } catch (error) {
      reject(true);
      console.log(error);
      logger.error(error);
    }
  });
}

/*
    Understanding :
    - [ hola kypanz , como estas] => [ hola kypanz ]
    - [ hola kypanz , como estas ] => [ hola kypanz ]
*/


function processChunks(channel: IChannel) {
  try {

    if (result.length == 0) {
      return console.log('[ processChunks ] : sin datos para procesar');
    }
    const bufferStream = new Readable();
    bufferStream.push(result[0]);
    bufferStream.push(null);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    player.play(createAudioResource(bufferStream));
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('buffer antes => ', result);
      result.shift();
      console.log('nuevo buffer => ', result);
      processChunks(channel);
    });

    player.on('error', (error) => {
      console.log(error);
      logger.error(error);
    })

  } catch (error) {
    console.log(error);
    logger.error(error);
  }
}


export async function meeetingBots() {
  try {

    for (const bot of bots) {
      const client = new Client({
        intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates]
      });
      client.login(bot.MY_BOT_TOKEN);
      client.on('ready', () => {
        console.log(`Logged in as ${client?.user?.tag}!`);
        // Get a copy of the actual channel based in the channelId
        const channel =
          client.channels.cache.get(process.env.CHANNEL_VOICE_BOTS || '');

        if (channel) {

          joinVoiceChannel({
            channelId: channel.id,
            group: (Math.random() * 99999999).toString(),
            guildId: (channel as IChannel).guild.id,
            adapterCreator: (channel as IChannel).guild.voiceAdapterCreator,
          });

          console.log(`${client?.user?.tag} connected to the channel`);

        } else {
          console.log(`${client?.user?.tag} cant connect to the channel`);
        }

      });
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
}
