import { NextResponse } from "next/server"
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/gallery"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.status !== 200) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const { galleryItems, error } = await getGalleryItems(category || undefined)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json(galleryItems)
  } catch (error: any) {
    console.error("API Error (GET gallery items):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.status !== 200) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const itemData = await request.json()
    const { galleryItem, error } = await createGalleryItem(itemData)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json(galleryItem, { status: 201 })
  } catch (error: any) {
    console.error("API Error (POST gallery item):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}