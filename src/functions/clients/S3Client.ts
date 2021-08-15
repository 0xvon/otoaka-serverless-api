import * as AWS from 'aws-sdk';
const axios = require('axios');
// const gm = require('gm');
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

        const imageData = await axios.get(imageUrl, {responseType: 'arraybuffer'}).data;
        const image = im(Buffer.from(imageData));
        const resized = await this.resize(image);
        
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