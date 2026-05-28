import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Force request-time execution to skip static build-time generation
    const userAgent = req.headers.get('user-agent');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 });
    }

    // Map stringified JSONs back to objects before returning
    const parsedMessages = conversation.messages.map((msg) => ({
      ...msg,
      confirm: msg.confirm ? JSON.parse(msg.confirm) : null,
      widget: msg.widget ? JSON.parse(msg.widget) : null,
      error: msg.error ? JSON.parse(msg.error) : null,
    }));

    return NextResponse.json({
      ...conversation,
      messages: parsedMessages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao carregar mensagens' }, { status: 500 });
  }
}
