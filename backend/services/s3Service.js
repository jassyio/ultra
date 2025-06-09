const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: Date.now().toString() + '-' + file.originalname,
      Body: file.buffer,
      ACL: 'public-read',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.Location);
    });
  });
};

const getFileUrl = (key) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: 60 * 5 // URL expires in 5 minutes
  });
};

const deleteFile = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  upload,
  uploadFile,
  getFileUrl,
  deleteFile,
};