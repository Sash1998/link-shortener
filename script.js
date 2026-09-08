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
    
    // Create the shortened link with hash
    const baseUrl = window.location.origin + window.location.pathname;
    const shortUrl = baseUrl + '#/' + shortCode;
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

// 🆕 CHECK IF THERE'S A SHORT LINK IN THE URL
function checkForShortLink() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
        const shortCode = hash.substring(2); // Remove '#/'
        const destination = links[shortCode];
        
        if (destination) {
            // Found the link! Show the ad page
            showAdPage(destination);
        } else {
            // Link not found
            document.body.innerHTML = `
                <div style="text-align:center;padding:50px;font-family:sans-serif;">
                    <h1>😕 Link Not Found</h1>
                    <p>This short link doesn't exist anymore.</p>
                    <a href="${window.location.origin + window.location.pathname}" style="color:#667eea;">Go to Home</a>
                </div>
            `;
        }
    }
}

// 🆕 SHOW THE AD PAGE
function showAdPage(destination) {
    // Replace the entire page with the ad page
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Watch Ad to Continue</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    padding: 20px;
                }
                .ad-container {
                    background: white;
                    border-radius: 30px;
                    padding: 60px 50px;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
                    animation: fadeIn 0.5s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .ad-icon { font-size: 4rem; margin-bottom: 20px; }
                h1 { color: #1a1a2e; font-size: 2rem; margin-bottom: 10px; }
                .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 30px; }
                .ad-box {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 30px;
                    border: 2px dashed #ddd;
                }
                .ad-box .emoji { font-size: 3rem; }
                .ad-box p { color: #333; margin-top: 10px; }
                .watch-btn {
                    display: inline-block;
                    padding: 18px 50px;
                    background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
                    color: #1a1a2e;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1.2rem;
                    border-radius: 50px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: 0 10px 30px rgba(247,151,30,0.3);
                    border: none;
                    cursor: pointer;
                }
                .watch-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 15px 40px rgba(247,151,30,0.5);
                }
                .watch-btn:active { transform: scale(0.95); }
                .timer {
                    color: #999;
                    font-size: 0.9rem;
                    margin-top: 20px;
                }
                .destination-link {
                    color: #667eea;
                    word-break: break-all;
                    font-size: 0.85rem;
                    margin-top: 15px;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 8px;
                }
                @media (max-width: 500px) {
                    .ad-container { padding: 40px 25px; }
                    h1 { font-size: 1.5rem; }
                    .watch-btn { padding: 15px 30px; font-size: 1rem; }
                }
            </style>
        </head>
        <body>
            <div class="ad-container">
                <div class="ad-icon">📺</div>
                <h1>WATCH AD TO CONTINUE</h1>
                <p class="subtitle">Click the button below to watch the ad and access your content</p>
                
                <div class="ad-box">
                    <div class="emoji">🎬</div>
                    <p><strong>Sponsored Content</strong><br>Watch this ad to unlock your content</p>
                </div>
                
                <button class="watch-btn" id="watchAdBtn">▶️ WATCH AD</button>
                <p class="timer" id="timerText">⏳ Click the button to continue</p>
                <div class="destination-link">📎 Destination: <span id="destDisplay">${destination}</span></div>
            </div>
            
            <script>
                const destination = '${destination}';
                const watchBtn = document.getElementById('watchAdBtn');
                const timerText = document.getElementById('timerText');
                const destDisplay = document.getElementById('destDisplay');
                
                // Show the destination
                destDisplay.textContent = destination;
                
                // When user clicks Watch Ad button
                watchBtn.addEventListener('click', function() {
                    // Open the ad in a new tab (CHANGE THIS TO YOUR AD LINK)
                    window.open('https://omg10.com/4/11754677', '_blank');
                    
                    // Open the destination in a new tab after a short delay
                    setTimeout(() => {
                        window.open(destination, '_blank');
                        timerText.textContent = '✅ Content opened! Check your other tabs.';
                        timerText.style.color = '#28a745';
                    }, 1000);
                });
            <\/script>
        </body>
        </html>
    `;
}

// Run the check when the page loads
checkForShortLink();

// Also check when the hash changes (for navigation)
window.addEventListener('hashchange', function() {
    window.location.reload();
});
