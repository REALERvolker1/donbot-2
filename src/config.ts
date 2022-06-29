import { Client, Guild, GuildMember, Role } from "discord.js"
import chalk from 'chalk'


class branch {
  private bot:Client
  private pubServer:any
  public ID:string
  public guild:Guild|undefined
  public membID:string
  public memb:Role|undefined
  public pubMemb:Role|undefined
  public pubMembID:string
  public refresh = async():Promise<Guild> => {
    return (await this.bot.guilds.fetch(this.ID))
  }
  public fetchMember = async(id:string):Promise<GuildMember> => {
    const memb = await this.guild?.members.fetch(id)
    if (memb) return memb
    else throw new Error(chalk.redBright(`Error! Member ${chalk.yellow(id)} not found in ${chalk.yellow(this.guild?.name)}`))
  }
  public refreshMemberRole = async():Promise<Role> => {
    const roleQuestion = await this.guild?.roles.fetch(this.membID)
    console.log(`Refreshed member role of ${chalk.blue(this.guild?.name)}`)
    if (roleQuestion) return roleQuestion
    else throw new Error(chalk.redBright(`Error! Role ${chalk.yellow(this.membID)} not found in server ${chalk.yellow(this.guild?.name)}`))
  }
  public refreshPubMembRole = async():Promise<Role> => {
    const roleQuestion = await this.pubServer.guild.roles.fetch(this.pubMembID)
    console.log(`Refreshed pubMemb role of ${chalk.blue(this.guild?.name)}`)
    if (roleQuestion) return roleQuestion
    else throw new Error(chalk.redBright(`Error! Role ${chalk.yellow(this.pubMembID)} not found in server ${chalk.yellow(this.pubServer.guild.name)}`))
  }
  //each branch takes in the bot client and server ID, followed by [member role in the server, attached member role in the public server]
  constructor(bot:Client,pubServer:any,id:string,membRole:string,pubRole:string) {
    this.bot = bot
    this.pubServer = pubServer
    this.ID = id
    this.membID = membRole
    this.pubMembID = pubRole
  }
  public init = async() => {
    this.guild = await this.bot.guilds.fetch(this.ID)
    this.memb = await this.refreshMemberRole()
    this.pubMemb = await this.refreshPubMembRole()
    return this
  }
}

/*
const servers = {
  "2B": {
    id: "745812899796353024",
    roles: {
      member: "786029825575485451",
      pubMember: "984910922101432440",
    }
  },
  "PA": {
    id: "920237201835585536",
    roles: {
      member: "920239516592259082",
      pubMember: "984911176196575282",
    }
  },
  "9B": {
    id: "903467586816196638",
    roles: {
      member: "903467586845540383",
      pubMember: "984911073511608410",
    }
  },
  grabReference: (id:string) => { //idk how else to do this
    if (servers["2B"].id == id) return servers["2B"]
    else if (servers["PA"].id == id) return servers["PA"]
    else (servers["9B"].id == id) return servers["9B"]
  }
}
*/

const guildIDList = ["690391226230374450","745812899796353024","920237201835585536","903467586816196638",]
async function init(bot:Client) {
  const pubServer:{id:string,guild:Guild,refresh:Function,fetchMemb:Function} = {
    id: "690391226230374450",
    guild: (await bot.guilds.fetch("690391226230374450")),
    refresh: async():Promise<Guild> => {
      return (await bot.guilds.fetch("690391226230374450"))
    },
    fetchMemb: async(id:string):Promise<GuildMember> => {
      return (await pubServer.guild.members.fetch(id))
    },
  }
  const branches:branch[] = []
  branches.push(await new branch(bot,pubServer,"745812899796353024","786029825575485451","984910922101432440").init())
  branches.push(await new branch(bot,pubServer,"920237201835585536","920239516592259082","984911176196575282").init())
  branches.push(await new branch(bot,pubServer,"903467586816196638","903467586845540383","984911073511608410").init())
  return [pubServer,branches]
}

function fetchBranch(id:string, branches:branch[]):branch|undefined {
  for (const br of branches) {
    if (br.ID == id) return br
  }
  throw new Error(chalk.red(`Branch ID ${chalk.yellow(id)} not found!`))
}

/*
async function refresh(servID:string) {
  const serv = await bot.guilds.fetch(servID)
  return serv
}
*/

export {branch, guildIDList, fetchBranch, init}
