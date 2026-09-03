require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', { folder: 'DevEvent' })
    .then(result => console.log("✅ UPLOAD SUCCESS:", result.secure_url))
    .catch(err => console.error("❌ UPLOAD ERROR:", JSON.stringify(err, null, 2)));