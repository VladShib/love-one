// =================================================================
// --- СВЕРХТАКТИЧЕСКИЙ ФАЙТИНГ «DASHA FIGHT 1v1» (ВЕРСИЯ 2.6) ---
// =================================================================

const DashaFight = {
    canvas: null, ctx: null, gameState: 'idle', lastTime: 0, animationFrameId: null,
    isMobile: false, particles: [], sparks: [], slashLines: [],
    
    introStartBtn: { x: 0, y: 0, w: 200, h: 60 },

    touchControl: {
        stick: { startX: 0, startY: 0, curX: 0, curY: 0, active: false, id: null, dir: 0 },
        btnHit: { x: 0, y: 0, r: 38, active: false },
        btnBlock: { x: 0, y: 0, r: 38, active: false }
    },

    keys: { Left: false, Right: false },

    audio: {
        ac: null,
        init() { if (!this.ac) this.ac = new (window.AudioContext || window.webkitAudioContext)(); },
        playTone(freq, type, duration, vol) {
            if (!this.ac) return;
            const o = this.ac.createOscillator(), g = this.ac.createGain();
            o.type = type; o.frequency.value = freq;
            g.gain.setValueAtTime(vol, this.ac.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, this.ac.currentTime + duration);
            o.connect(g); g.connect(this.ac.destination);
            o.start(); o.stop(this.ac.currentTime + duration);
        },
        hit() { this.playTone(120, 'sawtooth', 0.25, 0.4); },
        parry() { this.playTone(880, 'triangle', 0.3, 0.5); },
        block() { this.playTone(180, 'sine', 0.15, 0.3); }
    },

    sasha: {
        name: 'САША', x: 150, y: 0, w: 32, h: 60, hp: 250, maxHp: 250, side: 'left',
        state: 'idle', stateTimer: 0, attackCd: 0, blockCd: 0, blockActiveTimer: 0,
        isParryWindow: false, walkCycle: 0, slashAnim: null, attackBox: { w: 110, h: 80 },
        stunTimer: 0
    },

    dasha: {
        name: 'ДАША', x: 500, y: 0, w: 32, h: 60, hp: 250, maxHp: 250, side: 'right',
        state: 'idle', stateTimer: 0, attackCd: 0, blockCd: 0, blockActiveTimer: 0,
        isParryWindow: false, walkCycle: 0, slashAnim: null, attackBox: { w: 110, h: 80 },
        aiTimer: 0, aiState: 'evaluate', targetX: 0,
        stunTimer: 0
    },

    start(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.audio.init();
        this.resize();
        
        this.gameState = 'intro';
        
        let groundY = this.canvas.height - 100;
        
        this.sasha.hp = 250; this.sasha.maxHp = 250; this.sasha.x = this.canvas.width * 0.25; this.sasha.y = groundY - this.sasha.h;
        this.sasha.state = 'idle'; this.sasha.attackCd = 0; this.sasha.blockCd = 0; this.sasha.slashAnim = null; this.sasha.stunTimer = 0;
        
        this.dasha.hp = 250; this.dasha.maxHp = 250; this.dasha.x = this.canvas.width * 0.75 - this.dasha.w; this.dasha.y = groundY - this.dasha.h;
        this.dasha.state = 'idle'; this.dasha.attackCd = 0; this.dasha.blockCd = 0; this.dasha.slashAnim = null; this.dasha.stunTimer = 0;
        this.dasha.aiTimer = 0; this.dasha.aiState = 'evaluate';
        
        this.particles = []; this.sparks = []; this.slashLines = [];
        this.setupControls();

        this.lastTime = performance.now();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.loop(this.lastTime);
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isMobile = window.innerWidth < 768 || window.innerHeight < 500;
        
        let w = this.canvas.width, h = this.canvas.height;
        
        // КНОПКИ И ИХ ХИТБОКСЫ ТЕПЕРЬ НА ОДНОЙ ВЫСОТЕ
        this.touchControl.btnHit = { x: w - 170, y: h - 130, r: 38, active: false };
        this.touchControl.btnBlock = { x: w - 75, y: h - 170, r: 38, active: false };

        this.introStartBtn.x = w / 2 - this.introStartBtn.w / 2;
        this.introStartBtn.y = h / 2 + 30;
    },

    setupControls() {
        if (this._keydownRef) window.removeEventListener('keydown', this._keydownRef);
        if (this._keyupRef) window.removeEventListener('keyup', this._keyupRef);
        
        this._keydownRef = (e) => {
            if (this.gameState !== 'playing') return;
            if (this.sasha.stunTimer > 0) return; 
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.Left = true;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.Right = true;
            if (e.code === 'KeyJ' || e.code === 'KeyZ') this.triggerHit(this.sasha);
            if (e.code === 'KeyK' || e.code === 'KeyX') this.triggerBlock(this.sasha);
        };
        this._keyupRef = (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.Left = false;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.Right = false;
        };

        window.addEventListener('keydown', this._keydownRef);
        window.addEventListener('keyup', this._keyupRef);

        const handleStartClick = (clientX, clientY) => {
            if (this.gameState !== 'intro') return;
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = clientX - rect.left;
            const canvasY = clientY - rect.top;
            const btn = this.introStartBtn;
            if (canvasX >= btn.x && canvasX <= btn.x + btn.w && canvasY >= btn.y && canvasY <= btn.y + btn.h) {
                this.gameState = 'playing';
            }
        };

        this.canvas.onmousedown = (e) => handleStartClick(e.clientX, e.clientY);
        this.canvas.ontouchstart = (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            if (this.gameState === 'intro') { 
                const touch = e.changedTouches[0];
                handleStartClick(touch.clientX, touch.clientY); 
                return; 
            }
            if (this.gameState !== 'playing' || this.sasha.stunTimer > 0) return;
            
            for (let t of e.changedTouches) {
                // Переводим глобальные координаты тача в локальные координаты канваса
                const canvasX = t.clientX - rect.left;
                const canvasY = t.clientY - rect.top;

                if (this.checkCircleTouch(canvasX, canvasY, this.touchControl.btnHit)) { 
                    this.triggerHit(this.sasha); 
                }
                else if (this.checkCircleTouch(canvasX, canvasY, this.touchControl.btnBlock)) { 
                    this.triggerBlock(this.sasha); 
                }
                else if (canvasX < window.innerWidth / 2 && !this.touchControl.stick.active) {
                    this.touchControl.stick.active = true; this.touchControl.stick.id = t.identifier;
                    this.touchControl.stick.startX = canvasX; this.touchControl.stick.startY = canvasY;
                    this.touchControl.stick.curX = canvasX; this.touchControl.stick.curY = canvasY;
                }
            }
        };

        this.canvas.ontouchmove = (e) => {
            e.preventDefault();
            if (this.gameState !== 'playing' || !this.touchControl.stick.active || this.sasha.stunTimer > 0) return;
            const rect = this.canvas.getBoundingClientRect();
            for (let t of e.touches) {
                if (t.identifier === this.touchControl.stick.id) {
                    const canvasX = t.clientX - rect.left;
                    this.touchControl.stick.curX = canvasX;
                    let dx = this.touchControl.stick.curX - this.touchControl.stick.startX;
                    this.touchControl.stick.dir = dx < -15 ? -1 : (dx > 15 ? 1 : 0);
                }
            }
        };

        this.canvas.ontouchend = (e) => {
            for (let t of e.changedTouches) {
                if (this.touchControl.stick.active && t.identifier === this.touchControl.stick.id) {
                    this.touchControl.stick.active = false; this.touchControl.stick.dir = 0;
                }
            }
        };
    },

    checkCircleTouch(tx, ty, btn) { return Math.hypot(tx - btn.x, ty - btn.y) <= btn.r; },

    triggerHit(char) {
        if (char.attackCd <= 0 && char.state !== 'blocking' && char.state !== 'attacking' && char.stunTimer <= 0) {
            char.state = 'attacking'; char.stateTimer = 0.35; char.attackCd = 0.9;
            char.slashAnim = { progress: 0, dir: char.side === 'left' ? 1 : -1, triggeredDamage: false };
        }
    },

    triggerBlock(char) {
        if (char.blockCd <= 0 && char.state !== 'attacking' && char.state !== 'blocking' && char.stunTimer <= 0) {
            char.state = 'blocking'; char.blockActiveTimer = 0.45; char.isParryWindow = true; char.blockCd = 1.3;         
        }
    },

    executeDamageRegistry(char) {
        let isLeft = char.side === 'left';
        char.attackBox.x = isLeft ? char.x + char.w : char.x - char.attackBox.w;
        char.attackBox.y = char.y - 15;

        let target = (char === this.sasha) ? this.dasha : this.sasha;
        if (this.checkCollision(char.attackBox, target)) {
            let hitX = target.x + target.w/2; let hitY = target.y + target.h/3;

            if (target.state === 'blocking') {
                if (target.isParryWindow) {
                    this.audio.parry(); 
                    char.hp -= 15; 
                    char.stunTimer = 1.5;
                    char.state = 'idle'; 
                    char.attackCd = 1.5; 
                    this.spawnSparks(hitX, hitY, '#ffea00', 35);
                    this.slashLines.push({ x1: hitX - 80, y1: hitY - 80, x2: hitX + 80, y2: hitY + 80, color: '#ffea00', life: 0.2, w: 7 });
                } else {
                    this.audio.block(); 
                    target.hp -= 1; 
                    this.spawnSparks(hitX, hitY, '#ffffff', 10);
                }
            } else {
                this.audio.hit(); 
                if (char === this.dasha) {
                    target.hp -= 22; 
                } else {
                    target.hp -= 12; 
                }
                this.spawnBlood(hitX, hitY, isLeft ? 1 : -1);
                this.slashLines.push({ x1: hitX - (isLeft ? 140 : -140), y1: hitY - 90, x2: hitX + (isLeft ? 140 : -140), y2: hitY + 90, color: '#ff0055', life: 0.35, w: 15 });
            }
            if (target.hp < 0) target.hp = 0;
            if (char.hp < 0) char.hp = 0;
        }
    },

    checkCollision(r1, r2) { return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y; },
    spawnBlood(x, y, dir) { for(let i=0; i<25; i++) { this.particles.push({ x, y, vx: (dir * (60 + Math.random()*240)) + (Math.random() - 0.5)*80, vy: (Math.random() - 0.7) * 300, life: 0.4 + Math.random()*0.3, size: 3 + Math.random()*4 }); } },
    spawnSparks(x, y, color = '#ffcc00', count = 20) { for(let i=0; i<count; i++) { this.sparks.push({ x, y, vx: (Math.random() - 0.5) * 500, vy: (Math.random() - 0.5) * 500, life: 0.2 + Math.random()*0.2, color }); } },

    updateAI(dt) {
        let ai = this.dasha; let p = this.sasha;
        if (ai.stunTimer > 0) { ai.stunTimer -= dt; ai.state = 'idle'; return; }
        ai.aiTimer -= dt;
        ai.side = (ai.x > p.x) ? 'right' : 'left';

        if (ai.state === 'blocking') {
            ai.blockActiveTimer -= dt;
            if (ai.blockActiveTimer <= 0) ai.state = 'idle';
            if (ai.blockActiveTimer < 0.30) ai.isParryWindow = false;
            return;
        }
        if (ai.state === 'attacking') return;
        
        let dist = Math.abs((ai.x + ai.w/2) - (p.x + p.w/2));

        if (dist < 85 && p.state === 'attacking') {
            if (ai.blockCd <= 0 && Math.random() < 0.6) { this.triggerBlock(ai); return; }
            else if (ai.attackCd <= 0) { this.triggerHit(ai); return; }
        }

        if (ai.aiTimer <= 0) {
            ai.aiTimer = 0.15 + Math.random() * 0.25;
            if (dist < 120) {
                let r = Math.random();
                if (r < 0.65 && ai.attackCd <= 0) { ai.aiState = 'attack'; }
                else if (r < 0.85 && ai.blockCd <= 0) { this.triggerBlock(ai); }
                else { ai.aiState = 'backoff'; ai.targetX = ai.x + (ai.side === 'right' ? 70 : -70); }
            } else if (dist > 180) { ai.aiState = 'approach'; }
            else { ai.aiState = Math.random() < 0.7 ? 'approach' : 'attack'; }
        }

        if (ai.aiState === 'attack') {
            if (ai.attackCd <= 0) this.triggerHit(ai);
            else ai.aiState = 'approach';
        } else if (ai.aiState === 'backoff') {
            ai.state = 'moving'; ai.walkCycle += dt * 10;
            let speed = 140 * dt; ai.x += (ai.side === 'right') ? speed : -speed;
            if (ai.x < 20 || ai.x > this.canvas.width - ai.w - 20) ai.aiState = 'approach';
        } else if (ai.aiState === 'approach') {
            ai.state = 'moving'; ai.walkCycle += dt * 12; 
            ai.x += (ai.x > p.x) ? -160 * dt : 160 * dt;
        } else { ai.state = 'idle'; ai.walkCycle = 0; }
    },

    update(dt) {
        if (this.gameState !== 'playing') return;

        if (this.sasha.stunTimer > 0) this.sasha.stunTimer -= dt;
        if (this.dasha.stunTimer > 0) this.dasha.stunTimer -= dt;

        if (this.sasha.attackCd > 0) this.sasha.attackCd -= dt;
        if (this.sasha.blockCd > 0) this.sasha.blockCd -= dt;
        if (this.dasha.attackCd > 0) this.dasha.attackCd -= dt;
        if (this.dasha.blockCd > 0) this.dasha.blockCd -= dt;

        this.sasha.side = (this.sasha.x < this.dasha.x) ? 'left' : 'right';

        if (this.sasha.stunTimer <= 0) {
            if (this.sasha.state === 'blocking') {
                this.sasha.blockActiveTimer -= dt;
                if (this.sasha.blockActiveTimer <= 0) this.sasha.state = 'idle';
                if (this.sasha.blockActiveTimer < 0.32) this.sasha.isParryWindow = false;
            }
            
            if (this.sasha.state === 'attacking') {
                this.sasha.stateTimer -= dt;
                if (this.sasha.slashAnim) {
                    this.sasha.slashAnim.progress = (0.35 - this.sasha.stateTimer) / 0.35;
                    if (this.sasha.slashAnim.progress >= 0.9 && !this.sasha.slashAnim.triggeredDamage) {
                        this.sasha.slashAnim.triggeredDamage = true; this.executeDamageRegistry(this.sasha);
                    }
                }
                if (this.sasha.stateTimer <= 0) this.sasha.state = 'idle';
            }

            if (this.sasha.state !== 'attacking' && this.sasha.state !== 'blocking') {
                let moveDir = 0;
                if (this.keys.Left || this.touchControl.stick.dir === -1) moveDir = -1;
                if (this.keys.Right || this.touchControl.stick.dir === 1) moveDir = 1;

                if (moveDir !== 0) {
                    this.sasha.state = 'moving'; this.sasha.walkCycle += dt * 12; this.sasha.x += moveDir * 180 * dt;
                } else { this.sasha.state = 'idle'; this.sasha.walkCycle = 0; }
                if (this.sasha.x < 0) this.sasha.x = 0;
                if (this.sasha.x > this.canvas.width - this.sasha.w) this.sasha.x = this.canvas.width - this.sasha.w;
            }
        } else {
            this.sasha.state = 'idle';
        }

        if (this.dasha.stunTimer <= 0) {
            if (this.dasha.state === 'attacking') {
                this.dasha.stateTimer -= dt;
                if (this.dasha.slashAnim) {
                    this.dasha.slashAnim.progress = (0.35 - this.dasha.stateTimer) / 0.35;
                    if (this.dasha.slashAnim.progress >= 0.9 && !this.dasha.slashAnim.triggeredDamage) {
                        this.dasha.slashAnim.triggeredDamage = true; this.executeDamageRegistry(this.dasha);
                    }
                }
                if (this.dasha.stateTimer <= 0) this.dasha.state = 'idle';
            }
            this.updateAI(dt);
        }

        for (let i = this.slashLines.length - 1; i >= 0; i--) { this.slashLines[i].life -= dt; if (this.slashLines[i].life <= 0) this.slashLines.splice(i, 1); }
        for (let i = this.particles.length - 1; i >= 0; i--) { let p = this.particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 800 * dt; p.life -= dt; if (p.life <= 0) this.particles.splice(i, 1); }
        for (let i = this.sparks.length - 1; i >= 0; i--) { let s = this.sparks[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; if (s.life <= 0) this.sparks.splice(i, 1); }

        if ((this.sasha.hp <= 0 || this.dasha.hp <= 0) && this.gameState === 'playing') {
            this.endFight();
        }
    },

    drawCharacter(ctx, char, baseColor, neonColor) {
        ctx.save();
        let bobbingY = (char.state === 'moving') ? Math.abs(Math.sin(char.walkCycle)) * 4 : 0;
        let tiltAngle = (char.state === 'moving') ? Math.sin(char.walkCycle) * 0.05 : 0;
        ctx.translate(char.x + char.w / 2, char.y + char.h / 2 + bobbingY); ctx.rotate(tiltAngle);
        
        ctx.fillStyle = baseColor; ctx.shadowColor = neonColor; ctx.shadowBlur = 12;
        
        if (char.stunTimer > 0) {
            ctx.fillStyle = '#555566';
            ctx.shadowColor = '#ffea00';
        }
        
        let cx = -char.w / 2, cy = -char.h / 2;
        ctx.fillRect(cx + 6, cy, 20, 12); ctx.fillRect(cx, cy + 16, char.w, 24); 
        
        let leftLeg = (char.state === 'moving') ? Math.sin(char.walkCycle) * 6 : 0;
        let rightLeg = (char.state === 'moving') ? -Math.sin(char.walkCycle) * 6 : 0;
        ctx.fillRect(cx + 2, cy + 40, 9, 16 + leftLeg); ctx.fillRect(cx + char.w - 11, cy + 40, 9, 16 + rightLeg);
        ctx.restore();

        if (char.state === 'blocking') {
            ctx.save(); ctx.translate(char.x + char.w/2, char.y + char.h/2);
            ctx.strokeStyle = char.isParryWindow ? '#ffea00' : '#ffffff'; ctx.lineWidth = 5;
            ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20;
            ctx.fillStyle = char.isParryWindow ? 'rgba(255, 234, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        }

        ctx.save(); ctx.translate(char.x + char.w / 2, char.y + char.h * 0.5 + bobbingY);
        let lookDir = char.side === 'left' ? 1 : -1;

        if (char.state === 'attacking' && char.slashAnim) {
            ctx.lineWidth = 7; ctx.shadowBlur = 20; ctx.strokeStyle = '#ffffff'; ctx.shadowColor = neonColor;
            ctx.beginPath(); let angle = -Math.PI/1.2 + (char.slashAnim.progress * Math.PI * 1.4 * lookDir);
            ctx.moveTo(0, 0); ctx.lineTo(Math.cos(angle) * 55, Math.sin(angle) * 55); ctx.stroke();
        } else if (char.state !== 'blocking' && char.stunTimer <= 0) {
            ctx.lineWidth = 4; ctx.strokeStyle = neonColor; ctx.shadowColor = neonColor; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(35 * lookDir, -30); ctx.stroke();
        }
        ctx.restore();

        if (char.state === 'attacking' && char.slashAnim) {
            ctx.save(); ctx.translate(char.x + char.w/2, char.y + char.h/2 - 10);
            ctx.strokeStyle = neonColor; ctx.lineWidth = 8; ctx.shadowColor = neonColor; ctx.shadowBlur = 25;
            ctx.beginPath(); let startArc = char.side === 'left' ? -Math.PI/1.2 : Math.PI/4;
            ctx.arc(0, 0, 65, startArc, startArc + (char.slashAnim.progress * Math.PI * 1.3 * lookDir), char.side === 'right');
            ctx.stroke(); ctx.restore();
        }
        
        if (char.stunTimer > 0) {
            ctx.save();
            ctx.fillStyle = '#ffea00'; ctx.font = 'bold 16px Arial';
            ctx.fillText("💫 СТАН!", char.x - 10, char.y - 20);
            ctx.restore();
        }
    },

    drawUI(ctx) {
        let w = this.canvas.width;
        ctx.save();
        ctx.fillStyle = '#00ffcc'; ctx.font = 'bold 20px "Courier New"'; ctx.fillText(this.sasha.name, 40, 35);
        ctx.fillStyle = '#17122b'; ctx.fillRect(40, 48, 220, 20);
        ctx.fillStyle = '#00ffcc'; ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 10;
        ctx.fillRect(40, 48, 220 * (this.sasha.hp / this.sasha.maxHp), 20);
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ff4b6e'; ctx.font = 'bold 20px "Courier New"'; ctx.fillText(this.dasha.name, w - 260, 35);
        ctx.fillStyle = '#17122b'; ctx.fillRect(w - 260, 48, 220, 20);
        ctx.fillStyle = '#ff4b6e'; ctx.shadowColor = '#ff4b6e'; ctx.shadowBlur = 10;
        let dashaHpW = 220 * (this.dasha.hp / this.dasha.maxHp);
        ctx.fillRect(w - 260 + (220 - dashaHpW), 48, dashaHpW, 20);
        ctx.restore();
    },

    drawControls(ctx) {
        if (!this.isMobile) return;
        ctx.save(); let s = this.touchControl.stick;
        if (s.active) {
            ctx.fillStyle = 'rgba(0, 255, 204, 0.1)'; ctx.strokeStyle = 'rgba(0, 255, 204, 0.3)';
            ctx.beginPath(); ctx.arc(s.startX, s.startY, 50, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 204, 0.5)'; ctx.beginPath(); ctx.arc(s.curX, s.startY, 16, 0, Math.PI*2); ctx.fill();
        }
        let bHit = this.touchControl.btnHit;
        ctx.fillStyle = 'rgba(255, 0, 85, 0.2)'; ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bHit.x, bHit.y, bHit.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        if (this.sasha.attackCd > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.moveTo(bHit.x, bHit.y);
            ctx.arc(bHit.x, bHit.y, bHit.r, -Math.PI/2, -Math.PI/2 + (this.sasha.attackCd / 1.2) * Math.PI * 2);
            ctx.lineTo(bHit.x, bHit.y); ctx.fill();
        }
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Arial'; ctx.fillText("АТАКА", bHit.x - 18, bHit.y + 4);

        let bBlk = this.touchControl.btnBlock;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; ctx.strokeStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(bBlk.x, bBlk.y, bBlk.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        if (this.sasha.blockCd > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.moveTo(bBlk.x, bBlk.y);
            ctx.arc(bBlk.x, bBlk.y, bBlk.r, -Math.PI/2, -Math.PI/2 + (this.sasha.blockCd / 1.5) * Math.PI * 2);
            ctx.lineTo(bBlk.x, bBlk.y); ctx.fill();
        }
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Arial'; ctx.fillText("БЛОК", bBlk.x - 15, bBlk.y + 4);
        ctx.restore();
    },

    drawIntro() {
        const ctx = this.ctx;
        ctx.fillStyle = '#080614';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.fillStyle = '#ff4b6e';
        ctx.font = 'bold 36px "Courier New"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff4b6e';
        ctx.shadowBlur = 20;
        ctx.fillText('Побей эту школьницу!!!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        ctx.restore();

        ctx.save();
        const btn = this.introStartBtn;
        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
        ctx.fill();

        ctx.fillStyle = '#080614';
        ctx.font = 'bold 22px "Courier New"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText('СТАРТ', btn.x + btn.w / 2, btn.y + btn.h / 2);
        ctx.restore();
    },

    drawGameOver(resultText, textColor) {
        const ctx = this.ctx;
        ctx.fillStyle = '#080614';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = 'bold 44px "Courier New"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = textColor;
        ctx.shadowBlur = 30;
        ctx.fillText(resultText, this.canvas.width / 2, this.canvas.height / 2);
        ctx.restore();
    },

    draw() {
        if (this.gameState === 'intro') {
            this.drawIntro();
            return;
        }

        const ctx = this.ctx;
        ctx.fillStyle = '#080614';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.strokeStyle = '#141026'; ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, this.canvas.height); ctx.stroke(); }
        
        ctx.fillStyle = '#070512'; ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        ctx.strokeStyle = '#5a4acf'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, this.canvas.height - 100); ctx.lineTo(this.canvas.width, this.canvas.height - 100); ctx.stroke();

        for (let p of this.particles) { ctx.fillStyle = `rgba(255, 0, 60, ${p.life * 2})`; ctx.fillRect(p.x, p.y, p.size, p.size); }
        for (let s of this.sparks) { ctx.fillStyle = s.color; ctx.fillRect(s.x, s.y, 3, 3); }
        for (let sl of this.slashLines) { ctx.strokeStyle = sl.color; ctx.lineWidth = sl.w; ctx.beginPath(); ctx.moveTo(sl.x1, sl.y1); ctx.lineTo(sl.x2, sl.y2); ctx.stroke(); }

        this.drawCharacter(ctx, this.sasha, '#00ffcc', '#00ffcc');
        this.drawCharacter(ctx, this.dasha, '#ff4b6e', '#ff4b6e');

        this.drawUI(ctx);
        this.drawControls(ctx);
    },

    loop(now) {
        if (this.gameState === 'idle' || this.gameState === 'gameover') return;
        
        let dt = (now - this.lastTime) / 1000; if (dt > 0.1) dt = 0.1;
        this.lastTime = now;
        
        if (this.gameState === 'playing' || this.gameState === 'intro') {
            this.update(dt); 
            this.draw();
            this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
        }
    },

    endFight() {
        this.gameState = 'gameover'; 
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        let resultText = this.sasha.hp > 0 ? "Ахахаха туда ботиху эту!!!" : "Изи, мелкая";
        let textColor = this.sasha.hp > 0 ? "#00ffcc" : "#ff4b6e";

        setTimeout(() => {
            this.drawGameOver(resultText, textColor);
        }, 50);

        setTimeout(() => {
            const gameScreen = document.getElementById('gameScreen');
            if (gameScreen) gameScreen.style.display = 'none';
            
            window.isFightModeActive = false;
            this.gameState = 'idle';
        }, 4000); 
    }
};
