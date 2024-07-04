const got = require(`got`)

module.exports = {
	name: `response`,
	access: [],
	active: true,
	aliases: [`ответ`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const quizData = bb.utils.coins.loadQuizData()

		if (!quizData[ctx.channel.id]) {
			return {
				text: `На данный момент на канале нет активного квиза`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (quizData[ctx.channel.id].challenger !== ctx.user.login && quizData[ctx.channel.id].opponent !== ctx.user.login) {
			return {
				text: `Вызов был брошен не тебе aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const answer = parseInt(ctx.args[0], 10)

		if (!answer || isNaN(answer) || answer < 1 || answer > 4) {
			return {
				text: `\u{1F9E9} @${ctx.user.login}, необходимо выбрать один из номеров вариантов ответа (1, 2, 3 или 4)`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const rightAnswerIndex = quizData[ctx.channel.id].correctIndex
		let reward = null

		if (quizData[ctx.channel.id].question.difficulty === `easy`) {
			reward = 10
		}

		if (quizData[ctx.channel.id].question.difficulty === `medium`) {
			reward = 30
		}

		if (quizData[ctx.channel.id].question.difficulty === `hard`) {
			reward = 60
		}

		if (answer === rightAnswerIndex) {
			ctx.send(`\u{1F9E9} @${ctx.user.login} ответил(а) правильно и выиграл(а)! \u{2027} За победу начислил ${reward} монет`)
			clearTimeout(bb.misc.quizTimer)
			delete quizData[ctx.channel.id]
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, reward)
			bb.utils.coins.saveQuizData(quizData)
		} else {
			ctx.send(`\u{1F9E9} @${ctx.user.login} ответил(а) неправильно!`)
		}
	}
}
