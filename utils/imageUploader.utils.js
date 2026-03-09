


const fs = require("fs");
const path = require("path");
const s3 = require("../config/awsConfig");

const imageUploader = async (images, slugFileName) => {
    const list = Array.isArray(images) ? images : [images];
    const uploadedUrls = [];

    for (const image of list) {
        const ext = path.extname(image.name);
        const finalName = `${slugFileName}-${Date.now()}${ext}`;

        // Read file from tempFilePath
        const fileBuffer = fs.readFileSync(image.tempFilePath);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: finalName,
            Body: fileBuffer,
            ContentType: image.mimetype,
            // ACL: "public-read", // make file public
        };

        const result = await s3.upload(params).promise();

        // Only push URL
        uploadedUrls.push(result.Location);
    }

    return uploadedUrls;
};

module.exports = imageUploader;






// const s3 = require("../config/awsConfig");
// const path = require("path");

// const imageUploader = async (images, slugFileName) => {
//     const list = Array.isArray(images) ? images : [images];
//     let uploaded = [];

//     for (const image of list) {

//         console.log("image", image)
//         const ext = path.extname(image.name);
       
//         const finalName = `${slugFileName}${ext}`;

//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: finalName,
//             Body: image.data,
//             ContentType: image.mimetype,
//             // ACL: "public-read"
//         };

//         // console.log(s3)
//         const result = await s3.upload(params).promise();

//         uploaded.push({
//             // fileName: finalName,
//             url: result.Location
//         });
//     }

//     return uploaded;
// };

// module.exports = imageUploader;



