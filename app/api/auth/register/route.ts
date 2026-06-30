import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDb } from '@/app/lib/db/mongoose';
import { User } from '@/app/lib/models/User';
import { registerSchema } from '@/app/lib/schemas/auth.schema';
import { signToken } from '@/app/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password } = parsed.data;

    await connectDb();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    const accessToken = await signToken({ sub: user._id.toString(), email: user.email });

    return NextResponse.json({
      message: 'Account created successfully',
      accessToken,
      user: {
        id:        user._id.toString(),
        fullName:  user.fullName,
        email:     user.email,
        phone:     user.phone,
        bio:       user.bio,  
        avatar:    user.avatar,
        role:      user.role, 
        createdAt: user.createdAt,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}