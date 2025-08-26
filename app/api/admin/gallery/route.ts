import { NextResponse } from "next/server"
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/gallery"
import { requireAuth } from "@/lib/auth"

export const GET = requireAuth(async (request: Request) => {
  try {
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
})

export const POST = requireAuth(async (request: Request) => {
  try {
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
})

export const PUT = requireAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing gallery item ID" }, { status: 400 })
    }

    const itemData = await request.json()
    const { galleryItem, error } = await updateGalleryItem(id, itemData)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json(galleryItem)
  } catch (error: any) {
    console.error("API Error (PUT gallery item):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing gallery item ID" }, { status: 400 })
    }

    const { success, error } = await deleteGalleryItem(id)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json({ success })
  } catch (error: any) {
    console.error("API Error (DELETE gallery item):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
