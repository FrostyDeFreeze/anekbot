const fs = require(`node:fs`)
const path = require(`node:path`)

const crocodilePath = path.join(__dirname, `../data/crocodile.json`)

module.exports = {
	loadData: function () {
		return fs.existsSync(crocodilePath) ? JSON.parse(fs.readFileSync(crocodilePath, `utf8`)) : {}
	},
	saveData: function (data) {
		fs.writeFileSync(crocodilePath, JSON.stringify(data, null, 2))
	}
}
