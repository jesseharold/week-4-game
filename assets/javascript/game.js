//character object constructor
function Character(healthPoints, attackPower, counterAttackPower){
	this.hp = healthPoints;
	this.ap = attackPower;
	this.cap = counterAttackPower;
	this.baseAp = attackPower;
	this.enemy;

	this.attack = function(){
		if (!this.enemy) {
			return this.ap;
			this.ap += baseAp;
		} else {
			return this.cap;
		}
	}

	this.takeDamage = function(damage){
		this.hp -= damage;
		return this.hp;
	}
}

//global variables
var characters = [];
var hero;
var opponent;

// game initialize
function gameInit(){
	// instantiate the character objects
	$(".charContainer .character").each(function(){
		characters.push(new Character($(this).data("hp"),$(this).data("ap"),$(this).data("cap")));
	});
	console.log(characters);
	$(".character").on("click", function(){
		// make this char the hero
		var hero = $(this).data("char");
		// reassign click events on others
		$(".character").off("click").on("click", function(){
			setOpponent($(this).data("char"));
		});
		for (var i = 0; i < characters.length; i++) {
			if (i === hero){
				characters[i].enemy = false;
				$(this).detach().appendTo("#hero .charContainer").off("click");

			} else {
				characters[i].enemy = false;
			}
		}
	})
}

function setOpponent(charId){
	opponent = charId;
	$("#enemies .character[data-char=charId]").detach().appendTo("#opponent .charContainer").off("click");
}

$("document").ready(gameInit);