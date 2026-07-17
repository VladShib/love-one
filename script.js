// --- КОД КНОПКИ ЛЮБЛЮ И МЕМОВ ---
const bgTypes = ['❤️', '💖', '💝', '💕', '🌸', '🐶', '🐕']; 
const rainTypes = ['❤️', '💖', '💝', '💕', '🏋️‍♀️', '🤸‍♀️', '🏃‍♀️', '💪', '👟', '🏐', '🏀', '🧔', '🧔‍♂️', '🐶', '🐕'];
const phrases = [
    "Джонник вредина!!!", "Влiд старый уже...", "Ыаыаыа сикс севен (аутизм)", "Какашки мне в кармашки",
    "Саша лучшая!!!", "Дашка какашка", "Владос понос", "Влад опаздывает на 20 минут", "Влiд не в прайме...",
    "Сашенька красивая очень!!!", "Это читает сигма вумен", "Любовь Морковь", "Бествей 💩", "И очень сильно! 🥰",
    "Тренер года! 💪", "Кто тут не в прайме???", "Турники и баскет (обожаюююю) (И тебя тоже! 🥰)",
    "Забыли сушибургер...", "Как можно было подскользнуться на ступеньках...", "Булочка с маком 🥰",
    "Ну крутая, ну моя!", "Воздуханчик", "Защекочу!!!", "Джонни мили", "ДДЖОННИ, Не ешь говно!!!",
    "Ох этот дуэт... Романтика", "Дима опять порвал резинку!", "Очень сильно тебя люблю!!!"
];
const photoUrls = [
    'photos/1.jpg', 'photos/2.jpg', 'photos/3.jpg', 'photos/4.jpg', 'photos/5.jpg',
    'photos/6.jpg', 'photos/7.jpg', 'photos/8.jpg', 'photos/9.jpg', 'photos/10.jpg', 
    'photos/11.jpg', 'photos/12.jpg', 'photos/13.jpg', 'photos/14.jpg', 'photos/15.jpg', 
    'photos/16.jpg', 'photos/17.jpg', 'photos/18.jpg', 'photos/19.jpg', 'photos/20.jpg',
    'photos/21.jpg', 'photos/22.jpg', 'photos/23.jpg', 'photos/24.jpg', 'photos/25.jpg', 
    'photos/26.jpg', 'photos/27.jpg', 'photos/28.jpg', 'photos/29.jpg', 'photos/30.jpg', 'photos/31.jpg'
];

const boomSound = new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3');
boomSound.volume = 0.6; 
let clickCount = 0; 

