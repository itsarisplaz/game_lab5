export class Player {
  constructor() { this.w = 30; this.h = 47; this.reset(); }
  reset() { this.x = 54; this.y = 413; this.vx = 0; this.vy = 0; this.grounded = true; this.coyote = .1; this.facing = 1; this.walk = 0; }
  update(dt, input) {
    const direction = Number(input.down('right')) - Number(input.down('left'));
    this.vx = direction * 255;
    if (direction) { this.facing = direction; this.walk += dt * 11; }
    this.coyote=this.grounded?.1:Math.max(0,this.coyote-dt);
    const jumped = input.takeJump() && this.coyote>0;
    if (jumped) { this.vy = -545; this.grounded = false; this.coyote=0; }
    this.vy = Math.min(this.vy + 1250 * dt, 750);
    return jumped;
  }
}
