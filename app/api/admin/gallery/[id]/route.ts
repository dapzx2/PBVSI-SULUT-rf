import { NextResponse, NextRequest } from "next/server"
import { getGalleryItemById, updateGalleryItem, deleteGalleryItem } from "@/lib/gallery"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.status !== 200) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params
    const { galleryItem, error } = await getGalleryItemById(id)

    if (error || !galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    return NextResponse.json(galleryItem)
  } catch (error: any) {
    console.error("API Error (GET gallery item by ID):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.status !== 200) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params
    const itemData = await request.json()
    const { galleryItem, error } = await updateGalleryItem(id, itemData)

    if (error || !galleryItem) {
      return NextResponse.json({ error: "Gallery item not found or failed to update" }, { status: 404 })
    }
    return NextResponse.json(galleryItem)
  } catch (error: any) {
    console.error("API Error (PUT gallery item):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.status !== 200) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params
    const { success } = await deleteGalleryItem(id)

    if (!success) {
      return NextResponse.json({ error: "Gallery item not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ message: "Gallery item deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("API Error (DELETE gallery item):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
