import { type NextRequest, NextResponse } from "next/server"
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "@/lib/players";
import { getAdminFromRequest, requireSuperAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const { player, error } = await getPlayerById(id)
      if (error) {
        return NextResponse.json({ success: false, error: "Pemain tidak ditemukan" }, { status: 404 })
      }
      return NextResponse.json({ success: true, player })
    } else {
      const { players, error } = await getPlayers()
      if (error) {
        throw new Error(error);
      }
      return NextResponse.json({ success: true, players })
    }
  } catch (error: any) {
    console.error("API Error (GET players):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const playerData = await request.json()
    const { player, error } = await createPlayer(playerData)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json({ success: true, player }, { status: 201 })
  } catch (error: any) {
    console.error("API Error (POST player):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pemain diperlukan" }, { status: 400 })
    }

    const playerData = await request.json()
    const { player, error } = await updatePlayer(id, playerData)
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json({ success: true, player })
  } catch (error: any) {
    console.error("API Error (PUT player):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireSuperAdmin(request) // Only Super Admin can delete
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pemain diperlukan" }, { status: 400 })
    }

    const { success, error } = await deletePlayer(id)
    if (!success) {
      throw new Error(error || 'Failed to delete player');
    }
    return NextResponse.json({ success: true, message: "Pemain berhasil dihapus" })
  } catch (error: any) {
    console.error("API Error (DELETE player):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
