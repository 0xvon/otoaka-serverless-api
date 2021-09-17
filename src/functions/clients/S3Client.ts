import * as AWS from 'aws-sdk';
import * as Jimp from 'jimp';
import axios from 'axios';

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET ?? '';

export const upload = async (imageUrl: string, key: string) => {
    // var typeMatch = imageUrl.match(/\.([^.]*)$/);
    // if (!typeMatch) {
    //     console.log("Could not determine the image type.");
    //     return;
    // }
    // var imageType = typeMatch[1];
    // if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
    //     console.log(`Unsupported image type: ${imageType}`);
    //     return;
    // }

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

export const upload_d = async (imageUrl: string, key: string) => {
    const imageRes = await axios.get(imageUrl, {responseType: 'arraybuffer'});

    console.log(imageUrl);

    await s3.putObject({
        Body: Buffer.from(imageRes.data),
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