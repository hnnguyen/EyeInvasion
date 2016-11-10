ig.module( 
    'game.main' 
)

.requires(
    'impact.game',
    'game.levels.level1',
    'game.levels.level2',
    'game.levels.level3',
    'game.levels.level4',
    'game.entities.player',
    'game.entities.player2',
    'game.entities.eye_dynamic',
    'game.entities.eye_boss',
    'game.entities.bird',
    'game.entities.health'
)

.defines(function(){

    MyGame = ig.Game.extend({
        gravity: 300,
        lifeSprite: new ig.Image('media/life.png'),
        instructText: new ig.Font( 'media/font.png' ),
        statText: new ig.Font( 'media/font.png' ),
        lives: 3,
        health: 20,
        init: function() {
            this.loadLevel(LevelLevel1);
            ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
            ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
            ig.input.bind( ig.KEY.UP_ARROW, 'up' );
            ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
            ig.input.bind( ig.KEY.SPACE, 'jump');
            ig.input.bind( ig.KEY.C, 'shoot');
            ig.input.bind( ig.KEY.TAB, 'switch');
       },

        update: function() {
            // screen follows the player
            var player = this.getEntitiesByType( EntityPlayer )[0];
            var eye = this.getEntitiesByType(EntityEye_static)[0];
            var boss = this.getEntitiesByType(EntityEye_boss)[0];
            if( player ) {
                this.screen.x = player.pos.x - 20;// ig.system.width-20;
                if(eye){
                this.screen.y = player.pos.y - ig.system.height/2;
                }
                if(player.accel.x > 0 && this.instructText)
                    this.instructText = null;
            }
            if(boss){
                var newWidth = this.collisionMap.width * this.collisionMap.tilesize;
    
                // Resize the canvas height, keep the current width
                ig.system.resize( 720, 480 );

            }
            // Update all entities and BackgroundMaps
            if(!this.showStats){
                this.parent();
            }else{s
                if(ig.input.state('continue')){
                    this.showStats = false;
                    this.levelExit.nextLevel();
                    this.parent();
                }
            }
            if(this.health == 0){
                this.health += 20;
            }
        },
 
        draw: function() {
            this.parent();
            if(this.instructText){
                var x = ig.system.width/2,
                y = ig.system.height - 20;
                this.instructText.draw( 'Left/Right/Up/Down Moves, Spacebar Jumps, C Fires & Tab Switches Weapons.', x, y, ig.Font.ALIGN.CENTER );
            }
            this.statText.draw("Lives:", 5,5);
            for(var i = 0; i < this.lives; i++){
                this.lifeSprite.draw(((this.lifeSprite.width + 2)*i)+70,15);
            }
            this.statText.draw("Health:"+this.health, 5,25);
            
        },       
        gameOver: function(){
            ig.system.setGame(GameOverScreen);
        }

    });      

StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/font.png' ),
    background: new ig.Image('media/startscreen.png'),
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
    },
    update: function() {
        if(ig.input.pressed ('start')){
            ig.system.setGame(MyGame)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        //this.mainCharacter.draw(0,0);
        //this.title.draw(ig.system.width - this.title.width, 0);
        var x = ig.system.width/2,
        y = ig.system.height - 30;
        this.instructText.draw( 'Press Spacebar To Start', x, y, ig.Font.ALIGN.CENTER );
    }
});

GameOverScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/font.png' ),
    background: new ig.Image('media/startscreen.png'),
    gameOver: new ig.Image('media/gameover.png'),
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
    },
    update: function() {
        if(ig.input.pressed('start')){
            ig.system.setGame(StartScreen)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        //this.background.draw(0,0);
        var x = ig.system.width/2;
        var y = ig.system.height/2 - 20;
        this.gameOver.draw(0,0);
        this.instructText.draw('Press Spacebar To Continue.', x, y, ig.Font.ALIGN.CENTER);
    }
});
// Start the Game with 60fps, a resolution of 720x480, 
    ig.main( '#canvas', StartScreen, 60, 720, 480, 1 ); //720x530

});