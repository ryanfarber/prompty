

const {parseVariables, replaceVariables, countTokens} = require("./helpers.js")


function Prompt(data = {}) {

	let text
	let filepath = data.file || data.filepath
	this.name = data.name
	this.text = undefined
	this.numTokens = 0
	this.numVariables = 0
	this.variables = []

	if (filepath) text = fs.readFileSync(filepath, "utf8")
	else if (data.text) text = data.text

	if (text) {
		this.numTokens = countTokens(text)
		this.variables = parseVariables(text)
		this.numVariables = this.variables.length
	}

	this.get = function(vars = {}, options) {
		return replaceVariables(text, vars, options)
	}

	Object.defineProperties(this, {
		text: {
			get() {return text}
		}
	})
}


module.exports = Prompt
