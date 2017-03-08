const abilities = require("../json/abilities.json");
const items = require("../json/items.json");
const talents = require("../json/talents.json");

function clean(str) {
    str = str.toString();
    if (`${parseInt(str)}.0` == str) str = str.replace(".0", "");
    return str.trim();
}

module.exports = () => {
    let questions = [];

    abilities.forEach(ability => {
        if (ability.manacost) {
            if (ability.manacost.match(/[ ]/g)) {
                ability.manacost.split(" ").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Mana Cost: Level ${index + 1} ${ability.name}`,
                        "answer": clean(array[index]),
                        "category": "ability"
                    });
                });
            }

            if (ability.manacost.match(/[\/]/g)) {
                ability.manacost.split("/").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Mana Cost: Level ${index + 1} ${ability.name}`,
                        "answer": clean(array[index]),
                        "category": "ability"
                    });
                });
            }

            if (!ability.manacost.match(/[ ]/g) && ability.manacost.match(/[\/]/g)) {
                questions.push({
                    "question": "Mana Cost: ${ability.name}",
                    "answer": clean(array[index]),
                    "category": "ability"
                });
            }
        }

        if (ability.cooldown) {
            if (ability.cooldown.match(/[ ]/g)) {
                ability.cooldown.split(" ").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Cooldown: Level ${index + 1} ${ability.name}`,
                        "answer": clean(array[index]),
                        "category": "ability"
                    });
                });
            }

            if (ability.cooldown.match(/[\/]/g)) {
                ability.cooldown.split("/").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Cooldown: Level ${index + 1} ${ability.name}`,
                        "answer": clean(array[index]),
                        "category": "ability"
                    });
                });
            }

            if (!ability.cooldown.match(/[ ]/g) && ability.cooldown.match(/[\/]/g)) {
                questions.push({
                    "question": "Cooldown: ${ability.name}",
                    "answer": clean(array[index]),
                    "category": "ability"
                });
            }
        }

        if (ability.stats) {
            ability.stats.forEach(attribute => {
                let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                if (attribute.match(": ")) {
                    if (attr[1].match(/[/]/g)) {
                        attr[1].split("/").forEach((item, index) => {
                            questions.push({
                                "question": `${attr[0]}: Level ${index + 1} ${ability.name}`,
                                "answer": clean(item),
                                "category": "ability"
                            });
                        });
                    } else {
                        questions.push({
                            "question": `${ability.name}: ${attr[0]}`,
                            "answer": clean(attr[1]),
                            "category": "ability"
                        });
                    }
                } else {
                    questions.push({
                        "question": `${ability.name}: ${attr.slice(1).join(" ")}?`,
                        "answer": clean(attr[0]),
                        "category": "ability"
                    });
                }
            });
        }

        if (ability.effects) {
            ability.effects.forEach(attribute => {
                let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                if (attribute.match(": ")) {
                    if (attr[1].match(/[/]/g)) {
                        attr[1].split("/").forEach((item, index) => {
                            questions.push({
                                "question": `${attr[0]}: Level ${index + 1} ${ability.name}`,
                                "answer": clean(item),
                                "category": "ability"
                            });
                        });
                    } else {
                        if (!attr[0] == "Behavior") {
                            questions.push({
                                "question": `${ability.name}: ${attr[0]}`,
                                "answer": clean(attr[1]),
                                "category": "ability"
                            });
                        }
                    }
                } else {
                    questions.push({
                        "question": `${ability.name}: ${attr.slice(1).join(" ")}?`,
                        "answer": clean(attr[0]),
                        "category": "ability"
                    });
                }
            });
        }
    });

    items.forEach(item => {
        if (!["diffusal_blade", "necronomicon", "dagon"].includes(item.true_name)) {
            if (item.manacost) {
                questions.push({
                    "question": `Mana Cost: ${item.format_name}`,
                    "answer": clean(item.manacost),
                    "category": "item"
                });
            }

            if (item.cooldown) {
                questions.push({
                    "question": `Cooldown: ${item.format_name}`,
                    "answer": clean(item.cooldown),
                    "category": "item"
                });
            }

            if (item.attributes) {
                item.attributes.forEach(attribute => {
                    let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                    if (attribute.match(": ")) {
                        questions.push({
                            "question": `${item.format_name}: ${attr[0]}`,
                            "answer": clean(attr[1]),
                            "category": "item"
                        });
                    } else {
                        questions.push({
                            "question": `${item.format_name}: ${attr.slice(1).join(" ")}?`,
                            "answer": clean(attr[0]),
                            "category": "item"
                        });
                    }
                });
            }
        }
    });

    for (let talent in talents) {
        talent = talents[talent];
        tlist = []; tlist.push(...talent["10"], ...talent["15"], ...talent["20"], ...talent["25"]); // xd
        tlist.forEach(tl => {
            tl.split(" ").forEach((item, index, array) => {
                if (!isNaN(item.replace(/[+\-%s\.]/g, ""))) {
                    questions.push({
                        "question": `Talents: ${talent.format_name}: ${array.slice(0, index).join(" ")} ${Array(item.length).join("•")} ${array.slice(index + 1).join(" ")}`,
                        "answer": item,
                        "category": "talents"
                    });
                }
            });
        });
    }

    return questions;
};