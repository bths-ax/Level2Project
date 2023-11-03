const HIDDEN_IMAGE = "images/hidden.jpg";
const MATCHED_IMAGES = [
	"images/image1.png",
	"images/image2.png",
	"images/image3.jpeg",
	"images/image4.png",
	"images/image5.png",
	"images/image6.png",
	"images/image7.png",
	"images/image8.png",
];

class Game {
	constructor() {
		this.reset();
	}

	reset() {
		this.score = 0;
		this.positions = [...MATCHED_IMAGES, ...MATCHED_IMAGES];

		// Shuffle position table
		for (let i = this.positions.length - 1; i >= 0; i--) {
			let j = Math.floor(Math.random() * i);
			[
				this.positions[i],
				this.positions[j]
			] = [this.positions[j], this.positions[i]];
		}

		// Reformat position table to save match state
		this.positions = this.positions.map((image) => {
			return {
				image: image,
				state: "unmatched",
			};
		});
	}

	select(position) {
		// Make sure the match chosen isn't already a completed match
		let newMatch = this.positions[position];
		if (newMatch.state === "matched")
			return null;

		// Get started matching pair, make sure the new match chosen isn't the same one
		let currentlyMatching = this.positions.find((p) => p.state === "matching");
		if (currentlyMatching === newMatch)
			return null;

		// Remove the previous failed matching pair, if it exists
		this.positions.filter((p) => p.state === "mismatched")
			.forEach((p) => p.state = "unmatched");

		this.score++;

		if (currentlyMatching == null) {
			// Start a new matching pair
			newMatch.state = "matching";
		} else {
			// Finish an existing matching pair
			currentlyMatching.state = newMatch.state =
				currentlyMatching.image === newMatch.image
					? "matched"
					: "mismatched";
		}

		return newMatch.state;
	}

	finished() {
		return this.positions.filter((p) => p.state === "matched").length === this.positions.length;
	}
}

window.addEventListener("load", () => {
	let docImages = new Array(MATCHED_IMAGES.length * 2).fill(null)
		.map((_, idx) => document.getElementById(`img${idx}`));
	let docScore = document.getElementById("score");
	let docComment = document.getElementById("scoreComment");
	let docResetBtn = document.getElementById("reset");

	let game = new Game();

	function display() {
		game.positions.forEach((position, idx) => {
			switch (position.state) {
				case "unmatched":
					docImages[idx].style.borderColor = "black";
					docImages[idx].setAttribute("src", HIDDEN_IMAGE);
					break;
				case "matching":
					docImages[idx].style.borderColor = "#ffff00";
					docImages[idx].setAttribute("src", position.image);
					break;
				case "mismatched":
					docImages[idx].style.borderColor = "#ff0000";
					docImages[idx].setAttribute("src", position.image);
					break;
				case "matched":
					docImages[idx].style.borderColor = "#00ff00";
					docImages[idx].setAttribute("src", position.image);
					break;
			}
		});
		docScore.innerText = `score: ${game.score}`;
		docComment.innerText = !game.finished() ? "good luck"
			: game.score > 64 ? "i could do better by just clicking randomly"
			: game.score > 48 ? "siri search up how to improve my memory"
			: game.score > 32 ? "could be better"
			: game.score > 24 ? "that was okay i guess"
			: game.score > 16 ? "damn that was pretty good"
			: game.score === 16 ? "i know you cheated dont lie"
			: "bro???";
	}

	docImages.forEach((docImage, idx) =>
		docImage.addEventListener("click", () =>
			game.select(idx) && display()));

	docResetBtn.addEventListener("click", () => {
		game.reset();
		display();
	});

	display();
});
