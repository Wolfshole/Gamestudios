const { getGuildSettings } = require("../utils/api");

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    const settings = await getGuildSettings(member.guild.id);

    if (!settings || !settings.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(settings.welcomeChannel);
    if (!channel) return;

    const message = (settings.welcomeMessage || "👋 Willkommen {user}!")
      .replace("{user}", member.user)
      .replace("{server}", member.guild.name);

    channel.send(message).catch(() => {});
  },
};
