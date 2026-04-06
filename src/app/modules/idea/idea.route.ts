import { Router } from "express";
import * as ideaController from "./idea.controller"; 
import auth from "../../../middlewares/auth.middleware"; 

const router = Router();

router.get("/", ideaController.getAllIdeas);
router.get("/my-ideas", auth("MEMBER", "ADMIN"), ideaController.getMyIdeas);
router.get("/:id", ideaController.getIdeaById);

router.post("/", auth("MEMBER", "ADMIN"), ideaController.createIdea);
router.post("/:id/vote", auth("MEMBER", "ADMIN"), ideaController.handleVote); 
router.post("/:id/comments", auth("MEMBER", "ADMIN"), ideaController.addComment); 

router.put("/:id", auth("MEMBER", "ADMIN"), ideaController.updateIdea);
router.delete("/:id", auth("MEMBER", "ADMIN"), ideaController.deleteIdea);

router.patch("/approve/:id", auth("ADMIN"), ideaController.approveIdea);
router.patch("/reject/:id", auth("ADMIN"), ideaController.rejectIdea);

export const ideaRoutes = router;