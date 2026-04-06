import { Request, Response } from "express";
import * as ideaService from "./idea.service";
import catchAsync from "../../../utils/catchAsync";

// আইডিয়া তৈরি করা
export const createIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.createIdea(String(user.id), req.body);
  res.status(201).json({ success: true, data: result });
});

// সব আইডিয়া দেখা (সার্চ ও ফিল্টারসহ)
export const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.getAllIdeas(req.query);
  res.status(200).json({ success: true, data: result });
});

// আইডি দিয়ে একটি নির্দিষ্ট আইডিয়া দেখা
export const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.getIdeaById(String(req.params.id));
  res.status(200).json({ success: true, data: result });
});

// ইউজারের নিজস্ব আইডিয়াগুলো দেখা
export const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.getMyIdeas(String(user.id));
  res.status(200).json({ success: true, message: "Retrieved successfully", data: result });
});

// আইডিয়া আপডেট করা
export const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.updateIdea(String(user.id), String(req.params.id), req.body);
  res.status(200).json({ success: true, data: result });
});

// আইডিয়া ডিলিট করা
export const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  await ideaService.deleteIdea(String(user.id), String((user as any).role), String(req.params.id));
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

// ভোট হ্যান্ডেল করা
export const handleVote = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ideaService.toggleVote(String(user.id), String(req.params.id));
  res.status(200).json({ success: true, data: result });
});

/** * ✅ কমেন্ট যোগ করা (ফিক্স করা হয়েছে)
 * ফ্রন্টএন্ড থেকে { text: "..." } আকারে ডাটা আসবে। 
 * আমরা সরাসরি req.body সার্ভিস-এ পাঠিয়ে দিচ্ছি।
 */
export const addComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const ideaId = String(req.params.id);
  const userId = String(user.id);
  
  // সরাসরি req.body পাঠানো হচ্ছে কারণ সার্ভিসে আমরা এখন অবজেক্ট আশা করছি
  const result = await ideaService.addCommentIntoDB(ideaId, userId, req.body);
  
  res.status(201).json({ 
    success: true, 
    message: "Commented successfully!", 
    data: result 
  });
});

// অ্যাডমিন কর্তৃক আইডিয়া অ্যাপ্রুভ করা
export const approveIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.approveIdea(String(req.params.id));
  res.status(200).json({ success: true, data: result });
});

// অ্যাডমিন কর্তৃক আইডিয়া রিজেক্ট করা
export const rejectIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await ideaService.rejectIdea(String(req.params.id), req.body.feedback);
  res.status(200).json({ success: true, data: result });
});