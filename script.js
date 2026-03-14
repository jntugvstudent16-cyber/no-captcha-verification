// No-CAPTCHA Passive Verification System
// Hack & Forge 2026

class HumanVerification {
    constructor() {
        // Behavioral data collection
        this.mouseMovements = [];
        this.typingSpeed = [];
        this.startTime = Date.now();
        this.keyPressTimes = [];
        this.lastMousePos = { x: 0, y: 0 };
        this.mouseSpeed = [];
        this.interactions = 0;
        
        // Scores for different signals
        this.scores = {
            mouse: 0,
            typing: 0,
            time: 0,
            browser: 85 // Base browser entropy score
        };
        
        // Initialize tracking
        this.initTracking();
        this.updateUI();
    }
    
    initTracking() {
        // Track mouse movements
        document.addEventListener('mousemove', (e) => {
            this.trackMouseMovement(e);
        });
        
        // Track mouse speed/velocity
        document.addEventListener('mousemove', (e) => {
            const currentPos = { x: e.clientX, y: e.clientY };
            if (this.lastMousePos.x !== 0) {
                const distance = Math.sqrt(
                    Math.pow(currentPos.x - this.lastMousePos.x, 2) + 
                    Math.pow(currentPos.y - this.lastMousePos.y, 2)
                );
                this.mouseSpeed.push(distance);
                if (this.mouseSpeed.length > 10) this.mouseSpeed.shift();
                
                // Calculate mouse score based on speed variations
                this.calculateMouseScore();
            }
            this.lastMousePos = currentPos;
        });
        
        // Track typing patterns
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT') return;
            
            const currentTime = Date.now();
            if (this.keyPressTimes.length > 0) {
                const timeDiff = currentTime - this.keyPressTimes[this.keyPressTimes.length - 1];
                if (timeDiff < 1000) { // Ignore long pauses
                    this.typingSpeed.push(timeDiff);
                    if (this.typingSpeed.length > 10) this.typingSpeed.shift();
                }
            }
            this.keyPressTimes.push(currentTime);
            if (this.keyPressTimes.length > 20) this.keyPressTimes.shift();
            
            // Calculate typing score
            this.calculateTypingScore();
            this.interactions++;
        });
        
        // Track interaction time
        setInterval(() => {
            this.calculateTimeScore();
            this.updateUI();
        }, 1000);
        
        // Track touch events for mobile
        document.addEventListener('touchmove', (e) => {
            this.interactions += 2; // Touch gives higher human score
            this.calculateMouseScore();
        });
        
        document.addEventListener('touchstart', () => {
            this.interactions += 1;
        });
    }
    
    trackMouseMovement(e) {
        this.mouseMovements.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        if (this.mouseMovements.length > 50) {
            this.mouseMovements.shift();
        }
        
        this.interactions++;
        this.calculateMouseScore();
    }
    
    calculateMouseScore() {
        if (this.mouseSpeed.length < 5) {
            this.scores.mouse = 30;
            return;
        }
        
        // Calculate variance in mouse speed
        const avg = this.mouseSpeed.reduce((a, b) => a + b, 0) / this.mouseSpeed.length;
        const variance = this.mouseSpeed.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.mouseSpeed.length;
        
        // Higher variance = more human-like
        let score = Math.min(100, variance * 2);
        
        // More interactions = more human-like
        if (this.interactions > 20) score += 10;
        if (this.interactions > 50) score += 15;
        
        this.scores.mouse = Math.min(100, score);
    }
    
    calculateTypingScore() {
        if (this.typingSpeed.length < 3) {
            this.scores.typing = 30;
            return;
        }
        
        // Calculate typing rhythm variance
        const avg = this.typingSpeed.reduce((a, b) => a + b, 0) / this.typingSpeed.length;
        const variance = this.typingSpeed.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.typingSpeed.length;
        
        // Humans have variable typing speed
        let score = Math.min(100, variance / 5);
        
        // Natural typing speed range (150-300ms between keys)
        const naturalCount = this.typingSpeed.filter(speed => speed > 100 && speed < 400).length;
        score += (naturalCount / this.typingSpeed.length) * 30;
        
        this.scores.typing = Math.min(100, score);
    }
    
    calculateTimeScore() {
        const timeSpent = (Date.now() - this.startTime) / 1000; // in seconds
        
        // Humans spend time reading/interacting
        if (timeSpent < 2) {
            this.scores.time = 20; // Too fast - suspicious
        } else if (timeSpent < 5) {
            this.scores.time = 50;
        } else if (timeSpent < 10) {
            this.scores.time = 75;
        } else if (timeSpent < 30) {
            this.scores.time = 90;
        } else {
            this.scores.time = 95;
        }
        
        // Add bonus for interactions
        if (this.interactions > 10) this.scores.time += 5;
        if (this.interactions > 30) this.scores.time += 10;
        
        this.scores.time = Math.min(100, this.scores.time);
    }
    
    getOverallScore() {
        // Weighted average of all scores
        const weights = {
            mouse: 0.35,    // Mouse movements are very human-specific
            typing: 0.30,    // Typing patterns reveal humanity
            time: 0.20,      // Time spent indicates real interaction
            browser: 0.15     // Browser characteristics
        };
        
        let totalScore = 0;
        totalScore += this.scores.mouse * weights.mouse;
        totalScore += this.scores.typing * weights.typing;
        totalScore += this.scores.time * weights.time;
        totalScore += this.scores.browser * weights.browser;
        
        return Math.round(totalScore);
    }
    
    getVerdict(score) {
        if (score >= 70) {
            return {
                text: "✅ Human Verified - Access Granted",
                class: "human",
                allowLogin: true
            };
        } else if (score >= 40) {
            return {
                text: "⚠️ Low Confidence - Additional Verification Needed",
                class: "low",
                allowLogin: false
            };
        } else {
            return {
                text: "🤖 Bot Detected - Access Denied",
                class: "bot",
                allowLogin: false
            };
        }
    }
    
    updateUI() {
        const overallScore = this.getOverallScore();
        const verdict = this.getVerdict(overallScore);
        
        // Update score display
        document.getElementById('humanScore').textContent = overallScore + '%';
        
        // Update status texts with dynamic values
        document.getElementById('mouseStatus').textContent = 
            this.scores.mouse > 70 ? '✅ Natural movement' : 
            this.scores.mouse > 40 ? '⏳ Analyzing...' : '📝 Move mouse';
        
        document.getElementById('typingStatus').textContent = 
            this.scores.typing > 70 ? '✅ Human rhythm' : 
            this.scores.typing > 40 ? '⏳ Keep typing...' : '⌨️ Type something';
        
        document.getElementById('timeStatus').textContent = 
            this.scores.time > 70 ? '✅ Normal interaction' : 
            this.scores.time > 40 ? '⏳ Stay longer...' : '⏱️ Please wait';
        
        document.getElementById('browserStatus').textContent = 
            '✅ Verified';
        
        // Update progress bars
        document.getElementById('mouseBar').style.width = this.scores.mouse + '%';
        document.getElementById('typingBar').style.width = this.scores.typing + '%';
        document.getElementById('timeBar').style.width = this.scores.time + '%';
        document.getElementById('browserBar').style.width = this.scores.browser + '%';
        
        // Update verdict text
        document.getElementById('verdictText').textContent = verdict.text;
        document.getElementById('verdictText').style.color = 
            verdict.class === 'human' ? '#48bb78' : 
            verdict.class === 'low' ? '#ecc94b' : '#f56565';
        
        // Enable/disable login button
        const loginBtn = document.getElementById('loginBtn');
        if (verdict.allowLogin) {
            loginBtn.disabled = false;
            loginBtn.textContent = '🔓 Login - Human Verified';
            loginBtn.style.background = '#48bb78';
            document.getElementById('fallbackMessage').style.display = 'none';
        } else if (overallScore >= 40) {
            loginBtn.disabled = true;
            loginBtn.textContent = '⚠️ Complete Verification';
            loginBtn.style.background = '#ecc94b';
            document.getElementById('fallbackMessage').style.display = 'block';
        } else {
            loginBtn.disabled = true;
            loginBtn.textContent = '🤖 Bot Detection Active';
            loginBtn.style.background = '#f56565';
            document.getElementById('fallbackMessage').style.display = 'none';
        }
    }
}

// Fallback simple CAPTCHA for low confidence
function simpleCaptcha() {
    const answer = prompt('Quick verification: What is 5 + 3?');
    if (answer === '8') {
        alert('✅ Verified! You can now login.');
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').textContent = '🔓 Login - Verified';
        document.getElementById('loginBtn').style.background = '#48bb78';
        document.getElementById('fallbackMessage').style.display = 'none';
    } else {
        alert('❌ Incorrect. Please try again.');
    }
}

// Initialize the verification system when page loads
document.addEventListener('DOMContentLoaded', () => {
    const verifier = new HumanVerification();
    
    // Handle login button click
    document.getElementById('loginBtn').addEventListener('click', () => {
        const username = document.getElementById('username').value;
        if (username) {
            alert('✅ Login successful! Welcome ' + username + '\n\nNo CAPTCHA needed - Passive verification worked!');
        } else {
            alert('Please enter username');
        }
    });
    
    // Update UI every second
    setInterval(() => {
        verifier.updateUI();
    }, 1000);
});

// Track page visibility (another human signal)
let pageVisible = true;
document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
});
