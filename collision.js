export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function moveWithPlatforms(player, platforms, dt) {
  const oldX = player.x;
  player.x += player.vx * dt;
  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    if (player.vx > 0 && oldX + player.w <= platform.x + 2) player.x = platform.x - player.w;
    if (player.vx < 0 && oldX >= platform.x + platform.w - 2) player.x = platform.x + platform.w;
  }
  const oldY = player.y;
  player.y += player.vy * dt;
  player.grounded = false;
  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    if (player.vy >= 0 && oldY + player.h <= platform.y + 3) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
    } else if (player.vy < 0 && oldY >= platform.y + platform.h - 3) {
      player.y = platform.y + platform.h;
      player.vy = 0;
    }
  }
}
