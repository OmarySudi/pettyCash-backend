
const AWS = require('aws-sdk');
const dotenv = require("dotenv")
const { randomBytes } = require('crypto');

dotenv.config();

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

const generateUploadURL = async()=>{

    const rawBytes = randomBytes(16);
    const fileName = rawBytes.toString('hex');
    
    const params = ({
        Bucket: bucketName,
        Key: fileName,
        Expires: 60
    });

    const uploadUrl = await s3.getSignedUrlPromise("putObject",params);

    return uploadUrl;
}

module.exports = {generateUploadURL}




