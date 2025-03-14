import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSetting.create({
      data: {
        userId: user.id,
        currency: "INR",
        timezone: "Asia/Kolkata (GMT+05:30)",
      },
    });
  }

  revalidatePath("/");

  return Response.json(userSettings);
}
