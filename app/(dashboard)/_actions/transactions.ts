"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { addMinutes } from "date-fns";
import { redirect } from "next/navigation";

export const CreateTransaction = async (form: CreateTransactionSchemaType) => {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
      type: type,
    },
  });
  if (!categoryRow) {
    throw new Error("Category Not Found");
  }

  const userSettings = await prisma.userSettings.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }

  const tzDate = addMinutes(date, -1 * date.getTimezoneOffset());

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        description: description || "",
        date: tzDate,
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
        amount,
      },
    }),

    prisma.monthHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),

    prisma.yearHistory.upsert({
      where: {
        userId_month_year: {
          userId: user.id,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),
  ]);
};
