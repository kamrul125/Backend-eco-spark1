import { prisma } from "../../../config/prisma";

// ১. কমেন্ট বা রিপ্লাই তৈরি করা
export const createComment = async (userId: string, ideaId: string, content: string, parentId?: string) => {
  return await prisma.comment.create({
    data: {
      content,
      userId,
      ideaId,
      parentId: parentId || null,
    },
    include: { user: { select: { id: true, name: true } } }
  });
};

// ২. কমেন্ট আপডেট (Edit)
export const updateCommentContent = async (userId: string, commentId: string, content: string) => {
  return await prisma.comment.update({
    where: { id: commentId, userId: userId }, // নিরাপত্তা: শুধু নিজের কমেন্ট এডিট করা যাবে
    data: { content }
  });
};

// ৩. কমেন্ট ডিলিট (Delete)
export const deleteCommentFromDB = async (userId: string, commentId: string) => {
  return await prisma.comment.delete({
    where: { id: commentId, userId: userId } // নিরাপত্তা: শুধু নিজের কমেন্ট ডিলিট করা যাবে
  });
};

// ৪. আইডিয়ার সব কমেন্ট ও রিপ্লাই ফেচ করা
export const getCommentsByIdea = async (ideaId: string) => {
  return await prisma.comment.findMany({
    where: { ideaId, parentId: null },
    include: {
      user: { select: { id: true, name: true } },
      replies: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};