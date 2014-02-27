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
        Q.state.dec("ammo", 1);
      }
    }
  },
});


// Just a quick hack.
Q.component("shotgun", {
  added: function() {
    this.entity.p.asset = "player_with_shotgun.png";
    Q.audio.play("gun_cock.wav"); // Should have unique shotgun load sound.
  },

  extend: {
    fire: function() {
      if (this.p.bullets > 0 && !this.p.fire_block){
        Q.audio.play("shotgun_shot.wav");
        for(var i=-6; i < 6; i++){
          var spread = i*2;
          var speed = Math.random() * 750 + 750; // Speed between 750 and 1500.
          Q.stage().insert(new Q.ShotPellet(
          {
            x: this.p.x,
            y: this.p.y, 
            vx: speed * Math.cos(TO_RAD * (this.p.angle+90+spread)), 
            vy: speed * Math.sin(TO_RAD * (this.p.angle+90+spread)), 
          }
          ));
        }
        this.p.bullets -= 2;
        Q.state.dec("ammo", 2);
      }
    }
  },
});
