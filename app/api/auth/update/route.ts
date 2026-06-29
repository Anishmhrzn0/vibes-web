import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDb } from '@/app/lib/db/mongoose';
import { User } from '@/app/lib/models/User';
import { verifyToken } from '@/app/lib/auth/jwt';
import { saveFile, deleteFile } from '@/app/lib/upload/savefile';

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('ap_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token) as { sub: string };
    if (!payload?.sub) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDb();

    const formData = await req.formData();
    const fullName = formData.get('fullName') as string | null;
    const phone    = formData.get('phone')    as string | null;
    const bio      = formData.get('bio')      as string | null;
    const avatarFile = formData.get('avatar')    as File   | null;

    const updates: Record<string, any> = {};
    if (fullName) updates.fullName = fullName;
    if (phone)    updates.phone    = phone;
    if (bio)      updates.bio      = bio;

    if (avatarFile && avatarFile.size > 0) {
      const existingUser = await User.findById(payload.sub);
      if (existingUser?.avatar) {
        await deleteFile(existingUser.avatar);  // delete old file
      }
      updates.avatar = await saveFile(avatarFile, payload.sub, { folder: 'avatars' });
    }

    // Password change
    const currentPassword = formData.get('currentPassword') as string | null;
    const newPassword     = formData.get('newPassword')     as string | null;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password required' }, { status: 400 });
      }
      const user = await User.findById(payload.sub).select('+password');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await User.findByIdAndUpdate(payload.sub, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = {
      id:       updated._id.toString(),
      fullName: updated.fullName,
      email:    updated.email,
      phone:    updated.phone,
      bio:      updated.bio,
      avatar:   updated.avatar,
      createdAt: updated.createdAt,
    };
    const response = NextResponse.json({ success: true, user: updatedUser });
    response.cookies.set('ap_user', JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('[PUT /api/auth/update]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}