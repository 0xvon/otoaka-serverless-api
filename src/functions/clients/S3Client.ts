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
        console.log(`uploading ${imageUrl} ...`);

        const image = await axios.get(imageUrl, {responseType: 'arraybuffer'}).data as Buffer;
        const resized = sharp(image)
            .resize(400)
            .jpeg({ quality: 10 })
            .toBuffer();
        const res = await this.s3.putObject({
            Body: resized,
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }
}