
$("#suggest-div").hide();
$("#accuse-div").hide();





// <-----Variables and Constants -------->
const suspects = ["Miss Scarlet", "Mr. Green", "Colonel Mustard", "Professor Plum", "Mrs. Peacock", "Mrs. White"];
const weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Monkey Wrench"];
const rooms = ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Billiard Room", "Library", "Lounge", "Hall", "Study"];
var correctAnswers = {
	suspect: " ",
	weapon: " ",
	room: " "
};
var turnCount = 0;
var clues = {
	suspects: [],
	weapons: [],
	rooms: []
}

var allPossibleLocations = ["Kitchen", "Ballroom", "Conservatory", "dining-room", "billiard-room", "Library", "Study", "Hall", "Lounge"];

var cellarMoves = ["dining-room", "billiard-room", "Library"];
var fromDiningRoom = ["Kitchen", "dining-room"];
var fromKitchen = ["Ballroom", "dining-room", "Study", "Kitchen"];
var fromBallroom = ["Kitchen", "Conservatory", "Ballroom"];
var fromConservatory = ["Ballroom", "billiard-room", "Lounge", "Conservatory"];
var fromBilliardRoom = ["Conservatory", "Library", "billiard-room"];
var fromLibrary = ["billiard-room", "Study", "Library"];
var fromStudy = ["Library", "Kitchen", "Hall", "Study"];
var fromHall = ["Lounge", "Study", "Hall"];
var fromLounge = ["Conservatory", "Hall", "Lounge"];
var countDown = 10;

var counter = document.getElementById("counter")
counter.textContent = countDown;



// <-------- Event Listeners ----------->


//event listener for start button
document.getElementById("start").addEventListener("click", function(){
	startGame();
	// console.log("Clicked");
})




// <---------- Functions ---------------->


//starts the game
function startGame() {
	$("#start").hide();
	randomizedMurder();
	giveClues();

	//gives you options to move the player piece
	moveOptions();

	//shows the suggestion and accuse options 
	// $("#suggest-div").show();
	// $("#accuse-div").show();



	//event listener for accusations
	document.getElementById("accuse").addEventListener("submit", function(e) {
		e.preventDefault();
		
		checkAccusation();
	})

//event listener for suggestions
	document.getElementById("suggest").addEventListener("submit", function(e) {
		e.preventDefault();
		checkSuggestion();
		$("#suggest-div").hide();
		$("#accuse-div").hide();
	})
}


//fills an object with the murder suspect, weapon and room
function randomizedMurder(){
	
	weapons.sort(randomize);
	suspects.sort(randomize);
	rooms.sort(randomize);

	var coin = 0;
	coin = coinFlip(2);
	// console.log(coin);

	//this determines if I sort the arrays again or not, adding complexity to the randomization
	//additionally, popping and shifting the correct answers out of the arrays makes verifying the accusations easier
	if (coin = 0) {
		correctAnswers.weapon = weapons.pop();
		correctAnswers.room = rooms.shift();
		correctAnswers.suspect = suspects.pop();
	} else {
		weapons.sort(randomize);
		suspects.sort(randomize);
		rooms.sort(randomize);

		correctAnswers.weapon = weapons.pop();
		correctAnswers.room = rooms.shift();
		correctAnswers.suspect = suspects.shift();
	}
	// console.log(correctAnswers);
}

//randomizes the array so that .pop doesn't take the same element every time
function randomize (){
	return .5 - Math.random();
}


//gives the player clues
function giveClues() {
	clues.rooms.push(rooms[0]);
	clues.suspects.push(suspects[0]);
	clues.suspects.push(suspects[1]);
	clues.weapons.push(weapons[0]);

	//prints out clues in clue-div
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `${clues.suspects[0]} and ${clues.suspects[1]} are innocent! The murder didn't happen in the ${clues.rooms}. And the ${clues.weapons} wasn't used!`;

	document.getElementById("clue-div").append (clueMessage);
}

//checks accusation
function checkAccusation() {
	var accusedSuspect = document.getElementById("accused-suspect").value;
	var accusedWeapon = document.getElementById("accused-weapon").value;
	var accusedRoom = document.getElementById("accused-room").value;

	

	if (accusedWeapon == correctAnswers.weapon && accusedSuspect == correctAnswers.suspect && accusedRoom == correctAnswers.room) {
		winGame();
	} else {
		loseGame();
	}
}

