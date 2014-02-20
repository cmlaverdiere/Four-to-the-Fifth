// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "player.png",
      bullets: 50,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY,
      damage: 2,
      shooting: false,
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

    Q.input.on("fire", this, "fire_gun");
    Q.input.on("sword", this, "swing_sword");
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

    // When pressing the 'forward' key, the player follows mouse.
    if(Q.inputs['forward']){
    	this.p.x += (this.p.stepDistance) * Math.cos(TO_RAD * (this.p.angle+90));
      this.p.y += (this.p.stepDistance) * Math.sin(TO_RAD * (this.p.angle+90));
    }

    // Sprint activation and deactivation.
    if(Q.inputs['sprint']){
      if(!this.p.sprinting){
        console.log("Sprinting!");
        this.p.sprinting = true; 
        this.p.stepDistance *= 2;
      }
    } else {
      if(this.p.sprinting){
        console.log("Walking!");
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
    console.log("Swung sword!");
  },

  fire_gun: function() {
    if(!this.p.shooting){
      Q.audio.play("gun_cock.wav");
      this.p.asset = "player_with_gun.png";
      this.p.shooting = true;
    }
    else if (this.p.bullets > 0){
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
      console.log("Player fired gun. Bang! Bullets left: " + this.p.bullets);
    } else{
      console.log("You're out of bullets.");
    }
  }
});


Q.Sprite.extend("Enemy", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "enemy.png", 
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY,
      player: Q("Player").first(),
      speed: 1,
      type: Q.SPRITE_ENEMY
    });

    this.add('2d');
    this.on("bump.left,bump.right,bump.top,bump.bottom", function(collision){
      if(collision.obj.isA("Bullet")){
        // enemy owned.
        this.destroy();
        collision.obj.destroy();
      } 
    });
  },
  
  // This is likely not the best way to do this.
  // We should see if Quintus has a simpler way of 'focusing' an enemy to the player,
  //   other than doing manual trig.
  step: function(dt){
    // look at player (I like this, it's creepy)
    this.p.angle = -1 * TO_DEG * Math.atan2( (this.p.player.p.x - this.p.x), (this.p.player.p.y - this.p.y) );

    // Chase the player!
    this.p.x += this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
    this.p.y += this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));
  }
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

  this.on("bump.left,bump.right,bump.top,bump.bottom", function(collision){
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
      collisionMask: Q.SPRITE_ENEMY,
      type: Q.SPRITE_POWERUP
    });
  }
});
