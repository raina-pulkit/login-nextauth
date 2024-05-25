import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email, password, name, nickname, phNo } = body;

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists)
    return NextResponse.json({ msg: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const signInCred = { email, password };
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nickname,
        phNo,
      },
    });

    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json(
      { message: "Error adding data to database" },
      { status: 400 }
    );
  }
};
