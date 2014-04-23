Q.component("gun", {
  added: function() {
    this.entity.p.asset = this.entity.p.pistol_sprite;
    Q.audio.play("gun_cock.wav");
  },

  extend: {
    fire: function() {
      if (this.p.bullets > 0 && !this.p.fire_block){
        Q.audio.play("pistol_shot.wav");
        Q.stage().insert(new Q.Bullet(
        { 
          x: this.p.x + 100 * Math.cos(TO_RAD * (this.p.angle+90)),
          y: this.p.y + 100 * Math.sin(TO_RAD * (this.p.angle+90)), 
          vx: 1000 * Math.cos(TO_RAD * (this.p.angle+90)), 
          vy: 1000 * Math.sin(TO_RAD * (this.p.angle+90)), 
        }
        ));
        this.p.bullets -= 1;
        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("ammo", 1);
        }
      }
    }
  },
});

Q.component("shotgun", {
  added: function() {
    this.entity.p.asset = this.entity.p.shotgun_sprite;
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
            x: this.p.x + 100 * Math.cos(TO_RAD * (this.p.angle+90)),
            y: this.p.y + 100 * Math.sin(TO_RAD * (this.p.angle+90)), 
            vx: speed * Math.cos(TO_RAD * (this.p.angle+90+spread)), 
            vy: speed * Math.sin(TO_RAD * (this.p.angle+90+spread)), 
          }
          ));
        }
        this.p.bullets -= 4;
        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("ammo", 4);
        }
      }
    }
  },
});

Q.component("assaultrifle", {
  added: function() {
    this.entity.p.asset = this.entity.p.rifle_sprite;
    Q.audio.play("gun_cock.wav");
  },
  
  extend: {
    fire: function() {
      if (this.p.bullets > 0 && !this.p.fire_block){
        for(var i=160; i>=100; i-=30){
          Q.audio.play("assault_rifle_shot.wav");
          Q.stage().insert(new Q.Bullet(
          {
            x: this.p.x + i * Math.cos(TO_RAD * (this.p.angle+90)),
            y: this.p.y + i * Math.sin(TO_RAD * (this.p.angle+90)), 
            vx: 1000 * Math.cos(TO_RAD * (this.p.angle+90)), 
            vy: 1000 * Math.sin(TO_RAD * (this.p.angle+90)), 
          }
          ));
        }

        this.p.bullets -= 3;
        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("ammo", 3);
        }
      }
    }
  },
});

Q.component("machinegun", {
  added: function() {
    this.entity.p.asset = this.entity.p.mg_sprite;
    Q.audio.play("gun_cock.wav");
  },

  extend: {
    fire: function() {
      if (this.p.bullets > 0 && this.p.fire_delay <= 0){
        Q.audio.play("gun_shot.wav");
        Q.stage().insert(new Q.Bullet(
        { 
          x: this.p.x + 100 * Math.cos(TO_RAD * (this.p.angle+90)),
          y: this.p.y + 100 * Math.sin(TO_RAD * (this.p.angle+90)), 
          vx: 1000 * Math.cos(TO_RAD * (this.p.angle+90)), 
          vy: 1000 * Math.sin(TO_RAD * (this.p.angle+90)), 
        }
        ));

        this.p.bullets -= 1;
        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("ammo", 1);
        }
      }
    }
  },
});

Q.component("rocketlauncher", {
  added: function() {
    this.entity.p.asset = this.entity.p.rocket_sprite;
    Q.audio.play("gun_cock.wav");
  },

  extend: {
    fire: function() {
      if (this.p.bullets > 0 && !this.p.fire_block){
        Q.audio.play("rocket_fire.wav");
        Q.stage().insert(new Q.Rocket(
        { 
          angle: this.p.angle,
          x: this.p.x + 100 * Math.cos(TO_RAD * (this.p.angle+90)),
          y: this.p.y + 100 * Math.sin(TO_RAD * (this.p.angle+90)), 
          vx: 500 * Math.cos(TO_RAD * (this.p.angle+90)), 
          vy: 500 * Math.sin(TO_RAD * (this.p.angle+90)), 
        }
        ));

        this.p.bullets -= 5;
        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("ammo", 5);
        }
      }
    }
  },
});
