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

		switch (ctx.args[0]) {
			case `up`: {
				if (currRank < 10) {
					const nextRank = currRank + 1
					const nextRankCost = ranks[nextRank].cost
					const nextRankName = ranks[nextRank].name

					if (balance >= nextRankCost) {
						bb.utils.coins.setRank(ctx.user.id, ctx.channel.id, nextRank)
						bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, nextRankCost)

						return {
							text: `Ты успешно повысил(а) свой ранг до ${nextRank} [${nextRankName}] \u{2027} Баланс: ${(
								userData.coins - nextRankCost
							).toFixed(1)}`,
							reply: true
						}
					} else {
						const diff = (nextRankCost - balance).toFixed(1)

						return {
							text: `Недостаточно монет для повышения до ранга ${nextRank} [${nextRankName}] \u{2027} Необходимо: ${nextRankCost} \u{2027} У тебя: ${balance.toFixed(
								1
							)} \u{2027} Осталось накопить: ${diff}`,
							reply: true
						}
					}
				} else {
					return {
						text: `Ты достиг последнего ${currRank} ранга. Лечись, бро`,
						reply: true
					}
				}
			}

			default: {
				const nextRank = currRank + 1
				const nextRankCost = ranks[nextRank].cost
				const currRankName = ranks[currRank].name
				const nextRankName = ranks[nextRank].name
				const diff =
					Math.sign(nextRankCost - balance) !== -1
						? `Осталось накопить: ${(nextRankCost - balance).toFixed(1)}`
						: `Ты можешь повысить свой ранг, используя команду "${bb.config.Bot.Prefix}rank up"!`

				return {
					text: `Твой текущий ранг: ${currRank} [${currRankName}] \u{2027} Следующий ранг: ${nextRank} [${nextRankName}] \u{2027} Необходимо: ${nextRankCost} \u{2027} У тебя: ${balance.toFixed(
						1
					)} \u{2027} ${diff}`,
					reply: true
				}
			}
		}
	}
}
