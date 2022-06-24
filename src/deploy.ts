import  {SlashCommandBuilder} from '@discordjs/builders'
import fs from 'fs-extra'
import path from 'node:path'
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
import {TOKEN,ID} from './secret/secret.js'
import * as cfg from './config.js'
import {Collection} from 'discord.js'

const commands = new Array()

/*
const commDir = fs.readdirSync(path.join(process.cwd(),`build/commands/`))
console.log(commDir)

for (const module of commDir) {
  const comm = await import(module)
  commands.push(comm.data.toJSON())
}
*/

const comm = new SlashCommandBuilder()

class Command {
  public data
  public method
  constructor (
    data: {
      name: string,
      description: string,
    },
    method: Function
  ) {
    this.data = data
    this.method = method
  }
}
//saving for later
