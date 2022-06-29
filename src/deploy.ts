import  {SlashCommandBuilder} from '@discordjs/builders'
import fs from 'fs-extra'
import * as path from 'node:path'
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
import {TOKEN,ID} from './secret/secret.js'
import {guildIDList} from './config.js'
import chalk from 'chalk'
import {Collection} from 'discord.js'

const commands = new Array()
const commPath = path.join(process.cwd(),'build','commands')
const dir = fs.readdirSync(commPath).filter(val => val.endsWith(`.js`))
const rest = new REST({version:'10'}).setToken(TOKEN)

for (const module of dir) {
  const {data,exec} = await import(path.join(commPath,module))
  commands.push(data.toJSON())
}
for (const id of guildIDList) {
  rest.put(Routes.applicationGuildCommands(ID,id), {body: commands})
  .then(()=>{console.log(chalk.green(`Successfullt registered commands in guild ${chalk.blue(guildIDList)}`))})
  .catch(console.error)
}

