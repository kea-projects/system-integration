import chalk from "chalk";
import { Router } from "express";
import formidable from "formidable";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {
  getAllPics,
  getPicById,
  uploadPic,
} from "../utils/azure-storage.service.js";

export const picsRouter = Router();

picsRouter.get("/", async (req, res) => {
  res.send(await getAllPics());
});

picsRouter.get("/:picId", async (req, res) => {
  const id = req.params.picId;
  if (!id || id.length < 3) {
    res.status(400).send({
      status: 400,
      message: "Invalid picture Id, minimum length of 3 characters",
    });
    return;
  }
  res.send(await getPicById(id));
});

picsRouter.post("/", async (req, res) => {
  const form = new formidable.IncomingForm({
    multiples: true, // have to accept multiple so that the formidable is aware there are multiple, and allows me to delete them all. yeah, I know, great logic
    maxFileSize: 10 * 1024 * 1024, // 10 MB // Causes the files[""] to be an empty object. Logical
    uploadDir: dirname(fileURLToPath(import.meta.url)) + "/temp", // Where the files should be saved
  });

  form.parse(req, async (err, fields, files) => {
    const filesArr = [];
    try {
      // Send bad request if there are multiple files, otherwise upload if there is only one
      // No matter what make sure to clean upo the data
      // files[""] is because formidable is stupid just like the rest of javascript-based Node
      if (Array.isArray(files[""])) {
        files[""].forEach((file) => {
          filesArr.push(file.filepath);
        });
        console.log(
          chalk.yellow("[WARNING] Someone tried to upload more than one file")
        );
        res.status(400).send({
          status: 400,
          message: "You can't upload more than one file!",
        });
        return;
      } else if (Object.keys(files).length === 0) {
        // This occurs if the uploaded file is too big. Yup, an empty object. Yeah, logical
        console.log(
          chalk.yellow(
            "[WARNING] Someone tried to upload a file that was too big"
          )
        );
        res.status(400).send({
          status: 400,
          message: "The uploaded file is invalid! The limit is 10 MegaBytes.",
        });
        return;
      } else if (!files[""].mimetype.includes("image/")) {
        filesArr.push(files[""].filepath);
        console.log(
          chalk.yellow(
            `[WARNING] Someone tried to upload a file that wasn't an image (it was ${files[""].mimetype})`
          )
        );
        res.status(400).send({
          status: 400,
          message: "The uploaded file has to be an image.",
        });
        return;
      } else {
        filesArr.push(files[""].filepath);
        res
          .status(201)
          .send(await uploadPic(files[""].filepath, files[""].mimetype));
      }
    } catch (exception) {
      console.log(
        chalk.redBright(
          "[ERROR] An error occured while processing the uploaded file"
        )
      );
      console.error(exception);
      res.status(500).send({
        error: "500",
        message: "An internal server error has occured. Try again later :)",
      });
    } finally {
      // Remove the saved files
      filesArr.forEach((element) => {
        fs.unlink(element, (err) => {
          if (err) console.error("error:", err);
        });
      });
    }
  });
});
