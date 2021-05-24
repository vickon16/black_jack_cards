

document.getElementById("how_to_play").addEventListener("click",() => {
  alert("This is a black jack game between user(You) and Computer(dealer).\n\nClick on the Hit button to play cards.\n\nEnsure the total number of cards played is less than 21 or You get busted!!!.\n\nWhen you feel playing the next card will result to a bust, Click on the stand button for the Dealer's(computer) turn.\n\nClick the Deal button to move to the next round.\n\nNote that if the ('Wins'+ 'Losses' + 'Draws' > 10), the game ends.")
})


let blackjackGame = {
  "you": { 
    "div": "#your-box",
    "scoreSpan": "#your-blackjack-result",
    "score": 0,
  },
  "dealer": {
    "div": "#dealer-box",
    "scoreSpan": "#dealer-blackjack-result",
    "score": 0,
  },
  "cards": ["2","3","4","5","6","7","8","9","10","K","J","Q","A"],
  "cardsMap": {"2": 2, "3": 3, "4":4, "5":5 , "6": 6, "7": 7, "8": 8, 
              "9":9,"10": 10, "K": 10, "J" : 10, "Q": 10, "A": [1, 11]
  },
  "wins": 0,
  "losses": 0,
  "draws": 0,
}

const You = blackjackGame["you"];
const Dealer = blackjackGame["dealer"];
const Cards = blackjackGame["cards"];
const cardsMap = blackjackGame["cardsMap"]
let Wins = blackjackGame["wins"]
let Losses = blackjackGame["losses"]
let Draws = blackjackGame["draws"];

const hitSound = new Audio("./sounds/swish.m4a");
const winSound = new Audio("./sounds/cash.mp3");
const aww = new Audio("./sounds/aww.mp3");


document.querySelector("#blackjack-hit").addEventListener("click", blackjackHit);
document.querySelector("#blackjack-stand").addEventListener("click", blackjackStand);
document.querySelector("#blackjack-deal").addEventListener("click", blackjackDeal);
let winsHTML = document.querySelector("#wins");
let lossesHTML = document.querySelector("#losses");
let drawsHTML = document.querySelector("#draws");



function blackjackHit() {
  disableDeal()
  let card = randomCard();
  upDateScore(card, You)
  showCard(card, You);
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    createCards(card, activePlayer)
  } else {
    createCards(card, activePlayer)
    disableHit()

    document.querySelector(activePlayer["scoreSpan"]).textContent = "Bust!!"
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red"
  }
  
}

function createCards(card, activePlayer) {
  image = document.createElement("img");
  image.src = `./images/${card}.png`;
  document.querySelector(activePlayer["div"]).appendChild(image); 
  hitSound.play();
}

function randomCard() {
  randomNum = Math.floor(Math.random() * Cards.length);
  return Cards[randomNum];
}



// function calculate(card) {
//   for (items in cardsMap) {
//     if(items === card) {
//       if (items === "A") {
//         rand = Math.floor(Math.random() * cardsMap[items].length)
//         yourScore += cardsMap[items][rand]
//         console.log("card: " + card, "items :" + items, "cardMap: " + yourScore);
//       } else {
//         yourScore += cardsMap[items];
//         console.log("card: " + card, "items :" + items, "cardMap: " + yourScore);
//       }
//       return yourScore;
//     }
//   }
// }

function upDateScore(card, activePlayer) {
      // if adding 11 keeps me below 21, add 11 otherwise, add 1
      if (card === "A") {
        rand = Math.floor(Math.random() * cardsMap[card].length)
        if (activePlayer["score"] + cardsMap[card][rand] <= 21) {
            activePlayer['score'] += cardsMap[card][1];
            showScore(activePlayer)        
        } else {
          activePlayer['score'] += cardsMap[card][0];
          showScore(activePlayer)
        }
      } else {
        activePlayer['score'] += cardsMap[card];
        showScore(activePlayer)
      }  
}

function showScore(activePlayer) {
  document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
}

