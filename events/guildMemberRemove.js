const { getGuildSettings } = require("../utils/api");

module.exports = {
  name: "guildMemberRemove",

  async execute(member) {
    const settings = await getGuildSettings(member.guild.id);

    if (!settings || !settings.leaveChannel) return;

    const channel = member.guild.channels.cache.get(settings.leaveChannel);
    if (!channel) return;

    const message = (
      settings.leaveMessage || "😢 {user} hat den Server verlassen."
    )
      .replace("{user}", member.user.tag)
      .replace("{server}", member.guild.name);

    channel.send(message).catch(() => {});
  },
};
