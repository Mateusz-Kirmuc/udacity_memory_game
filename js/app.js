/*
 * Create a list that holds all of your cards
 */
const CARDS = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf",
  "bicycle", "bomb", "diamond", "paper-plane-o", "anchor", "bolt", "cube",
  "leaf", "bicycle", "bomb"
];
let openCards = [];
let timer, time;

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
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function newGame() {
  removeOldCards();
  const shuffledDeck = shuffle(CARDS);
  insertNewCards(shuffledDeck);
  resetMoveCounter();
  resetStarRating();
  restartTimer();
  openCards = [];
  $(".card").click(cardClickHandler);
}

function removeOldCards() {
  $(".card").remove();
}

function insertNewCards(shuffledDeck) {
  for (const card of shuffledDeck) {
    const cardHTML = `<li class="card"><i class="fa fa-${card}"></i></li>`;
    $(".deck").append(cardHTML);
  }
}

function resetMoveCounter() {
  $(".moves").html("0");
  $(".moves-summary").html("0");
}

function resetStarRating() {
  $(".stars li").css("color", "black");
  $(".stars-summary").html("3");
}

function restartTimer() {
  time = 0;
  timer = setInterval(function() {
    time++;
    console.log(time);
  }, 1000);
}

/*
 * Set restart button click handler.
 */
$(".restart").click(function() {
  if ($(".success-popup").css("display") == "none") {
    clearInterval(timer);
    newGame();
  }
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function cardClickHandler() {
  if (openCards.length < 2) {
    markCardAsOpen($(this));
    flipCard($(this));
  }
  if (openCards.length == 2) {
    let card1Symbol = openCards[0].children().attr("class");
    let card2Symbol = openCards[1].children().attr("class");
    if (card1Symbol == card2Symbol) {
      markCardsAsMatch();
    } else {
      unflipCards();
    }
    incrementMoveCounter();
    updateStarRating();
    if ($(".match").length == 16) {
      displaySuccessPopup();
    }
  }
}

function flipCard(card) {
  card.toggleClass("open show");
  card.off("click");
}

function markCardAsOpen(card) {
  if (openCards.length < 2) {
    openCards.push(card);
  }
}

function markCardsAsMatch() {
  for (let card of openCards) {
    card.toggleClass("open show match");
  }
  openCards = [];
}

function unflipCards() {
  const openCardsCopy = openCards.slice();
  openCards = [];
  window.setTimeout(function() {
    for (let card of openCardsCopy) {
      card.toggleClass("open show");
      card.click(cardClickHandler);
    }
  }, 700);
}

function incrementMoveCounter() {
  const currentValue = parseInt($(".moves").html());
  const nextValue = currentValue + 1;
  $(".moves").html(nextValue.toString());
  $(".moves-summary").html(nextValue.toString());
}

function updateStarRating() {
  const currentMoves = parseInt($(".moves").html());
  if (currentMoves == 14) {
    $(".third-star").css("color", "LightGrey");
    $(".stars-summary").html("2");
  } else if (currentMoves == 22) {
    $(".second-star").css("color", "LightGrey");
    $(".stars-summary").html("1");
  }
}

function displaySuccessPopup() {
  $(".time").html(time);
  $(".success-popup").css("display", "block");
}

/*
 * Set play again button handler.
 */
$(".play-again").click(function() {
  $(".success-popup").css("display", "none");
  clearInterval(timer);
  newGame();
});

/*
 * Start new game!
 */
newGame();
