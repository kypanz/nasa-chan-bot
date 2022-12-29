/**========================================================================
 *                           Created by => kypanz
 *                           Github => 
 *========================================================================**/
import './slashCommands.js';
import { join } from './musicActions.js';

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  
  if (!interaction.isChatInputCommand()) return;

  // Default ping command
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // Play
  if (interaction.commandName === 'play') {
    const isRightChannel = interaction?.channelId != process.env.MY_CHANNEL_TEXT;
    if(isRightChannel) return await interaction.reply('You only can use this command in the channel configurated !');
    const songLink = interaction.options.getString('link');
    if(songLink == null || songLink?.length == 0) return await interaction.reply('Please enter a valid link !');
    console.log('Song Link => ',songLink);
    const channel = interaction.member?.voice.channel;
    const channelText = client.channels.cache.get(process.env.MY_CHANNEL_TEXT);
    //await downloadSong({ channel, channelText, songLink });
    await join({ channel, channelText, songLink });
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

});

client.login(process.env.MY_BOT_TOKEN);