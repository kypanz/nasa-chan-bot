![alt text](https://i.postimg.cc/dtq4mNJr/Discord-bot-youtube-music-personal-use.jpg)

# Description
- This is a simple discord bot for youtube music
- The bot take a link from a youtube and play the song in voice channel

# Requirements
Tested with :
- node v16.18.0
- npm 8.19.2
- token bot from a developers app
- the client id from the developers app
- ffmpeg installed in linux ( this is for text to speach generation )

# How to install
- npm install

# How to configure
- Create a folder called "music" in the main of the project folder
- Rename the ``.env.example `` file, to `` .env ``
- Configure your `` .env `` file with your own tokens

# Notes about .env file
- ``MY_CLIENT_ID`` => is your bot client id, you can get one from discord developers
- ``MY_BOT_TOKEN`` => is your token bot, you can get one from discord developers
- ``MY_CHANNEL_TEXT`` => is the channel where you wanna call the commands, you can get the id of the text channel doing right click in the text channel

# How to run the bot
- `node index.js`
