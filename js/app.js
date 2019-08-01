//glocal variables for game
let toggledCards = []
let moves = 0;
let matchesMade = 0;
let time = 0;
let timerLive = false;
let starCount = 3;
let timerId;


//array to hold all cards for shuffling and resetting
const allCards = Array.from(document.querySelectorAll('.deck li'));

//game control buttons and events
const cancelButton = document.querySelector('.cancel-button');
cancelButton.addEventListener('click', () => {
  toggleModal();
});

const exitButton = document.querySelector('.exit-click');
exitButton.addEventListener('click', () => {
  toggleModal();
});


const replayButton = document.querySelector('.reset-button');
replayButton.addEventListener('click', () => {
  resetGame();
});

const inGameReset = document.querySelector('.restart');
inGameReset.addEventListener('click', () => {
  toggleModal();
  resetGame();
});

//Timer functions
function startTimer() {
  time = 0;
  timerId = setInterval(() => {
    time++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerLive = false;
}

//displays time to visual interface in correct format
function updateTimer() {
  const timerDisplay = document.querySelector('div .timer');
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    timerDisplay.innerText = minutes + ':0' + seconds;
  } else {
    timerDisplay.innerText = minutes + ':' + seconds;
  }
}

//central matching logic for game
const deck = document.querySelector('.deck');
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)) {
    //console.log('a click come hither!');
    toggleCard(clickTarget);
    addToggledCard(clickTarget);
    if (timerLive === false) {
      startTimer();
      timerLive = true;
    }
    if (toggledCards.length === 2) {
      //console.log('2 cards!');
      moves++;
      checkMatch(clickTarget);
    }
  }
});

//push chosen card into array for comparison
function addToggledCard(clickTarget) {
  toggledCards.push(clickTarget);
  //console.log(toggledCards);
}

//check for a match
function checkMatch() {
  if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
    //console.log('A match!');
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    matchesMade++;
    toggledCards = [];
    winChecker();
  } else {
    setTimeout(() => {
      //console.log('No match!');
      //console.log(toggledCards);
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 1000);
  }
  updateScore();
}

//check if game is won
function winChecker() {
  if (matchesMade === 8) {
    gameOver();
  }
}

//gane won
function gameOver() {
  stopTimer();
  updateModalStats();
  toggleModal();
}

//close all cards
function resetCards() {
  for (let card of allCards) {
    card.className = 'card';
  }
}

// open selected cards
function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

//updates scoreboard
function updateScore() {
  const scoreboard = document.querySelector('.moves');
  scoreboard.innerText = moves;
  starScore();
}

//removes stars as moves increase
function starScore() {
  if (moves === 15 || moves === 22) {
    removeStar();
  }
}


function removeStar() {
  const starSet = document.querySelectorAll('.stars li');
  for (star of starSet) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      starCount--;
      break;
    };
  }
}

//restores stars
function resetStar() {
  starCount = 3;
  const starSet = document.querySelectorAll('.stars li');
  for (star of starSet) {
    star.style.display = 'inline';
  }
}

//toggle modal on and off
function toggleModal() {
  const modal = document.querySelector('.modal-background');
  modal.classList.toggle('hide');
}

//displays stats on gameOver screen
function updateModalStats() {
  const gameClock = document.querySelector('.timer').innerHTML;
  const timerStats = document.querySelector('.stats-time');
  const moveStats = document.querySelector('.stats-moves');
  const starStats = document.querySelector('.stats-stars');
  timerStats.innerHTML = `Your time: ${gameClock}`;
  moveStats.innerHTML = `Moves: ${moves}`;
  starStats.innerHTML = `Your stars: ${starCount}`;
}

//shuffles the deck and changes card's position
function shuffleDeck() {
  const shuffledCards = shuffle(allCards);
  for (let card of shuffledCards) {
    deck.appendChild(card);
  }
}

//reset game
function resetGame() {
  score = 0;
  timer = 0;
  timerLive = false;
  time = 0;
  moves = 0;
  stopTimer();
  toggleModal();
  shuffleDeck();
  resetStar();
  updateScore();
  updateTimer();
  resetCards();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//initiate game and DOM elements once DOM is loaded

window.onload = startGame();

function startGame() {
  shuffleDeck();
  updateScore();
}