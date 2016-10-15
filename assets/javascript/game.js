//character object constructor
function Character(healthPoints, attackPower, counterAttackPower){
	this.hp = healthPoints;
	this.ap = attackPower;
	this.cap = counterAttackPower;
	this.baseAp = attackPower;
	this.enemy;

	this.attack = function(){
		var power = this.ap;
		if (this.enemy) {
			power = this.cap;
		} else {
			// hero's ap grows each turn
			this.ap += this.baseAp;
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
		//console.log(hero + " is the hero");
		// reassign click events on others
		$(".character").off("click").on("click", function(){
			setOpponent($(this).data("char"));
		});
		for (var i = 0; i < characters.length; i++) {
			if (i === hero){
				characters[i].enemy = false;
				$(this).detach().appendTo("#hero .charContainer").off("click");

			} else {
				characters[i].enemy = true;
			}
		}
	});
	showStats();
	$("#newGame").on("click", function() {
	    location.reload(false);
	}).hide();
	$("#attack").on("click", doFight);
}

function setOpponent(charId){
	if (waitingForClick){
		opponent = charId;
		// stops player from clicking on more than one opponent
		waitingForClick = false;
		//console.log("opponent is " + opponent);
		$("#enemies .character[data-char='" + charId + "']").detach().appendTo("#opponent .charContainer").off("click");
		$("#attack").show();
	}
}

function doFight(){
	if(opponent === false){
		showMessage("you must choose a hero and an opponent.");
	} else {
		//console.log(hero + " and " + opponent + " fight!");
		characters[hero].takeDamage(characters[opponent].attack());
		characters[opponent].takeDamage(characters[hero].attack());
		showStats();
		//check to see if this fight is over
		if(characters[hero].hp <= 0 && characters[opponent].hp <= 0){
			fightOver("tie");
		} else {
			if (characters[opponent].hp <= 0){
				fightOver(hero);
			} 
			if (characters[hero].hp <= 0){
				fightOver(opponent);
			}
		}
	}
}
function showStats(){
	for (var i = 0; i < characters.length; i++) {
		var statsHtml = "<div class='stat'>HP: " + characters[i].hp + "</div>";
		statsHtml += "<div class='stat'>AP: " + characters[i].ap + "</div>";
		statsHtml += "<div class='stat'>CAP: " + characters[i].cap + "</div>";
		$(".character[data-char='" + i + "'] .stats").html(statsHtml);
	}
}
function showMessage(text, cssClass){
	$("#message").html(text).addClass(cssClass);
}
function fightOver(winner){
	showMessage(winner + " wins!");
	if (winner === "tie") {
		showMessage("You and "+opponent+" killed each other at the same time");
		enemiesDefeated++;
	} else if (winner === hero) {
		showMessage("You killed "+ opponent);
		enemiesDefeated++;
	} else if (winner === opponent) {
		showMessage(opponent + " killed you.");
		gameOver("lose.");
	}
	if (enemiesDefeated === characters.length-1){
		gameOver("win!");
	} else if (winner === hero || winner === "tie"){
		// game not over, prepare for next round
		opponent = false;
		$("#opponent .charContainer").empty();
		$("#attack").hide();
		waitingForClick = true;
	}
}

function gameOver(result){
	showMessage("gameOver " + result);
	waitingForClick = false;
	$("#attack").hide();
	$("#controls #newGame").show();
}
$("document").ready(gameInit);