// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "player.png",
      bullets: 0,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY,
      damage: 2,
      sprinting: false,
      stepDistance: 5,
      stepDelay: 0.01,
      swinging_sword: false,
      sword: null,
      type: Q.SPRITE_PLAYER,
      x: 300,
      y: 300
    });

    this.add('2d, stepControls');

    Q.input.on("fire", this, function(){ this.fire() });
    Q.input.on("wep1", this, "put_away_wep");
    Q.input.on("wep2", this, "equip_gun");
    Q.input.on("sword", this, "swing_sword");
  },

  equip_gun: function() {
    this.add("gun"); 
  },

  put_away_wep: function() {
    this.del("gun"); 
    this.p.asset = "player.png";
  },

  step: function(dt) {
    // Update player angle based on mouse position.
    if (!this.p.swinging_sword){

      // We keep track of the previous mouse coordinates each step.
      // We then only update the angle when the mouse coords have changed.
      if( prev_mouse_coords[0] != Q.inputs['mouseX'] || prev_mouse_coords[1] != Q.inputs['mouseY'] ){
        var dmx = Q.inputs['mouseX'] - this.p.x;
        var dmy = Q.inputs['mouseY'] - this.p.y;

        prev_mouse_coords = [Q.inputs['mouseX'], Q.inputs['mouseY']];  
        this.p.angle = -1 * TO_DEG * Math.atan2(dmx, dmy);
      }
    }

    // Send event to all enemies to look at and chase the player.
    var enemies = Q("Enemy");
    enemies.trigger("face_player", this);
    enemies.trigger("chase_player", this);

    // When pressing the 'forward' key, the player follows mouse.
    if(Q.inputs['forward']){
    	this.p.x += (this.p.stepDistance) * Math.cos(TO_RAD * (this.p.angle+90));
      this.p.y += (this.p.stepDistance) * Math.sin(TO_RAD * (this.p.angle+90));
    }

    // Sprint activation and deactivation.
    if(Q.inputs['sprint']){
      if(!this.p.sprinting){
        this.p.sprinting = true; 
        this.p.stepDistance *= 2;
      }
    } else {
      if(this.p.sprinting){
        this.p.sprinting = false; 
        this.p.stepDistance /= 2;
      } 
    }

    // Sword swinging animation
    if(this.p.swinging_sword){
      this.p.angle += 10;
      if(this.p.angle > 360){
        Q("Sword").destroy();
        this.p.swinging_sword = false;
        this.p.angle = 0;
      }
    }
  },

  swing_sword: function() {
    this.p.sword = Q.stage().insert(new Q.Sword({ x: 22, y: -25 }), this);
    this.p.swinging_sword = true;
  },
});


Q.Sprite.extend("Enemy", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "enemy.png", 
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY,
      hp: 3,
      player: Q("Player").first(),
      speed: 1,
      type: Q.SPRITE_ENEMY
    });

    this.add('2d');
    this.on("face_player");
    this.on("chase_player");
    this.on("hit", function(collision){
      if(collision.obj.isA("Bullet") || collision.obj.isA("Sword")){
        if(--this.p.hp <= 0){
          this.destroy();
        } else {
          // Enemy should bounce back / react to being shot.  
        }
        collision.obj.destroy();
      } 
    });
  },
  
  face_player: function(player){
    // Face player (I like this, it's creepy)
    this.p.angle = -1 * TO_DEG * Math.atan2( (this.p.player.p.x - this.p.x), (this.p.player.p.y - this.p.y) );
  },

  chase_player: function(player){
    // Chase the player!
    this.p.x += this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
    this.p.y += this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));
  },

});

Q.Sprite.extend("Wall", {
  init: function(p) {
    this._super(p, {
      asset: "wall.png",
      type: Q.SPRITE_ACTIVE
    });
  }
});

// Should make this more generic, extendable for more ammo types, obviously.
Q.Sprite.extend("Ammo", {
  init: function(p) {
    this._super(p, {
      asset: "ammo_clip.png",
      capacity: 15,
    });

  this.add('2d');

  this.on("hit", function(collision){
    if(collision.obj.isA("Player")){
      // ammo collected.
      Q.audio.play("gun_cock.wav");
      this.destroy();
      collision.obj.p.bullets += this.p.capacity;
    } 
  });
  }
});

Q.Sprite.extend("Bullet", {
  init: function(p) {
    this._super(p, {
      asset: "bullet.png",
      atk_type: "projectile",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP,
    });

  this.add('2d');
  }
});

Q.Sprite.extend("Sword", {
  init: function(p) {
    this._super(p, {
      asset: "sword.png",
      atk_type: "melee",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP
    });
  }
});
