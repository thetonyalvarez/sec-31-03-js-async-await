const BASE_URL = "http://numbersapi.com";

let favNumber = 1;

/*
    1.  Make a request to the Numbers API to get a fact about your favorite number. (Make sure you get back JSON by including the json query key, specific to this API.)
*/

const numberFact = async () => {
	try {
		let res = await $.getJSON(`${BASE_URL}/${favNumber}?json`);
		$("#fav-number").text(`Favorite Number: ${res.number}`);
		$("#fav-number-fact").text(`Fact: ${res.text}`);
	} catch (err) {
		console.log("Error:", err);
	}
};

numberFact();

/*
    2.  Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page.
*/

let numbers = [1, 2, 3, 4];

const multipleNumbers = async () => {
	try {
		let data = await $.getJSON(`${BASE_URL}/${numbers}`);
		for (let [num, fact] of Object.entries(data)) {
			$("#mult-number-facts").append(`${num}: ${fact}<br>`);
		}
	} catch (err) {
		console.log("ERROR:", err);
	}
};

multipleNumbers();

/*
    3.  Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.
*/

const facts = async () => {
	try {
		const types = ["trivia", "math", "date", "year"];
		for (type of types) {
			let data = await $.get(`${BASE_URL}/${favNumber}/${type}/`);
			$("#fav-number-facts").append(`<div>${data}</div>`);
		}
	} catch (err) {
		console.log("ERROR:", err);
	}
};

facts();
