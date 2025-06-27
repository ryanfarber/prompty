

const fs = require("fs")
const path = require("path")

const prompty = require("../src")

console.log(prompty)


let textPrompt = prompty.fromText("hello {{name}}", {
	name: "ryan forever"
})

let filePrompt = prompty.fromFile(path.join(__dirname, "./test-prompt.txt"), {
	name: "ryan forever",
	date: new Date(Date.now()),
	mood: "amazing"
})

console.log(textPrompt)
console.log()
console.log(filePrompt)