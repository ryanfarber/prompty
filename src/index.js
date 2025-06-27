module.exports = require("./Prompter.js")

let helpers = require("./helpers.js")

module.exports.get = helpers.fromText
module.exports.fromText = helpers.fromText
module.exports.fromFile = helpers.fromFile
module.exports.helpers = helpers