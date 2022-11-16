import { BlobServiceClient } from "@azure/storage-blob";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";

const azureConnectionString = process.env.AZURE_CONNECTION_STRING;
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_CONTAINER_NAME;

const storageClient = BlobServiceClient.fromConnectionString(
  azureConnectionString
);

const pics = [
  {
    name: "1223456789.png",
    url: "hotdeals.dev/1223456789",
  },
  {
    name: "0987654321.png",
    url: "hotdeals.dev/0987654321",
  },
  {
    name: "0011223344.png",
    url: "hotdeals.dev/0011223344",
  },
];

export const getAllPics = async () => {
  const containers = storageClient.listContainers();
  for await (const container of containers) {
    console.log(`Container : ${container.name}`);
  }
  return pics;
};

export const getPicById = async (id) => {
  return pics.filter((pic) => pic.name.replace(/\..*/m, "") === id);
};

export const uploadPic = async (filepath, fileType) => {
  // prepare the data for upload
  const id = uuidv4() + "." + fileType.replace("image/", "");

  const containerClient = storageClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const options = { blobHTTPHeaders: { blobContentType: fileType } };
  await containerClient.getBlockBlobClient(id).uploadFile(filepath, options);
  const url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${id}`;
  console.log(chalk.green(`[INFO] New file uploaded at ${url}`));
  return {
    url: url,
  };
};
