import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/app/lib/db/mongoose';
import { User } from '@/app/lib/models/User';
import { verifyToken } from '@/app/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('ap_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDb();

    const user = await User.findById(payload.sub);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id:        user._id.toString(),
        fullName:  user.fullName || (user as any).name || '',
        email:     user.email,
        phone:     user.phone || (user as any).phoneNumber || '',
        bio:       user.bio,
        avatar:    user.avatar,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('[GET /api/auth/whoami]', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
