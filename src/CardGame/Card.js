// * This file defines the Card and Deck classes, and its related code. * //

let suits = [ Diamonds = '♦', Hearts = '♥', Spades = '♠', Clubs = '♣'];

let ranks = [ "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K" ];

class Card
{
    constructor(suit, rank, x, y)
    {
        this.suit = suit;
        this.rank = rank;
        this.x = x;
        this.y = y;
    }

    // Draws the given card in a certain position based on suit and rank.
    drawCard(x, y)
    {
        drawCardBG();

        colorSuit(this.suit);

        drawCardPattern(this.rank, this.suit, x, y);

        drawCardOutline();

        function drawCardBG()
        {
            ctx.beginPath();
            ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
            ctx.fillStyle = 'white';
            ctx.fill();
        }

        // Picks the right card color based on suit.
        function colorSuit(suit)
        {
            switch (suit)
            {
                case Spades:
                case Clubs:
                    ctx.fillStyle = 'black';
                    break;
    
                case Diamonds:
                case Hearts:
                    ctx.fillStyle = 'red';
                    break;
    
                default:
                    // In case of an error, shouldn't happen
                    ctx.fillStyle = 'blue';
            }
        }

        // Draws the card based on the rank and suit
        function drawCardPattern(rank, suit, x, y)
        {
            const CENTER_Y = y + (CARD_HEIGHT / 3) * 2;
            const LEFT = x + (CARD_WIDTH / 10) + 5;
            const RIGHT = x + (CARD_WIDTH / 10) * 9 - 5;

            ctx.font = "75px Verdana";
            ctx.fillText(suit, x + (CARD_WIDTH / 2), CENTER_Y);
            
            ctx.font = "17px Verdana";
            ctx.fillText(rank, LEFT, y + 20);
            ctx.font = "20px Verdana";
            ctx.fillText(suit, LEFT, y + 40);

            ctx.font = "17px Verdana";
            ctx.fillText(rank, RIGHT, y + CARD_HEIGHT - 10);
            ctx.font = "20px Verdana";
            ctx.fillText(suit, RIGHT, y + CARD_HEIGHT - 30);
        }

        function drawCardOutline()
        {
            ctx.beginPath();
            ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }
}

// A class for building a standard 52-card deck. //
class Deck
{
    constructor()
    {
        this.cards = [];

        let cardIndex = 0;

        createSuits(this.cards);

        // Loops through each rank to create a suit of cards
        function createSuits(cards)
        {
            for (let s = 0; s < suits.length; s++)
            {
                for (let r = 0; r < ranks.length; r++)
                {
                    cards[cardIndex] = new Card(suits[s], ranks[r]);
                    cardIndex++;
                }
            }
        }
    }
}