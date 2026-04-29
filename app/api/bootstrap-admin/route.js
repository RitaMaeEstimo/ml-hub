import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const providedKey = body?.key;

    if (!providedKey || providedKey !== process.env.ADMIN_BOOTSTRAP_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing admin bootstrap env values" },
        { status: 500 }
      );
    }

    const listResult = await supabaseAdmin.auth.admin.listUsers();
    if (listResult.error) {
      return NextResponse.json(
        { error: listResult.error.message },
        { status: 500 }
      );
    }

    let existingUser = listResult.data.users.find((u) => u.email === email);

    if (!existingUser) {
      const createResult = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createResult.error) {
        return NextResponse.json(
          { error: createResult.error.message },
          { status: 500 }
        );
      }

      existingUser = createResult.data.user;
    }

    const userId = existingUser.id;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          role: "admin",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      message: "Admin account is ready.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}