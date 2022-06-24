import * as dc from 'discord.js'
import moment from 'moment'
import chalk from 'chalk'
import * as sec from './secret/secret.js'

const bot:dc.Client = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)

bot.once("ready", async() => {
  console.log(chalk.green(`Bot ready at `) + chalk.yellow(moment().format("h:mm:ss a")))
})

bot.on("interactionCreate", async(int:dc.Interaction) => {
  if (!int.isCommand()) return
  const comm = bot.application?.commands.fetch
})
