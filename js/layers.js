function d(p) {
    return new Decimal(p)
}

function wordf(w) {
    return `<span class="word">${w}</span>`
}


addLayer("p", {
    name: "wordroll", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        words: [],
        rolling: false,
        length_exp: 0,
        tokens_exp: 0,
        uppers_exp: 0,
        orders_exp: 0,
        oo_mul: 1,
        month_mul: 1,
        punc_mul: 1,
        neg_mul: 1,
    }},
    color: "#00a8ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "words", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    clickables: {
        11: {
            display() {
                if (!word_init_ready) {
                    return "GAME INITIALIZING..."
                }
                if (player.p.rolling) {
                    return "GENERATING RANDOM WORD, PLEASE WAIT..."
                } else {
                    return "CLICK ME FOR A RANDOM WORD"
                }
            },
            canClick: () => !player.p.rolling && word_init_ready,
            style: () => {
                return {
                    "height": "60px",
                    "width": "500px",
                    "border-radius": "0",
                    "font-size": "18px"
                }
            },
            onClick() {
                player.p.rolling = true
                rollWord(() => {
                    player.p.rolling = false
                })
            }
        }
    },
    addWord(w) {
        if (w == "April Fools' Day") {
            player.have_got_april_fools_day = true
        }
        if (w == "All Fools' Day") {
            player.have_got_all_fools_day = true
        }
        if (w == "a") {
            player.have_a = true
        }
        if (w.toLowerCase().split(" ").includes("tree")) {
            player.have_tree = true
        }

        player.p.words.unshift(w)
        if (player.p.words.length > 1000) {
            player.p.words.pop()
        }

        tmp.p.canAffordU11 = layers.p.canAffordU11()
        tmp.p.canAffordU12 = layers.p.canAffordU12()
        tmp.p.canAffordU13 = layers.p.canAffordU13()
        tmp.p.canAffordU14 = layers.p.canAffordU14()
        tmp.p.canAffordU21 = layers.p.canAffordU21()
        tmp.p.canAffordU22 = layers.p.canAffordU22()
        tmp.p.canAffordU23 = layers.p.canAffordU23()
        tmp.p.canAffordU24 = layers.p.canAffordU24()
    },

    achievements: {
        0: {
            name: "All Fools' Day",    
            done() {
                return player.have_got_all_fools_day
            },
        },
        1: {
            name: "a",
            done() {
                return player.have_a
            }
        },
        2: {
            name: "tree",
            done() {
                return player.have_tree
            }
        }
    },

    popWord(n) {
        for (let i = 0; i < n; i++) {
            player.p.words.pop()
        }
    },

    lengthExpDisplay() {
        return `Word chance x length<sup>${format(player.p.length_exp)}</sup>`
    },
    
    tokensExpDisplay() {
        return `Word chance x words<sup>${format(player.p.tokens_exp)}</sup>`
    },

    uppersExpDisplay() {
        return `Word chance x (Uppercase Letters + 1)<sup>${format(player.p.uppers_exp)}</sup>`
    },

    ordersExpDisplay() {
        return `Word chance x (Word's alphabetical order, 1~250354)<sup>${format(player.p.orders_exp)}</sup>`
    },

    ooMulDisplay() {
        return `Word containing ${wordf("oo")} chance x${formatWhole(player.p.oo_mul)}`
    },

    monthMulDisplay() {
        return `Word containing a month chance x${formatWhole(player.p.month_mul)}`
    },

    puncMulDisplay() {
        return `Word containing ${wordf("'")} chance x${formatWhole(player.p.punc_mul)}`
    },

    negMulDisplay() {
        return `Word containing ${wordf("the")}, ${wordf("and")}, ${wordf("or")} or ${wordf("of")} chance x ${format(player.p.neg_mul)}`
    },

    upgrades: {
        11: {
            fullDisplay: () => {
                return `But is this game even possible <br><br>Req: 20 words got`
            },
            unlocked: () => player.p.words.length >= 5,
            canAfford: () => tmp.p.canAffordU11 === true
        },
        12: {
            fullDisplay: () => {
                return `Is this even a word? <br><br>Req: Get a word with at least 7 words (I know this is strange)`
            },
            unlocked: () => hasUpgrade("p", 11),
            canAfford: () => tmp.p.canAffordU12 === true
        },
        13: {
            fullDisplay: () => {
                return `Shakespeare<br><br> Req: Get <u>There is a tide in the affairs of men, which, taken at the flood, leads on to fortune</u>`
            },
            unlocked: () => hasUpgrade("p", 12),
            canAfford: () => tmp.p.canAffordU13 === true
        },
        14: {
            fullDisplay: () => {
                return `Very Little Brain <br><br> Req: Get a word that contains <u>Very Little Brain</u>`
            },
            unlocked: () => hasUpgrade("p", 12),
            canAfford: () => tmp.p.canAffordU14 === true
        },
        21: {
            fullDisplay: () => {
                return `OooooOoooo <br><br> Req: Get a word that contains at least 10 <u>o</u>s`
            },
            unlocked: () => tmp.p.rightUnlocked,
            canAfford: () => tmp.p.canAffordU21 === true
        },
        22: {
            fullDisplay: () => {
                return `It was so close <br><br> Req: Get a word that contains <u>Day</u>`
            },
            unlocked: () => tmp.p.rightUnlocked,
            canAfford: () => tmp.p.canAffordU22 === true
        },
        23: {
            fullDisplay: () => {
                return `How does that count as a word <br><br> Req: Get a word that contains at least 4 <u>a</u> s (as a word, not a letter)`
            },
            unlocked: () => tmp.p.rightUnlocked,
            canAfford: () => tmp.p.canAffordU23 === true
        },
        24: {
            fullDisplay: () => {
                return `I can't do this <br><br> Req: Get a word that begin with <u>z</u> or <u>Z</u>`
            },
            unlocked: () => tmp.p.rightUnlocked,
            canAfford: () => tmp.p.canAffordU24 === true
        }
    },

    canAffordU11: () => { return player.p.words.length >= 20 },
    canAffordU12: () => {
        return player.p.words.filter((x) => wordsCounter(x) >= 7).length > 0
    },
    canAffordU13: () => {
        return player.p.words.filter((x) => x == "There is a tide in the affairs of men, which, taken at the flood, leads on to fortune").length > 0
    },
    canAffordU14: () => {
        return player.p.words.filter((x) => x.includes("Very Little Brain")).length > 0
    },
    canAffordU21: () => {
        return player.p.words.filter((x) => (x.match(/[o]/g) || []).length >= 10).length > 0
    },
    canAffordU22: () => {
        return player.p.words.filter((x) => x.includes("Day")).length > 0
    },
    canAffordU23: () => {
        return player.p.words.filter((x) => (x.match(/[a][ ]/g) || []).length >= 4).length > 0
    },
    canAffordU24: () => {
        return player.p.words.filter((x) => x[0].toLowerCase() == "z").length > 0
    },

    rightUnlocked: () => hasUpgrade("p", 13) && hasUpgrade("p", 14),
    componentStyles: {
        upgrade: {
            "height": '80px',
            "width": '300px',
            'min-height': '80px',
            "border-radius": '0px'
        }
    },

    tabFormat() {
        return [
            ["clickable", 11],
            ["row", [
                ["slider-list", slider_configs],
                ["word-list", player.p.words],
                ["slider-list", slider_right_configs],
            ]]
            
        ]
    },
})
