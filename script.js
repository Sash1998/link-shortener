// ============================================
// DEBUG VERSION - This will show us what's wrong
// ============================================

console.log('🚀 SCRIPT STARTED - Debug Mode ON');

// Store all links
let links = JSON.parse(localStorage.getItem('shortLinks')) || {};
console.log('📦 Links loaded from storage:', links);

// Get elements
const longUrlInput = document.getElementById('longUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortUrlSpan = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');

console.log('📋 Elements found:', {
    longUrlInput: !!longUrlInput,
    shortenBtn: !!shortenBtn,
    resultDiv: !!resultDiv,
    shortUrlSpan: !!shortUrlSpan,
    copyBtn: !!copyBtn
});

// Shorten button
if (shortenBtn) {
    shortenBtn.addEventListener('click', function() {
        console.log('🖱️ Shorten button clicked');
        const longUrl = longUrlInput.value.trim();
        console.log('📎 URL entered:', longUrl);
        
        if (!longUrl) {
            console.log('❌ No URL entered');
            alert('Please paste a link first!');
            return;
        }
        
        try {
            new URL(longUrl);
            console.log('✅ URL is valid');
        } catch {
            console.log('❌ Invalid URL');
            alert('Please enter a valid URL (include https://)');
            return;
        }
        
        const shortCode = generateShortCode();
        console.log('🔑 Generated short code:', shortCode);
        
        links[shortCode] = longUrl;
        localStorage.setItem('shortLinks', JSON.stringify(links));
        console.log('💾 Saved to localStorage');
        
        const baseUrl = window.location.origin + window.location.pathname;
        const shortUrl = baseUrl + '#/' + shortCode;
        shortUrlSpan.textContent = shortUrl;
        resultDiv.style.display = 'block';
        longUrlInput.value = '';
        
        console.log('✅ Short URL created:', shortUrl);
    });
} else {
    console.log('❌ Shorten button NOT found!');
}

// Copy button
if (copyBtn) {
    copyBtn.addEventListener('click', function() {
        console.log('📋 Copy button clicked');
        navigator.clipboard.writeText(shortUrlSpan.textContent).then(function() {
            console.log('✅ Copied successfully');
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy';
            }, 2000);
        }).catch(function() {
            console.log('⚠️ Fallback copy method');
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
} else {
    console.log('❌ Copy button NOT found!');
}

// Enter key
if (longUrlInput) {
    longUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('⌨️ Enter key pressed');
            shortenBtn.click();
        }
    });
}

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
    console.log('🔍 Checking for short link in URL...');
    const hash = window.location.hash;
    console.log('📍 Current hash:', hash);
    
    if (hash && hash.startsWith('#/')) {
        const shortCode = hash.substring(2);
        console.log('🔑 Found short code:', shortCode);
        const destination = links[shortCode];
        console.log('🎯 Destination found:', destination);
        
        if (destination) {
            console.log('✅ Showing ad page');
            showAdPage(destination);
        } else {
            console.log('❌ Link not found in storage');
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
    } else {
        console.log('ℹ️ No short link in URL');
    }
}

// Show the ad page with debug info
function showAdPage(destination) {
    console.log('📄 Creating ad page...');
    console.log('🎯 Destination URL:', destination);
    
    // Check if ad script loads
    console.log('📢 Attempting to load ad script...');
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Page</title>
            
            <!-- DEBUG: Check if script loads -->
            <script>
                console.log('✅ Page HTML loaded');
                console.log('📍 Current URL:', window.location.href);
                console.log('🎯 Destination:', '${destination}');
            <\/script>
            
            <!-- POP-UNDER SCRIPT -->
            <script src="https://quge5.com/88/tag.min.js" data-zone="62085" async data-cfasync="false"
                onload="console.log('✅ Ad script loaded successfully!')"
                onerror="console.log('❌ Ad script FAILED to load!')">
            <\/script>
            
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
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h1 { color: #1a1a2e; font-size: 2rem; margin-bottom: 10px; }
                .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 30px; }
                .info-box {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 30px;
                    border: 2px dashed #ddd;
                }
                .info-box .emoji { font-size: 3rem; }
                .info-box p { color: #333; margin-top: 10px; }
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
                .debug-box {
                    margin-top: 20px;
                    padding: 15px;
                    background: #fff3cd;
                    border-radius: 8px;
                    border: 1px solid #ffc107;
                    text-align: left;
                    font-size: 0.85rem;
                }
                .debug-box strong {
                    color: #856404;
                }
                .debug-box .success {
                    color: #28a745;
                }
                .debug-box .error {
                    color: #dc3545;
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
                
                <div class="info-box">
                    <div class="emoji">🎯</div>
                    <p><strong>Download Now</strong><br>Your file is ready to download</p>
                </div>
                
                <!-- DOWNLOAD BUTTON -->
                <a href="${destination}" target="_blank" class="download-btn" onclick="console.log('🖱️ Download button clicked!');">
                    ⬇️ CLICK HERE TO DOWNLOAD
                </a>
                
                <p class="footer-text">⏳ Your download will start automatically</p>
                
                <div class="sponsored">
                    🔒 Secure Download • File Ready
                </div>
                
                <!-- DEBUG BOX - Shows status -->
                <div class="debug-box" id="debugBox">
                    <strong>🔍 Debug Status:</strong><br>
                    <span id="debugStatus">Checking...</span><br>
                    <span id="adStatus">Ad script: Loading...</span><br>
                    <span id="destStatus">Destination: <span class="success">${destination.substring(0, 50)}...</span></span>
                </div>
            </div>
            
            <script>
                // Update debug status
                document.getElementById('debugStatus').textContent = '✅ Page loaded successfully';
                document.getElementById('debugStatus').style.color = '#28a745';
                
                // Check if ad script loaded
                setTimeout(function() {
                    const adScripts = document.querySelectorAll('script[src*="quge5"]');
                    if (adScripts.length > 0) {
                        document.getElementById('adStatus').innerHTML = 'Ad script: <span class="success">✅ Script tag found in page</span>';
                    } else {
                        document.getElementById('adStatus').innerHTML = 'Ad script: <span class="error">❌ Script tag NOT found</span>';
                    }
                }, 1000);
                
                console.log('✅ Page fully loaded');
                console.log('🔗 Download button URL:', '${destination}');
            <\/script>
        </body>
        </html>
    `;
    
    console.log('✅ Ad page created');
}

// Run when page loads
console.log('🔄 Running checkForShortLink()');
checkForShortLink();

// Check when hash changes
window.addEventListener('hashchange', function() {
    console.log('🔄 Hash changed, reloading...');
    window.location.reload();
});

console.log('🚀 Script finished loading');
