const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { isCommandEnabled } = require("../utils/api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt einen Benutzer vom Server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Der Benutzer, den du bannen möchtest.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("grund")
        .setDescription("Grund für den Ban")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    // API-Check: Ist der Command aktiviert?
    const enabled = await isCommandEnabled(guildId, "ban");
    if (!enabled) {
      return interaction.reply({
        content: "❌ Der `/ban` Command ist auf diesem Server deaktiviert.",
        ephemeral: true,
      });
    }

    // ... Rest deines Ban-Codes bleibt gleich ...
    const target = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "Du hast keine Berechtigung für diesen Befehl!",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.ban(target, { reason });
      await interaction.reply({
        content: `✅ ${target.tag} wurde gebannt.\n**Grund:** ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: "❌ Ban fehlgeschlagen. Fehlende Berechtigungen?",
        ephemeral: true,
      });
    }
  },
};
