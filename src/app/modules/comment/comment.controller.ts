import { Request, Response } from "express";
import * as CommentService from "./comment.service";
import catchAsync from "../../../utils/catchAsync";

// তৈরি করা
export const handleCreateComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // ✅ টাইপ কাস্টিং: String() ব্যবহার করা হয়েছে এরর দূর করতে
  const ideaId = String(req.params.ideaId); 
  const { content, parentId } = req.body;

  const result = await CommentService.createComment(
    String(user.id), 
    ideaId, 
    content, 
    parentId ? String(parentId) : undefined
  );
  
  res.status(201).json({ success: true, message: "Commented!", data: result });
});

// আপডেট করা (Edit)
export const handleUpdateComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // ✅ টাইপ কাস্টিং
  const commentId = String(req.params.commentId);
  const { content } = req.body;

  const result = await CommentService.updateCommentContent(String(user.id), commentId, content);
  res.status(200).json({ success: true, message: "Updated!", data: result });
});

// ডিলিট করা
export const handleDeleteComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // ✅ টাইপ কাস্টিং
  const commentId = String(req.params.commentId);

  await CommentService.deleteCommentFromDB(String(user.id), commentId);
  res.status(200).json({ success: true, message: "Deleted!" });
});

// ফেচ করা
export const fetchIdeaComments = catchAsync(async (req: Request, res: Response) => {
  // ✅ টাইপ কাস্টিং
  const ideaId = String(req.params.ideaId);
  const result = await CommentService.getCommentsByIdea(ideaId);
  res.status(200).json({ success: true, data: result });
});