
import { NextResponse } from 'next/server';
import {
  getPlayerById,
  updatePlayer,
  deletePlayer,
} from '@/lib/players';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const player = await getPlayerById(params.id);
    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }
    const plainPlayer = JSON.parse(JSON.stringify(player));
    return NextResponse.json(plainPlayer);
  } catch (error) {
    console.error(`Failed to fetch player ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { name, position, club_id, image_url } = body;

    await updatePlayer(params.id, { name, position, club_id, image_url });
    return NextResponse.json({ message: 'Player updated successfully' });
  } catch (error) {
    console.error(`Failed to update player ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await deletePlayer(params.id);
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete player ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
