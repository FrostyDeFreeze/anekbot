const fs = require(`fs`)
const path = require(`path`)
const coinsPath = path.join(__dirname, `../data/coins.json`)
const promoPath = path.join(__dirname, `../data/promocodes.json`)

module.exports = {
	ranks: {
		0: { name: `Зародыш`, cost: 0 },
		1: { name: `Новичок`, cost: 100 },
		2: { name: `Обычный юзер`, cost: 1000 },
		3: { name: `Болтун`, cost: 4000 },
		4: { name: `Любитель-балбес`, cost: 10000 },
		5: { name: `Человек без личной жизни`, cost: 15000 },
		6: { name: `Сплетник чата`, cost: 20000 },
		7: { name: `Топчик`, cost: 30000 },
		8: { name: `Гуру чата`, cost: 45000 },
		9: { name: `Легенда чата`, cost: 60000 },
		10: { name: `Главный ебантяй`, cost: 100000 }
	},

	loadData: function () {
		const data = fs.existsSync(coinsPath) ? JSON.parse(fs.readFileSync(coinsPath, `utf8`)) : {}
		return data
	},

	loadPromoData: function () {
		const data = fs.existsSync(promoPath) ? JSON.parse(fs.readFileSync(promoPath, `utf8`)) : {}
		return data
	},

	saveData: function (data) {
		fs.writeFileSync(coinsPath, JSON.stringify(data))
	},

	savePromoData: function (data) {
		fs.writeFileSync(promoPath, JSON.stringify(data))
	},

	getUser: function (userID, channelID) {
		const data = this.loadData()

		if (data[channelID] && data[channelID].users[userID]) {
			return data[channelID].users[userID]
		}

		return null
	},

	getUsers: function (channelID) {
		const data = this.loadData()
		const channelUsers = Object.keys(data[channelID]?.users || {})

		channelUsers.sort((a, b) => {
			const userA = data[channelID].users[a]
			const userB = data[channelID].users[b]

			if (userA.rank !== userB.rank) {
				return this.ranks[userB.rank].cost - this.ranks[userA.rank].cost
			}

			return userB.coins - userA.coins
		})

		return channelUsers.map(userID => {
			return data[channelID].users[userID]
		})
	},

	getChannelsForUser: function (userID) {
		const data = this.loadData()
		const result = []

		for (const channelID in data) {
			const user = data[channelID]?.users[userID]

			if (user) {
				const guessDiff = new Date().getTime() - new Date(user.lastGuess).getTime()
				const promoDiff = new Date().getTime() - new Date(user.lastPromocode).getTime()

				if (guessDiff > 28_800_000) {
					result.push({
						channelID: channelID,
						channelLogin: data[channelID].login,
						lastGuess: user.lastGuess,
						type: `guess`
					})
				}

				if (promoDiff > 86_400_000) {
					result.push({
						channelID: channelID,
						channelLogin: data[channelID].login,
						lastPromocode: user.lastPromocode,
						type: `promocode`
					})
				}
			}
		}

		return result
	},

	addCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[channelID].users[userID].coins += coins
		this.saveData(data)
	},

	addPromoActivation: function (userID) {
		const data = this.loadPromoData()
		if (!data.activatedUsers.includes(userID)) {
			data.activatedUsers.push(userID)
			this.savePromoData(data)
		}
	},

	removeCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[channelID].users[userID].coins -= coins
		this.saveData(data)
	},

	setCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[channelID].users[userID].coins = coins
		this.saveData(data)
	},

	setRank: function (userID, channelID, rank) {
		const data = this.loadData()
		data[channelID].users[userID].rank = rank
		this.saveData(data)
	},

	setPromocode: function (code, activations) {
		const data = this.loadPromoData()
		data.code = code
		data.activations = activations
		data.activatedUsers = []
		this.savePromoData(data)
	},

	setLastGuess: function (userID, channelID, time) {
		const data = this.loadData()
		data[channelID].users[userID].lastGuess = time
		this.saveData(data)
	},

	setLastPromocode: function (userID, channelID, time) {
		const data = this.loadData()
		data[channelID].users[userID].lastPromocode = time
		this.saveData(data)
	}
}
