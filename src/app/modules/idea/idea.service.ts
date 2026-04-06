import { prisma } from '../../../config/prisma';
import { VoteType } from '@prisma/client';

// ১. আইডিয়া তৈরি করা
export const createIdea = async (userId: string, data: any) => {
  return await prisma.idea.create({
    data: { 
      ...data, 
      authorId: userId, 
      status: "DRAFT" 
    },
  });
};

// ✅ ৯. কমেন্ট ডাটাবেসে সেভ করা (নতুন ফাংশন)
export const addCommentIntoDB = async (ideaId: string, userId: string, text: string) => {
  // ১. কমেন্ট তৈরি করা
  const newComment = await prisma.comment.create({
    data: {
      content: text, // আপনার প্রিজমা স্কিমা অনুযায়ী এখানে 'content' বা 'text' দিন
      ideaId: ideaId,
      userId: userId,
    },
  });

  // ২. আইডিয়া টেবিলে কমেন্ট কাউন্ট ১ বাড়িয়ে দেওয়া
  await prisma.idea.update({
    where: { id: ideaId },
    data: {
      commentCount: {
        increment: 1,
      },
    },
  });

  return newComment;
};

// ২. সব আইডিয়া দেখা (পাবলিক ফিড)
export const getAllIdeas = async (query: any) => {
  const { searchTerm, category } = query;
  return await prisma.idea.findMany({
    where: {
      ...(searchTerm && { title: { contains: searchTerm as string, mode: 'insensitive' } }),
      ...(category && { category: { name: category as string } }),
    },
    include: { author: true, category: true },
    orderBy: { createdAt: 'desc' }
  });
};

// ২.১ ড্যাশবোর্ডের জন্য ফাংশন
export const getMyIdeas = async (userId: string) => {
  return await prisma.idea.findMany({
    where: {
      authorId: userId,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
};

// ৩. আইডি দিয়ে আইডিয়া খুঁজে বের করা
export const getIdeaById = async (id: string) => {
  return await prisma.idea.findUnique({ 
    where: { id }, 
    include: { 
      author: true, 
      category: true,
      comments: {
        include: { user: true, replies: { include: { user: true } } },
        orderBy: { createdAt: 'desc' } // নতুন কমেন্ট আগে দেখাবে
      }
    } 
  });
};

// ৪. আইডিয়া আপডেট করা
export const updateIdea = async (userId: string, ideaId: string, data: any) => {
  const idea = await prisma.idea.findFirst({
    where: {
      id: ideaId,
      authorId: userId,
    },
  });

  if (!idea) {
    throw new Error("You are not authorized to update this idea!");
  }

  return await prisma.idea.update({ 
    where: { id: ideaId }, 
    data 
  });
};

// ৫. আইডিয়া ডিলিট করা
export const deleteIdea = async (userId: string, userRole: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea) {
    throw new Error("Idea not found!");
  }

  if (userRole !== 'ADMIN' && idea.authorId !== userId) {
    throw new Error("You are not authorized to delete this idea!");
  }

  return await prisma.idea.delete({ 
    where: { id: ideaId } 
  });
};

// ৬. আইডিয়া অ্যাপ্রুভ করা
export const approveIdea = async (ideaId: string) => {
  return await prisma.idea.update({ 
    where: { id: ideaId }, 
    data: { status: "APPROVED" } 
  });
};

// ৭. আইডিয়া রিজেক্ট করা
export const rejectIdea = async (ideaId: string, feedback: string) => {
  return await prisma.idea.update({
    where: { id: ideaId },
    data: { 
      status: "REJECTED", 
      description: { append: `\n\nFeedback: ${feedback}` } as any 
    }
  });
};

// ৮. ভোট লজিক (Toggle Vote)
export const toggleVote = async (userId: string, ideaId: string) => {
  const existingVote = await prisma.vote.findFirst({
    where: { userId, ideaId },
  });

  if (existingVote) {
    await prisma.vote.delete({ where: { id: existingVote.id } });
    return await prisma.idea.update({
      where: { id: ideaId },
      data: { voteCount: { decrement: 1 } },
    });
  } else {
    await prisma.vote.create({
      data: { userId, ideaId, type: VoteType.UPVOTE },
    });
    return await prisma.idea.update({
      where: { id: ideaId },
      data: { voteCount: { increment: 1 } },
    });
  }
};