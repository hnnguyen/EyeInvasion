ig.module(
    'game.entities.eye_dynamic'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityEye_dynamic = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/eye_dynamic.png', 18, 12 ),
        size: {x: 18, y: 12},
        offset: {x: 0, y: 0},
        maxVel: {x: 100, y: 100},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 40,
        gravityFactor: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        health: 15,
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
            if(this.timer.delta() >= 1.5){
                ig.game.spawnEntity( EntityEnemyLaser, this.pos.x, this.pos.y-5, {flip:this.flip} );
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
            var waterTile = 47;
            var toe = this.pos.y + this.size.y + 1;
            if (ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +6 : this.size.x - 6), toe) == waterTile) {
                this.flip = !this.flip;      
            }
        },
        check: function(other){
            other.receiveDamage(10,this);
        }

    });
    EntityEnemyLaser = ig.Entity.extend({
        size: {x: 10, y:3},
        animSheet: new ig.AnimationSheet('media/enemylaser.png', 10, 3),
        maxVel: {x:300, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings){
            this.parent(x +(settings.flip ? 4: 16), y+10, settings);
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
            ig.game.health-=10;
            other.receiveDamage(10,this);
            this.kill();
            
        }

    });
});