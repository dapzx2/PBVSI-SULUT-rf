import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {
    getPublicInformation,
    createPublicInformation,
    updatePublicInformation,
    deletePublicInformation
} from '@/lib/public-information';
import { getAdminFromRequest, logActivity } from '@/lib/auth';

export async function GET() {
    const { data, error } = await getPublicInformation();
    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { data, error } = await createPublicInformation(body);
        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        await logActivity(
            admin.id,
            'create_public_information',
            'public_information',
            data?.id,
            { title: data?.title }
        );

        return NextResponse.json(data, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { data, error } = await updatePublicInformation(id, updateData);
        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        await logActivity(
            admin.id,
            'update_public_information',
            'public_information',
            id,
            { updateData }
        );

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { success, error } = await deletePublicInformation(id);
        if (!success) {
            return NextResponse.json({ error }, { status: 404 });
        }

        await logActivity(
            admin.id,
            'delete_public_information',
            'public_information',
            id,
            { id }
        );

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
