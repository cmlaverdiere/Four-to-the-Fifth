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
      prior_sprite: p.base_sprite,
      punch_timer: 10,
      pushback: 15,
      sprinting: false,
      shot_delay_inc: 35,
      shot_delay_boss_inc: 15,
      sight_range: 300,
      stepDistance: 10,
      stepDelay: 0.01,
      punching: false,
      x: 300,
      y: 300
    });

    this.add('2d');
    this.on("hit", function(collision){
      if(collision.obj.isA("Bullet") || collision.obj.isA("ShotPellet") || collision.obj.isA("Explosion")){
        if(collision.obj.isA("Bullet")) { this.p.hp -= 5; }
        else if(collision.obj.isA("ShotPellet")) { this.p.hp -= 2; }
        else if(collision.obj.isA("Explosion")) { 
          if(HOMING_ROCKETS){
            this.p.hp -= 12;
          }
          else{
            this.p.hp -= 8; 
          } 
        }

        if(this.isA("Player")){
          Q.stageScene("ui", 1, this.p);
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
          this.p.x -= this.p.pushback * Math.cos(TO_RAD * (this.p.angle+90));
          this.p.y -= this.p.pushback * Math.sin(TO_RAD * (this.p.angle+90));
        }

        if(!collision.obj.isA("Explosion")){
          collision.obj.destroy();
        }
      }

      else if(collision.obj.isA("Player")){
        if(collision.obj.p.punching){
          this.p.hp -= 20;
          this.p.x -= 30 * Math.cos(TO_RAD * (this.p.angle+90));
          this.p.y -= 30 * Math.sin(TO_RAD * (this.p.angle+90));
          if(this.p.hp <= 0){
            this.destroy();
            // Reset to title if player dies.
            if(this.isA("Player")){
              Q.stage().trigger("player_death");
            } else {
              Q.stage().trigger("enemy_killed");
            }
          }
        }
      } 

      else{ //collision with a wall
        if(!collision.obj.isA("Enemy") && !this.p.stuckCheck){ //colliding with wall
            this.p.stuck += 1;
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

  // Punching event
  punch: function() {
    if(!this.p.punching){
      // Play a random punch sound. Yes, very obtuse code.
      Q.audio.play("punch" + ((Math.floor(Math.random()*10) % 2) + 1) + ".wav")

      this.p.prior_sprite = this.p.asset;
      this.p.asset = this.p.punch_sprite;
      this.p.punching = true;
      this.p.punch_timer = 10;
    }
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
    
    // Punching animation
    if(this.p.punching){
      this.p.punch_timer--;
      if(this.p.punch_timer < 0){
        this.p.punching = false;
        this.p.asset = this.p.prior_sprite;
      }
    }
  },
    //function to set powerups on
    powerUpFunc: function() {
      if(COOLDOWN == 0){
        Q.audio.play("health_collect.wav");
        COOLDOWN = 500;
        Q.state.set("COOLDOWN", 500);
        if(Q.state.get("level") == 1){
          HOMING_ROCKETS = true;
        }
        else if(Q.state.get("level") == 2){
          HOMING_ROCKETS = true;
          SUPER_EXPLOSIONS = true;
        }
        else{
          HOMING_ROCKETS = true;
          SUPER_EXPLOSIONS = true;
          SUPER_SHOTGUN = true;
        }
      }
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
    this.equip_gun();

    Q.input.on("fire", this, function(){ this.fire()
      
    });
    Q.input.on("wep1", this, "put_away_wep");
    Q.input.on("wep2", this, "equip_gun");
    Q.input.on("wep3", this, "equip_shotgun");
    Q.input.on("wep4", this, "equip_machinegun");
    Q.input.on("wep5", this, "equip_rocketlauncher");
    Q.input.on("wep6", this, "equip_assaultrifle");
    Q.input.on("powerUp", this, "powerUpFunc");
    Q.input.on("punch", this, "punch");
    Q.input.on("pause", this, function(){
      Q.state.inc("pause", this, !Q.state.get("pause"));
    });
  },

  step_player: function(dt) {

    // Update player angle based on mouse position.
    if (!this.p.punching){

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
    var boss = Q("Boss");
    enemies.trigger("chase_player", this);
    boss.trigger("kill_player", this);
    
    if(COOLDOWN > 0){
      if(COOLDOWN == 100){
        SUPER_EXPLOSIONS = false;
        HOMING_ROCKETS = false;
        SUPER_SHOTGUN = false;
      }
      COOLDOWN--;
      Q.state.dec("COOLDOWN", 1);
    }
  }
});


Q.Human.extend("Enemy", {
  init: function(p) {
    this._super(p, {
      boss_ai: false,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT,
      scale: 1,
      speed: 1,
      type: Q.SPRITE_ENEMY,
    });

    this.add("gun");
    this.on("chase_player");
    this.on("face_player");
    this.on("frenzy");
    if(this.p.boss_ai) {
      this.on("step", this, "step_boss");
    }
  },
  
  chase_player: function(player){
    this.face_player(player);

    // Stop, and shoot at player if they get close.
    // We use a shotDelay to make sure the enemies only
    //   shoot every so often. Yes, slightly redundant as we already
    //   have fire_delay as well. Should refactor.
    if(Math.abs(this.p.x - player.p.x) < this.p.sight_range && Math.abs(this.p.y - player.p.y) < this.p.sight_range){
      if(!this.p.boss_ai) {
        if(this.p.shotDelay-- <= 1){
          this.fire();
          this.p.shotDelay += this.p.shot_delay_inc;
        }
      } else {
        if(this.p.shotDelay-- <= 1){
          this.p.fire_delay = 0;
          this.fire();
          this.p.shotDelay += this.p.shot_delay_boss_inc;
        }
      }
    } 
    
    else if(Math.abs(this.p.x - player.p.x) > this.p.sight_range * 1.5 && Math.abs(this.p.y - player.p.y) > this.p.sight_range * 1.5){
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

  step_boss: function(){
    this.p.pushback = 5;
    if(this.p.hp < .40 * this.p.max_hp){
      // Decide on final form.
      if(!this.has("machinegun")){
        this.equip_machinegun();
        this.p.shot_delay_boss_inc = 0;
        this.p.speed *= .8;
      }
    }
    else if(this.p.hp < .60 * this.p.max_hp){
      if(!this.has("shotgun")){
        this.equip_shotgun();
        this.p.speed *= 1.2;
      }
    }
    else if(this.p.hp < .85 * this.p.max_hp){
      if(!this.has("assaultrifle")){
        this.equip_assaultrifle();
        this.p.speed *= 1.1;
      }
    }
    else {
      // Stay on pistol. 
    }
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

Q.Sprite.extend("HealthPack", {
    init: function(p) {
      this._super(p, {
        asset: "health_pack.png",
        collisionMask: Q.SPRITE_PLAYER,
        capacity: 35,
      });

      this.add('2d');

      this.on("hit", function(collision){
        if(collision.obj.isA("Player")){
          Q.audio.play("health_collect.wav");
          this.destroy();
          collision.obj.p.hp += this.p.capacity;
          Q.state.inc("player_health", this.p.capacity);
          Q.stageScene("ui", 1, collision.obj.p);
        }
      });
    }
  });

Q.Sprite.extend("Bullet", {
  init: function(p) {
    this._super(p, {
      asset: "bullet.png",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
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
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
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
      rebounded: false,
      speed: 1,
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
      type: Q.SPRITE_POWERUP,
    });

    this.add('2d');

    this.on("hit", function(collision){
      if(collision.obj.p.boss_ai){
        console.log("Rebounding rocket.");
        if(!this.p.rebounded){
          this.p.rebounded = true;
          this.p.angle -= 180;
        }
      }
      else {
        if(!this.collided){
          Q.audio.play("rocket_explode.wav");
          if(SUPER_EXPLOSIONS){
            Q.stage().insert(new Q.SuperExplosion(
              {   
                x: this.p.x,
                y: this.p.y, 
              }
            ));
          }
          else{
            Q.stage().insert(new Q.Explosion(
              {   
                x: this.p.x,
                y: this.p.y, 
              }
            ));
          }

          this.collided = true;
        }
        this.destroy();
      }
    });
  },

  step: function(dt) {
    if(!this.p.rebounded && HOMING_ROCKETS) {
      this.p.angle = Q("Player").first().p.angle;
    }
    this.p.vx = this.p.speed * 500 * Math.cos(TO_RAD * (this.p.angle+90));
    this.p.vy = this.p.speed * 500 * Math.sin(TO_RAD * (this.p.angle+90));
    this.p.speed *= 1.05;
    if(this.p.speed > 100) {
      this.destroy(); 
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

Q.Sprite.extend("PowerUp", {
  init: function(p) {
    this._super(p, {
      asset: p.base_sprite,
      collisionMask: Q.SPRITE_PLAYER,
    });
  }
});

Q.Sprite.extend("SuperExplosion", {
  init: function(p) {
    this._super(p, {
      asset: "explosion.png",
      angle: 0,
      duration: 30,
      creation: 3, //can create 3 more normal explosions
      atk_type: "melee",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE| Q.SPRITE_DEFAULT,
      scale: .1,
      type: Q.SPRITE_POWERUP,
    });
    
    this.add('2d');
    this.on("hit", function(collision){
      if(this.p.creation > 0){
        Q.stage().insert(new Q.Explosion(
          {   
            x: this.p.x,
            y: this.p.y, 
          }
        ));
      }
      this.p.creation--;
    });
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
