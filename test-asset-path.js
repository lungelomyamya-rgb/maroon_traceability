const { getAssetPath } = require('./lib/utils/assetPath.ts');

console.log('Testing getAssetPath:');
console.log('Input: /images/maroon-logo.png');
console.log('Output:', getAssetPath('/images/maroon-logo.png'));
console.log('Window hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
