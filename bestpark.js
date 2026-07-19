// =========================================================
// --- ДВИЖОК МИНИ-ИГРЫ №4 «BESTWAY PARKOUR» С САЛЬТО ---
// =========================================================

const BestwayParkour = {
    canvas: null, ctx: null, gameState: 'idle', gameSpeed: 380, distanceTraveled: 0, 
    score: 0, highScore: 0, // Текущий рекорд
    buildings: [], obstacles: [], lastTime: 0, animationFrameId: null, resizeListener: null,
    isMobile: false,

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
                // Улучшенная лояльная проверка краев здания (+-2 пикселя)
                if (this.x + this.w - 2 > b.x && this.x + 2 < b.x + b.w) {
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
        this.gameState = 'playing'; this.distanceTraveled = 0; this.score = 0;
        
        // Загружаем рекорд из памяти браузера
        this.highScore = localStorage.getItem('parkourHighScore') ? parseInt(localStorage.getItem('parkourHighScore')) : 0;
        
        // Баланс физики: Мобильные vs ПК
        if (this.isMobile) {
            this.gameSpeed = 260;           
            this.player.gravity = 1550;     // Мягкая гравитация для затяжного полета
            this.player.jumpForce = -570;   // Комфортная высота прыжка вдаль
            this.player.flipSpeed = 4.5;      
            this.player.x = 60;             // Больше обзора впереди
        } else {
            this.gameSpeed = 380;
            this.player.gravity = 2800;
            this.player.jumpForce = -780;
            this.player.flipSpeed = 7;
            this.player.x = 100;
        }

        this.buildings = [];
        this.obstacles = [];

        let startFloorY = this.canvas.height - 180;
        this.player.y = startFloorY - this.player.h; 
        this.player.vy = 0;
        this.player.angle = 0;
        this.player.jumpBuffered = false;

        this.buildings = [
            { x: 0, y: startFloorY, w: 500 },
            { x: 580, y: this.canvas.height - 220, w: 350 },
            { x: 1000, y: this.canvas.height - 170, w: 450 }
        ];
        this.obstacles = [
            { x: 700, y: this.canvas.height - 245, size: 23 },
            { x: 1200, y: this.canvas.height - 195, size: 23 }
        ];
        
        this.lastTime = performance.now();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.loop(this.lastTime);
    },

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.isMobile = window.innerWidth < 768; 
        }
    },

    update(dt) {
        this.distanceTraveled += this.gameSpeed * dt;
        this.score = Math.floor(this.distanceTraveled / 10);

        this.player.update(dt, this.buildings, this.canvas.height, () => this.gameOver());

        for (let b of this.buildings) b.x -= this.gameSpeed * dt;
        for (let o of this.obstacles) o.x -= this.gameSpeed * dt;

        if (this.buildings.length > 0 && this.buildings[0].x + this.buildings[0].w < -100) this.buildings.shift();
        if (this.obstacles.length > 0 && this.obstacles[0].x < -50) this.obstacles.shift();

        if (this.buildings.length < 4) {
            let lastB = this.buildings[this.buildings.length - 1];
            
            // Зажатые рамки генерации пропастей на мобилках
            let gap = this.isMobile ? 80 + Math.random() * 55 : 110 + Math.random() * 120;
            let width = this.isMobile ? 300 + Math.random() * 250 : 350 + Math.random() * 400;
            
            let heightOffset = this.canvas.height - (150 + Math.random() * 90); 
            this.buildings.push({ x: lastB.x + lastB.w + gap, y: heightOffset, w: width });

            if (width > 300 && Math.random() < 0.55) {
                let minXFromLeft = 80;
                // Защита обрыва: куб не спавнится у самого края крыши на мобилке
                let maxXFromLeft = this.isMobile ? width - 120 : width - 60; 

                if (maxXFromLeft > minXFromLeft) {
                    this.obstacles.push({
                        x: lastB.x + lastB.w + gap + minXFromLeft + Math.random() * (maxXFromLeft - minXFromLeft),
                        y: heightOffset - 23, 
                        size: 23 
                    });
                }
            }
        }

        // Честные сжатые хитбоксы
        for (let o of this.obstacles) {
            let playerLeft = this.player.x + 8; 
            let playerRight = this.player.x + this.player.w - 8;
            let playerBottom = this.player.y + this.player.h;
            let playerTop = this.player.y + 6;

            if (playerRight > o.x + 3 && playerLeft < o.x + o.size - 3) {
                if (playerBottom > o.y + 3 && playerTop < o.y + o.size) {
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

        // Отображение Счёта и Локального Рекорда
        ctx.fillStyle = '#00ffcc'; ctx.font = 'bold 22px "Courier New"';
        ctx.fillText(`СЧЕТ: ${this.score} | РЕКОРД: ${this.highScore}`, this.isMobile ? 140 : 120, 32);
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

        // Проверка и сохранение рекорда
        let recordBeaten = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('parkourHighScore', this.score);
            recordBeaten = true;
        }

        if (recordBeaten) {
            alert(`🔥 НОВЫЙ РЕКОРД! 🔥\nПревосходный результат: ${this.score} очков! Сохранено в память устройства! 😎`);
        } else {
            alert(`ПАРКУР ОКОНЧЕН!\nТвой счёт: ${this.score} очков!\n(Лучший результат: ${this.highScore}) 🏃‍♀️🔥`);
        }

        const gScreen = document.getElementById('gameScreen');
        if(gScreen) gScreen.style.display = 'none';
    }
};