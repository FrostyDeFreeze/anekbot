module.exports = {
	name: `slots`,
	access: [],
	active: true,
	aliases: [`слоты`],
	cooldown: 10,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)

		const chatters = await bb.services.gql.getChatters(ctx.channel.login)
		const data = chatters.data.user.channel.chatters
		const array = Object.values(data)
			.flat()
			.map(i => i.login)
			.filter(i => i !== undefined)
			.filter(i => i !== bb.config.Bot.Login)

		if (!array.length) {
			return {
				text: `На канале нет чаттеров`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const slotsCount = 3
		const selectedChatters = []

		for (let i = 0; i < slotsCount; i++) {
			const randomChatter = bb.utils.unping(bb.utils.randArr(array))
			selectedChatters.push(randomChatter)
		}

		const isWin = selectedChatters.every((val, _, arr) => val === arr[0])

		const totalChatters = array.length
		const winCash = 100
		let winProbability
		let winProbabilityPercent
		let winText

		if (slotsCount === 1) {
			winProbability = 1
			winProbabilityPercent = 100
		} else {
			winProbability = (1 / totalChatters) ** (slotsCount - 1)
			winProbabilityPercent = winProbability * 100
		}

		if (isWin) {
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, winCash)
			winText = ` \u{2027} За победу начислил тебе ${winCash} монет \u{2027} Твой текущий баланс: ${(userData.coins + winCash).toFixed(1)}`
		}

		const winProbabilityText = `(1 к ${Math.round(1 / winProbability)})`
		const winProbabilityPercentText = Number.isInteger(winProbabilityPercent)
			? `${winProbabilityPercent}%`
			: `${winProbabilityPercent.toFixed(2)}%`

		const resultText = isWin
			? `\u{3010} ${selectedChatters.join(` \u{2B25} `)} \u{3011} \u{2027} ${winProbabilityPercentText} ${winProbabilityText}${winText}`
			: `\u{3010} ${selectedChatters.join(` \u{2B25} `)} \u{3011}`

		return {
			text: resultText
		}
	}
}
