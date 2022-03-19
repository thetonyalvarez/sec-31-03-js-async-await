$(function () {
	const BASE_URL = "http://deckofcardsapi.com";

	const $cardWrapper = $("#card-wrapper");
	const $cardPile = $("#card-pile");
	const $btn = $("button");

	const draw_card = async (deckId = "new") => {
		return await $.getJSON(`${BASE_URL}/api/deck/${deckId}/draw/`);
	};

	const callDeck = async (deckId = "new") => {
		return await $.get(`${BASE_URL}/api/deck/${deckId}/shuffle`);
	};

	// * 1.
	// Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit(e.g. “5 of spades”, “queen of diamonds”).

	const logCardValue = async () => {
		const deck = await callDeck();
		console.log(deck);
		let { deck_id } = deck;
		let { cards: card1 } = await draw_card(deck_id);
		console.log(`${card1[0].value} of ${card1[0].suit}`);
	};

	logCardValue();

	// * 2.
	// Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.

	// Once you have both cards, console.log the values and suits of both cards.
	// Draws a new deck by default if no id is defined

	const DrawTwoCardsFromNewDeck = async () => {
		const deck = await callDeck();
		let { deck_id } = deck;
		let { cards: card1 } = await draw_card(deck_id);
		let { cards: card2 } = await draw_card(deck_id);
		console.log(`${card1[0].value} of ${card1[0].suit}`);
		console.log(`${card2[0].value} of ${card2[0].suit}`);
	};

	DrawTwoCardsFromNewDeck();

	// * 3.
	// Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.
	const start = async () => {
		let { deck_id } = await callDeck();

		$btn.on("click", async () => {
			let { cards: card, remaining } = await draw_card(deck_id);
			let imgUrl = card[0].image;
			$cardPile.append(`<img src=${imgUrl}>`);
			if (remaining == 0) {
				$btn.remove();
			}
		});
	};
	start();
});
