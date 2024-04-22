module.exports = {
	name: `rps`,
	access: [],
	active: true,
	aliases: [`cnb`],
	cooldown: 60,
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const decision = ctx.args[0]?.toLowerCase()

		function randNum(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		}

		const choices = {
			камень: {
				beats: `ножницы`,
				losesTo: `бумага`
			},
			ножницы: {
				beats: `бумага`,
				losesTo: `камень`
			},
			бумага: {
				beats: `камень`,
				losesTo: `ножницы`
			}
		}

		if (!decision || !(decision in choices)) {
			return {
				text: `Укажи один из вариантов: ${Object.keys(choices).join(`, `)}`,
				reply: true,
				emoji: true
			}
		}

		const pick = bb.utils.randArr(Object.keys(choices))

		if (decision === pick) {
			return {
				text: `Ничья! \u{2694}\u{FE0F}`,
				reply: true,
				emoji: true
			}
		}

		if (choices[decision].beats === pick) {
			const winCash = randNum(5, 50)
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, winCash)
			return {
				text: `Ты выиграл(а)! \u{1F612} \u{2027} За победу начислил тебе ${winCash} монет \u{2027} Твой текущий баланс: ${(
					userData.coins + winCash
				).toFixed(1)}`,
				reply: true,
				emoji: true
			}
		} else {
			const loseCash = randNum(5, 10)
			bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, loseCash)
			return {
				text: `Ты проиграл(а) \u{1F61D} \u{2027} За проигрыш отнял у тебя ${loseCash} монет \u{2027} Твой текущий баланс: ${(
					userData.coins - loseCash
				).toFixed(1)}`,
				reply: true,
				emoji: true
			}
		}
	}
}
