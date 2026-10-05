const fs = require('fs');
const path = require('path');
const https = require('https');

const clients = [
  { id: "taj-vivanta-vadodara", url: "https://logo.clearbit.com/tajhotels.com" },
  { id: "taj-vivanta-kevadia", url: "https://logo.clearbit.com/tajhotels.com" },
  { id: "fern-vadodara", url: "https://logo.clearbit.com/fernhotels.com" },
  { id: "fern-kevadia", url: "https://logo.clearbit.com/fernhotels.com" },
  { id: "fortune-vadodara", url: "https://logo.clearbit.com/fortunehotels.in" },
  { id: "fortune-kevadia", url: "https://logo.clearbit.com/fortunehotels.in" },
  { id: "sayaji", url: "https://logo.clearbit.com/sayajihotels.com" },
  { id: "suba", url: "https://logo.clearbit.com/subahotels.com" },
  { id: "spice-kraft", url: "https://logo.clearbit.com/spicekraft.com" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
         if(response.statusCode === 301 || response.statusCode === 302) {
            download(response.headers.location, dest).then(resolve).catch(reject);
            return;
         }
         const file = fs.createWriteStream(dest);
         response.pipe(file);
         file.on('finish', () => {
            file.close(resolve);
         });
      } else {
         fs.unlink(dest, () => {});
         reject(`Status ${response.statusCode}`);
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

async function run() {
  for (const client of clients) {
    const dest = path.join(__dirname, '..', 'public', 'images', 'clients', `${client.id}.png`);
    try {
      await download(client.url, dest);
      console.log(`Downloaded ${client.id}`);
    } catch (e) {
      console.log(`Failed ${client.id}: ${e}`);
    }
  }
}

run();
