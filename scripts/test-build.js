// Quick build test
const { execSync } = require('child_process');

try {
  console.log('Testing build...');
  const output = execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
  console.log('✅ Build successful');
  
  // Check for any TypeScript errors
  if (output.includes('error') || output.includes('Error')) {
    console.log('⚠️  Build completed but with warnings/errors:');
    console.log(output);
  } else {
    console.log('✅ No build errors detected');
  }
} catch (error) {
  console.error('❌ Build failed:');
  console.error(error.stdout || error.message);
  process.exit(1);
}
