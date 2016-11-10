ig.module(
    'game.entities.eye_static'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityEye_static = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/eye_static.png', 18, 12 ),
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
        health: 1000,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim('walk', .07, [0]);
        },
        update: function() {
            // near an edge? return!
            
        },
        check: function(other){
            other.receiveDamage(10,this);
        }

    });
});