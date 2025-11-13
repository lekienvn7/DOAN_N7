import express from "express";
import {
  getRepository,
  getRepoMaterials,
  getAllRepository,
  addRepository,
  updateRepository,
  deleteRepository,
  removeMaterialFromRepo,
} from "../controllers/repoControllers.js";
import {
  verifyToken,
  checkRepositoryPermission,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRepository);

router.get("/:id", getRepository);

router.get("/material/:repoID", getRepoMaterials);
router.post("/", addRepository);

router.put("/:id", updateRepository);

router.delete(
  "/:id/removeMaterial",
  verifyToken,
  checkRepositoryPermission,
  removeMaterialFromRepo
);

router.delete("/:id", deleteRepository);

export default router;
