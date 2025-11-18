
import { NextResponse } from 'next/server';
import { getPlayers, createPlayer } from '@/lib/players';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async (request: Request) => {
  void request;
  try {
    const { players, error } = await getPlayers();
    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
    return NextResponse.json(players);
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});

export const POST = requireAuth(async (request: Request) => {
  try {
    const body = await request.json();
    const { name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements } = body;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const newPlayer = await createPlayer({ name, position: position || null, club_id, image_url: image_url || null, birth_date: birth_date || null, height_cm: height_cm || null, weight_kg: weight_kg || null, country: country || null, achievements: achievements || null });
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error('Failed to create player:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});

