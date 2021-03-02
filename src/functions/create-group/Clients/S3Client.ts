import * as AWS from 'aws-sdk';
const axios = require('axios');

export class S3Client {
    s3: AWS.S3;
    bucketName: string;

    constructor(bucketName: string) {
        this.s3 = new AWS.S3();
        this.bucketName = bucketName;
    }

    upload = async (imageUrl: string, key: string) => {
        const imageRes = await axios.get(imageUrl, {responseType: 'arraybuffer'});

        console.log(imageUrl);

        const res = await this.s3.putObject({
            Body: Buffer.from(imageRes.data),
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }
}