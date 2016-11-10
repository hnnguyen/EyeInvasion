ig.module(
    'game.entities.bird'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityBird = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/bird.png', 16, 16 ),
        size: {x: 16, y: 16},
        offset: {x: 0, y: 0},
        maxVel: {x: 100, y: 100},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 25,
        gravityFactor: 0,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim('walk', .07, [0,1,2]);
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
            
        },
        
    });
});