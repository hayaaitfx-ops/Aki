import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          name: 'Aki Pilot',
          email: 'pilot@aki.ai',
          image: '/avatars/pilot.png',
        },
      });
    }

    let settings = await db.settings.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      settings = await db.settings.create({
        data: {
          userId: user.id,
          model: 'groq',
          theme: 'purple',
          memoryEnabled: true,
          voiceEnabled: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          name: 'Aki Pilot',
          email: 'pilot@aki.ai',
          image: '/avatars/pilot.png',
        },
      });
    }

    const settings = await db.settings.upsert({
      where: { userId: user.id },
      update: {
        model: body.model !== undefined ? body.model : undefined,
        theme: body.theme !== undefined ? body.theme : undefined,
        voiceEnabled: body.voiceEnabled !== undefined ? body.voiceEnabled : undefined,
        temperature: body.temperature !== undefined ? body.temperature : undefined,
        maxTokens: body.maxTokens !== undefined ? body.maxTokens : undefined,
        language: body.language !== undefined ? body.language : undefined,
        memoryEnabled: body.memoryEnabled !== undefined ? body.memoryEnabled : undefined,
      },
      create: {
        userId: user.id,
        model: body.model || 'groq',
        theme: body.theme || 'purple',
        voiceEnabled: body.voiceEnabled !== undefined ? body.voiceEnabled : true,
        temperature: body.temperature !== undefined ? body.temperature : 0.7,
        maxTokens: body.maxTokens !== undefined ? body.maxTokens : 2048,
        language: body.language || 'pt',
        memoryEnabled: body.memoryEnabled !== undefined ? body.memoryEnabled : true,
      },
    });

    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro ao atualizar configurações' }, { status: 500 });
  }
}
