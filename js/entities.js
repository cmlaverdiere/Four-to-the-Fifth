// Create an abstract Human class
// Reduces duplicate code between Player / Enemies.
Q.Sprite.extend("Human", {
  init: function(p) {
    this._super(p, {
      asset: p.base_sprite,
      bullets: 0,
      stuck: 0,
      stuckCheck: false,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER,
      fire_block: false,
      fire_delay: 100,
      hp: 100,
      shotDelay: 10,
      meleeDelay: 100,
      sprinting: false,
      stepDistance: 10,
      stepDelay: 0.01,
      swinging_sword: false,
      sword: null,
      x: 300,
      y: 300
    });

    this.add('2d');
    this.on("hit", function(collision){
      if(collision.obj.isA("Bullet") || collision.obj.isA("ShotPellet") || collision.obj.isA("Explosion")){
        this.p.hp -= 7;

        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
          Q.state.dec("player_health", 7);
        }

        if(this.p.hp <= 0){
          this.destroy();

          // Reset to title if player dies.
          if(this.isA("Player")){
            Q.stage().trigger("player_death");
          } else {
            Q.stage().trigger("enemy_killed");
          }

        } else {
          // Human bounces back from being shot.  
          this.p.x -= 15 * Math.cos(TO_RAD * (this.p.angle+90));
          this.p.y -= 15 * Math.sin(TO_RAD * (this.p.angle+90));
        }

        if(!collision.obj.isA("Explosion")){
          collision.obj.destroy();
        }
      }

      else if(collision.obj.isA("Sword")){
        this.destroy();
      }

      else{ //collision with a wall
        if(!collision.obj.isA("Enemy") && !this.p.stuckCheck){ //colliding with wall
            this.p.stuck += 6;
          }
        if(this.p.stuck >= 24){ //game assumes stuck
          this.p.stuckCheck = true;
        }
      }
    });
  },

  equip_gun: function() {
    this.unequip_guns();
    this.add("gun"); 
  },

  equip_shotgun: function() {
    this.unequip_guns();
    this.add("shotgun"); 
  },

  equip_machinegun: function() {
    this.unequip_guns();
    this.add("machinegun"); 
  },
    
  equip_rocketlauncher: function() {
    this.unequip_guns();
    this.add("rocketlauncher"); 
  },
  
  equip_assaultrifle: function() {
    this.unequip_guns();
    this.add("assaultrifle");
  },

  // Event to put away weapons and return to base sprite.
  put_away_wep: function() {
    this.unequip_guns();
    this.p.asset = this.p.base_sprite;
  },
  

  step: function(dt) {
    // Machine gun delay.
    if(this.p.fire_delay < 100){
      this.p.fire_delay += 5;
    }
    
    // Sword swinging animation
    if(this.p.swinging_sword){
      this.p.angle += 20;
      if(this.p.angle > 360){
        Q("Sword").destroy();
        this.p.swinging_sword = false;
        this.p.angle = 0;
      }
    }
  },

  // Sword swinging event
  swing_sword: function() {
    this.p.asset = this.p.base_sprite;
    this.p.sword = Q.stage().insert(new Q.Sword({ x: -32, y: 25 }), this);
    this.p.swinging_sword = true;
  },

  // Remove all guns event.
  unequip_guns: function() {
    this.del("gun");
    this.del("shotgun");
    this.del("machinegun");
    this.del("rocketlauncher");
    this.del("assaultrifle");
  },
});

// Create Player class
Q.Human.extend("Player", {
  init: function(p) {
    this._super(p, {
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT,
      type: Q.SPRITE_PLAYER,
    });

    this.add('stepControls');
    this.on("step", this, "step_player");

    Q.input.on("fire", this, function(){ this.fire()
      
    });
    Q.input.on("wep1", this, "put_away_wep");
    Q.input.on("wep2", this, "equip_gun");
    Q.input.on("wep3", this, "equip_shotgun");
    Q.input.on("wep4", this, "equip_machinegun");
    Q.input.on("wep5", this, "equip_rocketlauncher");
    Q.input.on("wep6", this, "equip_assaultrifle");
    Q.input.on("sword", this, "swing_sword");
    Q.input.on("pause", this, function(){
      Q.state.inc("pause", this, !Q.state.get("pause"));
    });
  },

  step_player: function(dt) {

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
    
    // When pressing the 'forward' key, the human follows their orientation.
    if(Q.inputs['forward']){
      this.p.x += (this.p.stepDistance) * Math.cos(TO_RAD * (this.p.angle+90));
      this.p.y += (this.p.stepDistance) * Math.sin(TO_RAD * (this.p.angle+90));
    }

    // Create a block on firing so we don't shoot repeatedly when button held down.
    // Maybe make an exception for automatic guns, if ever added.
    if(Q.inputs['fire']){
      this.p.fire_block = true; 
      if(this.p.fire_delay > 0){
        this.p.fire_delay -= 20; 
      }
    } else {
      this.p.fire_block = false; 
    }

    // Sprint input activation and deactivation.
    if(Q.inputs['sprint']){
      if(!this.p.sprinting){
        this.p.sprinting = true; 
        this.p.stepDistance *= 1.5;
      }
    } else {
      if(this.p.sprinting){
        this.p.sprinting = false; 
        this.p.stepDistance /= 1.5;
      } 
    }

    // Send event to all enemies to look at and chase the player.
    var enemies = Q("Enemy");
    enemies.trigger("chase_player", this);
  }
});


