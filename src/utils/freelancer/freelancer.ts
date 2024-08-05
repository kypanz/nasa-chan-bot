import { EmbedBuilder, TextChannel } from "discord.js";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const {
  FREELANCER_AUTH_V2,
  FREELANCER_TRACKING,
} = process.env;

export interface IProject {
  title: string;
  seo_url: string;
  currency: {
    code: string;
  }
  description: string;
  budget: {
    minimum: number;
    maximum: number;
  },
  bid_stats: {
    bid_count: number;
    bid_avg: number;
  }
  time_submitted: number;
}

interface IDataFreelancer {
  result: {
    projects: IProject[]
  }
}

interface IFreelancerClass {
  interaction: any;
  client: any;
  search: string;
}

export class FreelancerScrapperByKyp4nz {

  worker: any;
  search: string;
  client: any;
  interaction: any;
  hashSet = new Set();
  jobs_finded: IProject[] = [];
  list_to_find: string[] = [
    'blockchain',
    'web3',
    'aplicacion web',
    'solidity',
    'nodejs',
    'AI software'
  ];

  constructor({ search, client, interaction }: IFreelancerClass) {
    this.search = search;
    this.client = client;
    this.interaction = interaction;
  }

  getInstance() {
    if (!this.worker) {
      const minute = 60 * 1000;
      this.list_to_find.forEach((el) => {
        this.getFreelancerJobs(el);
      });
      this.sendToDiscord();
      this.jobs_finded = [];
      this.worker = setInterval(() => {
        this.list_to_find.forEach((el) => {
          this.getFreelancerJobs(el);
        });
        // this.getFreelancerJobs()
        this.sendToDiscord();
        this.jobs_finded = [];
      }, 1000 * 10);
    }
    return this.worker;
  }

  async getFreelancerJobs(to_find: string) {
    const response = await fetch(`https://www.freelancer.com/api/projects/0.1/projects/active?limit=20&offset=0&full_description=true&job_details=true&local_details=true&location_details=true&upgrade_details=true&user_country_details=true&user_details=true&user_employer_reputation=true&user_status=true&jobs%5B%5D=9&jobs%5B%5D=24&jobs%5B%5D=44&jobs%5B%5D=116&jobs%5B%5D=167&jobs%5B%5D=182&jobs%5B%5D=183&jobs%5B%5D=292&jobs%5B%5D=323&jobs%5B%5D=343&jobs%5B%5D=989&jobs%5B%5D=2039&jobs%5B%5D=2060&jobs%5B%5D=2889&jobs%5B%5D=2916&jobs%5B%5D=2917&languages%5B%5D=en&languages%5B%5D=es&project_types%5B%5D=fixed&query=${to_find}&sort_field=submitdate&min_price=3000&webapp=1&compact=true&new_errors=true&new_pools=true`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "freelancer-app-build-timestamp": "1718377401",
        "freelancer-app-is-installed": "false",
        "freelancer-app-is-native": "false",
        "freelancer-app-locale": "es",
        "freelancer-app-name": "main",
        "freelancer-app-platform": "web",
        "freelancer-app-version": "gitRevision=36d8833, buildTimestampInSeconds=1718377401",
        "freelancer-auth-v2": `${FREELANCER_AUTH_V2}`,
        "freelancer-tracking": `${FREELANCER_TRACKING}`,
        "sec-ch-ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "Referer": `https://www.freelancer.com/search/projects?q=${to_find}&projectLanguages=es,en&projectSkills=9,24,44,116,167,182,183,292,323,343,989,2039,2060,2889,2916,2917&types=fixed&projectFixedPriceMin=3000`,
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });
    const data = await response.json();
    this.filterData(data)
  }

  filterData(data: IDataFreelancer) {
    data.result.projects.forEach((element: IProject) => {
      if (element.time_submitted) {
        element.time_submitted = this.calculateDate(element.time_submitted);
      }
      const hash = this.generateMD5(JSON.stringify(element));
      if (!this.hashSet.has(hash)) {
        this.hashSet.add(hash);
        element.description = element.description.slice(0, 700);
        this.jobs_finded.push(element);
      }
      // return element;
    });
    return this.jobs_finded;
  }


  calculateDate(submitDate: number) {
    const currentDate = Math.floor(Date.now() / 1000);
    const timeDifference = currentDate - submitDate;
    const daysAgo = Math.floor(timeDifference / (60 * 60 * 24));
    return daysAgo;
  }

  async sendToDiscord() {
    const result = await this.FindJobsEmbedGenerator(this.jobs_finded);
    const actualChannel = this.client.channels.cache
      .get(this.interaction.channelId) as TextChannel;
    for (let index = 0; index < result.length; index++) {
      await actualChannel.send({ embeds: [result[index]] });
    }
    // await actualChannel.send('Fnished. :)');
  }

  async FindJobsEmbedGenerator(data: IProject[]) {
    const arr_temp = [];
    for (let index = 0; index < data.length; index++) {
      // let img = data[index].urlToImage;
      const nasa_chan_img = 'https://cdn.discordapp.com/app-icons/831884165108334644/06ae1da8d97a3936c02a47a1138a129a.png';
      // if (img == null) img = 'https://i.imgur.com/AfFp7pu.png';
      const author = 'h4ck3d By Kyp4nz';
      const exampleEmbed = new EmbedBuilder()
        .setColor(0x05F000)
        .setTitle(`Nº ${index} | ${data[index].title} | Precio : ${data[index].budget.minimum} - ${data[index].budget.maximum} | Moneda : ${data[index].currency.code}`)
        .setURL(`https://www.freelancer.com/projects/${data[index].seo_url}`)
        .setAuthor({ name: `${(author == null) ? 'Anonymous' : author}`, iconURL: nasa_chan_img, url: `https://www.freelancer.com/projects/${data[index].seo_url}` })
        .setDescription(`${data[index].description}`)
        .setThumbnail(`${nasa_chan_img}`)
        .setTimestamp()
        .setFooter({ text: 'Nasa chan hacks - powered by Kyp4nz', iconURL: nasa_chan_img });
      arr_temp.push(exampleEmbed);
    }
    return arr_temp;
  }

  generateMD5(data: any) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

}
