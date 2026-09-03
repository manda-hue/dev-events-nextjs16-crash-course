const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function test() {
    const form = new FormData();
    form.append('file', fs.createReadStream('./test-image.jpg'));
    form.append('upload_preset', 'TON_PRESET_NAME');

    const res = await fetch('https://api.cloudinary.com/v1_1/ujbcwucl/image/upload', {
        method: 'POST',
        body: form,
    });

    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
}
test();