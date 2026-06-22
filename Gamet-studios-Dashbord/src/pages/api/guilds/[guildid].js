import prisma from '@/lib/prisma.js';

export async function GET({ params, cookies }) {
  const { guildId } = params;
  const userCookie = cookies.get('discord_user')?.value;

  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), { status: 401 });
  }

  try {
    const settings = await prisma.guildSettings.findUnique({
      where: { guildId: guildId }
    });

    return new Response(JSON.stringify({
      guildId,
      prefix: settings?.prefix || '!',
      welcomeChannel: settings?.welcomeChannel || null,
      welcomeMessage: settings?.welcomeMessage || null,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Datenbankfehler' }), { status: 500 });
  }
}

export async function POST({ params, request, cookies }) {
  const { guildId } = params;
  const userCookie = cookies.get('discord_user')?.value;

  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), { status: 401 });
  }

  try {
    const body = await request.json();

    const settings = await prisma.guildSettings.upsert({
      where: { guildId },
      update: {
        prefix: body.prefix || '!',
        welcomeChannel: body.welcomeChannel,
        welcomeMessage: body.welcomeMessage,
      },
      create: {
        guildId,
        prefix: body.prefix || '!',
        welcomeChannel: body.welcomeChannel,
        welcomeMessage: body.welcomeMessage,
      }
    });

    return new Response(JSON.stringify({ success: true, settings }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Speichern fehlgeschlagen' }), { status: 500 });
  }
}