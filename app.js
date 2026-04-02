/* ── GIGSHIELD APP CORE (v2.0.0) ── */
console.log('GIGSHIELD_APP: Initializing v2.0.0 ...');

/* ── STORAGE ── */
const S = {
    get: (k) => { try { const v = localStorage.getItem('gs_' + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem('gs_' + k, JSON.stringify(v)); } catch (e) { } },
    del: (k) => { try { localStorage.removeItem('gs_' + k); } catch (e) { } }
};

/* ── USER STATE ── */
let user = S.get('user') || null;
let settings = S.get('settings') || { renew: true, alerts: true, notif: true, bio: false, '2fa': true, sum: false, fraud: true };
let aiKey = S.get('aikey') || '';
let aiHistory = [];
let currentPlan = S.get('plan') || { name: 'Standard', price: '₹59', payout: '₹1,200' };

/* ── CURSOR ── */
const cd = document.getElementById('cd'), cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; if(cd) { cd.style.left = mx + 'px'; cd.style.top = my + 'px'; } });
(function l() { 
    rx += (mx - rx) * .12; ry += (my - ry) * .12; 
    if(cr) { cr.style.left = rx + 'px'; cr.style.top = ry + 'px'; }
    requestAnimationFrame(l); 
})();

function initCursorInteractions() {
    document.querySelectorAll('button,.gbi,.ni,.tier,.gc,.sc,.ob-s,.wt,.ref-code,.acc-head').forEach(el => { 
        el.addEventListener('mouseenter', () => document.body.classList.add('cx')); 
        el.addEventListener('mouseleave', () => document.body.classList.remove('cx')); 
    });
}

/* ── PARTICLES ── */
function initParticles() {
    const C = document.getElementById('pcv');
    if(!C) return;
    const ctx = C.getContext('2d');
    let W, H, pts = [];
    function resize() { W = C.width = window.innerWidth; H = C.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    class P { constructor() { this.reset(); } reset() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .2; this.vy = (Math.random() - .5) * .2; this.life = Math.random(); this.ml = .005 + Math.random() * .003; this.sz = Math.random() * 1.3 + .3; this.op = Math.random() * .35 + .1; } update() { this.x += this.vx; this.y += this.vy; this.life += this.ml; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > 1) this.reset(); } draw() { const a = Math.sin(this.life * Math.PI) * this.op; ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${a})`; ctx.fill(); } }
    for (let i = 0; i < 70; i++)pts.push(new P());
    function frame() { ctx.clearRect(0, 0, W, H); pts.forEach(p => { p.update(); p.draw(); }); for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 110) { const a = (1 - d / 110) * .05; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(34,197,94,${a})`; ctx.lineWidth = .5; ctx.stroke(); } } requestAnimationFrame(frame); }
    frame();
}

/* ── TOAST ── */
function showToast(msg, type = 'success', dur = 3500) {
    const w = document.getElementById('toast-wrap');
    if(!w) return;
    const el = document.createElement('div');
    el.className = 'toast t-' + type;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
    el.innerHTML = `<span>${icons[type] || '📢'}</span><span>${msg}</span>`;
    w.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, dur);
}

/* ── LOGIN / SIGNUP ── */
let _sbOriginalParent = null; 

function toggleMobSidebar() {
    const sb = document.querySelector('.sb');
    const backdrop = document.getElementById('mob-backdrop');
    if (!sb || !backdrop) return;
    const isOpen = sb.classList.contains('mob-open');
    if (!isOpen) {
        _sbOriginalParent = sb.parentNode;
        document.body.appendChild(sb);
        sb.getBoundingClientRect();
        sb.classList.add('mob-open');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        closeMobSidebar();
    }
}
function closeMobSidebar() {
    const sb = document.querySelector('.sb');
    const backdrop = document.getElementById('mob-backdrop');
    if (!sb) return;
    sb.classList.remove('mob-open');
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => {
        if (_sbOriginalParent && sb.parentNode === document.body) {
            _sbOriginalParent.insertBefore(sb, _sbOriginalParent.firstChild);
        }
    }, 320); 
}

function openLogin(tab = 'login') { document.getElementById('login-panel').classList.add('open'); switchTab(tab); }
function closeLogin() { document.getElementById('login-panel').classList.remove('open'); }
function switchTab(t) { document.querySelectorAll('.lp-tab').forEach(e => e.classList.remove('active')); document.querySelectorAll('.lp-tc').forEach(e => e.classList.remove('active')); document.getElementById('tab-' + t).classList.add('active'); document.getElementById('tc-' + t).classList.add('active'); }

