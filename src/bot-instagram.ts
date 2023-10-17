import fs from 'fs';
import dotenv from 'dotenv';
import Instagram from 'instagram-web-api';
dotenv.config();

const { username, password } = process.env;
const client = new Instagram({ username, password })

let isLogged = false;

export function startRandomTimeInstagram() {

    const minute = 60 * 1000;
    const max_minutes = 60;
    const tiempo = Math.round(Math.random() * (minute * max_minutes));
    console.log(tiempo / 1000 / 60);

    setTimeout(async () => {
        console.log(`Saludos despues de ${tiempo} milisegundos`);
        const titulos = definirTitulos();
        console.log('los titulo son ahora => ', titulos);
        const images = await getImages();
        await postInInstragram(titulos, images);
        startRandomTimeInstagram();
    }, tiempo);
}

async function getImages() {

    const response = await fetch("https://meilisearch-new.civitai.com/multi-search", {
        "headers": {
            "accept": "*/*",
            "accept-language": "es-419,es;q=0.7",
            "authorization": "Bearer 5e329503849e1e1f1baa628f29fde34308606d511493d6b4b430947df8cd0b43",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Brave\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-meilisearch-client": "Meilisearch instant-meilisearch (v0.13.5) ; Meilisearch JavaScript (v0.34.0)",
            "Referer": "https://civitai.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"queries\":[{\"q\":\"anime\",\"indexUid\":\"images_v2\",\"facets\":[\"tags.name\",\"user.username\"],\"attributesToHighlight\":[],\"highlightPreTag\":\"__ais-highlight__\",\"highlightPostTag\":\"__/ais-highlight__\",\"limit\":51,\"offset\":0,\"sort\":[\"rank.collectedCountAllTimeRank:asc\"]}]}",
        "method": "POST"
    });

    const images = (await response.json()).results[0].hits;

    const result: string[] = [];

    for (let index = 0; index < images.length; index++) {
        console.log(`The image is => https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/${images[index].url}/width=512/213.jpeg | NFSW : ${images[index].nsfw}`)
        const isNotMatureContent = 'none';
        const isSoft = 'soft';
        const actualTypeImage = (images[index].nsfw).toLowerCase();
        if (actualTypeImage == isNotMatureContent || actualTypeImage == isSoft) {
            result.push(`https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/${images[index].url}/width=512/213.jpeg`);
        }
    }

    return result;
}

async function postInInstragram(titulos: string[], images: string[]) {
    if (notHaveContent(titulos)) return;
    const resultRandomImage = images[Math.round(Math.random() * (images.length))];
    if(!resultRandomImage) return;
    const image = resultRandomImage;
    const titulo = titulos[0];
    if(!isLogged) {
        const response = await client.login({ username, password }, { _sharedData: false });
        console.log('respuesta => ', response);
        isLogged = true;
    }
    const { media } = await client.uploadPhoto({
        photo: image,
        caption : titulo,
        post: 'feed',
    });
    console.log(`tu imagen subida es => https://www.instagram.com/p/${media.code}/`)
    titulos.pop()
    fs.writeFileSync('./instagram/titulos_posteos.txt', titulos.join('-'));
}

function definirTitulos() {
    const contenidoTiutlos = fs.readFileSync('./instagram/titulos_posteos.txt');
    const titulos = contenidoTiutlos.toString().split('-');
    return titulos;
}

function notHaveContent(titles: string[]) {
    if (titles[0] == '' || titles.length == 0) return true;
}