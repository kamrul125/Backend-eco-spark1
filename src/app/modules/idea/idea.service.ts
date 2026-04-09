import { prisma } from '../../../config/prisma';
import { VoteType } from '@prisma/client';

// ১. আইডিয়া তৈরি করা
export const createIdea = async (userId: string, data: any) => {
  return await prisma.idea.create({
    data: { 
      ...data, 
      authorId: userId, 
      status: "APPROVED" 
    },
  });
};

// ২. সব আইডিয়া দেখা (পাবলিক ফিড)
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

// ৩. ড্যাশবোর্ডের জন্য নিজের আইডিয়া গেট করা
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

// ৪. আইডি দিয়ে আইডিয়া গেট করা
export const getIdeaById = async (id: string) => {
  return await prisma.idea.findUnique({ 
    where: { id }, 
    include: { 
      author: true, 
      category: true,
      comments: {
        include: { 
            user: true,
        },
        orderBy: { createdAt: 'desc' }
      }
    } 
  });
};

// ৫. আইডিয়া আপডেট করা
export const updateIdea = async (userId: string, ideaId: string, data: any) => {
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, authorId: userId },
  });
  if (!idea) throw new Error("আপনি এই আইডিয়াটি এডিট করার অনুমতিপ্রাপ্ত নন!");
  
  return await prisma.idea.update({ where: { id: ideaId }, data });
};

// ৬. আইডিয়া ডিলিট করা
export const deleteIdea = async (userId: string, userRole: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) throw new Error("আইডিয়াটি খুঁজে পাওয়া যায়নি!");
  
  if (userRole !== 'ADMIN' && idea.authorId !== userId) {
    throw new Error("আপনার এই আইডিয়াটি ডিলিট করার পারমিশন নেই!");
  }
  return await prisma.idea.delete({ where: { id: ideaId } });
};

// ৭. ভোট হ্যান্ডেল করা
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

// ৮. কমেন্ট এবং রিপ্লাই যোগ করা (সম্পূর্ণ আপডেট করা)
export const addCommentIntoDB = async (ideaId: string, userId: string, commentData: any) => {
  const text = commentData.text || commentData.content;
  const parentId = commentData.parentId || null; // যদি রিপ্লাই হয় তবে parentId থাকবে
  
  if (!text) {
    throw new Error("কমেন্টে কিছু লেখা প্রয়োজন!");
  }

  const newComment = await prisma.comment.create({
    data: { 
      content: text, 
      ideaId: ideaId, 
      userId: userId,
      parentId: parentId // ডাটাবেজে parentId সেভ হবে
    },
    include: {
      user: true 
    }
  });

  // আইডিয়াতে কমেন্ট কাউন্ট বাড়ানো
  await prisma.idea.update({
    where: { id: ideaId },
    data: { commentCount: { increment: 1 } },
  });

  return newComment;
};

// ৯. অ্যাডমিন অ্যাকশন - অ্যাপ্রুভ করা
export const approveIdea = async (ideaId: string) => {
  return await prisma.idea.update({ 
    where: { id: ideaId }, 
    data: { status: "APPROVED" } 
  });
};

// ১০. অ্যাডমিন অ্যাকশন - রিজেক্ট করা
export const rejectIdea = async (ideaId: string, feedback: string) => {
  return await prisma.idea.update({
    where: { id: ideaId },
    data: { 
      status: "REJECTED", 
      description: { set: `Admin Feedback: ${feedback}` } as any 
    }
  });
};