import chalk from "chalk";
import { Router } from "express";
import formidable from "formidable";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { validate as uuidValidate } from "uuid";
import {
  deletePic,
  getAllPics,
  getPicById,
  updatePic,
  uploadPic,
} from "../utils/azure-storage.service.js";

export const picsRouter = Router();

/**
 * Get all uploaded images.
 * @returns a list of URLs.
 */
picsRouter.get("/all", async (_req, res) => {
  res.send(await getAllPics());
});

/**
 * Get a picture by its id.\
 * Requires a query param that is a valid UUIDv4 string.
 * @returns a single URL pointing to the given file or Not Found error message
 */
picsRouter.get("/:picId", async (req, res) => {
  const id = req.params.picId;
  if (!id || !uuidValidate(id)) {
    res.status(400).send({
      status: 400,
      message: "Invalid picture Id, must be a valid UUIDv4",
    });
    return;
  }
  const foundPic = await getPicById(id);
  if (!foundPic) {
    res.status(404).send({ error: 404, message: "Not Found" });
  } else {
    res.send({ url: foundPic });
  }
});

/**
 * Upload a file to Azure storage.
 *
 * Requirements:
 * - One file max
 * - One File minimum
 * - Has to be an image (mimetype includes `image/`)
 * - Under 10 MB
 *
 * @returns a url to the uploaded file.
 */
picsRouter.post("/", async (req, res) => {
  const form = new formidable.IncomingForm({
    multiples: false, // have to accept multiple so that the formidable is aware there are multiple, and allows me to delete them all. yeah, I know, great logic
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    uploadDir: dirname(fileURLToPath(import.meta.url)) + "/temp", // Where the files should be saved
  });

  form.parse(req, async (_err, _fields, files) => {
    const filesArr = [];
    try {
      // Send bad request if there are multiple files, otherwise upload if there is only one
      // No matter what make sure to clean up the data
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
        // This occurs if the uploaded file is too big, or there are no uploaded objects. Yup, an empty object. Yeah, logical
        console.log(
          chalk.yellow(
            "[WARNING] Someone tried to upload a file that was too big"
          )
        );
        res.status(400).send({
          status: 400,
          message:
            "You either didn't upload any file or the uploaded file is invalid. The limit is 10 MegaBytes.",
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
          "[ERROR] An error occurred while processing the uploaded file"
        )
      );
      console.error(exception);
      res.status(500).send({
        error: "500",
        message: "An internal server error has occurred. Try again later :)",
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

/**
 * Upload a file to Azure storage and replace the original.
 *
 * Requirements:
 * - One file max
 * - One File minimum
 * - Has to be an image (mimetype includes `image/`)
 * - Under 10 MB
 *
 * @returns a url to the uploaded file.
 */
picsRouter.put("/:picId", async (req, res) => {
  // verify the path param
  const id = req.params.picId;
  if (!id || !uuidValidate(id)) {
    res.status(400).send({
      status: 400,
      message: "Invalid picture Id, must be a valid UUIDv4",
    });
    return;
  }
  const foundPic = await getPicById(id);
  if (foundPic === null) {
    res.status(404).send({ error: 404, message: "Not Found" });
    return;
  }
  // Process the uploaded file
  const form = new formidable.IncomingForm({
    multiples: false, // have to accept multiple so that the formidable is aware there are multiple, and allows me to delete them all. yeah, I know, great logic
    maxFileSize: 10 * 1024 * 1024, // 10 MB // Causes the files[""] to be an empty object. Logical
    uploadDir: dirname(fileURLToPath(import.meta.url)) + "/temp", // Where the files should be saved
  });

  form.parse(req, async (_err, _fields, files) => {
    const filesArr = [];
    try {
      // Send bad request if there are multiple files, otherwise upload if there is only one
      // No matter what make sure to clean up the data
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
        // This occurs if the uploaded file is too big, or there are no uploaded objects. Yup, an empty object. Yeah, logical
        console.log(
          chalk.yellow(
            "[WARNING] Someone tried to upload a file that was too big"
          )
        );
        res.status(400).send({
          status: 400,
          message:
            "You either didn't upload any file or the uploaded file is invalid. The limit is 10 MegaBytes.",
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
        const result = await updatePic(
          files[""].filepath,
          files[""].mimetype,
          id
        );
        if (result === null) {
          res.status(500).send({
            error: "500",
            message:
              "An internal server error has occurred. Try again later :)",
          });
          return;
        }
        if (result) {
          res.status(201).send(result);
        } else {
          res.status(404).send({ error: 404, message: "Not Found" });
        }
        return;
      }
    } catch (exception) {
      console.log(
        chalk.redBright(
          "[ERROR] An error occurred while processing the uploaded file"
        )
      );
      console.error(exception);
      res.status(500).send({
        error: "500",
        message: "An internal server error has occurred. Try again later :)",
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

/**
 * Remove a picture by its ID.\
 * Requires a query param that is a valid UUIDv4 string.
 * @returns a confirmation that the file got deleted or Not Found error message.
 */
picsRouter.delete("/:picId", async (req, res) => {
  const id = req.params.picId;
  if (!id || !uuidValidate(id)) {
    res.status(400).send({
      status: 400,
      message: "Invalid picture Id, must be a valid UUIDv4",
    });
    return;
  }
  const foundPic = await deletePic(id);
  if (foundPic === null) {
    res.status(404).send({ error: 404, message: "Not Found" });
  } else if (foundPic) {
    res.status(204).send();
  } else {
    {
      res
        .status(500)
        .send({ error: 500, message: "Failed to delete the picture" });
    }
  }
});
