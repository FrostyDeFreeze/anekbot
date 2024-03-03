module.exports = {
	name: `rps`,
	access: [],
	active: true,
	aliases: [`cnb`],
	cooldown: 10,
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const decision = ctx.args[0]

		function randNum(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		}

		const available = [`камень`, `ножницы`, `бумага`]
		const pick = bb.utils.randArr(available)
		const cash = randNum(5, 20)

		if (!decision) {
			return {
				text: `Укажи один из вариантов: ${available.join(`, `)}`,
				reply: true
			}
		}

		if (!available.includes(decision.toLowerCase())) {
			return {
				text: `Тип указан неверно \u{2027} Доступные варианты: ${available.join(`, `)}`,
				reply: true
			}
		}

		if (pick === decision.toLowerCase()) {
			return {
				text: `Ничья! \u{2694}\u{FE0F}`,
				reply: true
			}
		}

		switch (decision.toLowerCase()) {
			case `камень`: {
				if (pick === `бумага`) {
					return {
						text: `Ты проиграл(а) \u{2027} я поставил \u{1F4DC} \u{1F61C}`,
						reply: true
					}
				} else {
					bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, cash)
					return {
						text: `Ты выиграл(а)! \u{1F612} \u{2027} За победу начислил тебе ${cash} монет \u{2027} Твой текущий баланс: ${(
							userData.coins + cash
						).toFixed(1)}`,
						reply: true
					}
				}
			}

			case `ножницы`: {
				if (pick === `камень`) {
					return {
						text: `Ты проиграл(а) \u{2027} Я поставил \u{1FAA8} \u{1F61C}`,
						reply: true
					}
				} else {
					bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, cash)
					return {
						text: `Ты выиграл(а)! \u{1F612} \u{2027} За победу начислил тебе ${cash} монет \u{2027} Твой текущий баланс: ${(
							userData.coins + cash
						).toFixed(1)}`,
						reply: true
					}
				}
			}

			case `бумага`: {
				if (pick === `ножницы`) {
					return {
						text: `Ты проиграл(а) \u{2027} Я поставил \u{2702} \u{1F61C}`,
						reply: true
					}
				} else {
					bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, cash)
					return {
						text: `Ты выиграл(а)! \u{1F612} \u{2027} За победу начислил тебе ${cash} монет \u{2027} Твой текущий баланс: ${(
							userData.coins + cash
						).toFixed(1)}`,
						reply: true
					}
				}
			}
		}
	}
}
