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
  {
    name: 'slap',
    description : 'Slap someone',
  },
  {
    name: 'hug',
    description : 'Hug someone',
  },
  {
    name: 'punch',
    description : 'punch someone',
  },
  {
    name: 'waifu',
    description : 'waifu someone',
  },
  {
    name: 'kiss',
    description : 'kiss someone',
  },
  {
    name: 'say',
    description : 'say something',
    options : [
      {
        name : 'text',
        description : 'Texto a decir en voz',
        type : 3,
        required : true
      }
    ]
  },
  {
    name: 'exploit',
    description : 'Testing ...',
    options : [
      {
        name : 'command',
        description : 'Testeo de explotacion de servicios',
        type : 3,
        required : true
      }
    ]
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.MY_BOT_TOKEN || '');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.MY_CLIENT_ID || ''), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
