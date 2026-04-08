import { Router } from "express";

import authRoutes from "../app/modules/auth/auth.route";
import { ideaRoutes } from "../app/modules/idea/idea.route";
import categoryRoutes from "../app/modules/category/category.route";
import voteRoutes from "../app/modules/vote/vote.route";
import paymentRoutes from "../app/modules/payment/payment.route";
import commentRoutes from "../app/modules/comment/comment.route";
import userRoutes from "../app/modules/user/user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ideas", ideaRoutes);
router.use("/categories", categoryRoutes);
router.use("/votes", voteRoutes);
router.use("/payments", paymentRoutes);
router.use("/comments", commentRoutes);

export default router;