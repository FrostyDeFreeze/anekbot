const fs = require(`node:fs`)
const path = require(`node:path`)

const wordlyPath = path.join(__dirname, `../data/wordly.json`)

module.exports = {
	loadData: function () {
		return fs.existsSync(wordlyPath) ? JSON.parse(fs.readFileSync(wordlyPath, `utf8`)) : {}
	},
	saveData: function (data) {
		fs.writeFileSync(wordlyPath, JSON.stringify(data))
	}
}
