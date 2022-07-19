import { Client, Collection, Guild, GuildMember, PartialGuildMember } from "discord.js"
import chalk from 'chalk'
//import cfg from "./config.json" assert{type:'JSON'}

const cfg = {
  "publicServer": "690391226230374450",
  "branches": [
    {
      "tag": "2B",
      "id": "745812899796353024",
      "roles": {
        "member": "786029825575485451",
        "pubMember": "984910922101432440"
      }
    },
    {
      "tag": "PA",
      "id": "920237201835585536",
      "roles": {
        "member": "920239516592259082",
        "pubMember": "984911176196575282"
      }
    },
    {
      "tag": "9B",
      "id": "903467586816196638",
      "roles": {
        "member": "903467586845540383",
        "pubMember": "984911073511608410"
      }
    }
  ]
}


class branch {
  public guild:Guild
  public memberList:Collection<string, GuildMember>
  public memberIdList:string[]
  public pubRole:string
  public membRole:string
  constructor (guild:Guild, members:Collection<string,GuildMember>, pubRole:string, membRole:string) {
    this.guild = guild
    this.memberList = members
    this.memberIdList = members.map(memb => memb.user.id)
    this.pubRole = pubRole
    this.membRole = membRole
  }
  public findMember = (id:string):GuildMember|undefined => {
    for (const [key, memb] of this.memberList) {
      if (memb.id == id) return memb
    }
  }
}

type pubMembList = {member:GuildMember, guilds: Array<string|undefined>}

async function allMutuals(bot:Client) {
  const branches:branch[] = new Array()
  const pubServ:Guild = await bot.guilds.fetch(cfg.publicServer)
  const pubMembs:Collection<string,GuildMember> = await pubServ.members.fetch()
  const publicMemberList:pubMembList[] = new Array()
  //getting ready
  for (const br of cfg.branches) { //loops thrice: once for each guild
    const serv = await bot.guilds.fetch(br.id)
    const membs = await serv.members.fetch()
    branches.push(new branch(serv, membs, br.roles.pubMember, br.roles.member))
  }

  for (const [key, memb] of pubMembs) {
    const obj = {
      member: memb,
      guilds: new Array(),
    }
    for (const br of branches) {
      obj.guilds.push(br.findMember(memb.user.id)?.guild.id)
    }
    publicMemberList.push(obj)
  }//[pubServ, pubMembs, branches, publicMemberList]
  const retvals = {
    pubServ: pubServ,
    branches: branches,
    pubMembList: publicMemberList,
  }
  return retvals
}

async function roleThem(pubServ:Guild, branches:branch[], members:pubMembList[]) {
  for (const branch of branches) {
    const pubRole = await pubServ.roles.fetch(branch.pubRole)
    const membRole = await branch.guild.roles.fetch(branch.membRole)
    for (const memb of members) {
      try {
        console.log(memb.member.id)
        if (memb.guilds.includes(branch.guild.id) && pubRole && membRole) {
          await memb.member.roles.add(pubRole)
          await branch.findMember(memb.member.id)?.roles.add(membRole)
          console.log(`${chalk.green(memb.member.user.username)} is ${membRole.name} in ${branch.guild.name}. given ${pubRole.name}`)
        }
        else console.log(`${chalk.red(memb.member.user.username)} is not in ${branch.guild.name}`)
      }
      catch(e) {
        console.error()
      }
    }
  }
}

async function roleSync(bot:Client) {
  const doTheThingPlease = await allMutuals(bot)
  const branches = doTheThingPlease.branches
  const pubServ = doTheThingPlease.pubServ
  const pubMembList = doTheThingPlease.pubMembList
  console.log(`branches initialized at ${chalk.yellow(performance.now())}`)
  roleThem(pubServ, branches, pubMembList)
  .then(() => {console.log(`members roled at ${chalk.yellow(performance.now())}`)})
}

async function mutualRole(memb:GuildMember|PartialGuildMember) {
  const pubServ:Guild = await memb.client.guilds.fetch(cfg.publicServer)
  const pubMembs = await pubServ.members.fetch()
  if (!pubServ) throw new Error(`pub server does not exist, DonFuer is no more.`)
  const branches:branch[] = new Array()
  for (const br of cfg.branches) { //loops thrice: once for each guild
    let serv = memb.client.guilds.cache.get(br.id)
    if (!serv) serv = await memb.client.guilds.fetch(br.id)
    if (!serv) throw new Error(`go fuck yourself I'm not debugging this shit`)
    const membs = await serv.members.fetch()
    branches.push(new branch(serv, membs, br.roles.pubMember, br.roles.member))
  }
  for (const branch of branches) {
    const branchMemb = branch.findMember(memb.id)
    //const role = await branch.guild.roles.fetch(branch.membRole)
    //const pubRole = await pubServ.roles.fetch(branch.pubRole)
    for (const [k,m] of pubMembs) {
      if (branchMemb && m.id == branchMemb.id &&
        memb.roles.cache.has(branch.membRole)) m.roles.add(branch.pubRole)
      else {
        branchMemb?.roles.remove(branch.pubRole)
      }
    }
  }
}

export {cfg, branch, allMutuals, roleThem, roleSync, mutualRole}
