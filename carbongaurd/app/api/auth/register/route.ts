import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are all required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const admin = getAdminClient();

    // 1. Create the user directly in Supabase Auth with pre-confirmed email
    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: trimmedUsername,
        full_name: trimmedUsername,
      },
    });

    if (createError) {
      console.error('Supabase createUser error:', createError);
      // Friendly message if user exists
      if (createError.message.includes('already exists') || createError.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const userId = userData.user.id;

    // 2. Try inserting into public.profiles if the table exists
    try {
      await admin.from('profiles').upsert({
        id: userId,
        full_name: trimmedUsername,
        email: trimmedEmail,
        company_name: `${trimmedUsername} Exporters`,
        country: 'India',
        created_at: new Date().toISOString(),
      });
    } catch (profileErr) {
      console.warn('Profile insert optional warning:', profileErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: trimmedEmail,
        username: trimmedUsername,
      },
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

