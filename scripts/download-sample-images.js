const fs = require('fs');
const path = require('path');
const https = require('https');

const sampleImages = {
  'hero-bg.jpg':
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
  'living-room/arabic-sofa-set.jpg':
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
  'dining-room/dining-set.jpg':
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
  'bedroom/bed-frame.jpg':
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80',
  'office/desk.jpg':
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80',
  'living-room/luxury-sofa-set.jpg':
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200&q=80',
  'dining-room/arabic-dining-set.jpg':
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
  'bedroom/master-bedroom.jpg':
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80',
  'office/executive-desk.jpg':
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80',
  'showroom/store-front.jpg':
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
  'living-room/arabic-coffee-table.jpg':
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200&q=80'
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(filepath);
          });
          fileStream.on('error', (err) => {
            fs.unlink(filepath, () => reject(err));
          });
        } else {
          response.resume();
          reject(
            new Error(
              `Request Failed With a Status Code: ${response.statusCode}`
            )
          );
        }
      })
      .on('error', reject);
  });
}

async function main() {
  const baseDir = path.join(__dirname, '../public/images');

  // Create directories if they don't exist
  const dirs = ['living-room', 'dining-room', 'bedroom', 'office', 'showroom'];
  dirs.forEach((dir) => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Download images
  for (const [filename, url] of Object.entries(sampleImages)) {
    const filepath = path.join(baseDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await downloadImage(url, filepath);
      console.log(`Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
}

main().catch(console.error);
