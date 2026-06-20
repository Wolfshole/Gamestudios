export async function GET({ cookies, request }) {
  const userCookie = cookies.get('discord_user')?.value;

  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), { 
      status: 401 
    });
  }

  const user = JSON.parse(userCookie);

  try {
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${user.accessToken || ''}`,
      }
    });

    if (!guildsResponse.ok) {
      return new Response(JSON.stringify({ error: 'Token ungültig' }), { status: 401 });
    }

    const guilds = await guildsResponse.json();

    return new Response(JSON.stringify(guilds), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen der Server' }), { 
      status: 500 
    });
  }
}