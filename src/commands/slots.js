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

		const totalChatters = array.length
		const winCashForThree = 3_000
		const winCashForTwo = 50
		let winProbability
		let winProbabilityPercent
		let winText

		const isThreeWin = selectedChatters.every((val, _, arr) => val === arr[0])
		const isTwoWin =
			selectedChatters.slice(0, 2).every((val, _, arr) => val === arr[0]) || selectedChatters.slice(1, 3).every((val, _, arr) => val === arr[0])

		if (slotsCount === 1) {
			winProbability = 1
			winProbabilityPercent = 100
		} else {
			winProbability = (1 / totalChatters) ** (slotsCount - 1)
			winProbabilityPercent = winProbability * 100
		}

		if (isThreeWin) {
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, winCashForThree)
			winText = ` \u{2027} За победу начислил тебе ${winCashForThree} монет \u{2027} Твой текущий баланс: ${(
				userData.coins + winCashForThree
			).toFixed(1)}`
		} else if (isTwoWin) {
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, winCashForTwo)
			winText = ` \u{2027} За 2 совпадения начислил тебе ${winCashForTwo} монет \u{2027} Твой текущий баланс: ${(
				userData.coins + winCashForTwo
			).toFixed(1)}`
		} else {
			winText = ``
		}

		const winProbabilityText = `(1 к ${Math.round(1 / winProbability)})`
		const winProbabilityPercentText = Number.isInteger(winProbabilityPercent)
			? `${winProbabilityPercent}%`
			: `${winProbabilityPercent.toFixed(2)}%`

		const resultText = winText
			? `\u{3010} ${selectedChatters.join(` \u{2B25} `)} \u{3011} \u{2027} ${winProbabilityPercentText} ${winProbabilityText}${winText}`
			: `\u{3010} ${selectedChatters.join(` \u{2B25} `)} \u{3011}`

		return {
			text: resultText,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
