// bot/utils/modules.js
const axios = require('axios');

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:4321';

async function isModuleEnabled(guildId, moduleName) {
  try {
    const res = await axios.get(`${DASHBOARD_URL}/api/modules`);
    const guildSettings = res.data.find(g => g.guildId === guildId);
    return guildSettings?.[moduleName] === true;
  } catch (e) {
    return false; // Standardmäßig deaktiviert bei Fehler
  }
}

module.exports = { isModuleEnabled };