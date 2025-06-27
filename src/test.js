
const Logger = require("@ryanforever/logger").v4
const logger = new Logger(__filename, {debug: true})
const fs = require("fs")
const path = require("path")
// const kindof = require("kind-of")
// const _ = require("underscore")
// 
const Prompter = require("./Prompter.js")
const prompter = new Prompter({
	test: "key1: {{key1}}\nkey2: {{key2}}"
})



// console.log(prompter)
// console.log(path.parse("test/test.txt"))


prompter.set("prompt1", "hello {{world}}")

// console.log(prompter.get("test", {key1: "booper"}))

// console.log(prompter.update("test"))

// logger.inspect(prompter)

// prompter.prompt("test")

console.log(Prompter)