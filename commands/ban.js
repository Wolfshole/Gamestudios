const {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt einen Benutzer vom Server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Der Benutzer, den du bannen möchtest.")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.BanMembers) &&
      interaction.user.id !== interaction.guild.ownerId
    ) {
      return interaction.reply({
        content:
          'Du brauchst die Berechtigung "Mitglieder bannen", um diesen Befehl zu verwenden.',
        ephemeral: true,
      });
    }

    if (!user) {
      return interaction.reply({
        content: "Bitte gib einen gültigen Benutzer an.",
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setcustomId(`banModal-${user.id}`)
      .setTitle(`Ban ${user.tag}`);

    const reasonInput = new TextInputBilder()
      .setCustomId("reasonInput")
      .setLabel("Grund für den Ban")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },
};
