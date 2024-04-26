module.exports = {
	name: `rank`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const ranks = bb.utils.coins.ranks
		const balance = userData.coins
		const currRank = userData.rank
		const nextRank = currRank + 1
		const nextRankCost = ranks[nextRank]?.cost

		const getRankInfo = rank => `${rank} [${ranks[rank]?.name || `Максимальный ранг`}]`

		switch (ctx.args[0]?.toLowerCase()) {
			case `up`: {
				if (currRank === 10 || !nextRankCost) {
					return {
						text: `Ты достиг последнего ${currRank} ранга. Лечись, бро`,
						reply: true,
						emoji: true,
						action: true
					}
				}

				if (balance < nextRankCost) {
					return {
						text: `Недостаточно монет для повышения до ранга ${getRankInfo(
							nextRank
						)} \u{2027} Необходимо: ${nextRankCost} \u{2027} У тебя: ${balance.toFixed(1)} \u{2027} Осталось накопить: ${(
							nextRankCost - balance
						).toFixed(1)}`,
						reply: true,
						emoji: true,
						action: true
					}
				}

				bb.utils.coins.setRank(ctx.user.id, ctx.channel.id, nextRank)
				bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, nextRankCost)

				return {
					text: `Ты успешно повысил(а) свой ранг до ${getRankInfo(nextRank)} \u{2027} Баланс: ${(userData.coins - nextRankCost).toFixed(
						1
					)}`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			default: {
				let currRankInfo = `Твой текущий ранг: ${getRankInfo(currRank)}`
				let nextRankInfo = nextRankCost ? `Следующий ранг: ${getRankInfo(nextRank)}` : ``
				let rankInfoText = ``
				let remainingBalance = ``

				if (nextRankCost) {
					remainingBalance =
						(nextRankCost - balance).toFixed(1) > 0
							? `Осталось накопить: ${(nextRankCost - balance).toFixed(1)}`
							: `Ты можешь повысить свой ранг, используя команду "${bb.config.Bot.Prefix}rank up"!`
					rankInfoText += `Необходимо: ${nextRankCost} \u{2027} У тебя: ${balance.toFixed(1)}`
				}

				const result = [currRankInfo, nextRankInfo, rankInfoText, remainingBalance]
					.reduce((acc, curr) => {
						if (curr) {
							acc.push(curr)
						}
						return acc
					}, [])
					.join(` \u{2027} `)

				return {
					text: result,
					reply: true,
					emoji: true,
					action: true
				}
			}
		}
	}
}
