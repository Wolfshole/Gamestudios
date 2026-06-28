module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction) {
    // Nur Slash Commands verarbeiten
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`[WARN] Command ${interaction.commandName} nicht gefunden.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `[ERROR] Fehler beim Command ${interaction.commandName}:`,
        error,
      );

      const errorReply = {
        content: "❌ Es gab einen Fehler beim Ausführen dieses Commands!",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorReply);
      } else {
        await interaction.reply(errorReply);
      }
    }
  },
};
