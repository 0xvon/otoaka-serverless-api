import * as AWS from 'aws-sdk';
import * as Jimp from 'jimp';

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET ?? '';

export const upload = async (imageUrl: string, key: string) => {
    console.log(`uploading ${imageUrl} ...`);

    const resized = await resize(imageUrl);
    console.log('resizing complete!');

    await s3.putObject({
        Body: resized,
        Bucket: bucketName,
        ContentType: 'image/jpeg',
        Key: `assets/imported/${key}.jpeg`,
    }).promise()

    return `https://${bucketName}.s3-ap-northeast-1.amazonaws.com/assets/imported/${key}.jpeg`
}

const resize = async (url: string) => {
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