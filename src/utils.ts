import { Message } from 'discord.js'
import chalk from 'chalk'
import {bot} from './index.js'
import * as br from './branches.js'
import { Temporal } from 'temporal-polyfill'

async function command(msg:Message) {
  const args = msg.content.trim().split(" ").filter(ඞ => {return ඞ != ""})
  const command = args.shift()?.slice(1, 999)
  switch (command) {
    case "mcage":
      const data = await fetch(`https://api.ashcon.app/mojang/v2/user/${args[0]}`)
      const res = await data.json()
      msg.reply(res.created_at? res.created_at : `Error. Mojang's API is fucking stupid.`)
    break
    case "dcage":
      const account = await (await br.pubServ.updateGuild()).guild?.members.fetch(args[0])
      const date = account?.joinedAt?.toDateString()
      msg.reply(date? date : `Error. DateString object is weird today`)
  }
}


export {command}
