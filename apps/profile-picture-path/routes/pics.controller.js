import chalk from "chalk";
import { Router } from "express";
import formidable from "formidable";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getAllPics } from "../utils/azure-storage.service.js";
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
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    uploadDir: dirname(fileURLToPath(import.meta.url)),
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
        res.status(400).send({
          status: 400,
          message: "You can't upload more than one file!",
        });
        console.log(
          chalk.yellow("[WARNING] Someone tried to upload more than one file")
        );
        return;
      } else if (Object.keys(files).length === 0) {
        // This occurs if the uploaded file is too big. Yup, an empty object. Yeah, logical
        res.status(400).send({
          status: 400,
          message: "The uploaded file is invalid! The limit is 10 MegaBytes.",
        });
        console.log(
          chalk.yellow(
            "[WARNING] Someone tried to upload a file that was too big"
          )
        );
        return;
      } else {
        filesArr.push(files[""].filepath);
        // Upload this bitch
      }
      res.json({ fields, files });
    } catch (exception) {
      console.log(
        chalk.redBright(
          "[ERROR] An error occured while processing the uploaded file"
        )
      );
      console.error(exception);
    } finally {
      filesArr.forEach((element) => {
        fs.unlink(element, (err) => {
          if (err) console.error("error:", err);
        });
      });
    }
  });
  //res.status(201).send(await uploadPic());
});
