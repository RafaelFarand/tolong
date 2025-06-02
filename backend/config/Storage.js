const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Add initialization error handling
storage.getBuckets().catch(err => {
  console.error('Error initializing storage:', err);
  process.exit(1);
});

const bucket = storage.bucket('tolong'); // Set bucket name directly

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file uploaded');
      return;
    }

    try {
      // Generate unique filename
      const fileName = `products/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        }
      });

      blobStream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          // Make the file public
          await blob.makePublic();
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/tolong/${fileName}`;
          resolve(publicUrl);
        } catch (error) {
          console.error('Error making file public:', error);
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    } catch (error) {
      console.error('Error in upload process:', error);
      reject(error);
    }
  });
};

module.exports = { uploadFile };