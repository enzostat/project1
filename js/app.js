
$("#suggest-div").hide();
$("#accuse-div").hide();
$("#play-again").hide();





// <-----Variables and Constants -------->
var suspects = ["Miss Scarlet", "Mr. Green", "Colonel Mustard", "Professor Plum", "Mrs. Peacock", "Mrs. White"];
var weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Monkey Wrench"];
var rooms = ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Billiard Room", "Library", "Lounge", "Hall", "Study"];

//empty object created to hold the answers
var correctAnswers = {
	suspect: " ",
	weapon: " ",
	room: " "
};


var turnCount = 0;

//empty clue object, will hold clues to be shown at the beginning of the game
var clues = {
	suspects: [],
	weapons: [],
	rooms: []
}


//created in order to remove location listeners
var allPossibleLocations = ["Kitchen", "Ballroom", "Conservatory", "dining-room", "billiard-room", "Library", "Study", "Hall", "Lounge"];

//when called on, these show the possible moves the player has from their current location
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


//allows the user to see how many moves they have left
var counter = document.getElementById("counter")
counter.textContent = countDown;



//function created so that it can be removed in endGame
var suggest_Listener = function() {
	event.preventDefault();
	checkSuggestion();
	$("#suggest-div").hide();
	$("#accuse-div").hide();
}



// <-------- Event Listeners ----------->


//event listener for start button
document.getElementById("start").addEventListener("click", function(){
	startGame();
	// console.log("Clicked");
})

document.getElementById("easy-mode").addEventListener("click", function() {
	startGameEasy();
})

document.getElementById("hard-mode").addEventListener("click", function() {
	startGameHard();
})




// <---------- Functions ---------------->


//starts the game
function startGame() {
	countDown = 10;
	counter.textContent = changeCounter();
	hideStartButtons();
	randomizedMurder();
	giveClues();
	$("#play-again").hide();

	//gives you options to move the player piece
	moveOptions();

	



	//event listener for accusations
	document.getElementById("accuse").addEventListener("submit", function(e) {
		e.preventDefault();
		
		checkAccusation();
	})

//event listener for suggestions
	document.getElementById("suggest").addEventListener("submit", suggest_Listener) //function(e) {
	
}

function startGameEasy() {

	countDown = 15;
	counter.textContent = changeCounter();
	hideStartButtons();
	randomizedMurder();
	giveCluesEasy();
	$("#play-again").hide();
	

	//gives you options to move the player piece
	moveOptions();




	//event listener for accusations
	document.getElementById("accuse").addEventListener("submit", function(e) {
		e.preventDefault();
		
		checkAccusation();
	})

//event listener for suggestions
	document.getElementById("suggest").addEventListener("submit", suggest_Listener)

}

function startGameHard() {
	countDown = 15;
	counter.textContent = changeCounter();
	hideStartButtons();
	randomizedMurder();
	$("#play-again").hide();
	
	
	//print that no clues are given
	var noClues = document.getElementById("clue-div")
	noClues.textContent = "You chose to play the hardest difficulty. No initial clues will be provided."

	//gives you options to move the player piece
	moveOptions();


	//event listener for accusations
	document.getElementById("accuse").addEventListener("submit", function(e) {
		e.preventDefault();
		
		checkAccusation();
	})

//event listener for suggestions
	document.getElementById("suggest").addEventListener("submit", suggest_Listener)
}


//fills an object with the murder suspect, weapon and room
function randomizedMurder(){
	
	weapons.sort(randomize);
	suspects.sort(randomize);
	rooms.sort(randomize);

	var coin = 0;
	coin = coinFlip(2);
	

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

	document.getElementById("clue-div").append(clueMessage);
}

