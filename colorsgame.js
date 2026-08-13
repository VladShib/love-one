// =================================================================
// --- МИНИ-ИГРА «РЕБУСЫ ДЛЯ ЧАЙНИКОВ» (САЙМОН С 7 РАУНДАМИ) ---
// =================================================================

(function () {
    // Палитра из 9 цветов без синего и зелёного
    const SAFE_PALETTE = [
        '#ff4d4d', '#ff9f43', '#feca57', '#ff6b6b',
        '#9c88ff', '#8d5524', '#e056fd', '#ffbe76', '#b33939'
    ];

    let audioCtx = null;
    function playColorSound(index) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freqs[index % freqs.length];
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } catch(e) {}
    }

    let currentRound = 1;
    const TOTAL_ROUNDS = 7; // 🎯 Теперь 7 раундов — идеально по сложности!
    let sequence = [];
    let playerStep = 0;
    let isPlayingSequence = false;
    let targetPrankColor = '';

    let sequenceTimer = null;
    let flashTimeouts = [];

    function clearAllGameTimers() {
        if (sequenceTimer) {
            clearInterval(sequenceTimer);
            sequenceTimer = null;
        }
        flashTimeouts.forEach(t => clearTimeout(t));
        flashTimeouts = [];
        
        const tiles = document.querySelectorAll('.color-btn');
        tiles.forEach(t => t.classList.remove('active'));
    }

    function toggleJumpHint(show) {
        const hint = document.querySelector('.game-controls-hint');
        if (hint) {
            hint.style.display = show ? 'block' : 'none';
        }
    }

    window.stopColorsGame = function() {
        clearAllGameTimers();
        isPlayingSequence = false;
        toggleJumpHint(true);
        const colorsGameArea = document.getElementById('colorsGameArea');
        if (colorsGameArea) colorsGameArea.style.display = 'none';
    };

    const startColorsBtn = document.getElementById('startColorsBtn');
    const colorsGameArea = document.getElementById('colorsGameArea');
    const gameArea = document.getElementById('gameArea');
    const parkourCanvas = document.getElementById('parkourCanvas');
    const gameScreen = document.getElementById('gameScreen');
    const pepsaScoreContainer = document.getElementById('pepsaScoreContainer');

    if (startColorsBtn) {
        startColorsBtn.addEventListener('click', () => {
            startColorsBtn.blur();
            
            if (typeof stopGame === 'function') stopGame();
            if (typeof BestwayParkour !== 'undefined' && BestwayParkour.stop) BestwayParkour.stop();

            if (gameArea) gameArea.style.display = 'none';
            if (parkourCanvas) parkourCanvas.style.display = 'none';
            if (pepsaScoreContainer) pepsaScoreContainer.style.display = 'none';

            toggleJumpHint(false);

            if (colorsGameArea) colorsGameArea.style.display = 'flex';
            if (gameScreen) gameScreen.style.display = 'flex';

            startColorsGame();
        });
    }

    function startColorsGame() {
        clearAllGameTimers();
        currentRound = 1;
        setupRound();
    }

    function getGridConfig(round) {
        if (round <= 2) return { count: 4, gridClass: 'grid-2x2' };
        if (round <= 4) return { count: 6, gridClass: 'grid-3x2' };
        return { count: 9, gridClass: 'grid-3x3' };
    }

    function generateNewSequence(length, colorCount) {
        let newSeq = [];
        for (let i = 0; i < length; i++) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * colorCount);
            } while (newSeq.length > 0 && nextIndex === newSeq[newSeq.length - 1] && colorCount > 1);
            newSeq.push(nextIndex);
        }
        return newSeq;
    }

    function setupRound() {
        clearAllGameTimers();
        playerStep = 0;
        isPlayingSequence = true;

        const config = getGridConfig(currentRound);
        
        // 7 раундов = Длина от 1 до 7 элементов!
        sequence = generateNewSequence(currentRound, config.count);

        colorsGameArea.innerHTML = `
            <div class="colors-header">🧩 Раунд ${currentRound} из ${TOTAL_ROUNDS}</div>
            <div class="colors-grid ${config.gridClass}" id="colorsGrid"></div>
            <div id="colorsStatus" style="color: #bdc3c7; font-size: 0.9rem; height: 20px; text-align: center;">Запоминай порядок...</div>
        `;

        const gridEl = document.getElementById('colorsGrid');

        for (let i = 0; i < config.count; i++) {
            const btn = document.createElement('button');
            btn.classList.add('color-btn');
            btn.style.backgroundColor = SAFE_PALETTE[i];
            btn.dataset.index = i;
            
            const handleAction = (e) => {
                e.preventDefault();
                btn.blur();
                handleTileClick(i);
            };

            btn.addEventListener('click', handleAction);
            gridEl.appendChild(btn);
        }

        const startTimeout = setTimeout(() => {
            playSequence();
        }, 500);
        flashTimeouts.push(startTimeout);
    }

    function playSequence() {
        clearAllGameTimers();
        isPlayingSequence = true;
        const statusEl = document.getElementById('colorsStatus');
        if (statusEl) statusEl.innerText = "👀 Смотри внимательно...";

        let i = 0;
        const speed = currentRound > 4 ? 400 : 450;

        sequenceTimer = setInterval(() => {
            if (i >= sequence.length) {
                clearAllGameTimers();
                isPlayingSequence = false;
                if (statusEl) statusEl.innerText = "👉 Повторяй!";
                return;
            }

            flashTile(sequence[i]);
            i++;
        }, speed);
    }

    function flashTile(index) {
        const tiles = document.querySelectorAll('.color-btn');
        const tile = tiles[index];
        if (tile) {
            playColorSound(index);
            tile.classList.add('active');
            
            const t = setTimeout(() => {
                tile.classList.remove('active');
            }, 250);
            flashTimeouts.push(t);
        }
    }

    function handleTileClick(index) {
        if (isPlayingSequence) return;

        flashTile(index);

        if (index === sequence[playerStep]) {
            playerStep++;
            if (playerStep >= sequence.length) {
                isPlayingSequence = true;
                if (currentRound < TOTAL_ROUNDS) {
                    currentRound++;
                    const statusEl = document.getElementById('colorsStatus');
                    if (statusEl) statusEl.innerText = "Следующий раунд...";
                    const t = setTimeout(setupRound, 900);
                    flashTimeouts.push(t);
                } else {
                    // Все 7 раундов пройдены!
                    const t = setTimeout(showPrankStage, 800);
                    flashTimeouts.push(t);
                }
            }
        } else {
            const statusEl = document.getElementById('colorsStatus');
            if (statusEl) statusEl.innerText = "❌ Мимо!";
            isPlayingSequence = true;
            playerStep = 0;

            const config = getGridConfig(currentRound);
            sequence = generateNewSequence(currentRound, config.count);

            const t = setTimeout(() => {
                playSequence();
            }, 1000);
            flashTimeouts.push(t);
        }
    }

    function showPrankStage() {
        clearAllGameTimers();
        const isGreen = Math.random() < 0.5;
        targetPrankColor = isGreen ? 'green' : 'blue';
        const hexColor = isGreen ? '#2ecc71' : '#3498db';

        colorsGameArea.innerHTML = `
            <div class="prank-container">
                <div class="prank-box" style="background-color: ${hexColor};"></div>
                <div class="prank-question">Что это за цвет? 🤔</div>
                <div class="prank-buttons" id="prankBtnsWrapper">
                    <button class="prank-btn prank-btn-green" id="ansGreenBtn">Зелёный</button>
                    <button class="prank-btn prank-btn-blue" id="ansBlueBtn">Синий</button>
                </div>
                <div id="prankResult" style="margin-top: 20px; font-size: 1.2rem; text-align: center; color: #ffbe76; min-height: 50px;"></div>
            </div>
        `;

        document.getElementById('ansGreenBtn').addEventListener('click', () => handlePrankAnswer('green'));
        document.getElementById('ansBlueBtn').addEventListener('click', () => handlePrankAnswer('blue'));
    }

    function handlePrankAnswer(chosenColor) {
        // Скрываем варианты ответов сразу после клика, чтобы нельзя было кликнуть второй раз!
        const btnsWrapper = document.getElementById('prankBtnsWrapper');
        if (btnsWrapper) {
            btnsWrapper.style.display = 'none';
        }

        const resultEl = document.getElementById('prankResult');
        const correctText = targetPrankColor === 'green' ? 'ЗЕЛЁНЫЙ' : 'СИНИЙ';
        
        if (chosenColor === targetPrankColor) {
            resultEl.innerHTML = `Молодец! 🎉<br><span style="font-size: 0.9rem; color: #fff;">Это был ${correctText}! Эти красивые глаза всё видят</span>`;
        } else {
            resultEl.innerHTML = `Мимо! Ахахаха 🤪<br><span style="font-size: 0.9rem; color: #fff;">Это был <b>${correctText}</b>! Эх ты, дальтоник мой любимый ❤️</span>`;
        }

        // Показываем кнопку возврата в меню
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closePrankBtn';
        closeBtn.innerText = 'В меню ❤️';
        closeBtn.style.cssText = 'margin-top: 20px; padding: 10px 25px; background: #6c5ce7; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1rem; font-weight: bold; display: inline-block;';
        closeBtn.addEventListener('click', () => {
            window.stopColorsGame();
            if (gameScreen) gameScreen.style.display = 'none';
        });

        resultEl.appendChild(document.createElement('br'));
        resultEl.appendChild(closeBtn);
    }

})();