
var all_words;
var all_weights;
var temp_weights;

var word_init_ready = false;
var final_prob

function weighted_choice(weights) {
    let rnd = max_prob * Math.random()
    console.log(rnd)
    return weights.findIndex( a => (rnd -= a) <= 0)
}

function wordsCounter(w) {
    return w.split(" ").length
}

function upperCounter(w) {
    return (w.match(/[A-Z]/g) || []).length;
}

var slider_configs = [
    {uid: 11, slider_v: "length_exp", info_f: "lengthExpDisplay", smin: -2, smax: 2, step: 0.2},
    {uid: 12, slider_v: "tokens_exp", info_f: "tokensExpDisplay", smin: -4, smax: 4, step: 0.4},
    {uid: 13, slider_v: "uppers_exp", info_f: "uppersExpDisplay", smin: -5, smax: 5, step: 0.5},
    {uid: 14, slider_v: "orders_exp", info_f: "ordersExpDisplay", smin: -0.8, smax: 0.8, step: 0.1}
]

var slider_right_configs = [
    {uid: 21, slider_v: "oo_mul", info_f: "ooMulDisplay", smin: 1, smax: 3, step: 2},
    {uid: 22, slider_v: "month_mul", info_f: "monthMulDisplay", smin: 1, smax: 3, step: 2},
    {uid: 23, slider_v: "punc_mul", info_f: "puncMulDisplay", smin: 1, smax: 3, step: 2},
    {uid: 24, slider_v: "neg_mul", info_f: "negMulDisplay", smin: 0.1, smax: 1, step: 0.9},
]

var upgs = [
    {
        is_activated: () => {return hasUpgrade("p", 11)},
        weight: (w) => {return w.length},
        precalced_weights: undefined,
        modifier: (w) => Math.pow(w, player.p.length_exp)
    },
    {
        is_activated: () => {return hasUpgrade("p", 12)},
        weight: (w) => {return wordsCounter(w)},
        precalced_weights: undefined,
        modifier: (w) => Math.pow(w, player.p.tokens_exp)
    },
    {
        is_activated: () => {return hasUpgrade("p", 13)},
        weight: (w) => {return upperCounter(w) + 1},
        precalced_weights: undefined,
        modifier: (w) => Math.pow(w, player.p.uppers_exp)
    },
    {
        is_activated: () => {return hasUpgrade("p", 14)},
        weight: (w, i) => {return i+1},
        precalced_weights: undefined,
        modifier: (w) => Math.pow(w, player.p.orders_exp)
    },
    {
        is_activated: () => {return hasUpgrade("p", 21)},
        weight: (w) => {return w.includes("oo")},
        precalced_weights: undefined,
        modifier: (w) => w ? player.p.oo_mul : 1
    },
    {
        is_activated: () => {return hasUpgrade("p", 22)},
        weight: (w) => {return w.includes("January") || w.includes("February") || w.includes("March") || w.includes("April") || w.includes("May") || w.includes("June") || w.includes("July") || w.includes("August") || w.includes("September") || w.includes("October") || w.includes("November") || w.includes("December")},
        precalced_weights: undefined,
        modifier: (w) => w ? player.p.month_mul : 1
    },
    {
        is_activated: () => {return hasUpgrade("p", 23)},
        weight: (w) => {return w.includes("'")},
        precalced_weights: undefined,
        modifier: (w) => w ? player.p.punc_mul : 1
    },
    {
        is_activated: () => {return hasUpgrade("p", 24)},
        weight: (w) => {return w.includes("the") || w.includes("and") || w.includes("or") || w.includes("of")} ,
        precalced_weights: undefined,
        modifier: (w) => w ? player.p.neg_mul : 1
    },
]

function precalcWeights() {
    for (let u in upgs) {
        let upg = upgs[u]
        upg.precalced_weights = Array(all_words.length)
        for (let i in all_words) {
            w = all_words[i]
            upg.precalced_weights[i] = upg.weight(w, i)
        }
    }
}

function init() {
    $.get("./res/UKACD.txt", function(data) {
        all_words = data.split(/\r?\n|\r|\n/g);
        all_weights = Array(all_words.length)
        temp_weights = Array(all_words.length)
        all_weights.fill(1)
        temp_weights.fill(1)

        precalcWeights();
        word_init_ready = true
    })
}


function rollWord(cb) {
    temp_weights.fill(1)
    for (let u in upgs) {
        let upg = upgs[u]
        if (upg.is_activated()) {
            temp_weights.forEach((v, ind, arr) => {
                let w = upg.modifier ? upg.modifier(upg.precalced_weights[ind]) : upg.precalced_weights[ind]
                arr[ind] = v * w
            });
        }
    }
    max_prob = temp_weights.reduce( (l, r) => l+r )

    // 9445
    final_prob = temp_weights[9445] / max_prob

    let ind = weighted_choice(temp_weights, max_prob)
    console.log(ind, all_words[ind], temp_weights[ind] / max_prob)
    layers.p.addWord(all_words[ind])
    cb()
}



$(document).ready(function() {
    init()
})