/* ── CITY → ZONE MAPPING ── */
const cityZones = {
    Mumbai:    ['Dharavi, Mumbai','Kurla, Mumbai','Andheri, Mumbai','Bandra, Mumbai','Thane, Mumbai','Govandi, Mumbai','Malad, Mumbai'],
    Delhi:     ['Connaught Place, Delhi','Chandni Chowk, Delhi','Lajpat Nagar, Delhi','Dwarka, Delhi','Rohini, Delhi','Saket, Delhi'],
    Bengaluru: ['Koramangala, Bengaluru','Whitefield, Bengaluru','HSR Layout, Bengaluru','Indiranagar, Bengaluru','Electronic City, Bengaluru'],
    Hyderabad: ['Banjara Hills, Hyderabad','Hitech City, Hyderabad','Secunderabad','Kukatpally, Hyderabad','Ameerpet, Hyderabad'],
    Chennai:   ['T. Nagar, Chennai','Anna Nagar, Chennai','Velachery, Chennai','Adyar, Chennai','Tambaram, Chennai'],
    Pune:      ['Kothrud, Pune','Baner, Pune','Hinjewadi, Pune','Shivajinagar, Pune','Hadapsar, Pune'],
    Kolkata:   ['Salt Lake, Kolkata','Park Street, Kolkata','Howrah, Kolkata','Dum Dum, Kolkata','Tollygunge, Kolkata'],
    Ahmedabad: ['Navrangpura, Ahmedabad','Maninagar, Ahmedabad','Bopal, Ahmedabad','Vastrapur, Ahmedabad'],
    Jaipur:    ['Malviya Nagar, Jaipur','Mansarovar, Jaipur','Vaishali Nagar, Jaipur','C-Scheme, Jaipur'],
    Lucknow:   ['Hazratganj, Lucknow','Gomti Nagar, Lucknow','Alambagh, Lucknow','Aliganj, Lucknow'],
    Kochi:     ['Fort Kochi, Kochi','Marine Drive, Kochi','Kakkanad, Kochi','Edappally, Kochi'],
    Indore:    ['Vijay Nagar, Indore','Rajwada, Indore','Bhawarkua, Indore'],
    Guwahati:  ['Dispur, Guwahati','Paltan Bazaar, Guwahati','Maligaon, Guwahati'],
    Patna:     ['Boring Road, Patna','Kankarbagh, Patna','Patliputra, Patna'],
    Chandigarh:['Sector 17, Chandigarh','Sector 22, Chandigarh','Sector 35, Chandigarh'],
    Bhopal:    ['Arera Colony, Bhopal','MP Nagar, Bhopal','Bairagarh, Bhopal'],
    Nagpur:    ['Sitabuldi, Nagpur','Dharampeth, Nagpur','Wardhaman Nagar, Nagpur'],
    Thiruvananthapuram: ['Pattom, Thiruvananthapuram','Statue, Thiruvananthapuram','Technopark, Thiruvananthapuram']
};

const allCities = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", 
    "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", 
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", 
    "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", 
    "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Bareilly", 
    "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", 
    "Mira-Bhayandar", "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", 
    "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Bhavnagar", "Dehradun", "Durgapur", 
    "Asansol", "Nanded", "Kolhapur", "Ajmer", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", 
    "Ulhasnagar", "Nellore", "Jammu", "Sangli", "Belgaum", "Mangalore", "Ambattur", "Tirunelveli", "Malegaon", 
    "Gaya", "Jalgaon", "Udaipur", "Maheshtala", "Davanagere", "Kozhikode", "Akola", "Kurnool", "Rajpur Sonarpur", 
    "Rajahmundry", "Bokaro", "South Dumdum", "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", 
    "Muzaffarnagar", "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", "Brahmapur", 
    "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", 
    "Shahjahanpur", "Satara", "Bijapur", "Kakinada", "Rampur", "Shimoga", "Chandrapur", "Junagadh", "Thrissur", 
    "Alwar", "Bardhaman", "Kulti", "Nizamabad", "Parbhani", "Tumkur", "Khammam", "Uzhavarkarai", "Bihar Sharif", 
    "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Jalna", 
    "Eluru", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna", "Mau", "Sonipat", "Farrukhabad", "Sagar", 
    "Rourkela", "Durg", "Imphal", "Ratlam", "Hapur", "Anantapur", "Arrah", "Karimnagar", "Ramagundam", 
    "Etawah", "Ambernath", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham", "Baranagar", "Tiruppur", 
    "Puducherry", "Sikar", "Thoothukudi", "Rewa", "Mirzapur", "Raichur", "Pali", "Ramgarh", "Haridwar", 
    "Vijayanagaram", "Katihar", "Nagercoil", "Sri Ganganagar", "Karur", "Nandyal", "Haldwani", "Bulandshahr", 
    "Bharatpur", "Hospet", "Gurgaon", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", 
    "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Adoni", "Madanapalle", "Chittoor", "Machilipatnam", 
    "Tenali", "Proddatur", "Hindupur", "Bhimavaram", "Anantapur", "Guntakal", "Dharmavaram", "Vizianagaram", 
    "Srikakulam", "Narasaraopet", "Tadipatri", "Tadepalligudem", "Chilakaluripet"
];