//when a suggestion is made, a clue is given
function checkSuggestion() {
	var x = document.getElementById("game-piece").parentNode;
	var suggestedSuspect = document.getElementById("suggested-suspect").value;
	var suggestedWeapon = document.getElementById("suggested-weapon").value;
	// var suggestedRoom = document.getElementById("suggested-room").value;
	var suggestedRoom = x.textContent;
	var clueMessage = document.createElement("p");
	
	//holds coin flip result
	//if a player has guessed 0-1 correct elements, randomizes the clue given by the game
	var coin = 0;
	
	//empties the clue div so clues don't pile up
	$("#clue-div").empty();

	//spits out a clue based on your suggestions
	if (suggestedWeapon == correctAnswers.weapon && suggestedSuspect == correctAnswers.suspect && suggestedRoom == correctAnswers.room) {
		allSuggestionsCorrect();
	} else if (suggestedWeapon == correctAnswers.weapon && suggestedSuspect == correctAnswers.suspect){
		giveRoomClue(suggestedRoom);
	} else if (suggestedSuspect == correctAnswers.suspect && suggestedRoom == correctAnswers.room) {
		giveWeaponClue(suggestedWeapon);
	} else if (suggestedWeapon == correctAnswers.weapon && suggestedRoom == correctAnswers.room) {
		giveSuspectClue(suggestedSuspect);
	} else if (suggestedSuspect == correctAnswers.suspect) {
		coin = coinFlip(2);
			if (coin === 1) {
				giveRoomClue(suggestedRoom);
			} else {
				giveWeaponClue(suggestedWeapon);
			}
	} else if (suggestedWeapon == correctAnswers.weapon) {
		coin = coinFlip(2);
			if (coin === 1) {
				giveSuspectClue(suggestedSuspect);
			} else {
				giveRoomClue(suggestedRoom);
			}
	} else if (suggestedRoom == correctAnswers.room){
		coin = coinFlip(2);
		if (coin === 1) {
				giveSuspectClue(suggestedSuspect);
			} else {
				giveWeaponClue(suggestedWeapon);
			}
	} else {
		coin = coinFlip(3);
		if (coin === 2) {
				giveSuspectClue(suggestedSuspect);
			} else if (coin === 1) {
				giveWeaponClue(suggestedWeapon);
			} else {
				giveRoomClue(suggestedRoom);
			}
			
	}
	//increases the turncount
	turnCount++;
	counter.textContent = changeCounter();
	
	


	//if you run out of guesses, you are forced to make an accusation
	if (turnCount >= countDown) {
		forceAccusation();
	} else {
		console.log(`You have ${10-turnCount} turns left`)
		moveOptions();
	}
}


//random number generator
function coinFlip(max) {
	return Math.floor(Math.random()*Math.floor(max));
}


//you've run out of guesses and now you need to make an accusation
function forceAccusation() {
	$("#suggest-div").hide();
	$("#accuse-div").show();
}

//if you win the game
function winGame() {
	endGame();

	//text that shows you won
	var winMessage = document.getElementById("clue-div");
	winMessage.textContent = "Congratulations! Your detective work really paid off! You solved the mystery!";

}


//if you lose the game
function loseGame() {
	endGame();

	//text stating you lost with the correct answer printed out
	var loseMessage = document.getElementById("clue-div");
	loseMessage.textContent = `I'm sorry, your accusation was incorrect. You failed to solve the mystery, and you will never be invited to a dinner party again. Maybe that's for the best.
	It was ${correctAnswers.suspect} in the ${correctAnswers.room} with the ${correctAnswers.weapon}.`

}

//end game function
function endGame() {
	

	//remove all event listeners
	removeMovementListeners();
	revertToNormal();

	//empty the div
	$("#clue-div").empty();


	//maybe create a play again button?
}

function moveOptions() {
	var i = 0
	var x = document.getElementById("game-piece").parentNode;
	
	

	
	if (x.id == "cellar") {
		cellarMoves.forEach(createHighlights)
	} else if (x.id == "Kitchen") {
		fromKitchen.forEach(createHighlights)
	} else if (x.id == "Ballroom") {
		fromBallroom.forEach(createHighlights)
	} else if (x.id == "Conservatory") {
		fromConservatory.forEach(createHighlights)
	} else if (x.id == "dining-room") {
		fromDiningRoom.forEach(createHighlights)
	} else if (x.id == "billiard-room") {
		fromBilliardRoom.forEach(createHighlights)
	} else if (x.id == "Study") {
		fromStudy.forEach(createHighlights)
	} else if (x.id == "Hall") {
		fromHall.forEach(createHighlights)
	} else if (x.id == "Lounge") {
		fromLounge.forEach(createHighlights)
	}  else if (x.id == "Library") {
		fromLibrary.forEach(createHighlights)
	} else {
		console.log("Get fucked");
	}


	
}

function movePiece(element) {
	
	var location = document.getElementById("game-piece");
	document.getElementById(element.id).append(location);

	
	removeMovementListeners("click", movePiece);
	changeRoomName();
	$("#suggest-div").show();
	$("#accuse-div").show();
	

}


//removes event listener from the locations on the board
function removeMovementListeners () {
	allPossibleLocations.forEach(function(element) {
		var room = document.getElementById(element);
		room.removeEventListener("click", moveMyPiece);

	})
}

function revertToNormal() {
	allPossibleLocations.forEach(function(element) {
		var borders = document.getElementById(element);
		borders.style.border = "2px solid black";
	})
}


function moveMyPiece (e) {
	// console.log("click", e.target);
	movePiece(e.target);
	removeMovementListeners();
	revertToNormal();
	if (turnCount >= 10) {
		// console.log("Forced accusation")
	} else {
	$("#suggest-div").show();
	$("#accuse-div").show();
	}
}

function changeRoomName() {
	var x = document.getElementById("game-piece").parentNode;
	roomName = document.getElementById("suggested-room")
	roomName.textContent = x.textContent;
}

function changeCounter(){
	return 10-turnCount;
}

function startGameEasy() {

}

function allSuggestionsCorrect() {
	var clueMessage = document.createElement("p");
	clueMessage.textContent = "There is not much I can tell you";
	document.getElementById("clue-div").append(clueMessage);
}

function giveSuspectClue(suspect){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: ${suspect} is innocent!`;
	document.getElementById("clue-div").append(clueMessage);
}

function giveWeaponClue(weapon){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: I don't think it was the ${weapon}`;
	document.getElementById("clue-div").append(clueMessage);
}

function giveRoomClue(room){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: It didn't happen in the ${room}`;
	document.getElementById("clue-div").append(clueMessage);
}

function createHighlights(element) {
	var choice = document.getElementById(element);
	choice.style.border = "4px solid yellow";
	document.getElementById(element).addEventListener("click", moveMyPiece)
}


