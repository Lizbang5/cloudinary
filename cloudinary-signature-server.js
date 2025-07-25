
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const API_SECRET = process.env.CLOUDINARY_API_SECRET;

app.post('/sign', (req, res) => {
  const { timestamp, upload_preset, public_id } = req.body;

  if (!timestamp || !upload_preset || !API_SECRET) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  let signatureBase = `timestamp=${timestamp}&upload_preset=${upload_preset}`;
  if (public_id) {
    signatureBase += `&public_id=${public_id}`;
  }

  const signature = crypto
    .createHash('sha1')
    .update(signatureBase + API_SECRET)
    .digest('hex');

  res.json({ signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Signature server listening on port ${PORT}`);
});
