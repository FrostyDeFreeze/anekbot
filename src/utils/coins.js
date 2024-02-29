const fs = require(`fs`)
const path = require(`path`)
const coinsPath = path.join(__dirname, `../data/coins.json`)

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
		const data = fs.readFileSync(coinsPath, `utf8`)
		return JSON.parse(data)
	},
	saveData: function (data) {
		fs.writeFileSync(coinsPath, JSON.stringify(data))
	},
	getUserData: function (userID, channelID) {
		const data = this.loadData()
		if (data[userID] && data[userID].channels[channelID]) {
			return data[userID].channels[channelID]
		}
		return null
	},
	getUsersCountInChannel: function (channelID) {
		const data = this.loadData()
		let count = 0

		Object.keys(data).forEach(userID => {
			const channels = data[userID].channels
			if (channels && channels[channelID]) {
				count++
			}
		})

		return count
	},
	getTopUsersInChannel: function (channelID) {
		const data = this.loadData()

		const channelUsers = Object.keys(data).filter(userID => {
			const channels = data[userID].channels
			return channels && channels[channelID]
		})

		channelUsers.sort((a, b) => {
			const userA = data[a].channels[channelID]
			const userB = data[b].channels[channelID]

			if (userA.rank !== userB.rank) {
				return this.ranks[userB.rank].cost - this.ranks[userA.rank].cost
			}

			return userB.coins - userA.coins
		})

		return channelUsers.map(userID => {
			const userData = data[userID].channels[channelID]
			return {
				userID,
				coins: userData.coins,
				rank: userData.rank
			}
		})
	},
	addCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[userID].channels[channelID].coins += coins
		this.saveData(data)
	},
	removeCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[userID].channels[channelID].coins -= coins
		this.saveData(data)
	},
	setCoins: function (userID, channelID, coins) {
		const data = this.loadData()
		data[userID].channels[channelID].coins = coins
		this.saveData(data)
	},
	setRank: function (userID, channelID, rank) {
		const data = this.loadData()
		data[userID].channels[channelID].rank = rank
		this.saveData(data)
	},
	setLastGuess: function (userID, channelID, time) {
		const data = this.loadData()
		data[userID].channels[channelID].lastGuess = time
		this.saveData(data)
	}
}