function giveCluesEasy() {
	clues.rooms.push(rooms[0]);
	clues.rooms.push(rooms[1]);
	clues.suspects.push(suspects[0]);
	clues.suspects.push(suspects[1]);
	clues.weapons.push(weapons[0]);
	clues.weapons.push(weapons[1]);

	//prints out clues in clue-div
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `${clues.suspects[0]} and ${clues.suspects[1]} are innocent! The murder didn't happen in the ${clues.rooms[0]} or the ${clues.rooms[1]}. And neither the ${clues.weapons[0]} nor the ${clues.weapons[1]} were used!`;


	document.getElementById("clue-div").append(clueMessage);
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

	$("#accuse-div").hide();
	$("#suggest-div").hide();

	//empty the div
	$("#clue-div").empty();


	//create a play again button
	$("#play-again").show();
	document.getElementById("play-again").addEventListener("click", function() {
		restartGame();
		
	});
}

function moveOptions() {
	
	//finds the game piece on the board
	var x = document.getElementById("game-piece").parentNode;
	
	

	//determines move options based on current location of the game-piece
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
		console.log("Something went very wrong");
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
	
	movePiece(e.target);
	removeMovementListeners();
	revertToNormal();
	if (turnCount >= countDown) {
		
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

//updates the counter in the gameboard
function changeCounter(){
	return countDown-turnCount;
}



//called when all suggested items are correct. hints that the player should make an accusation
function allSuggestionsCorrect() {
	var clueMessage = document.createElement("p");
	clueMessage.textContent = "There is not much I can tell you. Maybe you're ready to make an accusation...";
	document.getElementById("clue-div").append(clueMessage);
}


//called to give a clue as to an innocent party
function giveSuspectClue(suspect){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: ${suspect} is innocent!`;
	document.getElementById("clue-div").append(clueMessage);
}


//called to give a weapon clue
function giveWeaponClue(weapon){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: I don't think it was the ${weapon}`;
	document.getElementById("clue-div").append(clueMessage);
}

//called to give a room clue
function giveRoomClue(room){
	var clueMessage = document.createElement("p");
	clueMessage.textContent = `I can only tell you this: It didn't happen in the ${room}`;
	document.getElementById("clue-div").append(clueMessage);
}

//creates highlights for moveable options and creates event listeners
function createHighlights(element) {
	var choice = document.getElementById(element);
	choice.style.border = "4px solid yellow";
	document.getElementById(element).addEventListener("click", moveMyPiece)
}


function restartGame() {
	

	suspects = ["Miss Scarlet", "Mr. Green", "Colonel Mustard", "Professor Plum", "Mrs. Peacock", "Mrs. White"];
	weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Monkey Wrench"];
	rooms = ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Billiard Room", "Library", "Lounge", "Hall", "Study"];

	correctAnswers.weapon = " ";
	correctAnswers.suspect = " ";
	correctAnswers.room = " ";
	turnCount = 0;

	clues = {
	suspects: [],
	weapons: [],
	rooms: []
	}

	$("#clue-div").empty();
	$("#start").show();
	$("#easy-mode").show();
	$("#hard-mode").show();

	document.getElementById("suggest").removeEventListener("submit", suggest_Listener)

	
	cheatSuspectArray = ["Scarlet", "Green", "Mustard", "Plum", "Peacock", "White"];
	cheatWeaponArray = ["Candlestick", "Knife", "Wrench", "Revolver", "Rope", "Pipe"];
	cheatRoomArray = ["Dining", "Kitchen", "Ballroom", "Conservatory", "Billiard", "Library", "Study", "Hall", "Lounge"];


	cheatSuspectArray.forEach(function(element){
		$(`input[name=${element}`).prop('checked',false);
	});
	cheatWeaponArray.forEach(function(element){
		$(`input[name=${element}`).prop('checked',false);
	});
	cheatRoomArray.forEach(function(element){
		$(`input[name=${element}`).prop('checked',false);
	});


  	var returnToStart = document.getElementById("game-piece")
  	document.getElementById("cellar").append(returnToStart);
  	$("#play-again").hide();

}

function hideStartButtons() {
	$("#start").hide();
	$("#easy-mode").hide();
	$("#hard-mode").hide();
}

