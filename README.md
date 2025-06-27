# Prompter
A tool to help format prompts dynamically

## usage

```javascript
const Prompter = require("./Prompter.js")
const prompter = new Prompter({
	fromFiles: {
		systemPrompt: "./prompts/system-prompt-v1.js"
	},
	fromText: {
		prompt2: "you are a helpful assistant named {{assitantName}}.  the current date is {{currentDate}}" // format variables in {{}}
	},
	throwPromptError: false // throw error if input variables do not match prompt variables
})

// assign variables at run time
let prompt = prompter.get("prompt2", {
	assitantName: "botlab",
	currentDate: new Date(Date.now())
})

// upsert prompt variables.  this will only change the {{currentDate}} variable, leaving all other variables the same
prompt = prompter.update("prompt2", {
	currentDate: new Date(Date.now())
})
```