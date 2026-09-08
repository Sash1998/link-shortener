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

// Show the ad page with WORKING AD
function showAdPage(destination) {
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Page</title>
            
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    padding: 20px;
                }
                .container {
                    background: white;
                    border-radius: 30px;
                    padding: 60px 50px;
                    max-width: 600px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
                    animation: fadeIn 0.5s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h1 { color: #1a1a2e; font-size: 2rem; margin-bottom: 10px; }
                .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 30px; }
                .ad-container {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 25px;
                    border: 2px solid #e0e0e0;
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .ad-container img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
                .ad-label {
                    color: #999;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }
                .download-btn {
                    display: inline-block;
                    padding: 18px 50px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1.2rem;
                    border-radius: 50px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
                    cursor: pointer;
                    border: none;
                    width: 100%;
                    max-width: 300px;
                }
                .download-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 15px 40px rgba(40, 167, 69, 0.5);
                }
                .download-btn:active { transform: scale(0.95); }
                .footer-text { color: #999; font-size: 0.9rem; margin-top: 20px; }
                .sponsored {
                    margin-top: 15px;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 8px;
                    color: #888;
                    font-size: 0.8rem;
                }
                .popunder-attempt {
                    margin-top: 15px;
                    padding: 10px;
                    background: #fff3cd;
                    border-radius: 8px;
                    border-left: 4px solid #ffc107;
                    color: #856404;
                    font-size: 0.85rem;
                }
                @media (max-width: 500px) {
                    .container { padding: 40px 25px; }
                    h1 { font-size: 1.5rem; }
                    .download-btn { padding: 15px 30px; font-size: 1rem; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">📥</div>
                <h1>Your Content is Ready!</h1>
                <p class="subtitle">Click the button below to start your download</p>
                
                <!-- ADVERTISEMENT SECTION -->
                <div class="ad-container">
                    <div class="ad-label">📢 Sponsored Content</div>
                    <!-- This is a sample ad - Replace with your actual ad code -->
                    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;border-radius:10px;width:100%;color:white;">
                        <div style="font-size:2rem;">🎯</div>
                        <p style="margin-top:10px;font-weight:600;">Visit Our Sponsor</p>
                        <p style="font-size:0.85rem;opacity:0.9;">Support this free service by visiting our sponsor</p>
                        <a href="https://omg10.com/4/6594248" target="_blank" style="display:inline-block;margin-top:10px;padding:10px 30px;background:white;color:#667eea;text-decoration:none;border-radius:50px;font-weight:600;font-size:0.9rem;">
                            Learn More →
                        </a>
                    </div>
                </div>
                
                <!-- DOWNLOAD BUTTON -->
                <a href="${destination}" target="_blank" class="download-btn">
                    ⬇️ CLICK HERE TO DOWNLOAD
                </a>
                
                <p class="footer-text">⏳ Your download will start automatically</p>
                
                <div class="sponsored">
                    🔒 Secure Download • File Ready
                </div>
                
                <!-- Pop-under script attempt -->
                <div class="popunder-attempt">
                    <strong>💡 Pop-Under Notice:</strong> 
                    Your pop-under script is being loaded in the background. 
                    If it doesn't work, try allowing pop-ups for this site.
                </div>
            </div>
            
            <!-- POP-UNDER SCRIPT (Loads in background) -->
            <script src="https://quge5.com/88/tag.min.js" data-zone="62085" async data-cfasync="false">
            <\/script>
            
            <script>
                // Alternative: Try to load the script via JavaScript if the script tag fails
                console.log('🔄 Attempting to load pop-under script...');
                
                // Check if the script loaded
                setTimeout(function() {
                    const scripts = document.querySelectorAll('script[src*="quge5"]');
                    if (scripts.length > 0) {
                        console.log('✅ Pop-under script tag found in page');
                    } else {
                        console.log('❌ Pop-under script tag NOT found');
                        // Try loading it dynamically
                        const script = document.createElement('script');
                        script.src = 'https://quge5.com/88/tag.min.js';
                        script.dataset.zone = '62085';
                        script.async = true;
                        script.setAttribute('data-cfasync', 'false');
                        document.head.appendChild(script);
                        console.log('🔄 Dynamically loaded pop-under script');
                    }
                }, 2000);
            <\/script>
        </body>
        </html>
    `;
}

// Run when page loads
checkForShortLink();

// Check when hash changes
window.addEventListener('hashchange', function() {
    window.location.reload();
});
