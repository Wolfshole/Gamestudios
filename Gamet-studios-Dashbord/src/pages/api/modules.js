import prisma from "@/lib/prisma.js";

export async function GET({ cookies }) {
  const userCookie = cookies.get("discord_user")?.value;

  if (!userCookie) {
    return new Response(JSON.stringify({ error: "Nicht eingeloggt" }), {
      status: 401,
    });
  }

  try {
    const modules = await prisma.guildSettings.findMany({
      select: {
        guildId: true,
        moderation: true,
        fun: true,
        welcome: true,
        antispam: true,
      },
    });

    return new Response(JSON.stringify(modules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Modules API Fehler:", error);
    return new Response(JSON.stringify({ error: "Datenbankfehler" }), {
      status: 500,
    });
  }
}

export async function POST({ request }) {
  const body = await request.json();
  const { guildId, module, enabled } = body;

  if (!guildId || !module) {
    return new Response(
      JSON.stringify({ error: "guildId und module erforderlich" }),
      { status: 400 },
    );
  }

  try {
    const settings = await prisma.guildSettings.upsert({
      where: { guildId },
      update: { [module]: enabled },
      create: {
        guildId,
        [module]: enabled,
      },
    });

    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Modules POST Fehler:", error);
    return new Response(JSON.stringify({ error: "Speichern fehlgeschlagen" }), {
      status: 500,
    });
  }
}
