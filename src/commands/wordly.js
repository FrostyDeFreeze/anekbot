const words = require(`../data/words.json`)

module.exports = {
	name: `wordly`,
	access: [],
	active: true,
	aliases: [`вордли`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const data = bb.utils.wordly.loadData()
		const userID = ctx.user.id
		const currTime = Date.now()

		if (!data[userID]) {
			data[userID] = {
				word: null,
				lastPlayed: null,
				hints: []
			}
		}

		const hasCooldown = data[userID].lastPlayed && currTime - data[userID].lastPlayed < 300_000

		if (ctx.args[0] && ctx.args[0].toLowerCase() === `swap`) {
			if (!data[userID].word || hasCooldown) {
				return {
					text: `Сначала начни игру с помощью команды ${ctx.prefix}wordly`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			const filtered = words.filter(w => w.length >= 4 && w.length <= 6)
			const randWord = bb.utils.randArr(filtered).toLowerCase()

			data[userID].word = randWord
			data[userID].hints = []
			bb.utils.wordly.saveData(data)

			return {
				text: `Я загадал новое слово из ${randWord.length} букв \u{2027} Попробуй угадать с помощью команды ${ctx.prefix}wordly <слово> \u{2027} Для смены слова используй ${ctx.prefix}wordly swap`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!ctx.args[0]) {
			if (hasCooldown) {
				const timeLeft = 300_000 - (currTime - data[userID].lastPlayed)

				return {
					text: `Ты уже играл! \u{2027} Попробуй снова через ${utils.humanizer(timeLeft)}`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			if (!data[userID].word) {
				const filtered = words.filter(w => w.length >= 4 && w.length <= 6)
				const randWord = bb.utils.randArr(filtered).toLowerCase()

				data[userID].word = randWord
				data[userID].hints = []
				bb.utils.wordly.saveData(data)
			}

			return {
				text: `Я загадал слово из ${data[userID].word.length} букв \u{2027} Попробуй угадать с помощью команды ${ctx.prefix}wordly <слово> \u{2027} Для смены слова используй ${ctx.prefix}wordly swap`,
				reply: true,
				emoji: true,
				action: true
			}
		} else {
			if (!data[userID].word) {
				return {
					text: `Сначала необходимо начать игру командой ${ctx.prefix}wordly`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			if (hasCooldown) {
				const timeLeft = 86_400_000 - (currTime - data[userID].lastPlayed)
				return {
					text: `Ты уже играл! \u{2027} Попробуй снова через ${utils.humanizer(timeLeft)}`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			const guessedWord = ctx.args[0].toLowerCase()
			const targetWord = data[userID].word

			if (guessedWord.length !== targetWord.length) {
				return {
					text: `Слово должно состоять из ${targetWord.length} букв!`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			let result = []
			const wordLetters = targetWord.split(``)
			const guessLetters = guessedWord.split(``)
			const matchedLetters = Array(targetWord.length).fill(false)

			for (let i = 0; i < guessLetters.length; i++) {
				if (guessLetters[i] === wordLetters[i]) {
					result[i] = `\u{1F7E9}`
					matchedLetters[i] = true
					if (!data[userID].hints.includes(guessLetters[i])) {
						data[userID].hints.push(guessLetters[i])
					}
				} else {
					result[i] = null
				}
			}

			for (let i = 0; i < guessLetters.length; i++) {
				if (result[i] !== null) continue

				let found = false
				for (let j = 0; j < wordLetters.length; j++) {
					if (!matchedLetters[j] && guessLetters[i] === wordLetters[j]) {
						found = true
						matchedLetters[j] = true
						break
					}
				}

				if (found) {
					result[i] = `\u{1F7E7}`
					if (!data[userID].hints.includes(guessLetters[i])) {
						data[userID].hints.push(guessLetters[i])
					}
				} else {
					result[i] = `\u{1F7E5}`
				}
			}

			if (guessedWord === targetWord) {
				utils.coins.addCoins(userID, ctx.channel.id, 30)

				data[userID].lastPlayed = currTime
				data[userID].word = null
				data[userID].hints = []
				bb.utils.wordly.saveData(data)

				return {
					text: `Поздравляю \u{1F973} Ты угадал слово и получил 30 монет! \u{2027} Следующая попытка будет доступна через 5 минут`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			const hints = data[userID].hints.length > 0 ? ` \u{2027} Известные буквы: ${data[userID].hints.join(`, `)}` : ``
			bb.utils.wordly.saveData(data)

			return {
				text: `Результат: ${result.join(` `)}${hints}`,
				reply: true,
				emoji: true,
				action: true
			}
		}
	}
}
