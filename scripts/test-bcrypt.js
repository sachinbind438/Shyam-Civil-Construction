// Test bcrypt performance
const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'Shyam@93245';
  const hash = '$2b$12$nGVHLVGjk3tbm5.lRF0wMusfsHleNVPoDC6SSg/jabgr7QCw6XSLC'; // Example hash
  
  console.log('Testing bcrypt comparison...');
  const start = Date.now();
  
  try {
    const isValid = await bcrypt.compare(password, hash);
    const end = Date.now();
    console.log(`✅ bcrypt.compare took ${end - start}ms, result: ${isValid}`);
  } catch (error) {
    console.error('❌ bcrypt error:', error);
  }
}

testBcrypt();
