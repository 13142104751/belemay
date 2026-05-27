import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: { type: string; data: ClerkUserData };
  try {
    evt = wh.verify(payload, headers) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email,
          firstName: first_name,
          lastName: last_name,
          avatarUrl: image_url,
        },
        update: {
          email,
          firstName: first_name,
          lastName: last_name,
          avatarUrl: image_url,
        },
      });
    }
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          firstName: first_name,
          lastName: last_name,
          avatarUrl: image_url,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
