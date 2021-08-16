import * as AWS from 'aws-sdk';
const axios = require('axios');
import * as gm from 'gm';
const im = gm.subClass({ imageMagick: true });

export class S3Client {
    s3: AWS.S3;
    bucketName: string;

    constructor(bucketName: string) {
        this.s3 = new AWS.S3();
        this.bucketName = bucketName;
    }

    upload = async (imageUrl: string, key: string) => {
        console.log(`uploading ${imageUrl} ...`);

        const imageRes = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const imageData: ArrayBuffer = imageRes.data;
        const imageBuffer = Buffer.from(imageData);
        console.log(`imageBuffer is ${imageBuffer.toString()}`);
        const image = im(imageBuffer);
        const resized = await this.resize(image);
        console.log('resizing complete!')

        const res = await this.s3.putObject({
            Body: resized,
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }

    resize = async (image: gm.State): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            image.resize(400).toBuffer('JPG', (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            })
        });
    }
}