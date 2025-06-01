const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file uploaded');
      return;
    }

    const blob = bucket.file(`products/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      try {
        // Make the file public
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadFile };