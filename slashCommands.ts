/**========================================================================
 *                    DESCRIPTION FOR SLASH COMMANDS
 *========================================================================**/

import * as dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'play',
    description : 'This command prepare a youtube music',
    options : [
      {
        name : 'link',
        description : 'Paste your youtube link here to download and play your song :)',
        type : 3,
        required : true
      }
    ]
  },
  {
    name: 'next',
    description : 'This command prepare a next music'
  },
  {
    name: 'prev',
    description : 'This command prepare a next music'
  },
  {
    name: 'stop',
    description : 'This command stop the actual music'
  },
  {
    name: 'question',
    description : 'Let me answer you',
    options: [
      {
        name : 'yourquestion',
        description : 'You can do any type of question, i do my best',
        type : 3,
        required : true
      }
    ]
  },
  
];

const rest = new REST({ version: '10' }).setToken(process.env.MY_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.MY_CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
