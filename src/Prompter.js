// Prompter

const Logger = require("@ryanforever/logger").v4
const logger = new Logger(__filename, {debug: true})
const fs = require("fs")
const path = require("path")
const tiktoken = require("tiktoken")


function Prompty(config = {}) {

	const logger = new Logger(__filename, {debug: config.debug ?? false})

	const model = config.model
	const throwError = config.throwError ?? false
	let fromFiles = config.fromFiles || config.files || config.fromFile || []
	let fromText = config.fromText || config.text || []


	
	this.prompts = {}

	this.prompts2 = new Map()


	// get prompts from filepaths
	for (let [name, filepath] of Object.entries(fromFiles)) {
		if (!fs.existsSync(filepath)) throw new ERROR(`"${name}" prompt could not be found at ${filepath}`)
		let prompt = fs.readFileSync(filepath, "utf8")
		let p = new Prompt({
			name,
			filepath,
			numTokens: countTokens(prompt),
			get prompt() {return prompt}
		})
		// promptData[name] = prompt
		this.prompts[name] = p
		this.prompts2.set(name, p)
	}

	// get prompts from filepaths
	for (let [name, text] of Object.entries(fromText)) {
		// if (!fs.existsSync(filepath)) throw new ERROR(`"${name}" prompt could not be found at ${filepath}`)
		let prompt = text
		let p = new Prompt({
			name,
			filepath: undefined,
			numTokens: countTokens(prompt),
			get prompt() {return prompt}
		})
		// promptData[name] = prompt
		this.prompts[name] = p.name
		this.prompts2.set(name, p)
	}

	// console.log(this.prompts)

	// // load prompt data into mem
	// for (let [name, value] of Object.entries(prompts)) {

	// 	let prompt
	// 	let filepath

	// 	if (!isFile(value)) prompt = value
	// 	else {
	// 		filepath = value
	// 		if (!fs.existsSync(value)) throw new ERROR(`"${name}" prompt could not be found at ${filepath}`)
	// 		prompt = fs.readFileSync(value, "utf8")
	// 	}


	// 	let obj = {
	// 		name,
	// 		filepath,
	// 		numTokens: countTokens(prompt),
	// 		get prompt() {return prompt}
	// 	}
	// 	// promptData[name] = prompt
	// 	this.prompts[name] = obj
	// }

	// // load prompt data into mem
	// for (let [name, value] of Object.entries(prompts)) {

	// 	let prompt
	// 	let filepath

	// 	if (!isFile(value)) prompt = value
	// 	else {
	// 		filepath = value
	// 		if (!fs.existsSync(filepath)) throw new ERROR(`"${name}" prompt could not be found at ${filepath}`)
	// 			prompt = fs.readFileSync(filepath, "utf8")
	// 	}
		

	// 	let p = new Prompt({
	// 		name,
	// 		filepath,
	// 		prompt,
	// 		numTokens: countTokens(prompt),

	// 	})
	// 	// promptData[name] = prompt
	// 	this.prompts2.set(name, p)
	// }

	this.get = function(name, vars = {}) {
		logger.debug(`get: "${name}"`)

		if (!this.prompts.hasOwnProperty(name)) throw new ERROR(`"${name}" is not a prompt, try one of [${Object.keys(this.prompts).join("|")}]`)
		let prompt = this.prompts[name].prompt
		let variables = prompt.match(/(?<={{).+?(?=}})/gi)
		if (!variables) return prompt

		// check for invalid varNames
		for (let varName of Object.keys(vars)) if (!variables.includes(varName)) throw new ERROR(`"${varName}" is not a valid prompt variable, must be one of [${variables.join("|")}]`)


		// iterate thru variables and replace them in the prompt
		for (let variable of variables) {
			let regex = new RegExp(`{{${variable}}}`, "gi")
			if (!vars[variable] && throwError) throw new ERROR(`missing prompt variable "${variable}"`)
			else if (!vars[variable] && !throwError) continue
			prompt = prompt.replace(regex, vars[variable])
		}


		return prompt
	}

	this.set = function(name, prompt) {
		logger.debug(`set: "${name}"`)

		let promptObj = new Prompt({
			name,
			prompt
		})

		this.prompts2.set(name, promptObj)

		
	}


	this.update = function(promptName, vars = {}) {
		logger.debug(`update: "${promptName}"`)

		if (!promptName) throw new ERROR(`missing promptName`)
		if (!this.prompts2.has(promptName)) throw new ERROR(`"${promptName}" is not a prompt, try one of [${Object.keys(this.prompts).join("|")}]`)
		
		let Prompt = this.prompts2.get(promptName)
		let prompt = Prompt.prompt


		for (let [key, val] of Prompt.variables) {
			let regex = new RegExp(`{{${key}}}`, "gi")
			let newVal = val
			if (vars[key]) newVal = vars[key]
			Prompt.variables.set(key, newVal)
			prompt = prompt.replace(regex, newVal)
		}

		return prompt
	}

	function isFile(input) {
		let {ext} = path.parse(input)
		if (!ext) return false

		else return true
	}
}

Prompty.fromFile = function(filepath, vars = {}) {
	let text = fs.readFileSync(filepath, "utf8")
	let prompt = new Prompt({text})
}

Prompty.fromText = function(text, vars = {}) {

}

class ERROR extends Error {
	constructor(message) {
		super(message)
		this.name = `PROMPTER ERROR`
	}
}


function Prompt(data = {}) {

	let prompt = data.prompt || data.text
	this.name = data.name
	this.filepath = data.filepath
	this.numTokens = data.numTokens || countTokens(prompt)
	this.variables = new Map()
	this.varKeys = []
	this.prompt = undefined
	this.activePrompt = undefined

	let variables = prompt.match(/(?<={{).+?(?=}})/gi) || []
	for (let variable of variables) {
		this.variables.set(variable, undefined)
		varKeys.push(variable)
	}

	this.get = function(inputVars = {}) {


		// check for invalid varNames
		for (let key of Object.keys(inputVars)) if (!this.varKeys.includes(key)) throw new ERROR(`"${key}" is not a valid prompt variable, must be one of [${this.varKeys.join("|")}]`)


		// iterate thru variables and replace them in the prompt
		for (let variable of variables) {
			let regex = new RegExp(`{{${variable}}}`, "gi")
			if (!vars[variable] && throwError) throw new ERROR(`missing prompt variable "${variable}"`)
			else if (!vars[variable] && !throwError) continue
			prompt = prompt.replace(regex, vars[variable])
		}
	}
	
	Object.defineProperties(this, {
		prompt: {
			get() {return data.prompt}
		}
	})

}

// count num of tokens for the model
function countTokens(text, model) {
	model = model || "gpt-4"
	const enc = tiktoken.encoding_for_model(model)
	const tokenIds = enc.encode(text);
	return tokenIds.length
}



module.exports = Prompty


