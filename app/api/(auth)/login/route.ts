import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password)
    return NextResponse.json(
      { message: "Missing name, email or passoword" },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    return NextResponse.json(
      { message: "User DOES NOT exist" },
      { status: 404 }
    );

  const valid = await bcrypt.compare(password, user.password);
    console.log("valid: ", valid);
    
  if (!valid) {
    console.log("Incorrect Cred");
    
    return NextResponse.json(
      { message: "Incorrect credentials" },
      { status: 400 }
    );
  }
  else return NextResponse.json(JSON.stringify(user), { status: 200 });
};
