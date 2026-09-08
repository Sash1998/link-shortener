// Store all links
let links = JSON.parse(localStorage.getItem('shortLinks')) || {};

// Get elements
const longUrlInput = document.getElementById('longUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortUrlSpan = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');

// Shorten button
shortenBtn.addEventListener('click', function() {
    const longUrl = longUrlInput.value.trim();
    
    if (!longUrl) {
        alert('Please paste a link first!');
        return;
    }
    
    try {
        new URL(longUrl);
    } catch {
        alert('Please enter a valid URL (include https://)');
        return;
    }
    
    const shortCode = generateShortCode();
    links[shortCode] = longUrl;
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    const baseUrl = window.location.origin + window.location.pathname;
    const shortUrl = baseUrl + '#/' + shortCode;
    shortUrlSpan.textContent = shortUrl;
    resultDiv.style.display = 'block';
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

// Enter key
longUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        shortenBtn.click();
    }
});

// Generate short code
function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Check for short link in URL
function checkForShortLink() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
        const shortCode = hash.substring(2);
        const destination = links[shortCode];
        
        if (destination) {
            showAdPage(destination);
        } else {
            document.body.innerHTML = `
                <div style="text-align:center;padding:50px;font-family:sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;justify-content:center;align-items:center;margin:0;">
                    <div style="background:white;padding:40px;border-radius:20px;max-width:400px;">
                        <h1>😕 Link Not Found</h1>
                        <p>This short link doesn't exist anymore.</p>
                        <a href="${window.location.origin + window.location.pathname}" style="color:#667eea;text-decoration:none;display:inline-block;margin-top:15px;padding:10px 20px;background:#667eea;color:white;border-radius:8px;">Go to Home</a>
                    </div>
                </div>
            `;
        }
    }
}

// Show the ad page with YOUR ad link
function showAdPage(destination) {
    document.body.innerHTML = `
        <div style="font-family:-apple-system,sans-serif;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:20px;margin:0;">
            <div style="background:white;border-radius:30px;padding:60px 50px;max-width:500px;width:100%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.5);">
                <div style="font-size:4rem;margin-bottom:20px;">📺</div>
                <h1 style="color:#1a1a2e;font-size:2rem;margin-bottom:10px;">WATCH AD TO CONTINUE</h1>
                <p style="color:#666;font-size:1.1rem;margin-bottom:30px;">Click the button below to watch the ad and access your content</p>
                
                <div style="background:#f8f9fa;border-radius:15px;padding:30px;margin-bottom:30px;border:2px dashed #ddd;">
                    <div style="font-size:3rem;">🎬</div>
                    <p style="color:#333;margin-top:10px;"><strong>Sponsored Content</strong><br>Watch this ad to unlock your content</p>
                </div>
                
                <button id="watchAdBtn" style="padding:18px 50px;background:linear-gradient(135deg,#f7971e 0%,#ffd200 100%);color:#1a1a2e;border:none;font-weight:700;font-size:1.2rem;border-radius:50px;cursor:pointer;transition:transform 0.3s;box-shadow:0 10px 30px rgba(247,151,30,0.3);">▶️ WATCH AD</button>
                <p id="statusText" style="color:#999;font-size:0.9rem;margin-top:20px;">⏳ Click the button to continue</p>
            </div>
        </div>
        
        <script>
            // Store the destination link (hidden from users)
            const destination = '${destination}';
            const watchBtn = document.getElementById('watchAdBtn');
            const statusText = document.getElementById('statusText');
            
            // When the WATCH AD button is clicked
            watchBtn.addEventListener('click', function() {
                // Disable the button to prevent multiple clicks
                watchBtn.disabled = true;
                watchBtn.style.opacity = '0.6';
                watchBtn.textContent = '⏳ Opening...';
                statusText.textContent = '⏳ Opening ad and content...';
                statusText.style.color = '#f7971e';
                
                // Open YOUR ad link in a NEW TAB
                window.open('https://omg10.com/4/6594248', '_blank');
                
                // Wait 2 seconds then open the destination in a NEW TAB
                setTimeout(function() {
                    window.open(destination, '_blank');
                    statusText.textContent = '✅ Done! Check your other tabs.';
                    statusText.style.color = '#28a745';
                    watchBtn.textContent = '✅ Opened!';
                }, 2000);
            });
        <\/script>
    `;
}

// Run when page loads
checkForShortLink();

// Check when hash changes
window.addEventListener('hashchange', function() {
    window.location.reload();
});
