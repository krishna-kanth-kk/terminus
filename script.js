const apiKey = "";
let audioStarted = false;
let bgmAudio = new Audio();
bgmAudio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; 
bgmAudio.loop = true;
bgmAudio.volume = 0.3;
bgmAudio.playbackRate = 0.8;

const errorSound = new Audio('https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3');

function toggleAudio() {
    const icon = document.getElementById('audio-icon');
    const status = document.getElementById('audio-status');
    const toggle = document.getElementById('audio-toggle');

    if (!audioStarted) {
        bgmAudio.play();
        audioStarted = true;
        icon.classList.replace('fa-volume-xmark', 'fa-volume-high');
        status.innerText = "BGM: ON";
        toggle.classList.add('active');
    } else {
        bgmAudio.pause();
        audioStarted = false;
        icon.classList.replace('fa-volume-high', 'fa-volume-xmark');
        status.innerText = "BGM: OFF";
        toggle.classList.remove('active');
    }
}

async function playTTS(text) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Say in a deep, mysterious terminal voice: ${text}` }] }],
                generationConfig: { 
                    responseModalities: ["AUDIO"], 
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } } 
                }
            })
        });
        const result = await response.json();
        const pcmData = result.candidates[0].content.parts[0].inlineData.data;
        
        const blob = new Blob([Uint8Array.from(atob(pcmData), c => c.charCodeAt(0))], { type: 'audio/l16' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
    } catch (e) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 0.5;
        window.speechSynthesis.speak(utterance);
    }
}

const stages = [
    {
        type: 'intro',
        title: 'CASE FILE: TERMINUS',
        text: '<p style="text-align:center; font-size:1.5rem;">Accessing restricted files...</p><br><p style="text-align:center; color: var(--text-dim);">Authorized personnel only. Proceed with caution.</p>',
        btnText: 'INITIALIZE SYSTEM',
        hint: ''
    },
    {
        type: 'info',
        title: 'THE BRIEFING',
        text: 'Welcome, Detective. We are chasing a ghost. The media calls him the "Terminus Mastermind".<br><br>He is brilliant, calculating, and never leaves a trail leading forward. He only leaves the <span class="highlight">results</span> of his crimes.<br><br>To catch him, you must adopt his philosophy. You must <span class="danger-text">Begin with the End in mind</span>. Look at his final goal, and reverse-engineer his path. Are you ready?',
        btnText: 'I UNDERSTAND',
        hint: ''
    },
    {
        type: 'choice',
        title: '01: THE ESCAPE ROUTE',
        text: 'We found a burned map at the first crime scene. The destination point (X) is marked on <span class="highlight">Lelouch</span>. Terminus used a train to get there.<br><br>Which train ticket do we need to track in the transit database?',
        options: [
            { label: 'Train Alpha (Ends at Tokyo)', value: 'A', icon: 'fa-train' },
            { label: 'Train Beta (Ends at Lelouch)', value: 'B', icon: 'fa-train-subway' },
            { label: 'Train Delta (Ends at Kobe)', value: 'C', icon: 'fa-train-tram' }
        ],
        correct: 'B',
        hint: 'Look at where he ended up. Track the transport that goes to that exact end.'
    },
    {
        type: 'input',
        title: '02: THE TIMELINE',
        text: 'We found his journal. The last entry reads:<br><div class="clue-box">"The target will be eliminated at exactly 21:00. I need precisely 40 minutes of prep time inside the building before the strike."</div><br>Working backward from his end goal, at what exact time (HH:MM) must Terminus enter the building?',
        correct: '20:20',
        placeholder: 'HH:MM',
        hint: 'Subtract 40 minutes from 21:00.'
    },
    {
        type: 'input',
        title: '03: THE SAFE CODE',
        text: 'We located his safe. A sticky note on it reads:<br><div class="clue-box">"Build it backwards. The LAST digit is 4.<br>The 3rd digit is half of the last.<br>The 2nd digit is the 3rd plus 5.<br>The 1st digit is the 2nd minus 4."</div><br>Enter the 4-digit code.',
        correct: '3724',
        placeholder: 'XXXX',
        hint: 'End = 4. 3rd = 4/2 = 2. 2nd = 2+5=7. 1st = 7-4=3.'
    },
    {
        type: 'choice',
        title: '04: THE POISON',
        text: 'The autopsy report is in. The victim\'s blood became corrosive enough to damage tissues rapidly, far below its natural balance. We found three unmarked vials in the suspect\'s lab. Which one was the murder weapon?',
        options: [
            { label: 'Vial A: Enhances basicity', value: 'A', icon: 'fa-vial' },
            { label: 'Vial B: Introduces a strong proton donor', value: 'B', icon: 'fa-vial-virus' },
            { label: 'Vial C: Maintains equilibrium', value: 'C', icon: 'fa-vials' }
        ],
        correct: 'B',
        hint: 'Match the weapon to the final state of the victim.'
    },
    {
        type: 'choice',
        title: '05: THE ALIBI',
        text: 'Terminus had to be at the docks at <span class="highlight">22:00</span> to execute the plan. We have three suspects.<br><br>Suspect 1 finishes work at 21:45 (30m drive to docks).<br>Suspect 2 finishes at 21:00 (1.5hr drive to docks).<br>Suspect 3 finishes at 21:30 (20m drive to docks).<br><br>Who is Terminus?',
        options: [
            { label: 'Suspect 1', value: '1', icon: 'fa-user' },
            { label: 'Suspect 2', value: '2', icon: 'fa-user-tie' },
            { label: 'Suspect 3', value: '3', icon: 'fa-user-secret' }
        ],
        correct: '3',
        hint: 'Calculate their arrival times. Suspect 1 arrives 22:15. Suspect 2 arrives 22:30. Suspect 3 arrives 21:50.'
    },
    {
        type: 'choice',
        title: '06: THE DATA PACKET',
        text: 'Terminus is exfiltrating data. He needs the transfer to be <span class="highlight">guaranteed and error-free</span>, regardless of how long it takes. Speed is secondary to absolute integrity. <br><br>Which transport protocol did he choose for the final handshake?',
        options: [
            { label: 'UDP', value: 'UDP', icon: 'fa-bolt-lightning' },
            { label: 'TCP', value: 'TCP', icon: 'fa-handshake' },
            { label: 'ICMP', value: 'ICMP', icon: 'fa-circle-info' }
        ],
        correct: 'TCP',
        hint: 'Look at the goal: "Guaranteed and error-free." Choose the protocol that focuses on the end result of data integrity.'
    },
    {
        type: 'input',
        title: '07: THE CIPHER',
        text: 'Terminus encrypts his files by writing words completely backwards. Decrypt this high-priority target file name:<br><br><span class="highlight" style="font-size:2rem; letter-spacing: 5px;">R E K C A H  E T N  A L I G I V</span>',
        correct: 'VIGILANTE HACKER',
        placeholder: 'TYPE DECRYPTED TEXT',
        hint: 'Read it from right to left.'
    },
    {
        type: 'choice',
        title: '08: THE MAZE',
        text: 'We are tracking him through an underground grid. He left a taunting message:<br><div class="clue-box">"I will exit through the North door. Before that, I went West. Before that, I went North."</div><br>If you trace his steps BACKWARDS starting from the North Exit (Move South, then East, then South), where did his journey begin?',
        options: [
            { label: 'North-West Room', value: 'NW', icon: 'fa-door-closed' },
            { label: 'South-East Room', value: 'SE', icon: 'fa-door-open' },
            { label: 'Center Room', value: 'C', icon: 'fa-door-closed' }
        ],
        correct: 'SE',
        hint: 'Move South, then East, then South. You end up bottom-right.'
    },
    {
        type: 'input',
        title: '09: EXPONENTIAL REVERSE',
        text: 'Terminus needs a server farm with <span class="highlight">1,024</span> nodes to crash the global bank. His virus is self-replicating: every hour, the number of nodes it infects <span class="danger-text">doubles</span>.<br><br>If the goal is 1,024 nodes at 12:00 PM, at what time did the virus only have 128 nodes?',
        correct: '09:00 AM',
        placeholder: 'HH:MM AM/PM',
        hint: 'Work backwards. 12:00 (1024) -> 11:00 (512) -> 10:00 (256) -> 09:00 (128).'
    },
    {
        type: 'input',
        title: '10: THE PARADOX ENCRYPTION',
        text: 'The terminal asks for a key. <br><div class="clue-box">"I am the beginning of Eternity, the end of Time and Space. I am at the start of every End, and the end of every Place."</div><br>Identify the single character that defines the End.',
        correct: 'E',
        placeholder: 'TAP TO ENTER',
        hint: 'Focus on the literal words: End, Time, Space, Place.'
    },
    {
        type: 'input',
        title: '11: REVERSE ARCHITECTURE',
        text: 'You found a blueprint for a complex vault. To unlock the final gate, you must input the <span class="highlight">Mirror-Sum</span>. <br><br>The vault was built using a Fibonacci sequence for its internal supports (1, 1, 2, 3, 5, 8...). The vault has 8 support beams. What is the sum of the sequence <span class="danger-text">reversed</span> starting from the 8th term back to the 1st?',
        correct: '54',
        placeholder: 'ENTER SUM',
        hint: 'Sum of 21, 13, 8, 5, 3, 2, 1, 1.'
    },
    {
        type: 'choice',
        title: '12: THE CHESSMASTER (GRANDMASTER LEVEL)',
        text: 'Terminus left a chessboard. The game is in progress. He says: <br><div class="clue-box">"A Master never moves a piece without knowing exactly how the board will look when the opponent resigns. Look at the board: White is two moves from Checkmate. If the Black King is currently trapped on H8 and White has a Queen on G3, where must the White Rook move to ensure the final blow is dealt from the H-file?"</div>',
        options: [
            { label: 'Rook to H1', value: 'H1', icon: 'fa-chess-rook' },
            { label: 'Rook to G7', value: 'G7', icon: 'fa-chess-knight' },
            { label: 'Rook to A1', value: 'A1', icon: 'fa-chess-board' }
        ],
        correct: 'H1',
        hint: 'If the end goal is a blow from the H-file, the Rook must position itself on that vertical line.'
    },
    {
        type: 'input',
        title: '13: THE COMPONENT TRACE',
        text: 'The heist required a device consuming <span class="highlight">240 Watts</span> of power at exactly <span class="danger-text">12 Volts</span>. <br><br>In the scrap pile, we found three types of power rails: <br>1. 30 Amp Rails<br>2. 25 Amp Rails<br>3. 20 Amp Rails<br><br>Terminus always buys the <span class="highlight">exact</span> Amperage needed for the end goal (Amps = Watts / Volts). Which rail did he buy?',
        correct: '20',
        placeholder: 'ENTER AMPERAGE',
        hint: 'Divide the Power (240) by the Voltage (12) to find the Amp requirement.'
    },
    {
        type: 'input',
        title: '14: THE INTERROGATION',
        text: 'You caught him. Terminus smiles from the interrogation chair.<br><br><div class="clue-box">"My end goal was always to be caught by YOU. Because while you chased me here, my partner planted the final bomb exactly where this game began."</div><br>Where is the final bomb located?',
        correct: 'Lelouch',
        placeholder: 'ENTER LOCATION',
        hint: 'Look back at Puzzle 01. Where was the X?'
    },
    {
        type: 'input',
        title: '15: THE FINAL DOOR',
        text: 'You rush to Lelouch. The bomb has a digital keypad with a text prompt:<br><br><div class="clue-box">"To defuse me, tell me the core philosophy you used to solve every single puzzle today. What must you do with the end?"</div>',
        correct: 'BEGIN WITH THE END IN MIND',
        placeholder: 'ENTER 6 WORD PHRASE',
        hint: 'It is the title of Habit 2.'
    },
    {
        type: 'info',
        title: 'SYSTEM OVERRIDE',
        text: '<h1 class="glitch" style="color:var(--neon-cyan); font-family:\'Special Elite\', cursive;">BOMB DEFUSED</h1><br><p>The metal casing opens. There is no explosive inside. Just a mirror, reflecting your own face.</p><br><p>And a final audio file labeled: <i>"The Real Target."</i></p>',
        btnText: 'PLAY AUDIO',
        hint: '',
        isAudioStage: true
    },
    {
        type: 'info',
        title: 'THE REVEAL',
        text: 'There was no murder. There was no bomb. <br><br>This entire case was an Architect\'s Exam.<br><br>For the last 15 stages, you successfully solved complex problems by identifying the final outcome first, and reverse-engineering the steps to get there.',
        btnText: 'CONTINUE',
        hint: ''
    },
    {
        type: 'info',
        title: 'HABIT 2: THE REALITY',
        text: 'You just used intense logic to plan a fictional detective\'s path.<br><br>But are you doing this for your own life?<br><br>If you don\'t define your own "End" (your career, your values, your legacy), society, distractions, and other people will define it for you.<br><br><span class="danger-text" style="font-size: 1.5rem;">DESIGN YOUR ENDING. OR BECOME SOMEONE ELSE\'S SCRIPT.</span>',
        btnText: 'FINISH PROTOCOL',
        hint: ''
    },
    {
        type: 'intro',
        title: 'PROTOCOL COMPLETE',
        text: '<p style="color:var(--neon-cyan); font-size:2rem; margin-bottom: 20px;">SURVIVAL CONFIRMED</p><br><p>Team Status: <span class="highlight">ARCHITECTS OF THE FUTURE</span></p>',
        btnText: 'RESTART SYSTEM',
        hint: ''
    }
];

let currentStage = 0;
const contentArea = document.getElementById('content-area');
const stageDisplay = document.getElementById('stage-display');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');

function renderStage(index) {
    if (index >= stages.length) {
        currentStage = 0;
        index = 0;
    }

    const stage = stages[index];
    stageDisplay.innerText = `STAGE: ${index.toString().padStart(2, '0')}/20`;
    
    hintText.style.display = 'none';
    if(stage.hint && stage.hint !== '') {
        hintBtn.style.display = 'block';
        hintText.innerText = stage.hint;
    } else {
        hintBtn.style.display = 'none';
    }

    let html = '';

    if (stage.type === 'intro' || stage.type === 'info') {
        const btnOnClick = stage.isAudioStage ? `triggerAudioAndNext()` : `nextStage()`;
        html = `
            <h1 class="title ${stage.type === 'intro' ? 'glitch' : ''}">${stage.title}</h1>
            <div class="narrative-text">${stage.text}</div>
            <button class="btn btn-danger" onclick="${btnOnClick}">${stage.btnText}</button>
        `;
    } 
    else if (stage.type === 'choice') {
        let optionsHtml = stage.options.map(opt => `
            <div class="option-card" onclick="checkChoice('${opt.value}', '${stage.correct}')">
                <i class="fa-solid ${opt.icon}"></i>
                <span>${opt.label}</span>
            </div>
        `).join('');

        html = `
            <h2 class="subtitle">${stage.title}</h2>
            <div class="narrative-text">${stage.text}</div>
            <div class="options-grid">
                ${optionsHtml}
            </div>
        `;
    }
    else if (stage.type === 'input') {
        html = `
            <h2 class="subtitle">${stage.title}</h2>
            <div class="narrative-text">${stage.text}</div>
            <div class="input-group">
                <input type="text" id="userInput" placeholder="${stage.placeholder}" autocomplete="off" onkeypress="handleEnter(event, '${stage.correct}')">
                <button class="btn" onclick="checkInput('${stage.correct}')">SUBMIT DATA</button>
            </div>
        `;
    }

    contentArea.innerHTML = html;
    const inputEl = document.getElementById('userInput');
    if(inputEl) inputEl.focus();
}

function triggerAudioAndNext() {
    playTTS("The Real Target... is your own potential. You have been tested. You have been measured. And you have been found capable. Now, go forth and build your end.");
    setTimeout(() => {
        nextStage();
    }, 6000);
}

function nextStage() {
    currentStage++;
    renderStage(currentStage);
}

function showError() {
    if (audioStarted) {
        errorSound.currentTime = 0;
        errorSound.play();
    }
    const container = document.getElementById('app-container');
    container.classList.remove('shake');
    void container.offsetWidth; 
    container.classList.add('shake');
    
    const inputEl = document.getElementById('userInput');
    if(inputEl) {
        inputEl.value = '';
        inputEl.placeholder = 'ACCESS DENIED';
        setTimeout(() => { 
            if (stages[currentStage]) inputEl.placeholder = stages[currentStage].placeholder; 
        }, 1000);
    }
}

function checkChoice(selected, correct) {
    if (selected === correct) {
        nextStage();
    } else {
        showError();
    }
}

function checkInput(correctStr) {
    const inputEl = document.getElementById('userInput');
    const userVal = inputEl.value.trim().toUpperCase();
    if (userVal === correctStr.toUpperCase()) {
        nextStage();
    } else {
        showError();
    }
}

function handleEnter(e, correctStr) {
    if (e.key === 'Enter') {
        checkInput(correctStr);
    }
}

function showHint() {
    hintText.style.display = hintText.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    renderStage(0);
};