const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} = require("./constants");
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  return await client.send(command);
}

async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });
  return await client.send(command);
}

async function getFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  return await client.send(command);
}

async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream(`./images/${filename}`));
}

async function getFileURL(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

exports.uploadFile = uploadFile;
exports.getFileURL = getFileURL;
exports.downloadFile = downloadFile;
exports.getFile = getFile;
exports.getFiles = getFiles;
