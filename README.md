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
- ``NEWS_APIKEY `` => to get news in discord, default 3 per call
- ``username `` => insta user
- ``password `` => insta password
- ``FREELANCER_AUTH_V2`` => Here your AUTH_V2 from the network request
- ``FREELANCER_TRACKING`` => Here your tracking from the network request

# How to run the bot
- `npm run start`

# Possible Issue

The images on instagram are not upload, if this happend ensure the `instagram-web-api/lib/index.js` has the next structure

```
// Get CSRFToken from cookie before login
let value
await this.request('/', { resolveWithFullResponse: true }).then(res => {
const pattern = new RegExp(/(csrf_token":")[\w]+/)
const matches = res.toJSON().body.match(pattern)
value = matches[0].split(':')[1].slice(1);
console.log('current token => ', value , '...');
console.log('current okten without slice => ', matches[0].split(':')[1]);
})
```


## Twitch bot

Create a file called `accounts.json` in the twitch folder and add the next structure
```
[{
  "token" : "",
  "username" : ""
}]
```
