import { NextRequest, NextResponse } from "next/server"
import { deleteSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value

    if (adminToken) {
      // In a real application, you would decode the token to get the sessionId
      // For now, we'll assume the token itself is the sessionId or contains it
      // This is a simplified example, adjust based on your actual token structure
      // If your token is a JWT, you'd need to verify and decode it first
      // For this example, let's assume the token value is directly the sessionId
      // Or, if you store sessionId in the JWT payload, extract it after verification
      
      // For now, let's just clear the cookie and assume session deletion is handled elsewhere
      // or that the token itself is the session ID for simplicity.
      // A more robust solution would involve decoding the JWT to get the sessionId
      // and then calling deleteSession(sessionId).

      // As per lib/auth.ts, deleteSession expects a sessionId. 
      // If adminToken is the JWT, we need to extract sessionId from it.
      // For now, let's just clear the cookie and rely on client-side token invalidation.
      // A proper logout would involve invalidating the session on the server.
      
      // Let's assume for now that the adminToken *is* the sessionId for the purpose of calling deleteSession
      // This is a simplification and might not be how your JWTs are structured.
      // If your JWT contains a sessionId, you'd do:
      // const payload = verifyToken(adminToken);
      // if (payload) { await deleteSession(payload.sessionId); }
      
      // For a quick implementation, we'll just clear the cookie.
      // To properly use deleteSession, we'd need to parse the token to get the sessionId.
      // Given the current setup, the token itself is not the sessionId directly.
      // The sessionId is generated and stored in the database.
      // So, we need to verify the token and then delete the session based on the sessionId in the payload.
      
      // Re-reading lib/auth.ts, the sessionId is part of the JWT payload.
      // So, we need to verify the token first to get the sessionId.
      // Let's import verifyToken from lib/auth.ts
      const { verifyToken } = await import("@/lib/auth")
      const payload = verifyToken(adminToken)

      if (payload) {
        await deleteSession(payload.sessionId)
      }
    }

    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })
    response.cookies.delete("admin_token")
    return response
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