Q.Human.extend("Enemy", {
  init: function(p) {
    this._super(p, {
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT,
      type: Q.SPRITE_ENEMY
    });

    this.add("gun");
    this.on("chase_player");
    this.on("face_player");
    this.on("frenzy");
    this.on("step", this, "step_enemy");
  },
  
  chase_player: function(player){
    this.face_player(player);

    // Stop, and shoot at player if they get close.
    // We use a shotDelay to make sure the enemies only
    //   shoot every so often. Yes, slightly redundant as we already
    //   have fire_delay as well. Should refactor.
    if(Math.abs(this.p.x - player.p.x) < 300 && Math.abs(this.p.y - player.p.y) < 300){
      if(this.p.shotDelay-- <= 1){
        this.fire();
        this.p.shotDelay += 25;
      }
    } 
    
    else if(Math.abs(this.p.x - player.p.x) > 450 && Math.abs(this.p.y - player.p.y) > 450){
      //sight range ends here
    }    

    else {
      if(this.p.stuckCheck){ //stuck so move back 4 times
        this.p.stuck -= 6;
        this.p.x -= this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
        this.p.y -= this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));

        if(this.p.stuck <= 0){
          this.p.stuckCheck = false; //reset check after stuck is 0
        }
      }
      else{
        // Chase player if out of range.
        this.p.x += this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
        this.p.y += this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));
      }
    }
  },

  face_player: function(player){
    this.p.angle = -1 * TO_DEG * Math.atan2( (player.p.x - this.p.x), (player.p.y - this.p.y) );
  },

  frenzy: function(player){
    this.p.speed *= 1.5;
  },

  step_enemy: function(){
    // Nothing at the moment
  },

});


Q.Enemy.extend("Zombie", {
  init: function(p) {
    this._super(p, {
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT | Q.SPRITE_ZOMBIE,
      type: Q.SPRITE_ZOMBIE
    });

    this.on("chase_player");
    this.on("maul_player");
  },

  chase_player: function(player){
    this.face_player(player);
    this.p.x += this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
    this.p.y += this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));
  },

  maul_player: function(collision){
    if(collision.obj.isA("Player")){
      collision.obj.p.hp -=7;
      collision.obj.p.x -= 15 * Math.cos(TO_RAD * (this.p.angle+90));
      collision.obj.p.y -= 15 * Math.sin(TO_RAD * (this.p.angle+90));
      this.p.speed *= 0.9;
    }
  },
});


// Should make this more generic, extendable for more ammo types, obviously.
Q.Sprite.extend("Ammo", {
  init: function(p) {
    this._super(p, {
      asset: "ammo_clip.png",
      collisionMask: Q.SPRITE_PLAYER,
      capacity: 15,
    });

    this.add('2d');

    this.on("hit", function(collision){
      if(collision.obj.isA("Player")){
        // ammo collected.
        Q.audio.play("gun_cock.wav");
        this.destroy();
        collision.obj.p.bullets += this.p.capacity;
        Q.state.inc("ammo", this.p.capacity);
        Q.stageScene("ui", 1, collision.obj.p);
      }
    });
  }
});

Q.Sprite.extend("Bullet", {
  init: function(p) {
    this._super(p, {
      asset: "bullet.png",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP,
    });
    
    this.add('2d');

    this.on("hit", function(collision){
      this.destroy();
    });
  }
});

Q.Sprite.extend("ShotPellet", {
  init: function(p) {
    this._super(p, {
      asset: "shot_pellet.png",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP,
    });
    
    this.add('2d');

    this.on("hit", function(collision){
      this.destroy();
    });
  }
});

Q.Sprite.extend("Rocket", {
  init: function(p) {
    this._super(p, {
      asset: "rocket.png",
      atk_type: "projectile",
      collided: false,
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP,
    });

    this.add('2d');

    this.on("hit", function(collision){
      if(!this.collided){
        Q.audio.play("rocket_explode.wav");
        Q.stage().insert(new Q.Explosion(
          {   
            x: collision.obj.p.x,
            y: collision.obj.p.y, 
          }
        ));
        this.collided = true;
      }
      this.destroy();
    });
  },

  step: function(dt) {
    if(HOMING_ROCKETS){
      this.p.angle = Q("Player").first().p.angle;
      this.p.vx = 500 * Math.cos(TO_RAD * (this.p.angle+90));
      this.p.vy = 500 * Math.sin(TO_RAD * (this.p.angle+90));
    }
  },
});

  
Q.Sprite.extend("Explosion", {
  init: function(p) {
    this._super(p, {
      asset: "explosion.png",
      angle: 0,
      duration: 30,
      atk_type: "melee",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      scale: .1,
      type: Q.SPRITE_POWERUP,
    });
    
    this.add('2d');
  },

  step: function(dt) {
    // Add logarithmic growth function to explosion.
    this.p.scale = Math.log(30 - this.p.duration) / 2;

    // Spin explosion as it goes off.
    this.p.angle += 25

    if(--this.p.duration <= 0){
      this.destroy(); 
    }
  },
});

Q.Sprite.extend("Sword", {
  init: function(p) {
    this._super(p, {
      asset: "sword.png",
      collisionMask: Q.SPRITE_ENEMY,
      scale: 2,
      type: Q.SPRITE_POWERUP
    });

    this.add('2d');
  }
});

Q.Sprite.extend("PowerUp", {
  init: function(p) {
    this._super(p, {
      asset: p.base_sprite,
      bullets: 0,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER,
    });
  }
});

