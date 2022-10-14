// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
// import fs from "fs";

async function uploadFile(
    s3Client,
    awsS3Bucket,
    filename,
    contentType,
    body
  ){
    const mediaUploadParams = {
      Bucket: awsS3Bucket,
      Key: filename,
      Body: body,
      ACL: 'public-read',
      ContentType: contentType,
    };

    let filename2 = filename.substr(5);
  
    try {
      await s3Client.send(new PutObjectCommand(mediaUploadParams));
      console.log('uploaded filename:', filename2);
    } catch (err) {
      console.log('Error', err);
    }
  
    const url = `https://${awsS3Bucket}.s3.amazonaws.com/json/${filename2}`;
    console.log('Location:', url);
    return url;
  }

  
export default async function awsUpload(image, type, attribute) {
  // apiKey: apiKey,
  // secretKey: secretKey,
  // region: region,
  // bucketName: bucketName
    const REGION = attribute.region;
    const s3Client = new S3Client({ region: REGION,
      credentials:{
          accessKeyId:attribute.apiKey,
          secretAccessKey: attribute.secretKey
      }
    });
  
    async function uploadMedia(media, type) {
      const mediaPath = media;
      const mediaFileStream = fs.createReadStream(media);
      const mediaUrl = await uploadFile(
        s3Client,
        attribute.bucketName,
        mediaPath,
        type,
        mediaFileStream,
      );
      console.log(mediaUrl);
      return mediaUrl;
    }
    const uriValue = await uploadMedia(image, type);
    return uriValue;
  }
  