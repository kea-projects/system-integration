import chalk from "chalk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { picsRouter } from "./routes/pics.controller.js";

// ---- Config ----
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Endpoints ----
app.use("/pictures/", picsRouter);

app.get("/pictures", (_req, res) => {
  res.status(418).send({
    getAllPics: {
      method: "GET",
      route: "/pictures/all",
      requirements: "",
      returns: "A list of URLs",
    },
    getPicById: {
      method: "GET",
      route: "/pictures/:picId",
      requirements: ":picId path param has to be a valid UUIDv4 string",
      returns: "A URL, or 404 Not Found",
    },
    uploadPic: {
      method: "POST",
      route: "/pictures/:picId",
      requirements:
        ":picId path param has to be a valid UUIDv4 string. One File, has to be an image, 10MB max",
      returns: "A URL",
    },
    update: {
      method: "PUT",
      route: "/pictures/:picId",
      requirements:
        ":picId path param has to be a valid UUIDv4 string. One File, has to be an image, 10MB max",
      returns: "A URL",
    },
    deletePic: {
      method: "DELETE",
      route: "/pictures/:picId",
      requirements: ":picId path param has to be a valid UUIDv4 string",
      returns: "204 No Content or 404 Not Found",
    },
    deletePic: {
      method: "DELETE",
      route: "/pictures/:picId",
      requirements: ":picId path param has to be a valid UUIDv4 string",
      returns: "204 No Content or 404 Not Found",
    },
  });
});

// ---- Server Start ----
server.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  // Check if the necessary environment variables are present
  if (!process.env.AZURE_CONNECTION_STRING) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage connection string is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }
  if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage account name is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }
  if (!process.env.AZURE_CONTAINER_NAME) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage container name is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }

  console.log(
    chalk.yellowBright(`Server has started on '${PORT}'`),
    chalk.redBright(PORT)
  );
});
