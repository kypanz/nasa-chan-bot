/* eslint-disable no-console */
import fs from 'fs';
import dotenv from 'dotenv';
import Instagram from 'instagram-web-api';
dotenv.config();
import logger from './winston/configWinston';

const { INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD } = process.env;
const client = new Instagram({
  username: INSTAGRAM_USERNAME,
  password: INSTAGRAM_PASSWORD
})

// console.log(INSTAGRAM_USERNAME, ' | ', INSTAGRAM_PASSWORD);

let isLogged = false;
let imagesProcessed: object;

export function startRandomTimeInstagram() {

  try {

    const minute = 60 * 1000;
    const max_minutes = 10;
    const tiempo = Math.round(Math.random() * (minute * max_minutes));

    setTimeout(async () => {
      const titulos = definirTitulos();
      const images = await getImages();
      if (titulos && images) {
        await postInInstragram(titulos, images);
      }
      startRandomTimeInstagram();
    }, tiempo);

  } catch (error) {
    console.error('Error on instapost worker');
    logger.error(error);
    logger.error(imagesProcessed);
  }


}

async function getImages() {


  try {

    const randomOffset = Math.round(Math.random() * 400);
    const requestBody = {
      queries: [
        {
          q: "cat",
          indexUid: "images_v6",
          facets: [
            "aspectRatio",
            "baseModel",
            "createdAtUnix",
            //"generationTool",
            "tagNames",
            "type",
            "user.username"
          ],
          attributesToHighlight: [],
          highlightPreTag: "__ais-highlight__",
          highlightPostTag: "__/ais-highlight__",
          limit: 51,
          offset: randomOffset,
          sort: ["stats.reactionCountAllTime:desc"]
        }
      ]
    };

    const host_target = 'https://meilisearch-v1-6.civitai.com/multi-search';
    const gt1 = '102312c2b83ea0ef9ac32e7858f7';
    const gt2 = '42721bbfd7319a957272e746f84fd1e974af';
    const sec_ch_ua1 = "\"Not/A)Brand\";v=\"8\", \"Chromium\";"
    const sec_ch_ua2 = "v=\"126\", \"Brave\";v=\"126\""
    const x_meilisearch1 = "Meilisearch instant-meilisearch (v0.13.5) ;";
    const x_meilisearch2 = "Meilisearch JavaScript (v0.34.0)";
    const response = await fetch(host_target, {
      "headers": {
        "accept": "*/*",
        "accept-language": "es-419,es;q=0.7",
        "authorization": `Bearer ${gt1 + gt2}`,
        "content-type": "application/json",
        "priority": "u=1, i",
        "referrer-policy": "strict-origin-when-cross-origin",
        "sec-ch-ua": `${sec_ch_ua1 + sec_ch_ua2}`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "x-meilisearch-client": `${x_meilisearch1} ${x_meilisearch2}`,
        "Referer": "https://civitai.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": JSON.stringify(requestBody),
      "method": "POST"
    });

    const images = (await response.json()).results[0].hits;
    imagesProcessed = images;
    const result: string[] = [];

    for (let index = 0; index < images.length; index++) {
      const nsfwLevel = (images[index].nsfwLevel[0]);
      const host_url = 'https://image.civitai.com';
      const path_url = '/xG1nkqKTMzGDvpLrqFT7WA';
      const name_file = '/${images[index].url}/width=512/213.jpeg';
      const image_url = `${host_url}${path_url}${name_file}`;
      if (nsfwLevel == 1) {
        result.push(image_url);
      }
      // This goes to a log storage 
      const out = {
        image: image_url,
        level: nsfwLevel
      }
      logger.log('image', out);
    }

    return result;

  } catch (error) {
    console.error('error on getting images');
    console.error(error);
    logger.error(error);
  }
}

async function postInInstragram(titulos: string[], images: string[]) {

  try {

    if (notHaveContent(titulos)) return;
    const resultRandomImage = images[
      Math.round(Math.random() * (images.length))
    ];
    if (!resultRandomImage) return;
    const image = resultRandomImage;
    const titulo = titulos[0];

    if (!isLogged) {
      const response = await client.login({
        username: INSTAGRAM_USERNAME,
        password: INSTAGRAM_PASSWORD
      }, { _sharedData: false });
      isLogged = true;
      console.log('Logeado correctamente !');
    }
    const { media } = await client.uploadPhoto({
      photo: image,
      caption: titulo,
      post: 'feed',
    });
    console.log(`upload result => https://www.instagram.com/p/${media.code}/`)
    titulos.shift()
    fs.writeFileSync('./instagram/titulos_posteos.txt', titulos.join('-'));

  } catch (error) {
    isLogged = false;
    titulos.shift();
    fs.writeFileSync('./instagram/titulos_posteos.txt', titulos.join('-'));
    logger.error(error);
    console.error(error);
  }

}

function definirTitulos() {
  try {
    const contenidoTiutlos = fs.readFileSync('./instagram/titulos_posteos.txt');
    const titulos = contenidoTiutlos.toString().split('-');
    return titulos;
  } catch (error) {
    console.error('error defining titles');
    logger.error(error);
  }
}

function notHaveContent(titles: string[]) {
  if (titles[0] == '' || titles.length == 0) return true;
}


// NOT REMOVE THIS CODE, THIS IS AN EXAMPLE OF WHAT MODIFY IN THE MODULE
/*
        // Get CSRFToken from cookie before login
    let value
    await this.request('/', { resolveWithFullRes
    ponse: true }).then(res => {
      const pattern = new RegExp(/(csrf_token\"\:\")[\w]+/)
      const matches = res.body.match(pattern)
      value = matches[0].split(":")[1].slice(1);
    })
*/
