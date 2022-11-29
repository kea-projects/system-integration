import { BlobServiceClient } from "@azure/storage-blob";
import chalk from "chalk";

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
 * Find a specific file by its id (name minus the file extension).
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
export const uploadPic = async (filepath, fileType, id) => {
  // prepare the data for upload
  const idWithExtension = id + "." + fileType.replace("image/", "");

  const containerClient = storageClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const options = { blobHTTPHeaders: { blobContentType: fileType } };
  await containerClient
    .getBlockBlobClient(idWithExtension)
    .uploadFile(filepath, options);
  const url = createResourceUrl(idWithExtension);
  console.log(chalk.green(`[INFO] New file uploaded at ${url}`));
  return {
    url: url,
  };
};

/**
 * Update and upload a file to azure.
 * @param {*} filepath the path to the file on the disk.
 * @param {*} fileType the mimetype (file type) as seen by the API (image/jpg etc).
 * @param {*} id the ID of the file to update.
 * @returns URL of the uploaded file.
 */
export const updatePic = async (filepath, fileType, id) => {
  if (getPicById(id) === null) {
    return null;
  }

  // Delete the original blob
  const result = await deletePic(id);
  if (result !== true) {
    return null;
  }

  // upload the new picture
  const name = id + "." + fileType.replace("image/", "");
  const containerClient = storageClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const options = { blobHTTPHeaders: { blobContentType: fileType } };
  await containerClient.getBlockBlobClient(name).uploadFile(filepath, options);
  const url = createResourceUrl(name);
  console.log(chalk.green(`[INFO] File updated at ${url}`));
  return {
    url: url,
  };
};

/**
 * Find and delete a specific file by its id (name minus the file extension).
 * @param {*} id the name minus the file extension.
 * @returns null if not found, false if failed to delete, and true if deletion succeeded.
 */
export const deletePic = async (id) => {
  const pic = await getPicById(id);
  if (pic === null) {
    return null;
  }
  // Strip URL part
  const name = pic.replace(/.*\//gm, "");
  const response = await storageClient
    .getContainerClient(containerName)
    .getBlockBlobClient(name)
    .deleteIfExists();
  return response.succeeded;
};

/**
 * Create a resource url that can be used to directly access the uploaded file.
 * @param {*} fileName the name (with the file extension) of the desired file.
 * @returns a URL.
 */
function createResourceUrl(fileName) {
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;
}
