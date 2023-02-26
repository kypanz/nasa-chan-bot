/**========================================================================
 *                           Created by => kypanz
 *                           Github => https://github.com/kypanz
 *========================================================================**/
import './slashCommands.js';
import logger from './configWinston';
import animeImages from  './animeImages';
import Gtts from 'gtts';

// Actions
import { join } from './musicActions.js';
import { question } from './openaiActions.js';

import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import express from 'express';


// ---------- texto a voz
import {
createAudioPlayer,
createAudioResource,
joinVoiceChannel,
NoSubscriberBehavior
} from '@discordjs/voice';
// .......... fin texto a voz



const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction : any) => {
  
  if (!interaction.isChatInputCommand()) return;

  // Default ping command
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // Play
  if (interaction.commandName === 'play') {
    try {
        const isRightChannel = interaction?.channelId != process.env.MY_CHANNEL_TEXT;
        if(isRightChannel) return await interaction.reply('You only can use this command in the channel configurated !');
        const songLink = interaction.options.getString('link');
        if(songLink == null || songLink?.length == 0) return await interaction.reply('Please enter a valid link !');
        console.log('Song Link => ',songLink);
        const channel = interaction.member?.voice.channel;
        const channelText = client.channels.cache.get(process.env.MY_CHANNEL_TEXT);
        await join({ channel, channelText, songLink });
    } catch(error){
        console.log('Error on Play music');
        logger.error(error);
    }
  }

  // Next
  if (interaction.commandName === 'next') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Prev
  if (interaction.commandName === 'prev') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Stop
  if (interaction.commandName === 'stop') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Your Question AI
  if (interaction.commandName === 'question') {
    try {
        const isRightChannel = interaction?.channelId != process.env.MY_CHANNEL_GENERAL;
        if(isRightChannel) return await interaction.reply('You only can use this command in the channel text defined !');
        await interaction.reply('Pensando ...');
        const channelText = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL) as TextChannel;
        const _question = interaction.options.getString('yourquestion');
        channelText.send(` \`\`\`fix\n Tu pregunta => ${_question} \n\`\`\` `);
        const answer = await question({_question});
        channelText.send(answer);
    } catch (error) {
        console.log('Error on AI question');
        logger.error(error);
    }
  }


  // -------------- ANIME ACTIONS ---------------
  if (interaction.commandName === 'hug') {
    const img = await animeImages.hug();
    await interaction.reply(img);
  }

  if (interaction.commandName === 'kiss') {
    const img = await animeImages.kiss();
    await interaction.reply(img);
  }

  if (interaction.commandName === 'slap') {
    const img = await animeImages.slap();
    await interaction.reply(img);
  }

  if (interaction.commandName === 'punch') {
    const img = await animeImages.punch();
    await interaction.reply(img);
  }

  if (interaction.commandName === 'waifu') {
    const img = await animeImages.waifu();
    await interaction.reply(img);
  }

  if (interaction.commandName === 'say') {

    try {
        const isRightChannel = interaction?.channelId != process.env.MY_CHANNEL_SAY;
        if(isRightChannel) return await interaction.reply('You only can use this command in the channel configurated !');
        const message = interaction.options.getString('text');
        const channel = interaction.member?.voice.channel;
        const channelText = client.channels.cache.get(process.env.MY_CHANNEL_TEXT);
        const gtts = new Gtts(message, 'es-us'); // es | es-es | es-us
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });
        player.play(createAudioResource( await gtts.stream() ));
        connection.subscribe(player);

        await interaction.reply(message ?? 'por favor ingresa un texto valido');
        logger.info(message);

    } catch (error) {
        logger.error(error);
        console.log('error al mencionar algo ...');
        console.log(error);
    }

  }

});

client.login(process.env.MY_BOT_TOKEN);

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Nasa-chan ...');
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});
