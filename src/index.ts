import * as dc from 'discord.js'
import {Temporal} from 'temporal-polyfill'
import chalk from 'chalk'
import * as sec from './secret/secret.js'
import {branch, fetchBranch, init} from './config.js'
const globals:any[] = new Array()
const bot:dc.Client = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)
bot.once("ready", async() => {
  console.log(chalk.green(`Bot ready at ${chalk.yellow(Temporal.Now.plainTimeISO().toString())}`))
  globals.concat(await init(bot)) //globals[0]: pubServ, globals[1]: branches
})

bot.on("interactionCreate", async(int:dc.Interaction) => {
  if (!int.isCommand()) return
  //const comm = bot.application?.commands.fetch
})

bot.on("guildMemberAdd", async(memb:dc.GuildMember) => {
  console.log(`GuildMember ${chalk.blue(memb.displayName)} added to ${memb.guild.name}`)
})

bot.on("guildMemberUpdate", async(oldmemb:dc.GuildMember | dc.PartialGuildMember,newmemb:dc.GuildMember) => {
  console.log(`in ${chalk.blue(newmemb.guild.name)},
  member ${chalk.blue(newmemb.displayName)} had roles updated from 
  ${chalk.blue(oldmemb.roles.highest)} to ${chalk.blue(newmemb.roles.highest)}`)
  const refServ = fetchBranch(oldmemb.guild.id,globals[1]) //globals[1] is undefined
  if (!refServ) return 
  //if (newmemb.roles.cache.has(refServ.roles.member) && !(await (await bot.guilds.cache.get(pubServer.id)?.fetch())?.members.fetch(newmemb.user.id))?.roles.cache.has(refServ.roles.pubMember))) 
  const removedRoles = oldmemb.roles.cache.filter(role => !newmemb.roles.cache.has(role.id))
  const addedRoles = newmemb.roles.cache.filter(role => !oldmemb.roles.cache.has(role.id))
  const pubMemb = await globals[0].fetchMemb(newmemb.user.id)
  if (removedRoles.size > 0) {
    if (newmemb.roles.cache.has(refServ.membID)) pubMemb.roles.add(refServ.pubMemb)
    else pubMemb.roles.remove(refServ.pubMemb)
  }
  else if (addedRoles.size > 0) {
    if (newmemb.roles.cache.has(refServ.membID)) pubMemb.roles.add(refServ.pubMemb)
    else pubMemb.roles.remove(refServ.pubMemb)
  } //complexity demon bah
})
