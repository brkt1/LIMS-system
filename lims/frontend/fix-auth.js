/**
 * Quick fix for 401 authentication errors
 * Run this in your browser console to set a dummy auth token
 */

// Set dummy authentication tokens
localStorage.setItem('access_token', 'dev-token-123');
localStorage.setItem('refresh_token', 'dev-refresh-token-123');

console.log('✅ Authentication tokens set!');
console.log('🔄 Please refresh the page to retry API calls');

// Optional: Auto-refresh the page
// window.location.reload();
