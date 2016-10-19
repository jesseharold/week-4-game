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
var numOfEnemies = 10;
var characters = [];
var hero;
var opponent;
var waitingForClick = true;
var enemiesDefeated = 0;

// game initialize
function gameInit(){
	// create the html elements
	for (var i = 0; i < numOfEnemies; i++) {
		//pick a random character from the library
		var random = getFromLibrary();
		// instantiate the character object
		var newChar = new Character(charLibrary[random].health, charLibrary[random].attack, charLibrary[random].counterAttack, charLibrary[random].name);
		characters.push(newChar);
		//generate new html element
		var charEl = $("#enemies .character#blank").clone().prop("id", "char"+i)
			.appendTo("#enemies .charContainer");
		charEl.find(".name").text(newChar.name);
		charEl.find(".portrait").html("<img src='"+charLibrary[random].image+"'' alt='"+newChar.name+"'>");
		charEl.data({
			char:i, 
			ap: newChar.hp, 
			hp: newChar.hp, 
			cap: newChar.cap 
		});
	}
	//remove blank character html
	$("#enemies .character#blank").remove();

	//console.log(characters);
	$(".character").on("click", function(){
		// make this char the hero
		hero = $(this).data("char");
		showMessage("Now click to choose your first opponent. <br> Your attack gets stronger each time you use it. Choose the order of your opponents wisely.", true);
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

function getFromLibrary(){
	var index = Math.floor(Math.random()*charLibrary.length);
	// check to see if this character is already in play
	while (charLibrary[index].inPlay === true){
		// try again
		index = Math.floor(Math.random()*charLibrary.length);
	}
	charLibrary[index].inPlay = true;
	return index
}

function setOpponent(charId){
	if (waitingForClick){
		opponent = charId;
		// stops player from clicking on more than one opponent
		waitingForClick = false;
		$("#enemies #char"+charId).detach().appendTo("#opponent .charContainer").off("click");
		$("#attack").show();
		showMessage("Click attack to begin the fight.", true, false);
	}
}

function doFight(){
	if(opponent === false){
		showMessage("You must choose a hero and an opponent.", false);
	} else {
		showMessage(characters[hero].name + " and " + characters[opponent].name + "  clash swords!", true);
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
		$(".character#char" + i + " .stats").html(statsHtml);
	}
}
function showMessage(text, clearPrev, cssClass){
	if(clearPrev) {
		$("#message").empty();
	}
	if (cssClass === false){
		$("#message").append(text).removeClass();
	} else {
		$("#message").append(text).addClass(cssClass);
	}
}
function fightOver(winner){
	showMessage(winner + " wins!", true);
	if (winner === "tie") {
		showMessage("You and " + characters[opponent].name + " killed each other at the same time", true, "loseMsg");
		gameOver("lose");
	} else if (winner === hero) {
		showMessage("You killed "+ characters[opponent].name, true, "winMsg");
		enemiesDefeated++;
	} else if (winner === opponent) {
		showMessage(characters[opponent].name + " killed you.", true, "loseMsg");
		gameOver("lose");
	}
	if (enemiesDefeated === characters.length-1){
		gameOver("win");
	} else if (winner === hero){
		// game not over, prepare for next round
		showMessage("<br>Choose another opponent.", false);
		opponent = false;
		$("#opponent .charContainer").empty();
		$("#attack").hide();
		waitingForClick = true;
	}
}
function gameOver(result){
	showMessage("<br>Game Over: " + result, false, result+"Msg gameOverMsg");
	waitingForClick = false;
	$("#attack").hide();
	$("#controls #newGame").show();
}
$("document").ready(gameInit);