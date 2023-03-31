let modInfo = {
	name: "The April Fools' Day Game",
	id: "aprilfoolsdaygame",
	author: "catfish",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Literally everything",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h3>v1.0</h3><br>
		- Added everything.<br>
		- Why would such a little game need a changelog?`

let winText = () => {
	return `<div id="thewintext"><b>Congratulations!</b> 
	<br>
	<br>
	You've got the ${wordf("April Fools' Day")} from 250353 words, 
	<br>
	<br>
	with a chance of ${wordf(formatSmall(final_prob*100) + "%")}.
	<br>
	<br>
	You have got ${wordf(formatWhole(player.p.words.length) + " words")} in total.
	<br>
	<br>
	
	Thanks for playing!</div>`
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["addWord", "popWord", "canAffordU11", "canAffordU12", "canAffordU13", "canAffordU14", "canAffordU21", "canAffordU22", "canAffordU23", "canAffordU24"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	have_got_april_fools_day: false,
	have_got_all_fools_day: false,
	have_a: false,
	have_tree: false
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return `Get an ${wordf(`April Fools' Day`)} to beat the game!<br><br>`
	},
	function() {
		if (final_prob) {
			return `In your last try, the chance of ${wordf(`April Fools' Day`)} is ${formatSmall(final_prob*100)}%<br><br>`
		}
	},
	function() {
		return `powered by UKACD. <a href="../res/UKACD_license.txt">License Link</a>`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.have_got_april_fools_day
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}