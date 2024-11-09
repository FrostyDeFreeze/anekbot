const words = require(`../data/words.json`)

module.exports = {
	name: `crocodile`,
	access: [],
	active: true,
	aliases: [`start`],
	cooldown: 300,
	requires: [],
	async execute(client, ctx, utils) {
		const data = bb.utils.croc.loadData()

		if (data[ctx.channel.id]) {
			return {
				text: `Игра на этом канале уже активна \u{2027} Подожди её завершения или присоединись с помощью ${ctx.prefix}join (необходимо иметь открытыми личные сообщения в настройках Twitch)`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const randWord = bb.utils.randArr(words)

		const crocData = {
			chief: ctx.user.login,
			word: randWord,
			describer: null,
			players: [],
			startTime: 0
		}

		data[ctx.channel.id] = crocData
		bb.utils.croc.saveData(data)

		ctx.send(
			`\u{1F40A} Игра "Крокодил" начинается \u{2027} Используйте ${ctx.prefix}join, чтобы присоединиться \u{2027} У вас есть 15 секунд \u{2027} Для отгадывания используйте ${ctx.prefix}word <предполагаемое слово>`
		)

		setTimeout(async () => {
			const currData = bb.utils.croc.loadData()
			const game = currData[ctx.channel.id]

			if (game && game.players.length >= 3) {
				game.describer = bb.utils.randArr(game.players)
				game.startTime = Date.now()

				// const prompt = `Ты выступаешь в роли чат бота и ведущего игры "Крокодил". Тебе необходимо очень кратко, понятно и простыми словами объяснить следующее слово: "${game.word}". Запрещено использовать само слово, а также однокоренные слова. Объясняй очень кратко, в пределах 100 символов.`

				// const request = await bb.services.ai.gpt(prompt, 50)
				// const body = JSON.parse(request.body)

				// if (body.error) {
				// 	return {
				// 		text: `При запросе и попытке объяснения слова возникла ошибка. Простите меня, пожалуйста (${body.error.message}) \u{1F614}`
				// 	}
				// }

				// const response = body.choices[0]

				// ctx.send(`\u{1F916} Объясняю слово, слушайте внимательно: ${response.message.content.replace(/[\n\r]/g, ` `)}`)
				await bb.services.helix.whisper(game.describer.id, `Слово для объяснения: ${game.word}`)
				ctx.send(
					`@${game.describer.login}, отправил тебе в личные сообщения Twitch слово, которое необходимо объяснить \u{2027} Запрещено использовать однокоренные слова и само слово при объяснении \u{2027} У игроков есть 1 минута на то, чтобы отгадать слово, удачи \u{1F601}`
				)

				bb.misc.guessTimeout = setTimeout(() => {
					ctx.send(`Время на отгадывание вышло \u{2027} Никто не отгадал слово "${game.word}" \u{1F603}`)
					delete currData[ctx.channel.id]
					bb.utils.croc.saveData(currData)
				}, 60_000)

				bb.utils.croc.saveData(currData)
			} else {
				ctx.send(`Недостаточно игроков для начала игры (необходимо минимум 3 человека) \u{2027} Игра отменена \u{1F641}`)
				delete currData[ctx.channel.id]
				bb.utils.croc.saveData(currData)
			}
		}, 15_000)
	}
}
