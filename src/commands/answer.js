module.exports = {
	name: `answer`,
	access: [],
	active: true,
	aliases: [`a`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const problem = bb.misc.currExp
		const answer = bb.misc.currAns
		const channel = bb.misc.expChannel

		const input = ctx.args.join(` `)

		if (problem === null) {
			return {
				text: `На данный момент нет активного примера`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (ctx.channel.login !== channel) {
			return {
				text: `Пример для решения находится на канале ${bb.utils.unping(channel)}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (!input) {
			return {
				text: `Пример: ${bb.misc.currExp} \u{2027} Укажи ответ(ы) через пробел`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const userAnswer = input
			.split(` `)
			.map(Number)
			.sort((a, b) => a - b)
		const correctAnswer = answer.map(Number).sort((a, b) => a - b)

		const isCorrect = userAnswer.length === correctAnswer.length && userAnswer.every((val, index) => Math.abs(val - correctAnswer[index]) < 1e-2)

		if (isCorrect) {
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, 100)
			bb.misc.currExp = null
			bb.misc.currAns = null
			bb.misc.expChannel = null

			return {
				text: `Поздравляю, ответ верный \u{2027} Начислил тебе 100 монет \u{2027} Твой текущий баланс: ${(userData.coins + 100).toFixed(
					1
				)} \u{2027} Следующий пример будет через 4 часа на случайном канале`,
				reply: true,
				emoji: true,
				action: true
			}
		} else {
			return {
				text: `Ответ неверный`,
				reply: true,
				emoji: true,
				action: true
			}
		}
	}
}
