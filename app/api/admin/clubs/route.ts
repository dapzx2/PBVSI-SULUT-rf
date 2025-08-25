import { NextResponse } from "next/server"
import { getClubs, createClub, updateClub, deleteClub } from "@/lib/clubs"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const GET = requireAuth(async (request: Request) => {
  try {
    const { clubs, error } = await getClubs()
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json(clubs)
  } catch (error: any) {
    console.error("API Error (GET clubs):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: Request) => {
  try {
    const clubData = await request.json()
    const { club, error } = await createClub(clubData)
    if (error) {
      throw new Error(error);
    }
    revalidatePath("/admin/klub") // Revalidate the clubs page
    return NextResponse.json(club, { status: 201 })
  } catch (error: any) {
    console.error("API Error (POST club):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing club ID" }, { status: 400 })
    }

    const clubData = await request.json()
    const { club, error } = await updateClub(id, clubData)
    if (error) {
      throw new Error(error);
    }
    revalidatePath("/admin/klub") // Revalidate the clubs page
    return NextResponse.json(club)
  } catch (error: any) {
    console.error("API Error (PUT club):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing club ID" }, { status: 400 })
    }

    const { success, error } = await deleteClub(id)
    if (error) {
      throw new Error(error);
    }
    revalidatePath("/admin/klub") // Revalidate the clubs page
    return NextResponse.json({ success })
  } catch (error: any) {
    console.error("API Error (DELETE club):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})