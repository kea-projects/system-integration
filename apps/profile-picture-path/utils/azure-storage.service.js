import { BlobServiceClient } from "@azure/storage-blob";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";

const azureConnectionString = process.env.AZURE_CONNECTION_STRING;
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_CONTAINER_NAME;

const storageClient = BlobServiceClient.fromConnectionString(
  azureConnectionString
);

/**
 * Fetch all blobs in the specified Azure container.
 * @returns a list of URLs.
 */
export const getAllPics = async () => {
  const blobs = storageClient.getContainerClient(containerName).listBlobsFlat();
  const blobList = [];
  for await (const blob of blobs) {
    blobList.push(createResourceUrl(blob.name));
  }
  return blobList;
};

/**
 * Find a specific blog by its id (name minus the file extension).
 * @param {*} id the name minus the file extension.
 * @returns a url or null.
 */
export const getPicById = async (id) => {
  // Terribly efficient fetching of all blobs and then finding one that matches the ID
  // Can't fetch one directly from azure since the name includes the extension
  const pics = await getAllPics();
  const matchingPic = pics.filter((pic) => pic.includes(id))[0];
  return matchingPic ? matchingPic : null;
};

/**
 * Upload a file to azure.
 * @param {*} filepath the path to the file on the disk.
 * @param {*} fileType the mimetype (file type) as seen by the API (image/jpg etc).
 * @returns URL of the uploaded file.
 */
export const uploadPic = async (filepath, fileType) => {
  // prepare the data for upload
  const id = uuidv4() + "." + fileType.replace("image/", "");

  const containerClient = storageClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const options = { blobHTTPHeaders: { blobContentType: fileType } };
  await containerClient.getBlockBlobClient(id).uploadFile(filepath, options);
  const url = createResourceUrl(id);
  console.log(chalk.green(`[INFO] New file uploaded at ${url}`));
  return {
    url: url,
  };
};

/**
 * Create a resource url that can be used to directly access the uploaded file.
 * @param {*} fileName the name (with the file extension) of the desired file.
 * @returns a URL.
 */
function createResourceUrl(fileName) {
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;
}
