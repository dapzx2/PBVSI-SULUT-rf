import { NextResponse } from "next/server"
import { NextResponse } from "next/server"
import { getGalleryItems } from "@/lib/gallery";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined

    const { galleryItems, error } = await getGalleryItems(category)
    if (error) {
      throw new Error(error);
    }

    return NextResponse.json({ galleryItems })
  } catch (error: any) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ message: "Failed to fetch gallery items", details: error.message }, { status: 500 })
  }
}
