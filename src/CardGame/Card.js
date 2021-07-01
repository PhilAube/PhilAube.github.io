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
        this.selected = false;
    }

    // Draws the given card in a certain position based on suit and rank.
    drawCard(x, y, highlighted)
    {
        if (this.selected)
        {
            if (highlighted) drawFaceDown(x, y, 'gray');
            else drawFaceDown(x, y, 'white');
        }
        else
        {
            drawCardBG(highlighted);

            colorSuit(this.suit);
    
            drawCardPattern(this.rank, this.suit, x, y);
    
            drawCardOutline();
        }

        function drawCardBG(highlighted)
        {
            ctx.beginPath();
            ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
            if (highlighted) { ctx.fillStyle = 'gray'; }
            else { ctx.fillStyle = 'white'; }
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

            ctx.font = "60px Verdana";
            ctx.fillText(suit, x + (CARD_WIDTH / 2), CENTER_Y);
            
            ctx.font = "17px Verdana";
            ctx.fillText(rank, LEFT, y + 20);
            ctx.font = "20px Verdana";
            ctx.fillText(suit, LEFT, y + 45);

            ctx.font = "17px Verdana";
            ctx.fillText(rank, RIGHT, y + CARD_HEIGHT - 10);
            ctx.font = "20px Verdana";
            ctx.fillText(suit, RIGHT, y + CARD_HEIGHT - 35);
        }

        function drawCardOutline()
        {
            ctx.beginPath();
            ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    drawFD(x, y, color)
    {
        drawFaceDown(x, y, color);
    }
}

// A class for building a standard 52-card deck. //
class Deck
{
    constructor()
    {
        this.cards = [];

        this.topCard = 0;

        createSuits(this.cards);

        // Loops through each rank to create a suit of cards
        function createSuits(cards)
        {
            let cardIndex = 0;
            
            for (let s = 0; s < suits.length; s++)
            {
                for (let r = 0; r < ranks.length; r++)
                {
                    cards[cardIndex] = new Card(suits[s], ranks[r]);
                    cardIndex++;
                }
            }
        }

        // Shuffles the deck.
        this.Shuffle = function()
        {
            for (let index = 0; index < 52; index++)
            {
                let randomIndex = null;

                do 
                {
                    randomIndex = (Math.floor(Math.random() * 52));
                } while (randomIndex === index);
                
                let tempCard = {};
                
                Object.assign(tempCard, this.cards[index]);

                Object.assign(this.cards[index], this.cards[randomIndex]);
                Object.assign(this.cards[randomIndex], tempCard);
            }
        }
    }
}

// A class defining a hand with a method for accumulating the value.
class Hand
{
    constructor()
    {
        this.cards = [];

        this.getBJValue = function() // TODO: Ranks come in as a string. Make them integers.
        {
            let acc = 0;
            let aceCount = 0;

            for (let i = 0; i < this.cards.length; i++)
            {
                if (this.cards[i].rank === 'A') // If Ace
                {
                    aceCount++;
                    acc +=11;
                }
                else if (this.cards[i].rank == 'K' || this.cards[i].rank == 'Q' || this.cards[i].rank == 'J') // If face card
                {
                    acc += 10;
                }
                else
                {
                    acc += ranks.indexOf(this.cards[i].rank) + 1;
                }
            }

            while (acc > 21 & aceCount > 0)
            {
                acc -= 10;
                aceCount--;
            }

            return acc;
        }
    }
}