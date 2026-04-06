import { Response } from "express";
import sendResponse from "../../../helpers/response"; 
import catchAsync from "../../../utils/catchAsync"; 
// ✅ আপনার config ফোল্ডারের prisma ইমপোর্ট (Named Export অনুযায়ী)
import { prisma } from "../../../config/prisma"; 

/**
 * লগইন করা ইউজারের প্রোফাইল দেখার জন্য
 */
export const getMe = catchAsync(async (req: any, res: Response) => {
  const user = req.user; 

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

/**
 * অ্যাডমিন প্যানেলের জন্য সব ইউজার লিস্ট নিয়ে আসা
 */
export const getAllUsers = catchAsync(async (req: any, res: Response) => {
  // ✅ আপনার স্কিমা অনুযায়ী কলামগুলো সিলেক্ট করা হয়েছে
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // ❌ status বাদ দেওয়া হয়েছে কারণ আপনার schema.prisma-তে এটি নেই
    },
    orderBy: {
      createdAt: 'desc' // নতুন ইউজাররা সবার উপরে থাকবে
    }
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users retrieved successfully",
    data: users,
  });
});