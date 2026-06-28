const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { isCommandEnabled } = require("../utils/api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Verwarnt einen Nutzer")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Der Nutzer, der verwarnt werden soll")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("grund")
        .setDescription("Grund für die Verwarnung")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    // API Check
    const enabled = await isCommandEnabled(guildId, "warn");
    if (!enabled) {
      return interaction.reply({
        content: "❌ Der `/warn` Command ist auf diesem Server deaktiviert.",
        ephemeral: true,
      });
    }

    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("grund");

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "Du hast keine Berechtigung für diesen Befehl!",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("⚠️ Verwarnung")
      .setDescription(
        `**Nutzer:** ${target.tag}\n**Grund:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
      )
      .setColor("#FFAA00")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Hier später zusätzlich in DB speichern (Warn-System)
  },
};
