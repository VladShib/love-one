// =================================================================
// --- КОД КНОПКИ ЛЮБЛЮ И МЕМОВ ---
// =================================================================
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

// =================================================================
// --- КОД ПЕРЕКЛЮЧЕНИЯ ИНТЕРФЕЙСА И ПОВОРОТА ЭКРАНА ---
// =================================================================
const openMenuBtn = document.getElementById('openMenuBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const mainButtons = document.getElementById('mainButtons');
const gamesMenu = document.getElementById('gamesMenu');
const gameScreen = document.getElementById('gameScreen');
const turnDeviceOverlay = document.getElementById('turnDeviceOverlay');

// ЖЕЛЕЗОБЕТОННЫЙ СБРОС ПРИ ПЕРВОМ ЗАХОДЕ НА САЙТ (Лечит баг CSS)
if (turnDeviceOverlay) {
    turnDeviceOverlay.style.setProperty('display', 'none', 'important');
}

function checkOrientationForGames() {
    if (!turnDeviceOverlay) return;
    if (window.innerHeight > window.innerWidth) {
        turnDeviceOverlay.style.setProperty('display', 'flex', 'important');
    } else {
        turnDeviceOverlay.style.setProperty('display', 'none', 'important');
    }
}

if (openMenuBtn) {
    openMenuBtn.addEventListener('click', () => {
        openMenuBtn.blur();
        if(mainButtons) mainButtons.style.display = 'none';
        if(gamesMenu) gamesMenu.style.display = 'flex';
        if(mainTitle) mainTitle.innerText = '🎯 Выбери игру';
        
        checkOrientationForGames();
    });
}

if (backToMainBtn) {
    backToMainBtn.addEventListener('click', () => {
        backToMainBtn.blur();
        if(gamesMenu) gamesMenu.style.display = 'none';
        if(mainButtons) mainButtons.style.display = 'flex';
        if(mainTitle) mainTitle.innerText = 'Для моей любимой Сашеньки';
        
        if(turnDeviceOverlay) turnDeviceOverlay.style.setProperty('display', 'none', 'important');
    });
}

window.addEventListener('resize', () => {
    const isGamesMenuOpen = gamesMenu && gamesMenu.style.display === 'flex';
    const isFightActive = window.isFightModeActive === true;

    if (isGamesMenuOpen || isFightActive) {
        checkOrientationForGames();
    } else {
        if(turnDeviceOverlay) turnDeviceOverlay.style.setProperty('display', 'none', 'important');
    }
});

// =================================================================
// --- ДВИЖОК МИНИ-ИГРЫ «ДОГОНИ ПЕПСУ» (ХАРДКОР-МОД) ---
// =================================================================
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
        if (typeof BestwayParkour !== 'undefined') BestwayParkour.stop();
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
    window.pepsaRandomTimer = 0; 
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

    window.pepsaX = 180;
    window.pepsaVx = 250;
    window.pepsaRandomTimer = 1.0;

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

    if (!window.pepsaX) {
        window.pepsaX = 180;
        window.pepsaVx = 200;
    }
    
    let currentPepsaMaxSpeed = 250 + (distance / 5); 
    window.pepsaRandomTimer -= dt;
    
    if (window.pepsaRandomTimer <= 0) {
        let direction = Math.random() < 0.5 ? -1 : 1;
        window.pepsaVx = direction * (currentPepsaMaxSpeed * (0.6 + Math.random() * 0.8));
        window.pepsaRandomTimer = 1.2 + Math.random() * 0.8;
    }

    window.pepsaX += window.pepsaVx * dt;

    if (window.pepsaX < 30) { window.pepsaX = 30; window.pepsaVx = -window.pepsaVx; }
    if (window.pepsaX > window.innerWidth - 80) { window.window.pepsaX = window.innerWidth - 80; window.pepsaVx = -window.pepsaVx; }
    
    if (pepsa) pepsa.style.left = window.pepsaX + 'px';

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
        obsEl.innerText = '🦮';
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

// =================================================================
// --- КНОПКА ЗАПУСКА ПАРКУРА ---
// =================================================================
const startParkourBtn = document.getElementById('startParkourBtn');
if (startParkourBtn) {
    startParkourBtn.addEventListener('click', () => {
        startParkourBtn.blur();
        if(gameArea) gameArea.style.display = 'none';
        if(pepsaScoreContainer) pepsaScoreContainer.style.display = 'none';
        
        const pCanvas = document.getElementById('parkourCanvas');
        if(pCanvas) pCanvas.style.display = 'block';
        if(gameScreen) gameScreen.style.display = 'flex';
        
        if (typeof BestwayParkour !== 'undefined') {
            BestwayParkour.start('parkourCanvas');
        }
    });
}

// =================================================================
// --- ЕДИНЫЙ ОБРАБОТЧИК КЛИКОВ И КНОПОК ПРЫЖКА ---
// =================================================================
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
            document.activeElement.blur(); 
        }
        e.preventDefault(); 
        
        if (typeof BestwayParkour !== 'undefined' && BestwayParkour.gameState === 'playing') {
            BestwayParkour.player.jump(BestwayParkour.audio);
        } 
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

        if (typeof BestwayParkour !== 'undefined' && BestwayParkour.gameState === 'playing') {
            BestwayParkour.player.jump(BestwayParkour.audio);
        } else if (isPlaying) {
            jump();
        }
    };

    gameScreen.addEventListener('touchstart', handleJumpTrigger, { passive: false });
    gameScreen.addEventListener('mousedown', handleJumpTrigger);
}

// =================================================================
// --- ЗАПУСК ФАЙТИНГА «ОТФИГАЧИТЬ ШКОЛОТУ» ---
// =================================================================
const startFightBtn = document.getElementById('startFightBtn');
if (startFightBtn) {
    startFightBtn.addEventListener('click', () => {
        startFightBtn.blur();
        
        window.isFightModeActive = true; 
        
        const gameArea = document.getElementById('gameArea');
        const pepsaScoreContainer = document.getElementById('pepsaScoreContainer'); 
        if (gameArea) gameArea.style.display = 'none';
        if (pepsaScoreContainer) pepsaScoreContainer.style.display = 'none';
        
        const pCanvas = document.getElementById('parkourCanvas');
        const gameScreen = document.getElementById('gameScreen');
        if (pCanvas) pCanvas.style.display = 'block';
        if (gameScreen) gameScreen.style.display = 'flex';
        
        checkOrientationForGames();
        
        if (typeof DashaFight !== 'undefined') {
            DashaFight.start('parkourCanvas');
        } else {
            console.error("Файл dashafight.js не подключен!");
        }
    });
}
