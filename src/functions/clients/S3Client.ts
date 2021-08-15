import * as AWS from 'aws-sdk';
const axios = require('axios');
const gm = require('gm');


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
        const resized = gm(image, `${key}.jpg`)
            .resize(400, 400)
            .toBuffer('jpg');
        const res = await this.s3.putObject({
            Body: resized,
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }
}