//character object constructor
function Character(healthPoints, attackPower, counterAttackPower){
	this.hp = healthPoints;
	this.ap = attackPower;
	this.cap = counterAttackPower;
	this.baseAp = attackPower;
	this.enemy;

	this.attack = function(){
		var power = this.ap;
		if (!this.enemy) {
			this.ap += this.baseAp;
		} else {
			power = this.cap;
		}
		return power;
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
var waitingForClick = true;
var enemiesDefeated = 0;

// game initialize
function gameInit(){
	// instantiate the character objects
	$(".charContainer .character").each(function(){
		characters.push(new Character($(this).data("hp"),$(this).data("ap"),$(this).data("cap")));
	});
	//console.log(characters);
	$(".character").on("click", function(){
		// make this char the hero
		hero = $(this).data("char");
		console.log(hero + " is the hero");
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
	});
	$("#attack").on("click", doFight);
}

function setOpponent(charId){
	if (waitingForClick){
		opponent = charId;
		// stops player from clicking on more than one opponent
		waitingForClick = false;
		console.log("opponent is " + opponent);
		$("#enemies .character[data-char='" + charId + "']").detach().appendTo("#opponent .charContainer").off("click");
	}
}

function doFight(){
	if(opponent === false){
		console.log("you must choose a hero and an opponent.");
	} else {
		console.log(hero + " and " + opponent + " fight!");
		characters[hero].takeDamage(characters[opponent].attack());
		characters[opponent].takeDamage(characters[hero].attack());
		$("#hero .character .stats").html("HP: " + characters[hero].hp);
		$("#opponent .character .stats").html("HP: " + characters[opponent].hp);
		if(characters[hero].hp < 0 && characters[opponent].hp < 0){
			fightOver("tie");
		} else {
			if (characters[opponent].hp < 0){
				fightOver(hero);
			} 
			if (characters[hero].hp < 0){
				fightOver(opponent);
			}
		}
	}
}
function fightOver(winner){
	console.log(winner + " wins!");
	waitingForClick = true;
	opponent = false;
	enemiesDefeated++;
	if (enemiesDefeated === characters.length){
		gameOver("win!");
	}
	//$("#opponent .charContainer").empty();
}

function gameOver(result){
	console.log("gameOver " + result);
}
$("document").ready(gameInit);