ig.module(
    'game.entities.eye_boss'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityEye_boss = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/eye_boss.png', 64, 64 ),
        size: {x: 64, y: 64},
        offset: {x: 0, y: 0},
        maxVel: {x: 100, y: 100},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 60,
        gravityFactor: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        health: 150,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim('walk', .07, [0]);
            this.timer = new ig.Timer(.5);
        },
        update: function() {
            // near an edge? return!
            if( !ig.game.collisionMap.getTile(
                this.pos.x + (this.flip ? +4 : this.size.x -4),
                    this.pos.y + this.size.y+1
                )
            ) {
                this.flip = !this.flip;
            }
            if(this.timer.delta() >= 1){
                ig.game.spawnEntity( EntityBossLaser, this.pos.x, this.pos.y-5, {flip:this.flip} );
                this.timer.reset();
            }
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            // collision with a wall? return!
            if( res.collision.x ) {
                this.flip = !this.flip;
            }
            var waterTile = 46;
            var toe = this.pos.x + this.size.x + 1;
            if (ig.game.collisionMap.getTile(this.pos.y + (this.flip ? +6 : this.size.y - 6), toe) == waterTile) {
                this.flip = !this.flip;      
            }
        },
        check: function(other){
            other.receiveDamage(10,this);
        }

    });

    EntityBossLaser = ig.Entity.extend({
        size: {x: 18, y:20},
        animSheet: new ig.AnimationSheet('media/vertlaserboss.png', 18, 20),
        maxVel: {x:0, y: 500},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+75, settings);
            this.vel.y = this.accel.y = (settings.flip ? this.maxVel.y : this.maxVel.y);
            this.addAnim('idle', 0.2, [0]);
        },
        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x || res.collision.y){
                this.kill();
            }
        },
        check: function(other){
            other.receiveDamage(20, this);
            this.kill();
        }

    });
});