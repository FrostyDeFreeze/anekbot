const fs = require(`fs`)
const path = require(`path`)

const coinsPath = path.join(__dirname, `../data/coins.json`)

module.exports = {
	name: `guess`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const currTime = new Date().getTime()
		const lastUsage = getLastGuess(ctx.user.id, ctx.channel.id)

		if (lastUsage && currTime - new Date(lastUsage).getTime() < 86_400_000) {
			const time = new Date(lastUsage).getTime() - currTime + 86_400_000

			return {
				text: `использовать команду можно раз в 24 часа. Приходи через ${bb.utils.humanizer(time)}`,
				reply: true
			}
		}

		const randNum = bb.utils.randArr([1, 2])
		const userNum = Number(ctx.args[0])

		if (!userNum) {
			return {
				text: `необходимо указать число: 1 или 2`,
				reply: true
			}
		}

		if (!isNaN(userNum) && (userNum === 1 || userNum === 2)) {
			if (userNum === randNum) {
				updateUserCoins(ctx.user.id, ctx.channel.id, 50)
				const result = `поздравляю, ты угадал, вот тебе 50 монет. Твой текущий баланс: ${getUserCoins(ctx.user.id, ctx.channel.id)}`
				updateLastGuess(ctx.user.id, ctx.channel.id, currTime)

				return {
					text: result,
					reply: true
				}
			} else {
				updateLastGuess(ctx.user.id, ctx.channel.id, currTime)
				return {
					text: `в этот раз не повезло, приходи через 24 часа`,
					reply: true
				}
			}
		} else {
			return {
				text: `число быть должно равно 1 или 2`,
				reply: true
			}
		}
	}
}

function loadCoinsData() {
	if (fs.existsSync(coinsPath)) {
		const coinsData = fs.readFileSync(coinsPath, `utf8`)
		return JSON.parse(coinsData)
	}

	return {}
}

function saveCoinsData(data) {
	fs.writeFileSync(coinsPath, JSON.stringify(data))
}

function getLastGuess(userID, channelID) {
	const coinsData = loadCoinsData()

	if (coinsData[userID] && coinsData[userID].channels[channelID]) {
		return coinsData[userID].channels[channelID].lastGuess || 0
	}

	return 0
}

function getUserCoins(userID, channelID) {
	const coinsData = loadCoinsData()

	if (coinsData[userID] && coinsData[userID].channels[channelID]) {
		return coinsData[userID].channels[channelID].coins || 0
	}

	return 0
}

function updateLastGuess(userID, channelID, time) {
	const coinsData = loadCoinsData()

	if (!coinsData[userID]) {
		coinsData[userID] = { channels: {} }
	}

	if (!coinsData[userID].channels[channelID]) {
		coinsData[userID].channels[channelID] = { coins: 0, rank: 0 }
	}

	coinsData[userID].channels[channelID].lastGuess = time
	saveCoinsData(coinsData)
}

function updateUserCoins(userID, channelID, coins) {
	const coinsData = loadCoinsData()

	if (!coinsData[userID]) {
		coinsData[userID] = { channels: {} }
	}

	if (!coinsData[userID].channels[channelID]) {
		coinsData[userID].channels[channelID] = { coins: 0, rank: 0 }
	}

	coinsData[userID].channels[channelID].coins += coins
	saveCoinsData(coinsData)
}
