import { Request, Response } from "express";
import * as ideaService from "./idea.service";
import catchAsync from "../../../utils/catchAsync";

// ✅ কমেন্ট যোগ করার নতুন ফাংশন
export const addComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params; // Idea ID
  const { text } = req.body; // ফ্রন্টএন্ড থেকে পাঠানো কমেন্ট

  const result = await ideaService.addCommentIntoDB(
    String(id), 
    String(user.id), 
    text
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully! ✅",
    data: result,
  });
});

// ✅ ড্যাশবোর্ডের জন্য নিজের সব আইডিয়া গেট করার ফাংশন
export const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.getMyIdeas(String(user.id));
  
  res.status(200).json({
    success: true,
    message: "Your ideas retrieved successfully",
    data: result,
  });
});

// ✅ ভোট টগল করার ফাংশন
export const handleVote = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const result = await ideaService.toggleVote(String(user.id), String(id));

  res.status(200).json({
    success: true,
    message: "Vote updated successfully",
    data: result,
  });
});

export const createIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.createIdea(String(user.id), req.body);
  res.status(201).json({ success: true, data: result });
});

export const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.getAllIdeas(req.query);
  res.status(200).json({ success: true, data: result });
});

export const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.getIdeaById(String(req.params.id));
  res.status(200).json({ success: true, data: result });
});

export const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.updateIdea(String(user.id), String(req.params.id), req.body);
  res.status(200).json({ success: true, data: result });
});

export const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  await ideaService.deleteIdea(String(user.id), String(user.role), String(req.params.id));
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

export const approveIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.approveIdea(String(req.params.id));
  res.status(200).json({ success: true, data: result });
});

export const rejectIdea = catchAsync(async (req: Request, res: Response) => {
  const { feedback } = req.body;
  const result = await ideaService.rejectIdea(String(req.params.id), feedback);
  res.status(200).json({ success: true, data: result });
});