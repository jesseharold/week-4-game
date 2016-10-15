//character object constructor
function Character(healthPoints, attackPower, counterAttackPower, name){
	this.hp = healthPoints;
	this.ap = attackPower;
	this.cap = counterAttackPower;
	this.name = name;
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
		var newChar = new Character($(this).data("hp"), $(this).data("ap"), $(this).data("cap"), $(this).text());
		characters.push(newChar);
	});
	//console.log(characters);
	$(".character").on("click", function(){
		// make this char the hero
		hero = $(this).data("char");
		showMessage("Now click to choose your first opponent. <br> Your attack gets stronger each time you use it. Choose the order of your opponents wisely.");
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
		$("#enemies .character[data-char='" + charId + "']").detach().appendTo("#opponent .charContainer").off("click");
		$("#attack").show();
		showMessage("Click attack to begin the fight.");
	}
}

function doFight(){
	if(opponent === false){
		showMessage("You must choose a hero and an opponent.");
	} else {
		
		showMessage(characters[hero].name + " and " + characters[opponent].name + "  clash swords!");
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
		showMessage("You and " + characters[opponent].name + " killed each other at the same time");
		gameOver("lose.");
	} else if (winner === hero) {
		showMessage("You killed "+ characters[opponent].name);
		enemiesDefeated++;
	} else if (winner === opponent) {
		showMessage(characters[opponent].name + " killed you.");
		gameOver("lose.");
	}
	if (enemiesDefeated === characters.length-1){
		gameOver("win!");
	} else if (winner === hero){
		// game not over, prepare for next round
		opponent = false;
		$("#opponent .charContainer").empty();
		$("#attack").hide();
		waitingForClick = true;
	}
}

function gameOver(result){
	showMessage("Game Over: " + result);
	waitingForClick = false;
	$("#attack").hide();
	$("#controls #newGame").show();
}
$("document").ready(gameInit);