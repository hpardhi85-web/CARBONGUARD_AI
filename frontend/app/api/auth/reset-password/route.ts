import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email address and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = getAdminClient();

    // Find the user in Supabase Auth
    const { data: userList, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;

    const targetUser = userList.users.find(u => {
      const uEmail = u.email?.toLowerCase() || '';
      return (
        uEmail === cleanEmail ||
        uEmail === cleanEmail.replace('lalchand', 'lalcahnd') ||
        uEmail === cleanEmail.replace('lalcahnd', 'lalchand')
      );
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: `No registered account found for ${cleanEmail}.` },
        { status: 404 }
      );
    }

    // Update password directly with pre-confirmed email
    const { error: updateErr } = await admin.auth.admin.updateUserById(targetUser.id, {
      password: newPassword,
      email_confirm: true
    });

    if (updateErr) throw updateErr;

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Password reset failed.' },
      { status: 500 }
    );
  }
}

