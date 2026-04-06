import { Router } from "express";
import * as commentController from "./comment.controller";
import protect from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/:ideaId", protect(), commentController.handleCreateComment);
router.get("/:ideaId", commentController.fetchIdeaComments);
router.patch("/:commentId", protect(), commentController.handleUpdateComment); // Edit Route
router.delete("/:commentId", protect(), commentController.handleDeleteComment); // Delete Route

export default router;