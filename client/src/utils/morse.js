
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
                currTime += 0.1;

                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += 0.1
            } else if (c === '-') {
                this.oscillator.frequency.setValueAtTime(440, currTime);
                currTime += 0.2;

                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += 0.1
            } else if (c === ' ') {
                this.oscillator.frequency.setValueAtTime(0, currTime);
                currTime += 0.1
            }
        }
    }

}