const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { isCommandEnabled } = require("../utils/api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banlist")
    .setDescription("Listet alle gebannten Nutzer des Servers")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    // API Check: Ist der Command aktiviert?
    const enabled = await isCommandEnabled(guildId, "banlist");
    if (!enabled) {
      return interaction.reply({
        content: "❌ Der `/banlist` Command ist auf diesem Server deaktiviert.",
        ephemeral: true,
      });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "Du hast nicht die Berechtigung um das zu nutzen!",
        ephemeral: true,
      });
    }

    try {
      const bans = await interaction.guild.bans.fetch();

      if (bans.size === 0) {
        return interaction.reply({
          content: "Es gibt keine gebannten Nutzer auf diesem Server!",
          ephemeral: true,
        });
      }

      const embeds = [];
      let currentEmbed = new EmbedBuilder()
        .setTitle("📜 Bannliste")
        .setColor("DarkNavy")
        .setTimestamp();
      let fieldCount = 0;

      for (const ban of bans.values()) {
        const user = ban.user;
        const reason = ban.reason || "Kein Grund angegeben";

        if (fieldCount >= 25) {
          embeds.push(currentEmbed);
          currentEmbed = new EmbedBuilder()
            .setTitle("📜 Bannliste (Fortsetzung)")
            .setColor("DarkNavy")
            .setTimestamp();
          fieldCount = 0;
        }

        currentEmbed.addFields({
          name: `${user.tag} (${user.id})`,
          value: `**Grund:** ${reason}`,
          inline: false,
        });
        fieldCount++;
      }

      embeds.push(currentEmbed);

      await interaction.reply({ embeds, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Fehler beim Abrufen der Bannliste!",
        ephemeral: true,
      });
    }
  },
};
