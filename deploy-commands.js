const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { TOKEN, CLIENT_ID, DEV_MODE, DEV_GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ TOKEN oder CLIENT_ID fehlt in der .env Datei!");
  process.exit(1);
}

// Befehle laden
const commands = [];
const commandsPath = path.join(__dirname, "/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

// REST-Instanz
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Starte Registrierung von ${commands.length} Befehlen...`);

    if (DEV_MODE === "true" && DEV_GUILD_ID) {
      // Nur für Test-Server (Dev Mode)
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DEV_GUILD_ID), {
        body: commands,
      });
      console.log(
        `✅ ${commands.length} Befehle erfolgreich im Dev-Server (${DEV_GUILD_ID}) registriert`,
      );
    } else {
      // Global registrieren
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log(`✅ ${commands.length} Befehle global registriert`);
    }
  } catch (error) {
    console.error("❌ Fehler beim Registrieren der Befehle:", error);
  }
})();
