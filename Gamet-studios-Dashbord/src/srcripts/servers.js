async function loadServers() {
  const container = document.getElementById('servers-list');
  
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-slate-400 col-span-full">Server werden geladen...</p>';

    const res = await fetch('/api/servers');
    
    if (!res.ok) {
      container.innerHTML = `<p class="text-red-400 col-span-full">Fehler beim Laden der Server</p>`;
      return;
    }

    const servers = await res.json();

    if (servers.error) {
      container.innerHTML = `<p class="text-red-400 col-span-full">${servers.error}</p>`;
      return;
    }

    container.innerHTML = '';

    if (servers.length === 0) {
      container.innerHTML = `<p class="text-slate-400 col-span-full">Keine Server gefunden.</p>`;
      return;
    }

    servers.forEach(server => {
      const card = document.createElement('div');
      card.className = "bg-[#1e2937] border border-slate-700 rounded-3xl p-6 hover:border-blue-500 transition-all cursor-pointer group";
      
      card.innerHTML = `
        <div class="flex items-center gap-4">
          ${server.icon 
            ? `<img src="https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=128" class="w-12 h-12 rounded-2xl">`
            : `<div class="w-12 h-12 bg-slate-600 rounded-2xl flex items-center justify-center text-2xl font-bold">${server.name.substring(0,1)}</div>`
          }
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg truncate">${server.name}</h3>
            <p class="text-sm text-slate-400">${server.memberCount ? server.memberCount.toLocaleString() + ' Mitglieder' : 'Server'}</p>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-400 col-span-full">Verbindungsfehler</p>`;
  }
}

// Automatisch beim Laden ausführen
document.addEventListener('DOMContentLoaded', loadServers);