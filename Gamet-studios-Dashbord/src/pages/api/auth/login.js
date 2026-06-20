export async function GET() {
  const clientId = import.meta.env.DISCORD_CLIENT_ID;
  const siteUrl = import.meta.env.SITE_URL || 'http://localhost:4321'; // ← Hier deinen aktuellen Port eintragen!

  if (!clientId) {
    return new Response('DISCORD_CLIENT_ID fehlt in .env', { status: 500 });
  }

  const redirectUri = encodeURIComponent(`${siteUrl}/api/auth/callback`);

  const authUrl = `https://discord.com/api/oauth2/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=identify%20guilds`;

  return Response.redirect(authUrl);
}