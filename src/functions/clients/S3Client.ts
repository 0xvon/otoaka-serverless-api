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
            image.resize(400).stream((err, stdout, stderr) => {
                if (err) {
                    console.log('stream process error');
                    console.log(err, stdout, stderr);
                    reject(err);
                }

                var chunks = [];
                stdout.on('data', function(chunk) {
                    console.log('pushed');
                    chunks.push(chunk);
                });
                stdout.on('end', function() {
                    console.log('end');
                    var buffer = Buffer.concat(chunks);
                    resolve(buffer);
                });
            })
        });
    }
}