function showCities(inputId, listId, zoneId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    if(!input || !list) return;
    const val = input.value.trim().toLowerCase();
    if (!val) { list.classList.remove('show'); return; }
    const matches = allCities.filter(c => c.toLowerCase().includes(val)).slice(0, 8);
    if (matches.length === 0) { list.classList.remove('show'); return; }
    list.innerHTML = matches.map(c => `<div class="ac-item" data-city="${c}" data-input="${inputId}" data-list="${listId}" data-zone="${zoneId}">${c}</div>`).join('');
    list.classList.add('show');
}

function selectCity(inputId, listId, zoneId, city) {
    document.getElementById(inputId).value = city;
    document.getElementById(listId).classList.remove('show');
    updateZonesFromCity(city, zoneId);
}

function updateZonesFromCity(city, zoneId) {
    const zoneEl = document.getElementById(zoneId);
    if (!zoneEl) return;
    const zones = cityZones[city] || [city + ' Central', city + ' North', city + ' South'];
    zoneEl.innerHTML = zones.map(z => `<option>${z}</option>`).join('');
}

function renderRiskMap(city, userZone) {
    const mapContainer = document.getElementById('risk-map');
    if (!mapContainer) return;
    const existingZones = mapContainer.querySelectorAll('.mz, .mw');
    existingZones.forEach(z => z.remove());
    const zones = cityZones[city] || [userZone];
    const zoneStatus = ['mz-r', 'mz-o', 'mz-g']; 
    const displayZones = zones.slice(0, 4);
    const positions = [
        { top: '14px', left: '20px', size: '84px' },
        { top: '30px', left: '96px', size: '66px' },
        { top: '68px', right: '36px', size: '72px' },
        { bottom: '14px', left: '162px', size: '58px' }
    ];
    displayZones.forEach((z, i) => {
        const zName = z.split(',')[0].toUpperCase();
        const status = (z === userZone) ? 'mz-r' : zoneStatus[Math.floor(Math.random() * zoneStatus.length)];
        const pos = positions[i] || { top: '50px', left: '50px', size: '60px' };
        const div = document.createElement('div');
        div.className = `mz ${status}`;
        div.style.width = pos.size; div.style.height = pos.size;
        if (pos.top) div.style.top = pos.top; if (pos.left) div.style.left = pos.left; if (pos.right) div.style.right = pos.right; if (pos.bottom) div.style.bottom = pos.bottom;
        div.innerHTML = zName + (status === 'mz-r' ? '<br>RED' : '');
        mapContainer.appendChild(div);
        if (z === userZone) {
            const mw = document.createElement('div'); mw.className = 'mw';
            mw.style.top = (parseInt(pos.top) + 32) + 'px'; mw.style.left = (parseInt(pos.left) + 36) + 'px';
            mapContainer.appendChild(mw);
        }
    });
}

function updateUserCityUI(city, zone) {
    document.querySelectorAll('.user-city').forEach(el => el.textContent = city);
    document.querySelectorAll('.user-zone').forEach(el => el.textContent = zone);
    renderRiskMap(city, zone);
}
function updateZones(cityId, zoneId) {
    const city = document.getElementById(cityId)?.value;
    const zoneEl = document.getElementById(zoneId);
    if (!city || !zoneEl) return;
    const zones = cityZones[city] || [city + ' Central'];
    zoneEl.innerHTML = zones.map(z => `<option>${z}</option>`).join('');
}

