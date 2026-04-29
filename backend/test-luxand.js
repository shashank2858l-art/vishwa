require('dotenv').config();

const LUXAND_BASE_URL = 'https://api.luxand.cloud';
const token = process.env.LUXAND_API_KEY;

async function test() {
  console.log('Testing Luxand API v2 endpoints...');
  try {
    // 1. Create person and adding face
    console.log('\nCreating person and adding face...');
    const formData = new FormData();
    formData.append('name', 'admin_999');
    formData.append('store', '1');
    formData.append('photos', new Blob([Buffer.from('dummy data')], { type: 'image/jpeg' }), 'face.jpg');
    
    const res2 = await fetch(`${LUXAND_BASE_URL}/v2/person`, {
      method: 'POST',
      headers: { token },
      body: formData
    });
    console.log('Create status:', res2.status);
    console.log('Create result:', await res2.text());

    // 2. Search
    console.log('\nSearching photo...');
    const res3 = await fetch(`${LUXAND_BASE_URL}/photo/search/v2`, {
      method: 'POST',
      headers: { token },
      body: formData
    });
    console.log('Search result:', await res3.text());

    // 3. List persons
    console.log('\nListing persons...');
    const res1 = await fetch(`${LUXAND_BASE_URL}/v2/person`, {
      headers: { token }
    });
    console.log('Persons:', await res1.text());

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
