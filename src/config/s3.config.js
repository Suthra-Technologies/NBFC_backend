const { S3Client } = require("@aws-sdk/client-s3");
const { aws } = require("./env");

const s3Client = new S3Client({
    region: aws.region,
    credentials: {
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey,
    },
});

module.exports = { s3Client };
