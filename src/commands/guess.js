module.exports = {
	name: `guess`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const lastUsage = userData.lastGuess
		const currTime = new Date().getTime()

		if (lastUsage && currTime - new Date(lastUsage).getTime() < 28_800_000) {
			const time = new Date(lastUsage).getTime() - currTime + 28_800_000

			return {
				text: `Использовать команду можно раз в 8 часов \u{2027} Возвращайся через ${bb.utils.humanizer(time)}`,
				reply: true
			}
		}

		const randNum = bb.utils.randArr([1, 2])
		const userNum = Number(ctx.args[0])

		if (!userNum || isNaN(userNum) || ![1, 2].includes(userNum)) {
			return {
				text: `Необходимо указать число: 1 или 2`,
				reply: true
			}
		}

		if (userNum === randNum) {
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, 50)
			bb.utils.coins.setLastGuess(ctx.user.id, ctx.channel.id, currTime)

			return {
				text: `Поздравляю, ты угадал(а), за правильный ответ начислил тебе 50 монет \u{2027} Твой текущий баланс: ${(
					userData.coins + 50
				).toFixed(1)} \u{2027} Следующая попытка через 8 часов`,
				reply: true
			}
		} else {
			bb.utils.coins.setLastGuess(ctx.user.id, ctx.channel.id, currTime)

			if (!ctx.user.perms.mod && ctx.user.id !== bb.config.Dev.ID) {
				ctx.send(`.timeout ${ctx.user.login} 300`)
			}

			return {
				text: `В этот раз не повезло, приходи через 8 часов!`,
				reply: true
			}
		}
	}
}
