import * as dc from 'discord.js'
import {Temporal} from 'temporal-polyfill'
import chalk from 'chalk'
import * as sec from './secret/secret.js'

const bot:dc.Client = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)

bot.once("ready", async() => {
  console.log(chalk.green(`Bot ready at ${chalk.yellow(Temporal.Now.plainTimeISO().toString())}`))
})

bot.on("interactionCreate", async(int:dc.Interaction) => {
  if (!int.isCommand()) return
  //const comm = bot.application?.commands.fetch
})
