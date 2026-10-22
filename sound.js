export class Sound {
  constructor() { this.enabled = false; this.context = null; }
  toggle() { this.enabled = !this.enabled; return this.enabled; }
  play(kind) {
    if (!this.enabled) return;
    try {
      this.context ??= new (window.AudioContext || window.webkitAudioContext)();
      if (this.context.state === 'suspended') this.context.resume();
      const notes = {jump:[[310,.07]],collect:[[660,.08],[880,.12]],hurt:[[210,.12],[150,.18]],next:[[440,.09],[550,.09],[660,.15]],win:[[440,.1],[550,.1],[660,.1],[880,.25]]}[kind] || [];
      let at = this.context.currentTime;
      for (const [frequency,length] of notes) {
        const oscillator = this.context.createOscillator(), gain = this.context.createGain();
        oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.055, at+.01); gain.gain.exponentialRampToValueAtTime(.0001, at+length);
        oscillator.connect(gain).connect(this.context.destination); oscillator.start(at); oscillator.stop(at+length+.01); at += length*.9;
      }
    } catch { this.enabled = false; }
  }
}
