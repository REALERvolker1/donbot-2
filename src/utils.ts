import { Message } from 'discord.js'

async function command(msg:Message) {
  const args = msg.content.trim().split(" ").filter(ඞ => {return ඞ != ""})
  const command = args.shift()?.slice(1, 999)
  switch (command) {
    case "mcage":
      const data = await fetch(`https://api.ashcon.app/mojang/v2/user/${args[0]}`)
      const res = await data.json()
      msg.reply(res.created_at? res.created_at.replace(/@/g, "ඞ") : `Error. Mojang's API is fucking stupid. Please try again later or run 'help`)
    break
    case "dcage":
      const account = await msg.guild?.members.fetch(args[0])
      const date = account?.joinedAt?.toDateString()
      msg.reply(date? `Creation date of ${account?.displayName}: ${date.replace(/@/g, "ඞ")}` : `Error parsing data. Please try again later or run 'help`)
    break
    default:
      msg.reply(`
      **Available commands**
      \`'mcage <minecraftIGN>\` returns the age of a Minecraft account
      \`'dcage <user ID>\` returns the age of a discord user
      more coming soon
      `)
  }
}

export {command}
