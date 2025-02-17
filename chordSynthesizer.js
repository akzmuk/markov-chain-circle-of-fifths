class ChordSynthesizer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentChord = 'C';
        this.masterGainNode = null;
        this.tempo = 30;
        this.waveform = 'sine';
        this.lowpassNode = null;
        this.highpassNode = null;
        this.isArpeggio = false;
        this.reverbNode = null;
        this.dryGainNode = null;
        this.wetGainNode = null;
        this.delayNode = null;
        this.delayFeedback = null;
        this.delayWet = null;
        this.octaveShift = 0;
        this.customTransitions = null;
        this.strictProgressionMode = false;
        this.progressionChords = null;
        
        this.CHORDS = {
            'C': 261.63,   // C4
            'G': 392.00,   // G4
            'D': 293.66,   // D4
            'A': 440.00,   // A4
            'E': 329.63,   // E4
            'B': 493.88,   // B4
            'F♯': 369.99,  // F♯4
            'D♭': 277.18,  // D♭4
            'A♭': 415.30,  // A♭4
            'E♭': 311.13,  // E♭4
            'B♭': 466.16,  // B♭4
            'F': 349.23,   // F4
            'Am': 440.00,  // A4
            'Em': 329.63,  // E4
            'Bm': 493.88,  // B4
            'F♯m': 369.99, // F♯4
            'C♯m': 277.18, // C♯4
            'G♯m': 415.30, // G♯4
            'D♯m': 311.13, // D♯4
            'B♭m': 466.16, // B♭4
            'Fm': 349.23,  // F4
            'Cm': 261.63,  // C4
            'Gm': 392.00,  // G4
            'Dm': 293.66   // D4
        };
        
        this.TRANSITIONS = {
            'C':  {'G': 0.16, 'F': 0.16, 'Am': 0.16, 'Dm': 0.16, 'Em': 0.16, 'A♭': 0.05, 'Fm': 0.05, 'E': 0.05, 'C♯m': 0.05},
            'G':  {'C': 0.16, 'D': 0.16, 'Em': 0.16, 'Am': 0.16, 'Bm': 0.16, 'E♭': 0.05, 'Cm': 0.05, 'B': 0.05, 'G♯m': 0.05},
            'D':  {'G': 0.16, 'A': 0.16, 'Bm': 0.16, 'Em': 0.16, 'F♯m': 0.16, 'B♭': 0.05, 'Gm': 0.05, 'F♯': 0.05, 'D♯m': 0.05},
            'A':  {'D': 0.16, 'E': 0.16, 'F♯m': 0.16, 'Bm': 0.16, 'C♯m': 0.16, 'F': 0.05, 'Dm': 0.05, 'D♭': 0.05, 'B♭m': 0.05},
            'E':  {'A': 0.16, 'B': 0.16, 'C♯m': 0.16, 'F♯m': 0.16, 'G♯m': 0.16, 'C': 0.05, 'Am': 0.05, 'A♭': 0.05, 'Fm': 0.05},
            'B':  {'E': 0.16, 'F♯': 0.16, 'G♯m': 0.16, 'C♯m': 0.16, 'D♯m': 0.16, 'G': 0.05, 'Em': 0.05, 'E♭': 0.05, 'Cm': 0.05},
            'F♯': {'B': 0.16, 'D♭': 0.16, 'G♯m': 0.16, 'D♯m': 0.16, 'B♭m': 0.16, 'D': 0.05, 'Bm': 0.05, 'B♭': 0.05, 'Gm': 0.05},
            'D♭': {'A♭': 0.16, 'B♭m': 0.16, 'F♯': 0.16, 'Fm': 0.16, 'D♯m': 0.16, 'A': 0.05, 'F♯m': 0.05, 'F': 0.05, 'Dm': 0.05},
            'A♭': {'D♭': 0.16, 'E♭': 0.16, 'Fm': 0.16, 'B♭m': 0.16, 'Cm': 0.16, 'E': 0.05, 'C♯m': 0.05, 'C': 0.05, 'Am': 0.05},
            'E♭': {'A♭': 0.16, 'B♭': 0.16, 'Cm': 0.16, 'Fm': 0.16, 'Gm': 0.16, 'B': 0.05, 'G♯m': 0.05, 'G': 0.05, 'Em': 0.05},
            'B♭': {'E♭': 0.16, 'F': 0.16, 'Gm': 0.16, 'Cm': 0.16, 'Dm': 0.16, 'F♯': 0.05, 'D♯m': 0.05, 'D': 0.05, 'Bm': 0.05},
            'F':  {'B♭': 0.16, 'C': 0.16, 'Dm': 0.16, 'Gm': 0.16, 'Am': 0.16, 'D♭': 0.05, 'B♭m': 0.05, 'A': 0.05, 'F♯m': 0.05},
            'Am': {'Dm': 0.16, 'Em': 0.16, 'F': 0.16, 'G': 0.16, 'C': 0.16, 'A♭': 0.05, 'Fm': 0.05, 'E': 0.05, 'C♯m': 0.05},
            'Em': {'Am': 0.16, 'Bm': 0.16, 'C': 0.16, 'D': 0.16, 'G': 0.16, 'E♭': 0.05, 'Cm': 0.05, 'B': 0.05, 'G♯m': 0.05},
            'Bm': {'Em': 0.16, 'F♯m': 0.16, 'G': 0.16, 'A': 0.16, 'D': 0.16, 'B♭': 0.05, 'Gm': 0.05, 'F♯': 0.05, 'D♯m': 0.05},
            'F♯m': {'Bm': 0.16, 'C♯m': 0.16, 'D': 0.16, 'E': 0.16, 'A': 0.16, 'F': 0.05, 'Dm': 0.05, 'D♭': 0.05, 'B♭m': 0.05},
            'C♯m': {'F♯m': 0.16, 'G♯m': 0.16, 'A': 0.16, 'B': 0.16, 'E': 0.16, 'C': 0.05, 'Am': 0.05, 'A♭': 0.05, 'Fm': 0.05},
            'G♯m': {'C♯m': 0.16, 'D♯m': 0.16, 'E': 0.16, 'F♯': 0.16, 'B': 0.16, 'G': 0.05, 'Em': 0.05, 'E♭': 0.05, 'Cm': 0.05},
            'D♯m': {'G♯m': 0.16, 'B♭m': 0.16, 'B': 0.16, 'D♭': 0.16, 'F♯': 0.16, 'D': 0.05, 'Bm': 0.05, 'B♭': 0.05, 'Gm': 0.05},
            'B♭m': {'D♯m': 0.16, 'Fm': 0.16, 'F♯': 0.16, 'A♭': 0.16, 'D♭': 0.16, 'A': 0.05, 'F♯': 0.05, 'F': 0.05, 'Dm': 0.05},
            'Fm': {'B♭m': 0.16, 'Cm': 0.16, 'A♭': 0.16, 'E♭': 0.16, 'A♭': 0.16, 'E': 0.05, 'C♯m': 0.05, 'C': 0.05, 'Am': 0.05},
            'Cm': {'Fm': 0.16, 'Gm': 0.16, 'E♭': 0.16, 'B♭': 0.16, 'E♭': 0.16, 'B': 0.05, 'G♯m': 0.05, 'G': 0.05, 'Em': 0.05},
            'Gm': {'Cm': 0.16, 'Dm': 0.16, 'B♭': 0.16, 'F': 0.16, 'B♭': 0.16, 'F♯': 0.05, 'D♯m': 0.05, 'D': 0.05, 'Bm': 0.05},
            'Dm': {'Gm': 0.16, 'Am': 0.16, 'F': 0.16, 'C': 0.16, 'F': 0.16, 'D♭': 0.05, 'B♭m': 0.05, 'A': 0.05, 'F♯m': 0.05}
        };

        this.CIRCLE_CHORDS = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
        this.CIRCLE_MINORS = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
        
        this.startBtn = document.getElementById('startBtn');
        this.bindEvents();
        this.updateUI();
        this.setupCircleOfFifths();
        this.populateChordSelector();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stop();
                this.startBtn.textContent = 'Start';
            } else {
                this.start();
                this.startBtn.textContent = 'Stop';
            }
        });
        
        const tempoSlider = document.getElementById('tempoSlider');
        tempoSlider.value = "30";
        document.getElementById('tempoValue').textContent = "30 BPM";
        
        tempoSlider.addEventListener('input', (e) => {
            this.tempo = parseInt(e.target.value);
            document.getElementById('tempoValue').textContent = `${this.tempo} BPM`;
        });

        const waveformSelect = document.getElementById('waveformSelect');
        waveformSelect.addEventListener('change', (e) => {
            this.waveform = e.target.value;
        });

        const lowpassSlider = document.getElementById('lowpassSlider');
        lowpassSlider.addEventListener('input', (e) => {
            this.lowpassFilter.frequency.value = e.target.value;
            document.getElementById('lowpassValue').textContent = `${e.target.value} Hz`;
        });

        const arpeggioToggle = document.getElementById('arpeggioToggle');
        arpeggioToggle.addEventListener('change', (e) => {
            this.isArpeggio = e.target.checked;
        });

        const reverbSlider = document.getElementById('reverbSlider');
        reverbSlider.addEventListener('input', (e) => {
            const reverbMix = e.target.value / 100;
            document.getElementById('reverbValue').textContent = `${e.target.value}%`;
            
            if (this.dryGainNode && this.wetGainNode) {
                this.dryGainNode.gain.setValueAtTime(1 - reverbMix, this.audioContext?.currentTime || 0);
                this.wetGainNode.gain.setValueAtTime(reverbMix, this.audioContext?.currentTime || 0);
            }
        });

        const delaySlider = document.getElementById('delaySlider');
        delaySlider.addEventListener('input', (e) => {
            const delayMix = e.target.value / 100;
            document.getElementById('delayValue').textContent = `${e.target.value}%`;
            
            if (this.delayWet) {
                this.delayWet.gain.setValueAtTime(delayMix, this.audioContext?.currentTime || 0);
            }
        });

        const octaveSlider = document.getElementById('octaveSlider');
        octaveSlider.addEventListener('input', (e) => {
            this.octaveShift = parseInt(e.target.value);
            document.getElementById('octaveValue').textContent = `${this.octaveShift >= 0 ? '+' : ''}${this.octaveShift}`;
        });

        const applyProgressionBtn = document.getElementById('applyProgressionBtn');
        applyProgressionBtn.addEventListener('click', () => {
            const progressionInput = document.getElementById('progressionInput');
            const progression = progressionInput.value.trim();
            
            if (progression) {
                this.updateTransitionProbabilities(progression);
                // Optional: provide user feedback
                progressionInput.style.borderColor = '#48A69D';
                setTimeout(() => {
                    progressionInput.style.borderColor = '';
                }, 1000);
            } else {
                // Optional: show error state
                progressionInput.style.borderColor = 'red';
            }
        });

        const strictProgressionToggle = document.getElementById('strictProgressionToggle');
        strictProgressionToggle.addEventListener('change', (e) => {
            this.strictProgressionMode = e.target.checked;
        });

        // Add new event binding for random progression
        const randomBtn = document.getElementById('randomProgressionBtn');
        randomBtn.addEventListener('click', () => {
            const length = parseInt(document.getElementById('progressionLength').value);
            const progression = this.generateRandomProgression(length);
            document.getElementById('progressionInput').value = progression;
            this.updateTransitionProbabilities(progression);
        });
    }

    setupCircleOfFifths() {
        const container = document.getElementById('circleOfFifths');
        const outerRadius = 120;
        const innerRadius = 70;
        const center = { x: 150, y: 150 };

        this.CIRCLE_CHORDS.forEach((chord, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const x = center.x + outerRadius * Math.cos(angle);
            const y = center.y + outerRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'chord-node';
            node.textContent = chord;
            node.style.left = `${x - 20}px`;
            node.style.top = `${y - 20}px`;
            
            container.appendChild(node);
        });

        this.CIRCLE_MINORS.forEach((chord, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const x = center.x + innerRadius * Math.cos(angle);
            const y = center.y + innerRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'chord-node minor';
            node.textContent = chord;
            node.style.left = `${x - 17.5}px`;
            node.style.top = `${y - 17.5}px`;
            
            container.appendChild(node);
        });
    }

    updateCircleOfFifths() {
        console.log("Updating circle for chord:", this.currentChord);
        const nodes = document.querySelectorAll('.chord-node');
        nodes.forEach(node => {
            node.classList.remove('active');
            // Trim any whitespace and ensure exact match
            if (node.textContent.trim() === this.currentChord.trim()) {
                console.log("Found matching node:", node.textContent);
                node.classList.add('active');
            }
        });
    }

    populateChordSelector() {
        const selector = document.getElementById('startingChord');
        const allChords = [...this.CIRCLE_CHORDS, ...this.CIRCLE_MINORS];
        
        allChords.forEach(chord => {
            const option = document.createElement('option');
            option.value = chord;
            option.textContent = chord;
            if (chord === this.currentChord) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            this.currentChord = e.target.value;
            this.updateUI();
        });
    }

    async createReverb() {
        const convolver = this.audioContext.createConvolver();
        
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2.5;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const decay = Math.exp(-i / (sampleRate * 0.5));
                channelData[i] = (Math.random() * 2 - 1) * decay;
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }

    createDelay() {
        const delay = this.audioContext.createDelay(2.0);
        delay.delayTime.value = 0.3;
        const feedback = this.audioContext.createGain();
        feedback.gain.value = 0.4;

        const wet = this.audioContext.createGain();
        wet.gain.value = 0;

        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);

        return { delay, feedback, wet };
    }

    async start() {
        if (this.isPlaying) return;
        
        this.currentChord = document.getElementById('startingChord').value;
        this.updateUI();
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        
        const delayNetwork = this.createDelay();
        this.delayNode = delayNetwork.delay;
        this.delayFeedback = delayNetwork.feedback;
        this.delayWet = delayNetwork.wet;
        
        this.reverbNode = await this.createReverb();
        this.dryGainNode = this.audioContext.createGain();
        this.wetGainNode = this.audioContext.createGain();
        
        const reverbValue = document.getElementById('reverbSlider').value / 100;
        const delayValue = document.getElementById('delaySlider').value / 100;
        
        this.dryGainNode.gain.value = 1 - reverbValue;
        this.wetGainNode.gain.value = reverbValue;
        this.delayWet.gain.value = delayValue;
        
        this.lowpassFilter = this.audioContext.createBiquadFilter();
        this.lowpassFilter.type = 'lowpass';
        this.lowpassFilter.frequency.value = 20000;
        
        this.tempo = parseInt(document.getElementById('tempoSlider').value);
        
        this.waveform = document.getElementById('waveformSelect').value;
        
        this.isArpeggio = document.getElementById('arpeggioToggle').checked;
        
        this.isPlaying = true;
        
        const baseFreq = this.CHORDS[this.currentChord];
        const type = this.currentChord.endsWith('m') ? 'minor' : 'major';
        const duration = this.playChord(baseFreq, type);
        
        setTimeout(() => {
            this.currentChord = this.getNextChord();
            this.updateUI();
            this.playNextChord();
        }, duration * 1000);
    }

    stop() {
        if (!this.isPlaying) return;
        
        const startingChordSelect = document.getElementById('startingChord');
        startingChordSelect.value = this.currentChord;
        
        this.isPlaying = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.lowpassNode = null;
            this.highpassNode = null;
            this.reverbNode = null;
            this.dryGainNode = null;
            this.wetGainNode = null;
            this.delayNode = null;
            this.delayFeedback = null;
            this.delayWet = null;
        }
    }

    createOscillator(frequency, startTime, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        const adjustedFrequency = frequency * Math.pow(2, this.octaveShift);
        oscillator.frequency.value = adjustedFrequency;
        
        oscillator.type = this.waveform;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.lowpassFilter);
        this.lowpassFilter.connect(this.dryGainNode);
        this.lowpassFilter.connect(this.wetGainNode);
        this.lowpassFilter.connect(this.delayNode);
        
        this.dryGainNode.connect(this.audioContext.destination);
        this.wetGainNode.connect(this.reverbNode);
        this.reverbNode.connect(this.audioContext.destination);
        this.delayWet.connect(this.audioContext.destination);
        
        return oscillator;
    }

    playChord(baseFreq, type = 'major') {
        const now = this.audioContext.currentTime;
        const duration = 60 / this.tempo;
        
        const multipliers = type === 'major' 
            ? [1, 1.25, 1.5, 1.25]
            : [1, 1.2, 1.5, 1.2];
        
        if (this.isArpeggio) {
            const noteDelay = duration / multipliers.length;
            multipliers.forEach((mult, index) => {
                const osc = this.createOscillator(baseFreq * mult, now + (index * noteDelay), noteDelay);
                osc.start(now + (index * noteDelay));
                osc.stop(now + (index * noteDelay) + noteDelay);
            });
        } else {
            multipliers.forEach(mult => {
                const osc = this.createOscillator(baseFreq * mult, now, duration);
                osc.start(now);
                osc.stop(now + duration);
            });
        }
        
        return duration;
    }

    getNextChord() {
        console.log("%cCurrent chord:", "color: blue; font-weight: bold", this.currentChord);
        
        // If we have custom transitions and current chord has defined transitions
        if (this.customTransitions && this.customTransitions[this.currentChord]) {
            const transitions = this.customTransitions[this.currentChord];
            const random = Math.random();
            let sum = 0;
            
            for (const [nextChord, probability] of Object.entries(transitions)) {
                sum += probability;
                if (random < sum) {
                    console.log(`Using custom transition to ${nextChord}`);
                    return nextChord;
                }
            }
        }
        
        // If we reached a chord with no custom transitions defined
        if (this.strictProgressionMode && this.progressionChords) {
            // In strict mode, cycle back to the first chord
            console.log("Strict mode: cycling back to first chord");
            return this.progressionChords[0];
        } else {
            // In non-strict mode, use default transitions
            console.log("Using default transitions");
            const defaultTransitions = this.TRANSITIONS[this.currentChord];
            const random = Math.random();
            let sum = 0;
            
            for (const [nextChord, probability] of Object.entries(defaultTransitions)) {
                sum += probability;
                if (random < sum) {
                    console.log(`Using default transition to ${nextChord}`);
                    return nextChord;
                }
            }
            
            // Fallback to first default transition
            return Object.keys(defaultTransitions)[0];
        }
    }

    updateUI() {
        document.getElementById('currentChord').textContent = this.currentChord;
        document.getElementById('centerChord').textContent = this.currentChord;
        
        const transitionsDiv = document.getElementById('transitions');
        transitionsDiv.innerHTML = '<h4>Possible Transitions:</h4>';
        
        // Use the same logic as getNextChord to determine which transitions to show
        const currentTransitions = (this.customTransitions && this.customTransitions[this.currentChord])
            ? this.customTransitions[this.currentChord]
            : this.TRANSITIONS[this.currentChord];
        
        Object.entries(currentTransitions).forEach(([chord, prob]) => {
            const div = document.createElement('div');
            div.className = 'transition';
            div.textContent = `${this.currentChord} → ${chord}: ${(prob * 100).toFixed(1)}%`;
            transitionsDiv.appendChild(div);
        });

        this.updateCircleOfFifths();
    }

    playNextChord() {
        if (!this.isPlaying) return;
        
        console.log('Playing chord:', this.currentChord);
        
        const baseFreq = this.CHORDS[this.currentChord];
        const type = this.currentChord.endsWith('m') ? 'minor' : 'major';
        const duration = this.playChord(baseFreq, type);
        
        // Update UI before getting next chord
        this.updateUI();
        
        // Get and set next chord
        const nextChord = this.getNextChord();
        console.log('Next chord will be:', nextChord);
        this.currentChord = nextChord;
        
        setTimeout(() => this.playNextChord(), duration * 1000);
    }

    static generateTransitionMatrix(progression) {
        // Split the progression into an array of chords
        const chords = progression.split(' ').filter(chord => chord.length > 0);
        console.log("Processing progression:", chords);
        
        // Create a transition matrix
        const transitions = {};
        
        // Create transitions for all chords except the last one
        for (let i = 0; i < chords.length - 1; i++) {
            const currentChord = chords[i];
            const nextChord = chords[i + 1];
            
            if (!transitions[currentChord]) {
                transitions[currentChord] = {};
            }
            
            transitions[currentChord][nextChord] = (transitions[currentChord][nextChord] || 0) + 1;
            console.log(`Added transition: ${currentChord} → ${nextChord}`);
        }
        
        // Normalize probabilities
        for (const chord in transitions) {
            const total = Object.values(transitions[chord]).reduce((sum, count) => sum + count, 0);
            for (const nextChord in transitions[chord]) {
                transitions[chord][nextChord] = transitions[chord][nextChord] / total;
                console.log(`Normalized ${chord} → ${nextChord}: ${transitions[chord][nextChord]}`);
            }
        }
        
        console.log("Final transition matrix:", transitions);
        return transitions;
    }

    updateTransitionProbabilities(progression) {
        console.log("Updating transitions for progression:", progression);
        
        // Clear everything if input is empty
        if (!progression.trim()) {
            this.customTransitions = null;
            this.progressionChords = null;
            this.strictProgressionMode = false;
            document.getElementById('strictProgressionToggle').checked = false;
            console.log("Empty input - reverting to default transitions");
            this.updateUI();
            return;
        }
        
        // Store the progression chords
        this.progressionChords = progression.split(' ').filter(chord => chord.length > 0);
        
        // Set the starting chord to the first chord in the progression
        if (this.progressionChords.length > 0) {
            const startingChord = this.progressionChords[0];
            document.getElementById('startingChord').value = startingChord;
            this.currentChord = startingChord;
        }
        
        // Generate and store new transitions
        this.customTransitions = ChordSynthesizer.generateTransitionMatrix(progression);
        
        console.log("New state:", {
            progressionChords: this.progressionChords,
            customTransitions: this.customTransitions,
            strictMode: this.strictProgressionMode
        });
        
        this.updateUI();
    }

    generateRandomProgression(length) {
        const allChords = [...this.CIRCLE_CHORDS, ...this.CIRCLE_MINORS];
        let progression = [];
        let currentChord = allChords[Math.floor(Math.random() * allChords.length)];
        
        for (let i = 0; i < length; i++) {
            progression.push(currentChord);
            
            // Get possible next chords from transition matrix
            const transitions = this.TRANSITIONS[currentChord];
            const random = Math.random();
            let sum = 0;
            
            // Select next chord based on transition probabilities
            for (const [nextChord, probability] of Object.entries(transitions)) {
                sum += probability;
                if (random < sum) {
                    currentChord = nextChord;
                    break;
                }
            }
        }
        
        return progression.join(' ');
    }
}

const synth = new ChordSynthesizer();