ig.module(
	'game.entities.levelexit2'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityLevelexit2 = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0,0,255,0.7)',
		size: {x:128, y:16},
		level: null,
		checkAgainst: ig.Entity.TYPE.A,

		update: function(){},

		check:function(other){
			ig.game.gameOver();
		}

	});
});