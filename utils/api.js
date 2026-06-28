const axios = require("axios");

const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:4321";

console.log(`[API] Dashboard verbunden mit: ${DASHBOARD_URL}`);

/**
 * Prüft, ob ein Command auf diesem Server aktiviert ist
 */
async function isCommandEnabled(guildId, commandName) {
  try {
    const res = await axios.get(`${DASHBOARD_URL}/api/modules/${guildId}`);
    const modules = res.data || {};
    return modules[commandName] !== false; // Standardmäßig aktiviert
  } catch (error) {
    console.warn(`[API] Konnte Modul-Status nicht abrufen (${commandName})`);
    return true; // Bei Fehler Command aktiv lassen
  }
}

module.exports = {
  isCommandEnabled,
};
