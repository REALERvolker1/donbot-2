import * as dc from 'discord.js'
import {Temporal} from 'temporal-polyfill'
import chalk from 'chalk'
import * as sec from './secret/secret.js'
import { command } from './utils.js'
import {allMutuals, branch, roleThem, roleSync, mutualRole} from './branch.js'

const bot:dc.Client = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)
console.log(`bot initialized at ${chalk.yellow(performance.now())}`)

bot.on("error", (e) => {
  console.log(e)
  console.trace(e)
})

bot.once("ready", async() => {
  console.log(chalk.green(`Bot ready in ${chalk.yellow(performance.now())} ms at ${chalk.bold.yellow(Temporal.Now.plainTimeISO().toString())}`))
  //roleSync(bot)
})


bot.on("guildMemberAdd", async(memb:dc.GuildMember) => {
  console.log(`GuildMember ${chalk.blue(memb.displayName)} added to ${memb.guild.name}`)
  mutualRole(memb)
})

bot.on("guildMemberRemove", async(memb) => {
  console.log(`GuildMember ${chalk.blue(memb.displayName)} removed from ${memb.guild.name}`)
  mutualRole(memb)
})

bot.on("guildMemberUpdate", async(oldmemb:dc.GuildMember | dc.PartialGuildMember,newmemb:dc.GuildMember) => {
  console.log(`${oldmemb.displayName} => ${newmemb.displayName}`)
  if (oldmemb.roles.highest == newmemb.roles.highest) return //exits if not a role update
  mutualRole(newmemb)
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
