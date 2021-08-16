import * as AWS from 'aws-sdk';
var Jimp = require("jimp");

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

    resize = async (url: string) => {
        return new Promise((resolve, reject) => {
            Jimp.read(url, (err, data) => {
                if (err) { reject(err) }
                else {
                    data.scaleToFit(400, Jimp.AUTO, Jimp.RESIZE_BEZIER).getBuffer(Jimp.MIME_JPEG, (err, data) => {
                        if (err) { reject(err) }
                        else { resolve(data) }
                    })
                }
            });
        })
    }
}