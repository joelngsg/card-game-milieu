const prompt = require('prompt-sync')({sigint: true});

let player_count 
while(isNaN(player_count)){
    player_count = prompt("key in the number of players: ")
    if(isNaN(player_count)){
        console.log("please key in a valid number")
    }
}
player_count = parseInt(player_count)
let players_cards = Array(player_count).fill({})
let players_scores = Array(player_count).fill(0)
let deck = []

// index in order of lowest point to highest, assuming ace is the lowest
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]
// index in order of lowest point to highest, assuming the order is correct
const suits = ["diamond", "club", "hearts", "spades"]

function build_deck () {
    let deck_len = 104;
    for( let i = 0; i < deck_len; i++){
        deck[i] = {value: values[i % values.length], suit: suits[Math.floor(i / values.length) % 4]}
    }
}

function shuffle_deck () {
    deck.sort((a, b) => 0.5 - Math.random());
}

function display_player_cards () {
    for(let i = 0; i < players_cards.length; i++){
        if(players_cards[i].value !== undefined){
            console.log("player " + i + " card is: " + players_cards[i].value + " of " + players_cards[i].suit)
        }
        else{
            console.log("player " + i + " did not draw a card")
        }
    }
}

function draw_card(player_index) {
    players_cards[player_index] = deck.pop();
    return players_cards[player_index];
}

function check_winner(){
    let winner_index = 0;
    for(let i = 1; i < players_cards.length; i++){
        // if the current winner has a better card than the comparing player
        if(values.indexOf(players_cards[winner_index].value) > values.indexOf(players_cards[i].value) || 
        (values.indexOf(players_cards[winner_index].value) === values.indexOf(players_cards[i].value) && 
        suits.indexOf(players_cards[winner_index].suit) > suits.indexOf(players_cards[i].suit))){
            // winner is still the winner
        }
        else{
            // this wil occur even if the cards are the same but it wont matter as there is a check after
            winner_index = i;
        }
    }
    // if another player has the same card as the player with the highest card, nobody wins that round
    let is_more_than_one_winner = false;
    for(let i = 0; i < players_cards.length; i++){
        if(winner_index === i) continue;
        if(players_cards[winner_index].value === players_cards[i].value && 
        players_cards[winner_index].suit === players_cards[i].suit){
            is_more_than_one_winner = true;
            break;
        }
    }
    
    if(!is_more_than_one_winner){
        players_scores[winner_index] ++;
    }else{
        winner_index = undefined;

    }
    return winner_index;
}

function display_player_scores () {
    // sort the scores from highest to lowest
    let sorted_scores = []
    for(let i = 0; i < players_scores.length; i++){
        sorted_scores.push({index: i, score: players_scores[i]})
    }
    const entries = Object.entries(sorted_scores);
    entries.sort((x, y) => y[1].score - x[1].score)

    // print out the sorted scores
    for(let i = 0; i < entries.length; i++){
        console.log("player " + entries[i][1].index + " score: " + entries[i][1].score)
    }

}

function clear_players_cards() {
    for(let i = 0; i < players_cards.length; i++){
        players_cards[i] = {};
    }
}

function print_seperator() {
    console.log("===============================")
}

function main (){
    build_deck();
    shuffle_deck();

    // assuming that if the remaining cards are < number of players, game stops
    while(deck.length >= players_cards.length){
        for(let i = 0; i < players_cards.length; i++){
            // subsequent player after the first player draws a card
            let choice = "y";
            if(i > 0){
                choice = prompt("player " + i + ", would you like to draw a card (y/n)?")
            }
            if(choice === "y"){
                let card_drawn = draw_card(i)
                console.log("player " + i + " drew the " + card_drawn.value + " of " + card_drawn.suit)
            }
        }
        print_seperator();  
        display_player_cards();
        print_seperator();  
        let winner_index = check_winner();
        if(winner_index !== undefined)
            console.log("player " + winner_index + " won this round");
        else
            console.log("nobody won ths round")
        print_seperator();  
        // clear the player cards each round
        clear_players_cards();
    }

    display_player_scores();
}

main();