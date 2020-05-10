
// TODO: Do Farnsworth for now...
const DOT_WAIT = 0.1;
const DASH_WAIT = 3 * DOT_WAIT;

// TODO: Fix audio

/**
 * Plays morse code
 */
export default class MorsePlayer {

    constructor() {
        this.audioCtx = new AudioContext();
        const gainNode = this.audioCtx.createGain();
        gainNode.connect(this.audioCtx.destination);
        const osc = this.audioCtx.createOscillator();
        osc.connect(gainNode);

        this.oscillator = osc;
    }

    start() {
        this.oscillator.frequency.setValueAtTime(0, 0);
        this.oscillator.start(0);
    }

    play(data) {

        let currTime = this.audioCtx.currentTime;

        for (const c of data) {
            if (c === '.') {
                this.oscillator.frequency.setValueAtTime(440, currTime);
                currTime += DOT_WAIT;

                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += DOT_WAIT;
            } else if (c === '-') {
                this.oscillator.frequency.setValueAtTime(440, currTime);
                currTime += DASH_WAIT;

                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += DOT_WAIT
            } else if (c === ' ') {
                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += DOT_WAIT;
            }
        }
    }

}