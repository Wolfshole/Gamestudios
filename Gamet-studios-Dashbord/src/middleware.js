import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // Öffentliche Seiten (dürfen ohne Login aufgerufen werden)
  const publicPaths = ['/login', '/api/auth', '/gs_pb_icon_black.png', '/robots.txt'];

  const isPublic = publicPaths.some(path => url.pathname.startsWith(path));

  if (isPublic) {
    return next();
  }

  // Prüfen ob User eingeloggt ist
  const userCookie = cookies.get('discord_user');

  if (!userCookie) {
    // Nicht eingeloggt → zur Login-Seite weiterleiten
    return redirect('/login');
  }

  return next();
});