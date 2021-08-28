import * as AWS from 'aws-sdk';
const Jimp = require("jimp");
import axios from 'axios';

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

        const resized = await this.resize(imageUrl);
        console.log('resizing complete!');

        const res = await this.s3.putObject({
            Body: resized,
            Bucket: this.bucketName,
            ContentType: 'image/jpeg',
            Key: `assets/imported/${key}.jpeg`,
        }).promise()

        return res
    }

    upload_d = async (imageUrl: string, key: string) => {
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

    resize = async (url: string) => {
        return new Promise((resolve, reject) => {
            Jimp.read(url, (err, image) => {
                if (err) { reject(err) }
                else {
                    image
                        .scaleToFit(400, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                        .getBuffer(Jimp.MIME_JPEG, (err, data) => {
                            if (err) { reject(err) }
                            else { resolve(data) }
                        })
                }
            });
        })
    }
}