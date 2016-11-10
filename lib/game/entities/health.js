ig.module(
    'game.entities.health'
)

.requires(
    'impact.entity'
)

.defines(function(){
    EntityHealth = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/health.png', 9, 9 ),
        size: {x: 9, y: 9},
        offset: {x: 0, y: 0},
        maxVel: {x: 100, y: 100},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 0,
        gravityFactor: 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        health: 0,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim('walk', 1, [0]);
        },
        
        check: function(other){
            ig.game.health+=10;
            this.kill();
        }

    });
});