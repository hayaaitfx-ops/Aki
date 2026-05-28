import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Fetch all saved conversations in database ordered by updated date
export async function GET(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent');
    const conversations = await db.conversation.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao carregar conversas' }, { status: 500 });
  }
}

// Clear or delete a specific conversation from SQLite database
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      // Clear all conversations if no id specified
      await db.conversation.deleteMany({});
      return NextResponse.json({ message: 'Todo o histórico de chat foi apagado com sucesso!' });
    }

    await db.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Conversa excluída com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao deletar conversa' }, { status: 500 });
  }
}
