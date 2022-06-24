import {SlashCommandBuilder} from "@discordjs/builders"
import {Interaction} from "discord.js"

export default {
  data: new SlashCommandBuilder()
  .setName('members')
  .setDescription(`Shows the amount of members in the server`)
  ,async exec(int:Interaction) {
    try {
      await int.channel?.send(`Members: ${int.guild?.approximateMemberCount}`)
    }
    catch (e) {
      console.log(e)
      console.trace(e)
    }
  }
}
