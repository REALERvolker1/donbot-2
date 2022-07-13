import { Client, Guild, GuildMember, Role } from "discord.js"
import {bot} from './index.js'

class branch {
  public key:string
  public ID: string
  public role:string
  public pubRole:string
  public guild:Guild|undefined
  constructor (key:string, id:string, roleID:string, pubRoleID:string) {
    this.key = key
    this.ID = id
    this.role = roleID
    this.pubRole = pubRoleID
  }
  public fetchMember = async(id:string):Promise<GuildMember> => {
    const guild = bot.guilds.cache.get(this.ID)
    const memb = await guild?.members.fetch(id)
    if (memb) return memb
    else throw new Error(`Error! Member ${id} not found in ${guild?.name}`)
  }
  public init = async():Promise<branch> => {
    this.guild = await bot.guilds.fetch(this.ID)
    return this
  }
}
var errorCount = 0
function err() {
  errorCount += 1
}
const branchList = [
  await new branch("2B", "745812899796353024", "786029825575485451", "984910922101432440").init(), //2b
  await new branch("PA", "920237201835585536", "920239516592259082", "984911176196575282").init(), //pa
  await new branch("9B", "903467586816196638", "903467586845540383", "984911073511608410").init(), //9b
]
const pubServ = {
  ID: "690391226230374450",
  roles: {
    "2B": "984910922101432440",
    "PA": "984911176196575282",
    "9B": "984911073511608410",
  },
  guild:bot.guilds.cache.get("690391226230374450"),
  updateGuild: async() => {
    pubServ.guild = await bot.guilds.fetch("690391226230374450")
    return pubServ
  }
}

async function mutuals(userID:string):Promise<branch[]> {
  const servs = new Array()
  for (const branch of branchList) {
    try{
      servs.push(branch.fetchMember(userID))
    }
    catch(e) {
      err()
    }
  }
  return servs
}

export {branch, branchList, err, errorCount, pubServ, mutuals }