function disableHit(){ document.querySelector("#blackjack-hit").disabled = true;}
function disableStand(){ document.querySelector("#blackjack-stand").disabled = true;}
function disableDeal(){ document.querySelector("#blackjack-deal").disabled = true;}
function enableHit(){ document.querySelector("#blackjack-hit").disabled = false;}
function enableStand(){ document.querySelector("#blackjack-stand").disabled = false;}
function enableDeal(){ document.querySelector("#blackjack-deal").disabled = false;}


function sleep(mills) {
  return new Promise(resolve => setTimeout(resolve, mills))
}



async function blackjackStand() {
  
  // await sleep(400);
  while (Dealer["score"] < 17) { 
    if (You["score"] === 0) {
      enableHit()
      break;
    } else {
      let card = randomCard();
      upDateScore(card, Dealer);
      showCard(card, Dealer);
      disableHit()
      disableStand()
      disableDeal()
    }
    await sleep(800);
}

enableDeal()
computeWinner()

  
}

// show who win
function computeWinner() {
  let winner;

  if (You["score"] <= 21) {
    // consider if dealer is less than 21 or dealer Bust!!
    if (You["score"] > Dealer["score"] || Dealer["score"] > 21) {
      winner = You;
      Wins++;
    } else if (You["score"] < Dealer["score"]) {
      winner = Dealer;
      Losses++;
    } else if (You["score"] === Dealer["score"] && You["score"] != 0) {
      Draws++;
    }

    // condition if your score is above 21
  } else if (You["score"] > 21 && Dealer["score"] <= 21) {
    winner = Dealer;
    Losses++;
  } else if (You["score"] > 21 && Dealer["score"] > 21) {
    Draws++;
  }

  showResult(winner);
  checkGameOver()
  return winner;
}


function showResult(winner) {
  let message, messageColor;

  if(winner === You) {
    message = "You Won!";
    messageColor = "green";
    wins.innerHTML = Wins;
    winSound.play();

  } else if ( winner === Dealer) {
    message = "You Lost!";
    messageColor = "red"
    losses.innerHTML = Losses;
    aww.play();
  }
  else if (You["score"] != 0) {
    message = "You Drew!";
    messageColor = "orange";
    draws.innerHTML = Draws;
  } else {
    message = "Let's Play";
    messageColor = "black";
  }

  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;

}



function checkGameOver() {
  if (Wins + Losses + Draws > 10) {
    if (Wins > Losses) {
      clearScreen()
      createTags("YOU WON!!!<br> " + Wins + " wins")
      tryAgain()

    } else if (Losses > wins) {
      clearScreen()
      createTags("YOU Lost!!!<br> " + Losses + " losses")
      tryAgain()
    } else {
      clearScreen()
      createTags("You Drew");
      tryAgain()
    }
  }

}

function clearScreen() {
  document.querySelector(".container").innerHTML = "";
}

function tryAgain() {
  document.querySelector("#try-again").addEventListener("click", function() {
    window.location.reload();
  })
}

function createTags(message) {
  let div = document.createElement("div");
      div.setAttribute("id", "game-over")
      let h1 = document.createElement("h1");
      let text = document.createTextNode(message);
      h1.setAttribute("id", "game-over-content");
      h1.appendChild(text);
      let button = document.createElement("button");
      button.setAttribute("id", "try-again");
      textButton = document.createTextNode("Try Again");
      button.appendChild(textButton);
      div.appendChild(h1)
      div.appendChild(button);
      document.body.appendChild(div)
}




// this reset the whole thing
function blackjackDeal() {
  let yourImg = document.querySelectorAll("#your-box img");
  let dealerImg = document.querySelectorAll("#dealer-box img");

  yourImg.forEach(item => {item.remove()});
  dealerImg.forEach(item => {item.remove()});

  document.querySelector("#your-blackjack-result").textContent = 0;
  document.querySelector("#dealer-blackjack-result").textContent = 0;
  You.score = 0;
  Dealer.score = 0;

  enableHit()
  enableStand()

  document.querySelector("#your-blackjack-result").style.color = "white";
  document.querySelector("#dealer-blackjack-result").style.color = "white";
  document.querySelector("#blackjack-result").textContent = "Let's Play";
  document.querySelector("#blackjack-result").style.color = "black";
}

