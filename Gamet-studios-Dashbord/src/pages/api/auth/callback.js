export async function GET({ request, cookies }) {
  const code = new URL(request.url).searchParams.get("code");
  const clientId = import.meta.env.DISCORD_CLIENT_ID;
  const clientSecret = import.meta.env.DISCORD_CLIENT_SECRET;
  const siteUrl = "http://localhost:4321";

  if (!code) return new Response("Kein Code", { status: 400 });

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${siteUrl}/api/auth/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userResponse.json();

    // User-Daten speichern
    cookies.set(
      "discord_user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 Tage
        httpOnly: true,
      },
    );

    return Response.redirect(siteUrl);
  } catch (error) {
    console.error(error);
    return new Response("Fehler bei der Anmeldung", { status: 500 });
  }
}