const bgContainer = document.getElementById('bgHeartsContainer');
function createBackgroundElement() {
    if (!bgContainer) return;
    const el = document.createElement('div');
    el.classList.add('bg-heart');
    el.innerText = bgTypes[Math.floor(Math.random() * bgTypes.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 22 + 15) + 'px';
    el.style.animationDuration = (Math.random() * 6 + 6) + 's'; 
    bgContainer.appendChild(el);
    setTimeout(() => { el.remove(); }, 12000);
}
setInterval(createBackgroundElement, 500);

const btn = document.getElementById('loveBtn');
const mainTitle = document.getElementById('mainTitle');

if (btn) {
    btn.addEventListener('click', (e) => {
        btn.blur(); 
        clickCount++;
        for (let i = 0; i < 45; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.classList.add('rain-heart');
                drop.innerText = rainTypes[Math.floor(Math.random() * rainTypes.length)];
                drop.style.left = Math.random() * 100 + 'vw';
                drop.style.top = '-50px';
                drop.style.setProperty('--drift', (Math.random() * 240 - 120) + 'px');
                drop.style.setProperty('--rotation', (Math.random() * 360) + 'deg');
                drop.style.setProperty('--scale', (Math.random() * 0.7 + 0.6));
                drop.style.animationDuration = (Math.random() * 1.5 + 1.3) + 's';
                document.body.appendChild(drop);
                setTimeout(() => { drop.remove(); }, 2500);
            }, i * 20);
        }

        const phraseForButton = phrases[Math.floor(Math.random() * phrases.length)];
        const phraseForTitle = phrases[Math.floor(Math.random() * phrases.length)];
        const phraseForScreen = phrases[Math.floor(Math.random() * phrases.length)];
        
        btn.innerText = phraseForButton;
        if(Math.random() < 0.4 && mainTitle) mainTitle.innerText = phraseForTitle;

        const floatingText = document.createElement('div');
        floatingText.classList.add('floating-phrase');
        floatingText.innerText = phraseForScreen;
        floatingText.style.left = (Math.random() * 60 + 10) + 'vw';
        floatingText.style.top = (Math.random() * 70 + 10) + 'vh';
        document.body.appendChild(floatingText);
        setTimeout(() => { floatingText.remove(); }, 2500);

        setTimeout(() => {
            if(btn.innerText === phraseForButton) btn.innerText = 'Люблю тебя ❤️';
            if(mainTitle && mainTitle.innerText === phraseForTitle) mainTitle.innerText = 'Для моей любимой Сашеньки';
        }, 3000);

        if(Math.random() < 0.25) {
            const meme = document.createElement('div');
            meme.classList.add('meme-67');
            meme.innerText = Math.random() < 0.5 ? "6 7" : "SIX SEVEN";
            const corners = [{top:'10vh', left:'10vw'}, {top:'10vh', right:'10vw'}, {bottom:'10vh', left:'10vw'}, {bottom:'10vh', right:'10vw'}];
            const chosenCorner = corners[Math.floor(Math.random() * corners.length)];
            if(chosenCorner.left) meme.style.left = chosenCorner.left;
            if(chosenCorner.right) meme.style.right = chosenCorner.right;
            if(chosenCorner.top) meme.style.top = chosenCorner.top;
            if(chosenCorner.bottom) meme.style.bottom = chosenCorner.bottom;
            document.body.appendChild(meme);
            setTimeout(() => { meme.remove(); }, 2000);
        }

        if(clickCount % 5 === 0) {
            boomSound.currentTime = 0;
            boomSound.play().catch(e => {});
            const img = document.createElement('img');
            img.classList.add('meme-photo');
            img.src = photoUrls[Math.floor(Math.random() * photoUrls.length)];
            img.style.left = (Math.random() * 50 + 15) + 'vw';
            img.style.top = (Math.random() * 50 + 15) + 'vh';
            document.body.appendChild(img);
            setTimeout(() => { img.remove(); }, 1500);
        }
    });
}

