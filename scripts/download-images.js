const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ig = new IgApiClient();

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  fs.writeFileSync(filepath, response.data);
}

async function main() {
  // Instagram credentials - you'll need to provide these
  const username = process.env.INSTAGRAM_USERNAME;
  const password = process.env.INSTAGRAM_PASSWORD;

  if (!username || !password) {
    console.error(
      'Please set INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD environment variables'
    );
    process.exit(1);
  }

  try {
    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    // Get user's media
    const user = await ig.user.searchExact('altajfurniture');
    const feed = ig.feed.user(user.pk);
    const items = await feed.items();

    // Download images
    for (const item of items) {
      if (item.image_versions2) {
        const imageUrl = item.image_versions2.candidates[0].url;
        const category = determineCategory(item.caption?.text || '');
        const filename = `${item.id}.jpg`;
        const filepath = path.join(
          __dirname,
          '../public/images',
          category,
          filename
        );

        console.log(`Downloading ${filename} to ${category}...`);
        await downloadImage(imageUrl, filepath);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function determineCategory(caption) {
  const captionLower = caption.toLowerCase();
  if (captionLower.includes('living room') || captionLower.includes('sofa'))
    return 'living-room';
  if (captionLower.includes('dining') || captionLower.includes('table'))
    return 'dining-room';
  if (captionLower.includes('bedroom') || captionLower.includes('bed'))
    return 'bedroom';
  if (captionLower.includes('office') || captionLower.includes('desk'))
    return 'office';
  return 'showroom';
}

main();
