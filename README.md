# Prompter
a simple tool to help format LLM prompts dynamically

## usage

```javascript
const Prompter = require("@ryanforever/prompter")
const prompter = new Prompter({
	fromFiles: {
		systemPrompt: "./prompts/system-prompt-v1.js"
	},
	fromText: {
		prompt2: "you are a helpful assistant named {{assitantName}}.  the current date is {{currentDate}}" // format variables in {{}}
	},
	strict: false // throw error if input variables do not match prompt variables, or variables are missing
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


## tools
```javascript
const prompter = require("@ryanforever/prompter")

// in line text prompt
let prompt1 = prompter.fromText("hello {{username}}", {
	username: "ryan forever"
})

// read prompt text from a file instead
let prompt2 = prompter.fromFile("./my-prompt.txt", {
	currentDate: new Date(Date.now())
})
```