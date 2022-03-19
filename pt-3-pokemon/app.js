$(async () => {
	const BASE_URL = "https://pokeapi.co/api/v2";
	let allPokes = [];
	let pokeNames = [];
	let pokeUrls = [];
	let pokeList = [];

	let $btn = $("button");
	let $form = $("form");
	let $pokeArea = $("#pokemon-wrapper");

	let { results: res } = await $.getJSON(`${BASE_URL}/pokemon?limit=1126`);
	for (let i = 0; i < res.length; i++) {
		allPokes.push(res[i]);
	}
	const getPokesByCount = (count) => {
		pokeNames = [];
		pokeUrls = [];
		pokeList = [];
		for (let i = 0; i < count; i++) {
			let randomPoke =
				allPokes[Math.floor(Math.random() * (allPokes.length - 1))];
			let { name, url } = randomPoke;
			let pokeItem = { name, url };
			pokeNames.push(name);
			pokeUrls.push(url);
			pokeList.push(pokeItem);
		}
		return pokeList;
	};

	const fetchPokeDataFromList = async (count) => {
		let data = getPokesByCount(count);
		return await Promise.all(data.map((url) => $.getJSON(url)));
	};

	const logPokeData = async (list) => {
		let pokemon = await list;
		return await pokemon.forEach((poke) => {
			console.log(`Logging logPokesByCount(): ${poke.name}`, poke);
		});
	};

	const getSpeciesData = async (list) => {
		let urlList = await list;
		return await Promise.all(
			urlList.map((data) => $.getJSON(data.species.url))
		);
	};

	const getFlavorEntries = async (list) => {
		let entryList = await list;
		return await Promise.all(
			entryList.map((desc) => {
				let description = desc.flavor_text_entries.find(
					(entry) => entry.language.name == "en"
				);
				return description
					? description.flavor_text
					: "No English entry found";
			})
		);
	};

	const logDescriptionData = async (list) => {
		let descriptionData = await list;
		descriptionData.forEach((text, idx) => {
			console.log(`${pokeList[idx].name}: ${text}`);
		});
	};

	const printDescriptionData = async (mainList, flavorList) => {
		let descriptionData = await flavorList;
		let mainData = await mainList;
		descriptionData.forEach((text, idx) => {
			let name = mainData[idx].name;
			let image = mainData[idx].sprites.front_default;
			$pokeArea.append(createPokeCard(name, image, text));
		});
	};

	const createPokeCard = (name, image, description) => {
		return `
			<div class="card pokemon-card">
				<h1>${name}</h1>
				<img src="${image}">
				<p>${description}</p>
			</div>
		`;
	};

	const fetchPokemon = async (e) => {
		console.debug("fetchPokemon", e);
		e.preventDefault();
		const $pokeCount = $("#pokemon-count").val();

		let pokeList = fetchPokeDataFromList($pokeCount);
		let flavorList = getFlavorEntries(getSpeciesData(pokeList));

		$pokeArea.empty();

		printDescriptionData(pokeList, flavorList);
	};

	$form.on("submit", fetchPokemon);
});
