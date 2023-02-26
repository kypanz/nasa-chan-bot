import Anime_Images from 'anime-images-api';
const API = new Anime_Images()

async function hug(){
    let { image } = await API.sfw.hug();
    return image;
}

async function kiss(){
    let { image } = await API.sfw.kiss();
    return image;
}

async function slap() {
    let { image } = await API.sfw.slap();
    return image;
}

async function punch() {
    let { image } = await API.sfw.punch();
    return image;
}

async function waifu() {
    let { image } = await API.sfw.slap();
    return image;
}

export default { hug, kiss, slap, punch, waifu };
