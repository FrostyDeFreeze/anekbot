module.exports = {
	name: `word`,
	access: [],
	active: true,
	aliases: [`слово`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const data = bb.utils.croc.loadData()
		const guess = ctx.args[0]

		if (!guess) {
			return {
				text: `Необходимо написать предполагаемое слово`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!data[ctx.channel.id] || data[ctx.channel.id].startTime === 0) {
			return {
				text: `На данный момент нет активной игры \u{2027} Используйте ${ctx.prefix}start, чтобы начать новую игру`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!data[ctx.channel.id].players.find(player => player.id === ctx.user.id)) {
			return {
				text: `Только участники, присоединившиеся к игре, могут угадывать слово \u{1F60F} `,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!data[ctx.channel.id].isFailedToWhisper && data[ctx.channel.id].describer.id === ctx.user.id) {
			return {
				text: `Ты не можешь отгадать слово, которое объясняешь \u{1F926} `,
				reply: true,
				emoji: true,
				action: true
			}
		}

		let describerReward = true
		let text = `Поздравляю! Ты отгадал(а) слово "${data[ctx.channel.id].word}" и получаешь 50 монет \u{2027} Благодаря тебе ${
			data[ctx.channel.id].describer.login
		} также получает 50 монет за красноречивое объяснение \u{1F913}`

		if (data[ctx.channel.id].isFailedToWhisper) {
			describerReward = false
			text = `Поздравляю! Ты отгадал(а) слово "${data[ctx.channel.id].word}" и получаешь 50 монет \u{1F913}`
		}

		if (guess.toLowerCase() === data[ctx.channel.id].word.toLowerCase()) {
			ctx.send(text, true, true, true)

			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, 50)
			describerReward ? bb.utils.coins.addCoins(data[ctx.channel.id].describer.id, ctx.channel.id, 50) : null

			clearTimeout(bb.misc.guessTimeout)
			delete data[ctx.channel.id]
			bb.utils.croc.saveData(data)
		} else {
			ctx.send(`Неверно, попробуй ещё раз \u{1F353} `, true, true, true)
		}
	}
}
