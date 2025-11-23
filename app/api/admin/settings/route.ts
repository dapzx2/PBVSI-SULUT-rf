import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings, type UpdateSettingsInput } from '@/lib/settings'
import { verifyAuth } from '@/lib/auth'

/**
 * GET /api/admin/settings
 * Get current settings
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Re-enable authentication after login flow is fixed
        // const authResult = await verifyAuth(request)
        // if (!authResult.authenticated || !authResult.user) {
        //   return NextResponse.json(
        //     { error: 'Unauthorized' },
        //     { status: 401 }
        //   )
        // }

        const settings = await getSettings()
        return NextResponse.json(settings)
    } catch (error: any) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/admin/settings
 * Update settings
 */
export async function PUT(request: NextRequest) {
    try {
        // TODO: Re-enable authentication after login flow is fixed
        // const authResult = await verifyAuth(request)
        // if (!authResult.authenticated || !authResult.user) {
        //   return NextResponse.json(
        //     { error: 'Unauthorized' },
        //     { status: 401 }
        //   )
        // }

        const body = await request.json()
        const updateData: UpdateSettingsInput = {}

        // Validate and sanitize input
        if (body.website_name !== undefined) updateData.website_name = body.website_name
        if (body.tagline !== undefined) updateData.tagline = body.tagline
        if (body.email !== undefined) updateData.email = body.email
        if (body.phone !== undefined) updateData.phone = body.phone
        if (body.address !== undefined) updateData.address = body.address
        if (body.logo_url !== undefined) updateData.logo_url = body.logo_url
        if (body.facebook !== undefined) updateData.facebook = body.facebook
        if (body.instagram !== undefined) updateData.instagram = body.instagram
        if (body.twitter !== undefined) updateData.twitter = body.twitter
        if (body.youtube !== undefined) updateData.youtube = body.youtube
        if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp

        const settings = await updateSettings(updateData)
        return NextResponse.json(settings)
    } catch (error: any) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update settings' },
            { status: 500 }
        )
    }
}
