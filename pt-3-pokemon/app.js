$(() => {
	const BASE_URL = "https://pokeapi.co/api/v2";
	let pokeCount = 3;
	let pokeNames = [];

	// 1.  Figure out how to make a single request to the [Pokemon API](https://pokeapi.co/) to get names and URLs for every pokemon in the database.
	const getAllPokes = async () => {
		let res = $.getJSON(`${BASE_URL}/pokemon?limit=1126`);
		// console.log("Part 1:", res);
		return await res;
	};

	getAllPokes();

	// 2. Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs. Once those requests are complete, console.log the data for each pokemon.

	const getThreePokes = async () => {
		let pokeNames = [];
		let pokeUrls = [];

		for (let i = 0; i < pokeCount; i++) {
			let { results: res } = await getAllPokes();
			let randomPoke = res[Math.floor(Math.random() * (res.length - 1))];
			let { name, url } = randomPoke;
			pokeNames.push(name);
			pokeUrls.push(url);
		}

		let pokemon = await Promise.all(pokeUrls.map((url) => $.getJSON(url)));

		pokemon.forEach((poke) => {
			console.log(`Pokemon: ${poke.name}`, poke);
		});
	};

	getThreePokes();

	// 3. Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable...
	// ... and then make another request, this time to that pokemon’s species URL (you should see a key of species in the data).
	// Once _that_ request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English.If you find one, console.log the name of the pokemon along with the description you found.

	const getDescriptions = async () => {
		let pokeNames = [];
		let pokeUrls = [];

		for (let i = 0; i < pokeCount; i++) {
			let { results: res } = await getAllPokes();
			let randomPoke = res[Math.floor(Math.random() * (res.length - 1))];
			let { name, url } = randomPoke;
			pokeNames.push(name);
			pokeUrls.push(url);
		}

		let pokemon = await Promise.all(pokeUrls.map((url) => $.getJSON(url)));

		let speciesData = await Promise.all(
			pokemon.map((data) => $.getJSON(data.species.url))
		);

		let descriptionData = speciesData.map((spec) => {
			let description = spec.flavor_text_entries.find(
				(entry) => entry.language.name == "en"
			);
			return description
				? description.flavor_text
				: `No English entry found for flavor text for ${data.name}`;
		});
		descriptionData.forEach((text, idx) => {
			console.log(`${pokeNames[idx]}: ${text}`);
		});
	};

	getDescriptions();

	// 4. **BONUS** Instead of relying on console.log, let’s create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3.

	let $btn = $("button");
	let $pokeArea = $("#pokemon-wrapper");

	$btn.on("click", async () => {
		$pokeArea.empty();
		let pokeNames = [];
		let pokeUrls = [];

		let getAllPokes = await $.getJSON(`${BASE_URL}/pokemon?limit=1126`);

		for (let i = 0; i < pokeCount; i++) {
			let { results: res } = getAllPokes;
			let randomPoke = res[Math.floor(Math.random() * (res.length - 1))];
			let { name, url } = randomPoke;
			pokeNames.push(name);
			pokeUrls.push(url);
		}

		let pokemon = await Promise.all(pokeUrls.map((url) => $.getJSON(url)));

		let speciesData = await Promise.all(
			pokemon.map((data) => $.getJSON(data.species.url))
		);

		let descriptionData = speciesData.map((spec) => {
			let description = spec.flavor_text_entries.find(
				(entry) => entry.language.name == "en"
			);
			return description
				? description.flavor_text
				: `No English entry found for flavor text for ${data.name}`;
		});
		descriptionData.forEach((text, idx) => {
			let name = pokemon[idx].name;
			let image = pokemon[idx].sprites.front_default;
			$pokeArea.append(createPokeCard(name, image, text));
		});
	});

	const createPokeCard = (name, image, description) => {
		return `
			<div class="card pokemon-card">
				<h1>${name}</h1>
				<img src="${image}">
				<p>${description}</p>
			</div>
		`;
	};
});
