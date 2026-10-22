const keyMap = {ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',KeyW:'jump',ArrowUp:'jump'};

export class Input {
  constructor() {
    this.held = new Set();
    this.jumpQueued = false;
    window.addEventListener('keydown', e => {
      const action = keyMap[e.code];
      if (!action) return;
      e.preventDefault();
      if (action === 'jump' && !this.held.has(action)) this.jumpQueued = true;
      this.held.add(action);
    });
    window.addEventListener('keyup', e => { if (keyMap[e.code]) this.held.delete(keyMap[e.code]); });
    window.addEventListener('blur', () => this.clear());
    document.querySelectorAll('[data-control]').forEach(button => {
      const action = button.dataset.control;
      const press = e => {
        e.preventDefault();
        button.setPointerCapture(e.pointerId);
        if (action === 'jump' && !this.held.has(action)) this.jumpQueued = true;
        this.held.add(action);
      };
      const release = e => { e.preventDefault(); this.held.delete(action); };
      button.addEventListener('pointerdown', press);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
    });
  }
  down(action) { return this.held.has(action); }
  takeJump() { const result = this.jumpQueued; this.jumpQueued = false; return result; }
  clear() { this.held.clear(); this.jumpQueued = false; }
}
