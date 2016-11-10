ig.module(
    'game.entities.player'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/player.png',32,32),
        size: {x: 24, y: 28},
        offset: {x: 4, y: 2},
        flip: false,
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 150,
        gravityFactor: 1,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        activeWeapon: "EntityBullet",
        weapon: 0,
        totalWeapons: 2,
        startPosition: null,
        health: 20,
        init: function(x,y,settings){
            this.startPosition = {x:x,y:y},
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.07, [1,2,3,4]);
            this.addAnim('jump',1,[5]);
            this.addAnim('swim',1,[6,7]);
            
        },
        update: function(){
            //move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
            var waterTile = 46;
            var toe = this.pos.y + this.size.y + 1;
            if(ig.input.state('left')){
                this.accel.x = -accel;
                this.flip = true;
            }else if(ig.input.state('right')){
                this.accel.x = accel;
                this.flip = false;
            }else{
                this.accel.x = 0;
            }
            
            //jump
            if(ig.input.pressed('jump') && this.standing){
                this.vel.y = -this.jump;
            }

            // shoot
            if( ig.input.pressed('shoot') ) {
                ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );
                
            }

            //switch weapons
            if(ig.input.pressed('switch')){
                this.weapon++;
                if(this.weapon >= this.totalWeapons){
                    this.weapon = 0;
                }
                switch(this.weapon){
                    case(0):
                        this.activeWeapon = "EntityBullet";
                        break;
                    case(1):
                        this.activeWeapon = "EntityLaser";
                        break;
                }
            }

            //set the current animation
            if(this.vel.y < 0 || this.vel.y > 0){
                this.currentAnim = this.anims.jump;
            }else if( this.vel.x != 0 ) {
                this.currentAnim = this.anims.run;
            }else{
                this.currentAnim = this.anims.idle;
            }
            this.currentAnim.flip.x = this.flip;

            if(ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +6 : this.size.x - 6), toe) == waterTile){
                this.currentAnim = this.anims.swim;
                gravityFactor = .1;
                if(ig.input.state('left')){
                    this.vel.x = -100;
                    this.vel.y = 0;
                    this.accel.x = 0;
                    this.accel.y = 0;
                    this.flip = true;
                }else if(ig.input.state('right')){
                    this.vel.x = 100;
                    this.vel.y = 0;
                    this.accel.x = 0;
                    this.accel.y = 0;
                    this.flip = false;
                }else if(ig.input.state('up')){
                        this.vel.y = -70;
                }else if(ig.input.state('down')){
                    this.vel.y = 70;
                }else{
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.accel.x = 0;
                    this.accel.y = 0;
                }
            this.currentAnim.flip.x = this.flip;
            }

            
            //move
            this.parent();
        },
        kill:function(){
            this.parent();
            
            ig.game.lives--;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity(EntityPlayer, this.startPosition.x, this.startPosition.y);
            }
            
        },
        
    });
    
    EntityBullet = ig.Entity.extend({
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+16, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim('idle', 0.2, [0]);
        },
        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x || res.collision.y){
                this.kill();
            }
        },
        check: function(other){
            other.receiveDamage(3, this);
            this.kill();
        }
    });
    EntityLaser = ig.Entity.extend({
        size: {x: 10, y:3},
        animSheet: new ig.AnimationSheet('media/laser.png', 10, 3),
        maxVel: {x:300, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+16, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim('idle', 0.2, [0]);
        },
        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x || res.collision.y){
                this.kill();
            }
        },
        check: function(other){
            other.receiveDamage(6, this);
            this.kill();
        }

    });
   
});
 
