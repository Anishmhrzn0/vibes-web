  import { NextRequest, NextResponse } from 'next/server';
  import bcrypt from 'bcryptjs';
  import { connectDb } from '@/app/lib/db/mongoose';
  import { User } from '@/app/lib/models/User';
  import { loginSchema } from '@/app/lib/schemas/auth.schema';
  import { signToken } from '@/app/lib/auth/jwt';


  const DUMMY_HASH = '$2b$12$invalidhashpaddingtoensureconstanttimexxxxx';

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();

      const parsed = loginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.issues[0].message },
          { status: 400 }
        );
      }

      const { email, password } = parsed.data;

      await connectDb();

      const user = await User.findOne({ email: email.toLowerCase() });
      const hash = user?.password ?? DUMMY_HASH;
      const passwordMatch = await bcrypt.compare(password, hash);

      if (!user || !passwordMatch) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const accessToken = await signToken({ sub: user._id.toString(), email: user.email });

      return NextResponse.json({
        message: 'Login successful',
        accessToken,
        user: {
          id:        user._id.toString(),
          fullName:  user.fullName || (user as any).name || "",
          email:     user.email,
          phone:     user.phone || (user as any).phoneNumber || "",
          bio:       user.bio,      
          avatar:    user.avatar,
          role:      user.role,
          createdAt: user.createdAt,
        },
      });

    } catch (err) {
      console.error('[POST /api/auth/login]', err);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }