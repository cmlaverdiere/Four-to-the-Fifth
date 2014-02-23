Q.component("gun", {
  added: function() {
    this.entity.p.asset = "player_with_gun.png";
    Q.audio.play("gun_cock.wav");
  },

  extend: {
    fire: function() {
      if (this.p.bullets > 0 && !this.p.fire_block){
        Q.audio.play("gun_shot.wav");
        Q.stage().insert(new Q.Bullet(
        { 
          x: this.p.x,
          y: this.p.y, 
          vx: 1000 * Math.cos(TO_RAD * (this.p.angle+90)), 
          vy: 1000 * Math.sin(TO_RAD * (this.p.angle+90)), 
        }
        ));

        this.p.bullets -= 1;
      }
    }
  },
});
