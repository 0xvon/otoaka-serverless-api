import { S3 } from "aws-sdk";

import * as AWS from 'aws-sdk';

export class S3Client {
    s3: S3;
    bucketName: string;

    constructor(bucketName: string) {
        this.s3 = new AWS.S3();
        this.bucketName = bucketName;
    }

    upload = async (imageUrl: string, key: string) => {
        let requestBody = Buffer.from(imageUrl, 'base64');

        const res = await this.s3.putObject({
            Body: requestBody,
            Bucket: this.bucketName,
            ContentType: 'image/png',
            Key: `assets/imported/${key}.png`,
        }).promise()

        return res
    }
}