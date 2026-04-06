import { Router } from "express";
import * as ideaController from "./idea.controller"; 
import auth from "../../../middlewares/auth.middleware"; 

const router = Router();

// ১. পাবলিক রাউটস
router.get("/", ideaController.getAllIdeas);

// ✅ ড্যাশবোর্ড রাউট (এটি /:id এর উপরে রাখতে হবে)
router.get("/my-ideas", auth("MEMBER", "ADMIN"), ideaController.getMyIdeas);

router.get("/:id", ideaController.getIdeaById);

// ২. মেম্বার এবং অ্যাডমিন অ্যাকশনস (MEMBER রোল ব্যবহার করা হয়েছে)
router.post("/", auth("MEMBER", "ADMIN"), ideaController.createIdea);

// ✅ ভোট দেওয়ার রাউট
router.post("/:id/vote", auth("MEMBER", "ADMIN"), ideaController.handleVote); 

// ✅ কমেন্ট করার নতুন রাউট (এটি আপনার ফ্রন্টএন্ড এরর ফিক্স করবে)
router.post("/:id/comments", auth("MEMBER", "ADMIN"), ideaController.addComment); 

router.put("/:id", auth("MEMBER", "ADMIN"), ideaController.updateIdea);
router.delete("/:id", auth("MEMBER", "ADMIN"), ideaController.deleteIdea);

// ৩. শুধুমাত্র অ্যাডমিন অ্যাকশনস
router.patch("/approve/:id", auth("ADMIN"), ideaController.approveIdea);
router.patch("/reject/:id", auth("ADMIN"), ideaController.rejectIdea);

export const ideaRoutes = router;