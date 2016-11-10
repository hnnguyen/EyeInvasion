ig.module(
    'game.entities.player2'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityPlayer2 = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/player.png',32,32),
        size: {x: 24, y: 28},
        offset: {x: 4, y: 2},
        flip: false,
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 150,
        gravityFactor: 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        activeWeapon: "EntityLaser2",
        weapon: 0,
        totalWeapons: 2,
        startPosition: null,
        health: 20,
        init: function(x,y,settings){
            this.startPosition = {x:x,y:y},
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [10]);
            this.addAnim('rightrun', 0.07, [10,12]);
            this.addAnim('leftrun',0.07, [10,13]);
            this.addAnim('uprun', 0.07, [10,11]);
            this.addAnim('downrun',0.07, [10,11]);
            
        },
        update: function(){
            //move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
            if(ig.input.state('left')){
                //this.accel.x = -accel;
                this.vel.x = -100;
            }else if(ig.input.state('right')){
                //this.accel.x = accel;
                this.vel.x = 100;
            }else if(ig.input.state('up')){
                //this.accel.y = -accel;
                this.vel.y = -100;
            }else if(ig.input.state('down')){
                //this.accel.y = accel;
                this.vel.y = 100;
            }else{
                //this.accel.y = 0;
                //this.accel.x = 0;
                this.vel.y = 0;
                this.vel.x = 0;
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
                        this.activeWeapon = "EntityLaser2";
                        break;
                    case(1):
                        this.activeWeapon = "EntityDeathray";
                        break;
                }
            }

            //set the current animation
            if( this.vel.x > 0 ) {
                this.currentAnim = this.anims.rightrun;
            }else if( this.vel.x < 0 ) {
                this.currentAnim = this.anims.leftrun;
            }else if(this.vel.y > 0){
                this.currentAnim = this.anims.downrun;
            }else if(this.vel.y < 0){
                this.currentAnim = this.anims.uprun;
            }else{
                this.currentAnim = this.anims.idle;
            }
            //this.currentAnim.flip.x = this.flip;
        
            //move
            this.parent();
        },
        kill:function(){
            this.parent();
            
            ig.game.lives--;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity(EntityPlayer2, this.startPosition.x, this.startPosition.y);
            }
        },
        
    });
    
    EntityLaser2 = ig.Entity.extend({
        size: {x: 3, y:10},
        animSheet: new ig.AnimationSheet('media/vertlaser.png', 3, 10),
        maxVel: {x:0, y: 300},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+16, settings);
            this.vel.y = this.accel.y = -(settings.flip ? this.maxVel.y : this.maxVel.y);
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
    EntityDeathray = ig.Entity.extend({
        size: {x: 15, y:16},
        animSheet: new ig.AnimationSheet('media/deathray.png', 15, 16),
        maxVel: {x:0, y: 150},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        gravityFactor: 0,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+16, settings);
            this.vel.y = this.accel.y = -(settings.flip ? this.maxVel.y : this.maxVel.y);
            this.addAnim('idle', 0.2, [0]);
        },
        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x || res.collision.y){
                this.kill();
            }
        },
        check: function(other){
            other.receiveDamage(50, this);
            this.kill();
        }

    });

   
});