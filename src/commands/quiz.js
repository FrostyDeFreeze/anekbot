module.exports = {
	name: `quiz`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 300,
	requires: [],
	async execute(client, ctx, utils) {
		const quizData = bb.utils.coins.loadQuizData()
		const opponent = ctx.args[0] ? bb.utils.parseUser(ctx.args[0]) : null

		if (opponent === `сброс`) {
			delete quizData[ctx.channel.id]
			bb.utils.coins.saveQuizData(quizData)

			return {
				text: `Квиз успешно отменён`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (quizData[ctx.channel.id]) {
			return {
				text: `Игра на этом канале уже идёт`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!opponent) {
			return {
				text: `Оппонент не указан`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (opponent === ctx.user.login || opponent === bb.config.Bot.Login) {
			return {
				text: `Размечтался aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const challenge = {
			challenger: ctx.user.login,
			opponent: opponent,
			channel: ctx.channel.login,
			accepted: false,
			startTime: null
		}

		quizData[ctx.channel.id] = challenge
		bb.utils.coins.saveQuizData(quizData)

		ctx.send(`\u{1F9E9} @${opponent}, @${ctx.user.login} бросил(а) тебе вызов! Используй ${bb.config.Bot.Prefix}принять, чтобы принять`)

		bb.misc.acceptTimer = setTimeout(() => {
			const quiz = bb.utils.coins.loadQuizData()

			if (!quiz[ctx.channel.id].accepted) {
				delete quiz[ctx.channel.id]
				bb.utils.coins.saveQuizData(quiz)

				ctx.send(`\u{1F9E9} @${ctx.user.login}, вызов не принят в течение 30 секунд. Игра отменена`)
			}
		}, 30_000)
	}
}
