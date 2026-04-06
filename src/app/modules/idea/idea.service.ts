import { prisma } from '../../../config/prisma';
import { VoteType } from '@prisma/client';

// আইডিয়া তৈরি করা
export const createIdea = async (userId: string, data: any) => {
  return await prisma.idea.create({
    data: { 
      ...data, 
      authorId: userId, 
      status: "APPROVED" 
    },
  });
};

// সব আইডিয়া দেখা (পাবলিক ফিড)
// ✅ আপডেট: এখানে comments ইনক্লুড করা হয়েছে যাতে হোম পেজে কমেন্ট দেখা যায়
export const getAllIdeas = async (query: any) => {
  const { searchTerm, category } = query;
  return await prisma.idea.findMany({
    where: {
      ...(searchTerm && { 
        OR: [
          { title: { contains: searchTerm as string, mode: 'insensitive' } },
          { description: { contains: searchTerm as string, mode: 'insensitive' } }
        ]
      }),
      ...(category && { category: { name: category as string } }),
    },
    include: { 
      author: true, 
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// ড্যাশবোর্ডের জন্য নিজের আইডিয়া গেট করা
export const getMyIdeas = async (userId: string) => {
  return await prisma.idea.findMany({
    where: { authorId: userId },
    include: { 
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// আইডি দিয়ে আইডিয়া খুঁজে বের করা
export const getIdeaById = async (id: string) => {
  return await prisma.idea.findUnique({ 
    where: { id }, 
    include: { 
      author: true, 
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    } 
  });
};

// আইডিয়া আপডেট করা
export const updateIdea = async (userId: string, ideaId: string, data: any) => {
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, authorId: userId },
  });
  if (!idea) throw new Error("You are not authorized to update this idea!");
  return await prisma.idea.update({ where: { id: ideaId }, data });
};

// আইডিয়া ডিলিট করা
export const deleteIdea = async (userId: string, userRole: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) throw new Error("Idea not found!");
  
  if (userRole !== 'ADMIN' && idea.authorId !== userId) {
    throw new Error("You are not authorized to delete this idea!");
  }
  return await prisma.idea.delete({ where: { id: ideaId } });
};

// ভোট লজিক (Toggle Vote)
export const toggleVote = async (userId: string, ideaId: string) => {
  const existingVote = await prisma.vote.findFirst({ where: { userId, ideaId } });
  
  if (existingVote) {
    await prisma.vote.delete({ where: { id: existingVote.id } });
    return await prisma.idea.update({ 
      where: { id: ideaId }, 
      data: { voteCount: { decrement: 1 } } 
    });
  } else {
    await prisma.vote.create({ data: { userId, ideaId, type: VoteType.UPVOTE } });
    return await prisma.idea.update({ 
      where: { id: ideaId }, 
      data: { voteCount: { increment: 1 } } 
    });
  }
};

// ✅ কমেন্ট সেভ করা (Fixing 500 Error)
// আপডেট: এখানে object ডেসট্রাকচারিং করা হয়েছে যাতে ডাটা ঠিকভাবে পৌঁছায়
export const addCommentIntoDB = async (ideaId: string, userId: string, commentData: { text: string }) => {
  const newComment = await prisma.comment.create({
    data: { 
      content: commentData.text, // আপনার স্কিমা অনুযায়ী 'content' ফিল্ডে ডাটা যাচ্ছে
      ideaId: ideaId, 
      userId: userId 
    },
    include: {
      user: true // নতুন কমেন্টের সাথে ইউজারের তথ্যও পাঠাবে
    }
  });

  // আইডিয়াতে কমেন্ট কাউন্ট বাড়ানো
  await prisma.idea.update({
    where: { id: ideaId },
    data: { commentCount: { increment: 1 } },
  });

  return newComment;
};

// অ্যাডমিন অ্যাকশনস
export const approveIdea = async (ideaId: string) => {
  return await prisma.idea.update({ where: { id: ideaId }, data: { status: "APPROVED" } });
};

export const rejectIdea = async (ideaId: string, feedback: string) => {
  return await prisma.idea.update({
    where: { id: ideaId },
    data: { 
      status: "REJECTED", 
      description: { set: `Feedback: ${feedback}` } as any // append এর বদলে set ব্যবহার নিরাপদ
    }
  });
};