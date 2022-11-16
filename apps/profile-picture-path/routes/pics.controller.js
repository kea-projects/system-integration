import { Router } from "express";
import {
  getAllPics,
  getPicById,
  uploadPic,
} from "../utils/azure-storage.service.js";

export const picsRouter = Router();

picsRouter.get("/", (req, res) => {
  res.send(getAllPics());
});

picsRouter.get("/:picId", (req, res) => {
  const id = req.params.picId;
  if (!id || id.length < 3) {
    res
      .status(400)
      .send({
        status: 400,
        message: "Invalid picture Id, minimum length of 3 characters",
      });
    return;
  }
  res.send(getPicById(id));
});

picsRouter.post("/", (req, res) => {
  res.status(201).send(uploadPic());
});
