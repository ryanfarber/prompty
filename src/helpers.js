

const tiktoken = require("tiktoken")
const fs = require("fs")
const path = require("path")



function parseVariables(text) {
	if (!text) return
	let set = new Set(text.match(/(?<={{).+?(?=}})/gi))
	return Array.from(set)
}



function replaceVariables(text, input = {}, options = {}) {

	if (!text) return
		
	let strict = options.strict
	let promptKeys = parseVariables(text)
	let inputKeys = Object.keys(input)

	if (strict) {
		// check for invalid keys
		for (let inputKey of inputKeys) {
			if (!promptKeys.includes(inputKey)) throw new Error(`"${inputKey}"" is not a valid prompt variable`)
		}

		// check for missing keys
		for (let promptKey of promptKeys) {
			if (!inputKeys.includes(promptKey)) throw new Error(`missing "${promptKey}" variable`)
		}
	}

	// iterate thru prompt keys and replace them with input
	for (let promptKey of promptKeys) {
		let regex = new RegExp(`{{${promptKey}}}`, "gi")
		if (!input[promptKey]) continue
		text = text.replace(regex, input[promptKey])
	}

	return text
}



function countTokens(text, model) {
	model = model || "gpt-4"
	const enc = tiktoken.encoding_for_model(model)
	const tokenIds = enc.encode(text);
	return tokenIds.length
}

function fromText(text, vars = {}, options = {}) {
	return replaceVariables(text, vars, options)
}

function fromFile(filepath, vars = {}, options = {}) {
	let text = fs.readFileSync(filepath, "utf8")
	return replaceVariables(text, vars, options)
}

// let text = `hello {{name}}, you are {{adj}}`
// console.log(parseVariables(text))

// console.log(replaceVariables(text, {adj: "cool"}, {strict: false}))




module.exports = {
	parseVariables,
	replaceVariables,
	countTokens,
	fromText,
	fromFile
}