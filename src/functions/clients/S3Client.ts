import * as AWS from 'aws-sdk';
const axios = require('axios');
const sharp = require('sharp');

export class S3Client {
    s3: AWS.S3;
    bucketName: string;

    constructor(bucketName: string) {
        this.s3 = new AWS.S3();
        this.bucketName = bucketName;
    }

    upload = async (imageUrl: string, key: string) => {
        var typeMatch = imageUrl.match(/\.([^.]*)$/);
        if (!typeMatch) {
            console.log("Could not determine the image type.");
            return;
        }
        var imageType = typeMatch[1];
        if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
            console.log(`Unsupported image type: ${imageType}`);
            return;
        }

        console.log(`uploading ${imageUrl} ...`);

        const imageRes = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const imageData: ArrayBuffer = imageRes.data;
        const imageBuffer = Buffer.from(imageData);
        console.log(`imageBuffer is undefined?: ${imageBuffer === undefined}`);
        const resized = await this.resize(imageBuffer);
        console.log('resizing complete!');

        const res = await this.s3.putObject({
            Body: resized,
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }

    resize = async (buffer: Buffer) => {
        return await sharp(buffer).resize(400, 400).toBuffer();
    }
}