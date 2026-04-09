import { Router } from "express";
import * as ideaController from "./idea.controller"; 
import auth from "../../../middlewares/auth.middleware"; 

const router = Router();

// --- GET ROUTES ---
router.get("/", ideaController.getAllIdeas);
router.get("/my-ideas", auth("MEMBER", "ADMIN"), ideaController.getMyIdeas);
router.get("/:id", ideaController.getIdeaById);

// --- POST ROUTES ---
router.post("/", auth("MEMBER", "ADMIN"), ideaController.createIdea);
router.post("/:id/vote", auth("MEMBER", "ADMIN"), ideaController.handleVote); 
router.post("/:id/comments", auth("MEMBER", "ADMIN"), ideaController.addComment); 

// --- PUT & DELETE ROUTES ---
router.put("/:id", auth("MEMBER", "ADMIN"), ideaController.updateIdea);
router.delete("/:id", auth("MEMBER", "ADMIN"), ideaController.deleteIdea);

// --- PATCH ROUTES ---
// ✅ এই রুটটি আপনার ফ্রন্টএন্ডের PATCH রিকোয়েস্ট হ্যান্ডেল করবে (যেমন: ফিডব্যাক বা আপডেট)
router.patch("/:id", auth("ADMIN", "MEMBER"), ideaController.updateIdea);

// এডমিন স্পেসিফিক অ্যাপ্রুভ/রিজেক্ট রুট
router.patch("/approve/:id", auth("ADMIN"), ideaController.approveIdea);
router.patch("/reject/:id", auth("ADMIN"), ideaController.rejectIdea);

export const ideaRoutes = router;