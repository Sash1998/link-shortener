// This is where we store all our links
let links = JSON.parse(localStorage.getItem('shortLinks')) || {};

// Get the elements from the page
const longUrlInput = document.getElementById('longUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortUrlSpan = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');

// When user clicks the Shorten button
shortenBtn.addEventListener('click', function() {
    const longUrl = longUrlInput.value.trim();
    
    // Check if the user pasted a link
    if (!longUrl) {
        alert('Please paste a link first!');
        return;
    }
    
    // Check if it's a valid URL
    try {
        new URL(longUrl);
    } catch {
        alert('Please enter a valid URL (include https://)');
        return;
    }
    
    // Create a short code (like abc123)
    const shortCode = generateShortCode();
    
    // Save the link
    links[shortCode] = longUrl;
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    // Show the shortened link
    const shortUrl = window.location.origin + '/' + shortCode;
    shortUrlSpan.textContent = shortUrl;
    resultDiv.style.display = 'block';
    
    // Clear the input
    longUrlInput.value = '';
});

// Copy button
copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(shortUrlSpan.textContent).then(function() {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    }).catch(function() {
        // Fallback for older browsers
        const range = document.createRange();
        range.selectNode(shortUrlSpan);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    });
});

// Press Enter key to shorten
longUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        shortenBtn.click();
    }
});

// Generate a random short code (6 characters)
function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
