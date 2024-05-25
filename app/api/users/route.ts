import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/utils/db";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const data = await prisma.user.findMany();
  return NextResponse.json(data, {status: 200});
};