// --- КОД ПЕРЕКЛЮЧЕНИЯ ИНТЕРФЕЙСА МЕНЮ ---
const openMenuBtn = document.getElementById('openMenuBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const mainButtons = document.getElementById('mainButtons');
const gamesMenu = document.getElementById('gamesMenu');
const gameScreen = document.getElementById('gameScreen');

if (openMenuBtn) {
    openMenuBtn.addEventListener('click', () => {
        openMenuBtn.blur();
        if(mainButtons) mainButtons.style.display = 'none';
        if(gamesMenu) gamesMenu.style.display = 'flex';
        if(mainTitle) mainTitle.innerText = '🎯 Выбери игру';
    });
}

if (backToMainBtn) {
    backToMainBtn.addEventListener('click', () => {
        backToMainBtn.blur();
        if(gamesMenu) gamesMenu.style.display = 'none';
        if(mainButtons) mainButtons.style.display = 'flex';
        if(mainTitle) mainTitle.innerText = 'Для моей любимой Сашеньки';
    });
}

// --- ДВИЖОК МИНИ-ИГРЫ «ДОГОНИ ПЕПСУ» ---
const startPepsaBtn = document.getElementById('startPepsaBtn');
const gameExitBtn = document.getElementById('gameExitBtn');
const gameActualStartBtn = document.getElementById('gameActualStartBtn');
const gameRestartBtn = document.getElementById('gameRestartBtn');
const gameWinCloseBtn = document.getElementById('gameWinCloseBtn');

const runner = document.getElementById('runnerObj');
const pepsa = document.getElementById('pepsaObj');
const gameArea = document.getElementById('gameArea');
const distanceVal = document.getElementById('distanceVal');
const pepsaScoreContainer = document.getElementById('pepsaScoreContainer');

const pepsaMusic = new Audio('https://pub-c5e31b5cdafb419a91624d102b92794c.r2.dev/The%20Rah%20Band%20-%20Messages%20From%20The%20Stars.mp3');
pepsaMusic.loop = true;
pepsaMusic.volume = 0.5;
pepsaMusic.preload = "auto";

let isPlaying = false;
let distance = 0;
let isJumping = false;
let pepsaAnimFrameId = null;
let lastPepsaTime = 0;
let obstacleSpawnTimer = 0;
let obstacles = [];
let gameSpeed = 300; 
const targetDistance = 2000;

// Оригинальная классическая физика для Пепсы
let runnerY = 20;
let runnerVy = 0;
const gravity = -1400;  
const jumpForce = 520;  

if (startPepsaBtn) {
    startPepsaBtn.addEventListener('click', () => {
        startPepsaBtn.blur();
        document.getElementById('parkourCanvas').style.display = 'none';
        if(gameArea) gameArea.style.display = 'block';
        if(pepsaScoreContainer) pepsaScoreContainer.style.display = 'inline';
        if(gameScreen) gameScreen.style.display = 'flex';
        initGameStage();
        document.getElementById('gameStartOverlay').style.display = 'flex';
    });
}

if (gameExitBtn) {
    gameExitBtn.addEventListener('click', (e) => {
        gameExitBtn.blur();
        e.stopPropagation();
        stopGame();
        BestwayParkour.stop();
        if(gameScreen) gameScreen.style.display = 'none';
    });
}

if (gameActualStartBtn) {
    gameActualStartBtn.addEventListener('click', (e) => {
        gameActualStartBtn.blur();
        e.stopPropagation();
        document.getElementById('gameStartOverlay').style.display = 'none';
        startGame();
    });
}

if (gameRestartBtn) {
    gameRestartBtn.addEventListener('click', (e) => {
        gameRestartBtn.blur();
        e.stopPropagation();
        document.getElementById('gameOverOverlay').style.display = 'none';
        initGameStage(); 
        startGame();
    });
}

if (gameWinCloseBtn) {
    gameWinCloseBtn.addEventListener('click', (e) => {
        gameWinCloseBtn.blur();
        e.stopPropagation();
        document.getElementById('gameWinOverlay').style.display = 'none';
        if(gameScreen) gameScreen.style.display = 'none';
    });
}

// Прыжок в Пепсе — строго с земли, без двойных прыжков
function jump() {
    if (!isPlaying) return;
    if (isJumping) return; 
    isJumping = true;
    runnerVy = jumpForce;
}

function initGameStage() {
    stopGame(); 
    distance = 0;
    gameSpeed = 300; 
    runnerY = 20;
    runnerVy = 0;
    if(distanceVal) distanceVal.innerText = distance;
    if(runner) runner.style.bottom = '20px';
    if(pepsa) {
        pepsa.style.left = '180px';
        pepsa.innerText = '🐕';
    }
    isJumping = false; 
    obstacleSpawnTimer = 0;
    
    obstacles.forEach(o => { if(o.el) o.el.remove(); });
    obstacles = [];
    
    document.getElementById('gameStartOverlay').style.display = 'none';
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('gameWinOverlay').style.display = 'none';
}

function startGame() {
    isPlaying = true;
    pepsaMusic.currentTime = 0;
    pepsaMusic.play().catch(err => console.log("Браузер заблокировал аудио:", err));

    let pepsaPos = 180;
    let pepsaRunTimer = setInterval(() => {
        if(!isPlaying) { clearInterval(pepsaRunTimer); return; }
        pepsaPos += 7;
        if(pepsa) pepsa.style.left = pepsaPos + 'px';
        if (pepsaPos > window.innerWidth + 50) {
            clearInterval(pepsaRunTimer);
        }
    }, 20);

    lastPepsaTime = performance.now();
    pepsaAnimFrameId = requestAnimationFrame(pepsaGameLoop);
}

function pepsaGameLoop(timestamp) {
    if (!isPlaying) return;
    
    let dt = (timestamp - lastPepsaTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastPepsaTime = timestamp;

    distance += 100 * dt; 
    if(distanceVal) distanceVal.innerText = Math.floor(Math.min(distance, targetDistance));

    if (Math.floor(distance) % 100 === 0) gameSpeed += 5 * dt;

    if (isJumping) {
        runnerVy += gravity * dt;
        runnerY += runnerVy * dt;
        if (runnerY <= 20) {
            runnerY = 20;
            runnerVy = 0;
            isJumping = false;
        }
    }
    if (runner) runner.style.bottom = runnerY + 'px';

    obstacleSpawnTimer -= dt;
    if (obstacleSpawnTimer <= 0) {
        spawnPepsaObstacle();
        obstacleSpawnTimer = Math.random() * 1.5 + 1.2 - (gameSpeed / 1200);
        if (obstacleSpawnTimer < 0.8) obstacleSpawnTimer = 0.8;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed * dt;
        obs.el.style.left = obs.x + 'px';

        if (obs.x > 35 && obs.x < 85) {
            if (obs.type === 'pit') {
                if (runnerY <= 25) { endGame(false); return; }
            } else if (obs.type === 'poop') {
                if (runnerY > 60 && runnerY < 130) { endGame(false); return; }
            } else if (obs.type === 'dog' || obs.type === 'man') {
                if (runnerY < 60) { endGame(false); return; }
            }
        }

        if (obs.x < -60) {
            obs.el.remove();
            obstacles.splice(i, 1);
        }
    }

    if (distance >= targetDistance) {
        endGame(true);
        return;
    }

    pepsaAnimFrameId = requestAnimationFrame(pepsaGameLoop);
}

function spawnPepsaObstacle() {
    if (!isPlaying || !gameArea) return;

    let types = ['pit', 'poop', 'dog', 'man'];
    let chosenType = types[Math.floor(Math.random() * types.length)];
    
    const obsEl = document.createElement('div');
    obsEl.classList.add('obstacle');
    
    let obsX = window.innerWidth + 20;
    obsEl.style.left = obsX + 'px';

    if (chosenType === 'pit') {
        obsEl.innerText = '🕳️';
        obsEl.style.bottom = '10px';
    } else if (chosenType === 'poop') {
        obsEl.innerText = '💩';
        obsEl.style.bottom = '85px'; 
    } else if (chosenType === 'dog') {
        obsEl.innerText = '🐕‍🦺';
        obsEl.style.bottom = '20px';
        obsEl.classList.add('obs-dog'); 
    } else if (chosenType === 'man') {
        obsEl.innerText = '🧔';
        obsEl.style.bottom = '20px';
        obsEl.classList.add('obs-man'); 
    }

    gameArea.appendChild(obsEl);
    obstacles.push({ el: obsEl, x: obsX, type: chosenType });
}

function stopGame() {
    isPlaying = false;
    pepsaMusic.pause(); 
    if (pepsaAnimFrameId) { cancelAnimationFrame(pepsaAnimFrameId); pepsaAnimFrameId = null; }
}

function endGame(isWin) {
    stopGame();
    if (isWin) {
        if(pepsa) {
            pepsa.style.left = '95px';
            pepsa.innerText = '🥰🐕';
        }
        document.getElementById('gameWinOverlay').style.display = 'flex';
    } else {
        document.getElementById('gameOverOverlay').style.display = 'flex';
    }
}


// =========================================================
// --- ДВИЖОК МИНИ-ИГРЫ №4 «BESTWAY PARKOUR» С САЛЬТО ---
// =========================================================
const startParkourBtn = document.getElementById('startParkourBtn');

if (startParkourBtn) {
    startParkourBtn.addEventListener('click', () => {
        startParkourBtn.blur();
        if(gameArea) gameArea.style.display = 'none';
        if(pepsaScoreContainer) pepsaScoreContainer.style.display = 'none';
        document.getElementById('parkourCanvas').style.display = 'block';
        if(gameScreen) gameScreen.style.display = 'flex';
        BestwayParkour.start('parkourCanvas');
    });
}

const BestwayParkour = {
    canvas: null, ctx: null, gameState: 'idle', gameSpeed: 380, distanceTraveled: 0, score: 0,
    buildings: [], obstacles: [], lastTime: 0, animationFrameId: null, resizeListener: null,

    audio: {
        ac: null, master: null, ostGain: null, seqStep: 0, nextStepTime: 0, schedulerHandle: null,
        init() {
            if (this.ac) return;
            this.ac = new (window.AudioContext || window.webkitAudioContext)();
            this.master = this.ac.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ac.destination);
            this.ostGain = this.ac.createGain(); this.ostGain.gain.value = 0.2; this.ostGain.connect(this.master);
        },
        playOsc(type, freq, atk, dec, vol, t) {
            if (!this.ac) return;
            const o = this.ac.createOscillator(), g = this.ac.createGain();
            o.type = type; o.frequency.value = freq; o.connect(g); g.connect(this.ostGain);
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + atk);
            g.gain.exponentialRampToValueAtTime(0.0001, t + atk + dec);
            o.start(t); o.stop(t + atk + dec + 0.02);
        },
        startMusic() {
            if (this.schedulerHandle) return;
            this.nextStepTime = this.ac.currentTime;
            this.schedulerHandle = setInterval(() => {
                while (this.nextStepTime < this.ac.currentTime + 0.1) {
                    let step = this.seqStep % 8;
                    let notes = [36, 36, 39, 39, 41, 41, 43, 46];
                    this.playOsc('sawtooth', 440 * Math.pow(2, (notes[step] - 69) / 12), 0.01, 0.15, 0.3, this.nextStepTime);
                    if (step % 2 === 0) this.playOsc('sine', 60, 0.01, 0.1, 0.5, this.nextStepTime);
                    if (step % 4 === 2) this.playOsc('triangle', 200, 0.01, 0.08, 0.3, this.nextStepTime);
                    this.nextStepTime += 0.14; this.seqStep++;
                }
            }, 25);
        },
        stopMusic() { clearInterval(this.schedulerHandle); this.schedulerHandle = null; },
        jump() { if(this.ac) this.playOsc('triangle', 300, 0.02, 0.15, 0.4, this.ac.currentTime); },
        hit() { if(this.ac) this.playOsc('sawtooth', 120, 0.01, 0.2, 0.5, this.ac.currentTime); }
    },

    player: {
        x: 100, y: 0, w: 24, h: 42, vy: 0, gravity: 2800, jumpForce: -780, isGrounded: false, animFrame: 0, animTimer: 0,
        angle: 0, flipSpeed: 7, jumpBuffered: false, bufferTimer: 0,
        
        update(dt, buildings, canvasHeight, onGameOver) {
            this.vy += this.gravity * dt; this.y += this.vy * dt; this.animTimer += dt;
            if (this.animTimer > 0.08) { this.animFrame = (this.animFrame + 1) % 4; this.animTimer = 0; }
            
            if (this.jumpBuffered) {
                this.bufferTimer -= dt;
                if (this.bufferTimer <= 0) this.jumpBuffered = false;
            }

            if (!this.isGrounded) {
                this.angle += this.flipSpeed * dt * 2 * Math.PI;
            } else {
                this.angle = 0;
            }

            this.isGrounded = false;
            for (let b of buildings) {
                if (this.x + this.w - 4 > b.x && this.x + 4 < b.x + b.w) {
                    if (this.y + this.h >= b.y && this.y + this.h - this.vy * dt <= b.y + 15) {
                        this.y = b.y - this.h; this.vy = 0; this.isGrounded = true;
                        
                        if (this.jumpBuffered) {
                            this.executeJump(BestwayParkour.audio);
                        }
                    }
                }
            }
            if (this.y > canvasHeight + 100) onGameOver();
        },
        
        jump(audio) { 
            if (this.isGrounded) {
                this.executeJump(audio);
            } else {
                this.jumpBuffered = true;
                this.bufferTimer = 0.15; 
            }
        },

        executeJump(audio) {
            this.vy = this.jumpForce; 
            this.isGrounded = false; 
            this.jumpBuffered = false;
            audio.jump(); 
        }
    },

    start(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.resizeListener = () => this.resize();
        window.addEventListener('resize', this.resizeListener);

        this.audio.init(); this.audio.startMusic();
        this.gameState = 'playing'; this.gameSpeed = 380; this.distanceTraveled = 0; this.score = 0;
        
        this.buildings = [];
        this.obstacles = [];

        let startFloorY = this.canvas.height - 200;
        this.player.y = startFloorY - this.player.h; 
        this.player.vy = 0;
        this.player.angle = 0;
        this.player.jumpBuffered = false;

        this.buildings = [
            { x: 0, y: startFloorY, w: 600 },
            { x: 720, y: this.canvas.height - 260, w: 450 },
            { x: 1280, y: this.canvas.height - 190, w: 600 }
        ];
        this.obstacles = [
            { x: 850, y: this.canvas.height - 285, size: 25 },
            { x: 1500, y: this.canvas.height - 215, size: 25 }
        ];
        this.lastTime = performance.now();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.loop(this.lastTime);
    },

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },

    update(dt) {
        this.distanceTraveled += this.gameSpeed * dt;
        this.score = Math.floor(this.distanceTraveled / 10);
        
        // СКОРОСТЬ ТЕПЕРЬ ФИКСИРОВАННАЯ И КОМФОРТНАЯ
        this.gameSpeed = 380; 

        this.player.update(dt, this.buildings, this.canvas.height, () => this.gameOver());

        for (let b of this.buildings) b.x -= this.gameSpeed * dt;
        for (let o of this.obstacles) o.x -= this.gameSpeed * dt;

        if (this.buildings.length > 0 && this.buildings[0].x + this.buildings[0].w < -100) this.buildings.shift();
        if (this.obstacles.length > 0 && this.obstacles[0].x < -50) this.obstacles.shift();

        if (this.buildings.length < 4) {
            let lastB = this.buildings[this.buildings.length - 1];
            let gap = 110 + Math.random() * 120;
            let width = 350 + Math.random() * 400;
            
            let heightOffset = this.canvas.height - (160 + Math.random() * 80); 
            this.buildings.push({ x: lastB.x + lastB.w + gap, y: heightOffset, w: width });

            if (width > 400 && Math.random() < 0.6) {
                this.obstacles.push({
                    x: lastB.x + lastB.w + gap + 150 + Math.random() * (width - 200),
                    y: heightOffset - 25, size: 25
                });
            }
        }

        for (let o of this.obstacles) {
            let playerLeft = this.player.x + 6; 
            let playerRight = this.player.x + this.player.w - 6;
            let playerBottom = this.player.y + this.player.h;
            let playerTop = this.player.y + 4;

            if (playerRight > o.x + 2 && playerLeft < o.x + o.size - 2) {
                if (playerBottom > o.y + 2 && playerTop < o.y + o.size) {
                    this.audio.hit(); 
                    this.gameOver();
                    return; 
                }
            }
        }
    },

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.strokeStyle = '#251b45'; ctx.lineWidth = 1;
        let gridOffset = Math.floor(this.distanceTraveled) % 40;
        for (let i = -gridOffset; i < this.canvas.width; i += 40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, this.canvas.height); ctx.stroke();
        }

        for (let b of this.buildings) {
            ctx.save();
            ctx.fillStyle = '#0c0b1f'; ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 4;
            ctx.shadowColor = '#6c5ce7'; ctx.shadowBlur = 10;
            ctx.fillRect(b.x, b.y, b.w, this.canvas.height - b.y);
            ctx.strokeRect(b.x, b.y, b.w, this.canvas.height - b.y);
            ctx.restore();
        }

        for (let o of this.obstacles) {
            ctx.save();
            ctx.fillStyle = '#ff4b6e'; ctx.strokeStyle = '#ff758f'; ctx.lineWidth = 2;
            ctx.shadowColor = '#ff4b6e'; ctx.shadowBlur = 12;
            ctx.fillRect(o.x, o.y, o.size, o.size);
            ctx.strokeRect(o.x, o.y, o.size, o.size);
            ctx.restore();
        }

        ctx.save();
        let p = this.player;
        
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.angle);
        
        ctx.fillStyle = '#00ffcc'; ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 12;
        let cx = -p.w / 2;
        let cy = -p.h / 2;
        
        ctx.fillRect(cx + 6, cy, 12, 10);
        ctx.fillRect(cx + 4, cy + 12, 16, 16);
        if (!p.isGrounded) {
            ctx.fillRect(cx, cy + 14, 4, 10); ctx.fillRect(cx + 20, cy + 14, 4, 10);
            ctx.fillRect(cx + 2, cy + 28, 6, 10); ctx.fillRect(cx + 16, cy + 28, 6, 10);
        } else {
            let offset = Math.sin(p.animFrame * Math.PI / 2) * 4;
            ctx.fillRect(cx + 1, cy + 14, 4, 12); ctx.fillRect(cx + 19, cy + 14, 4, 12);
            ctx.fillRect(cx + 3, cy + 28, 5, 14 + offset); ctx.fillRect(cx + 16, cy + 28, 5, 14 - offset);
        }
        ctx.restore();

        ctx.fillStyle = '#00ffcc'; ctx.font = 'bold 22px "Courier New"';
        ctx.fillText(`СЧЕТ ПАРКУРА: ${this.score}`, 120, 32);
    },

    loop(now) {
        if (this.gameState !== 'playing') return;
        let dt = (now - this.lastTime) / 1000; if (dt > 0.1) dt = 0.1;
        this.lastTime = now;
        this.update(dt); this.draw();
        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    },

    stop() {
        this.gameState = 'idle'; this.audio.stopMusic();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.resizeListener);
    },

    gameOver() {
        this.stop();
        alert(`ПАРКУР ОКОНЧЕН!\nТвой счёт: ${this.score} очков! 🏃‍♀️🔥`);
        if(gameScreen) gameScreen.style.display = 'none';
    }
};

// --- ЕДИНЫЙ, СТРОГО РАЗДЕЛЕННЫЙ ОБРАБОТЧИК КЛИКОВ И КНОПОК ---
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
            document.activeElement.blur(); 
        }
        e.preventDefault(); 
        
        // Если запущен паркур, прыгает только паркурист
        if (BestwayParkour.gameState === 'playing') {
            BestwayParkour.player.jump(BestwayParkour.audio);
        } 
        // Иначе если запущена Пепса, прыгает только Пепса
        else if (isPlaying) {
            jump(); 
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
    }
});

if (gameScreen) {
    const handleJumpTrigger = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('.game-overlay') || e.target.id === 'gameExitBtn') {
            return; 
        }
        e.preventDefault();
        e.stopPropagation();

        if (BestwayParkour.gameState === 'playing') {
            BestwayParkour.player.jump(BestwayParkour.audio);
        } else if (isPlaying) {
            jump();
        }
    };

    gameScreen.addEventListener('touchstart', handleJumpTrigger, { passive: false });
    gameScreen.addEventListener('mousedown', handleJumpTrigger);
}
