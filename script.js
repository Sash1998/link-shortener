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
            showAdPage(destination, shortCode);
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

// Show the ad page with two-step system
function showAdPage(destination, shortCode) {
    // Check if user has already watched the ad
    const adWatched = localStorage.getItem('adWatched_' + shortCode) === 'true';
    
    document.body.innerHTML = `
        <div style="font-family:-apple-system,sans-serif;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:20px;margin:0;">
            <div style="background:white;border-radius:30px;padding:60px 50px;max-width:550px;width:100%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.5);">
                <div style="font-size:4rem;margin-bottom:20px;">${adWatched ? '🎉' : '📺'}</div>
                <h1 style="color:#1a1a2e;font-size:2rem;margin-bottom:10px;">${adWatched ? 'Ready to Download!' : 'Watch Ad to Continue'}</h1>
                <p style="color:#666;font-size:1.1rem;margin-bottom:30px;">${adWatched ? 'Your content is now ready for download' : 'Click the button below to watch the ad'}</p>
                
                <div style="background:#f8f9fa;border-radius:15px;padding:30px;margin-bottom:30px;border:2px dashed #ddd;">
                    <div style="font-size:3rem;">${adWatched ? '✅' : '🎬'}</div>
                    <p style="color:#333;margin-top:10px;"><strong>${adWatched ? 'Access Granted!' : 'Sponsored Content'}</strong><br>${adWatched ? 'Click the button below to start your download' : 'Watch this ad to unlock your content'}</p>
                </div>
                
                <button id="actionBtn" style="padding:18px 50px;background:${adWatched ? 'linear-gradient(135deg,#28a745 0%,#20c997 100%)' : 'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)'};color:${adWatched ? 'white' : '#1a1a2e'};border:none;font-weight:700;font-size:1.2rem;border-radius:50px;cursor:pointer;transition:transform 0.3s, box-shadow 0.3s;box-shadow:0 10px 30px ${adWatched ? 'rgba(40,167,69,0.3)' : 'rgba(247,151,30,0.3)'};width:100%;max-width:300px;">
                    ${adWatched ? '⬇️ START DOWNLOAD' : '▶️ WATCH AD'}
                </button>
                <p id="statusText" style="color:#999;font-size:0.9rem;margin-top:20px;">${adWatched ? 'Click the button to get your content' : 'Click the button to watch the ad'}</p>
                
                ${!adWatched ? `
                    <div style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px;border-left:4px solid #ffc107;">
                        <p style="color:#856404;font-size:0.85rem;margin:0;">📌 After watching the ad, come back here and the button will change to "START DOWNLOAD"</p>
                    </div>
                ` : `
                    <div style="margin-top:20px;padding:15px;background:#d4edda;border-radius:8px;border-left:4px solid #28a745;">
                        <p style="color:#155724;font-size:0.85rem;margin:0;">✅ You've already watched the ad! Click the button to download.</p>
                    </div>
                `}
            </div>
        </div>
        
        <script>
            const destination = '${destination}';
            const shortCode = '${shortCode}';
            const actionBtn = document.getElementById('actionBtn');
            const statusText = document.getElementById('statusText');
            let adWatched = ${adWatched};
            
            actionBtn.addEventListener('click', function() {
                if (!adWatched) {
                    // FIRST CLICK - Watch the ad
                    actionBtn.disabled = true;
                    actionBtn.textContent = '⏳ Opening Ad...';
                    actionBtn.style.opacity = '0.6';
                    statusText.textContent = '⏳ Opening ad in a new tab...';
                    statusText.style.color = '#f7971e';
                    
                    // Open the ad link
                    window.open('https://omg10.com/4/6594248', '_blank');
                    
                    // Store that user watched the ad
                    localStorage.setItem('adWatched_' + shortCode, 'true');
                    
                    // Change button after a delay (user comes back)
                    setTimeout(() => {
                        actionBtn.disabled = false;
                        actionBtn.textContent = '🔄 Reload to Continue';
                        actionBtn.style.opacity = '1';
                        actionBtn.style.background = 'linear-gradient(135deg,#28a745 0%,#20c997 100%)';
                        actionBtn.style.color = 'white';
                        actionBtn.style.boxShadow = '0 10px 30px rgba(40,167,69,0.3)';
                        statusText.textContent = '✅ Ad opened! Refresh this page to see the download button.';
                        statusText.style.color = '#28a745';
                        
                        // Add a reload button
                        const reloadBtn = document.createElement('button');
                        reloadBtn.textContent = '🔄 Click here to refresh';
                        reloadBtn.style.cssText = 'display:block;margin:15px auto;padding:12px 30px;background:#667eea;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer;';
                        reloadBtn.onclick = function() {
                            window.location.reload();
                        };
                        actionBtn.parentNode.insertBefore(reloadBtn, actionBtn.nextSibling);
                        
                        // Update the page content to show "Ready to Download"
                        document.querySelector('h1').textContent = 'Ready to Download!';
                        document.querySelector('h1').style.color = '#28a745';
                        document.querySelector('.ad-container .emoji').textContent = '🎉';
                        document.querySelector('.ad-box p strong').textContent = 'Access Granted!';
                        document.querySelector('.ad-box p').innerHTML = '<strong>Access Granted!</strong><br>Refresh the page to download your content';
                    }, 3000);
                    
                } else {
                    // SECOND CLICK - Download the content
                    actionBtn.disabled = true;
                    actionBtn.textContent = '⏳ Opening...';
                    actionBtn.style.opacity = '0.6';
                    statusText.textContent = '⏳ Opening your content...';
                    statusText.style.color = '#28a745';
                    
                    // Open the destination
                    window.open(destination, '_blank');
                    
                    setTimeout(() => {
                        statusText.textContent = '✅ Content opened! Check your other tab.';
                        statusText.style.color = '#28a745';
                        actionBtn.textContent = '✅ Opened!';
                    }, 1000);
                }
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
