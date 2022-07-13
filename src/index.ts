import * as dc from 'discord.js'
import {Temporal} from 'temporal-polyfill'
import chalk from 'chalk'
import * as sec from './secret/secret.js'
import { command } from './utils.js'
import * as br from './branches.js'
const bot:dc.Client = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)
const pubServ = await br.pubServ.updateGuild()
bot.on("error", (e) => {
  console.log(e)
  console.trace(e)
})

bot.once("ready", async() => {
  console.log(chalk.green(`Bot ready at ${chalk.yellow(Temporal.Now.plainTimeISO().toString())}`))
})

bot.on("guildMemberAdd", async(memb:dc.GuildMember) => {
  console.log(`GuildMember ${chalk.blue(memb.displayName)} added to ${memb.guild.name}`)
  if (memb.guild.id == br.pubServ.ID) {
    const muts = await br.mutuals(memb.user.id)
    if (muts.length < 1) return
    for (const branch of muts) {
      memb.roles.add(branch.pubRole)
    }
  }
})

bot.on("guildMemberRemove", async(memb) => {
  console.log(`GuildMember ${chalk.blue(memb.displayName)} removed from ${memb.guild.name}`)
  if (memb.guild.id == pubServ.ID){
    const channel = memb.user.dmChannel? memb.user.dmChannel : await memb.user.createDM()
    channel.send(`
      Please rejoin the public DonFuer discord server to continue your membership in DonFuer.
      https://donfuer.com/discord
      Contact volker1#0001 if you believe this is in error.
    `)
  }  
})

bot.on("guildMemberUpdate", async(oldmemb:dc.GuildMember | dc.PartialGuildMember,newmemb:dc.GuildMember) => {
  console.log(`${oldmemb.displayName} => ${newmemb.displayName}`)
  if (oldmemb.roles.highest == newmemb.roles.highest) return //exits if not a role update
})

bot.on("messageCreate", async(msg) => {
  try {
    if (msg.content.startsWith("'")) await command(msg)
  }
  catch(e) {
    console.log(e)
    console.trace(e)
    msg.reply(`There was an error processing your request. Please try again later.
    If any further issues occur, contact volker1#0001.`)
  }
})
export {bot}
