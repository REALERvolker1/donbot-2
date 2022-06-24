import * as dc from 'discord.js'
import chalk from 'chalk'
import * as sec from './secret/secret.js'

const bot = new dc.Client({intents:sec.INTENTS})
bot.login(sec.TOKEN)

bot.once("ready", async() => {
  console.log("ready")
})