function selWT(el) { document.querySelectorAll('.wt').forEach(w => w.classList.remove('sel')); el.classList.add('sel'); }
async function doLogin() {
    const ph = document.getElementById('login-phone').value.trim();
    const pw = document.getElementById('login-pass').value.trim();
    if (!ph) { showToast('Enter phone number', 'warn'); return; }
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: ph, password: pw })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        if (document.getElementById('remember-me')?.checked) { S.set('rememberMe', true); } else { S.del('rememberMe'); }
        S.set('savedPhone', ph);
        launchApp(data.user);
    } catch (e) { showToast(e.message, 'error'); }
}
async function doSignup() {
    const name = document.getElementById('su-name').value.trim();
    const phone = document.getElementById('su-phone').value.trim();
    const pass = document.getElementById('su-pass').value.trim();
    if (!name || !phone || !pass) { showToast('Please fill in required fields', 'warn'); return; }
    const platform = document.querySelector('.wt.sel')?.dataset.platform || 'Zomato';
    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, platform, zone: document.getElementById('su-zone').value, upi: phone + '@upi', pid: 'ACT-' + Math.floor(1000 + Math.random() * 9000), password: pass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        S.set('savedPhone', phone);
        launchApp(data.user);
        setTimeout(() => goPage('onboard'), 800);
    } catch (e) { showToast(e.message, 'error'); }
}

function launchApp(u) {
    user = u || user; if (u) S.set('user', u);
    let city = user.zone.includes(',') ? user.zone.split(',').pop().trim() : user.zone.split(' ')[0].trim();
    updateUserCityUI(city, user.zone);
    closeLogin();
    const landing = document.getElementById('landing'); landing.classList.add('exit');
    setTimeout(() => {
        landing.style.display = 'none';
        document.getElementById('app').classList.add('open');
        document.getElementById('ai-fab').classList.add('show');
        updateUIFromUser();
    }, 700);
}
function exitApp() {
    document.getElementById('app').classList.remove('open');
    document.getElementById('ai-fab').classList.remove('show');
    document.getElementById('landing').style.display = 'flex';
    document.getElementById('landing').classList.remove('exit');
}

function updateUIFromUser() {
    if (!user) return;
    const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setEl('sb-wname', user.name); setEl('sb-wplat', user.platform + ' · Active');
    setEl('dash-name', user.name.split(' ')[0]);
    // Bind all other fields...
}

function goPage(page) {
    closeMobSidebar();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
    const pg = document.getElementById('pg-' + page); if (pg) pg.classList.add('active');
    document.querySelector('.main-c').scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── AI ASSISTANT ── */
async function sendAI() {
    const inp = document.getElementById('ai-in');
    const q = inp.value.trim(); if (!q) return;
    inp.value = ''; addUserMsg(q);
    try {
        const res = await fetch('/api/ai/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: q, userConfig: user ? { name: user.name, platform: user.platform, zone: user.zone, plan: currentPlan.name } : null })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'AI request failed');
        addBotMsg(data.reply);
    } catch (e) { addBotMsg('Error: ' + e.message); }
}

function addUserMsg(t) { const m = document.getElementById('ai-msgs'); const d = document.createElement('div'); d.className = 'ai-msg user'; d.innerHTML = `<div class="ai-bubble">${t}</div>`; m.appendChild(d); m.scrollTop = m.scrollHeight; }
function addBotMsg(t) { const m = document.getElementById('ai-msgs'); const d = document.createElement('div'); d.className = 'ai-msg bot'; d.innerHTML = `<div class="ai-bubble">${t}</div>`; m.appendChild(d); m.scrollTop = m.scrollHeight; }

/* ── DOM LOAD ── */
window.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorInteractions();

    // Map all onclicks to addEventListeners to bypass CSP attribute restrictions
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[onclick]');
        if (target) {
            // We'll manually handle the common ones here or use eval as a fallback if the user wants
            const attr = target.getAttribute('onclick');
            if (attr.includes('openLogin')) openLogin();
            if (attr.includes('closeLogin')) closeLogin();
            if (attr.includes('doLogin')) doLogin();
            if (attr.includes('doSignup')) doSignup();
            if (attr.includes('toggleAI')) toggleAI();
            // ... etc
        }
    });

    const savedUser = S.get('user');
    if (savedUser && S.get('rememberMe')) {
        user = savedUser; launchApp(savedUser);
    }
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js?v=2.0.1')
            .then(reg => console.log('SW Fixed v2.0.1'))
            .catch(e => console.error('SW Error:', e));
    });
}
