module.exports = {
	name: `promocode`,
	access: [],
	active: true,
	aliases: [`promo`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const lastUsage = userData.lastPromocode
		const promoData = bb.utils.coins.loadPromoData()
		const currCode = promoData.code
		const currTime = new Date().getTime()

		if (lastUsage && currTime - new Date(lastUsage).getTime() < 86_400_000) {
			const time = new Date(lastUsage).getTime() - currTime + 86_400_000

			return {
				text: `Активировать промокод можно раз в 24 часа \u{2027} Возвращайся через ${bb.utils.humanizer(time)}`,
				reply: true
			}
		}

		if (!currCode) {
			return {
				text: `В данный момент нет активного промокода`,
				reply: true
			}
		}

		const promocode = ctx.args[0]

		if (!promocode) {
			return {
				text: `Укажи промокод для активации aga`,
				reply: true
			}
		}

		if (promocode === currCode) {
			const activations = promoData.activations
			const activatedUsers = promoData.activatedUsers

			if (activations === activatedUsers.length) {
				return {
					text: `Увы, лимит активаций для этого промокода был достигнут`,
					reply: true
				}
			}

			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, 50)
			bb.utils.coins.setLastPromocode(ctx.user.id, ctx.channel.id, currTime)
			bb.utils.coins.addPromoActivation(ctx.user.id)

			return {
				text: `Промокод успешно активирован, начислил тебе 50 монет \u{2027} Твой текущий баланс: ${(userData.coins + 50).toFixed(
					1
				)} \u{2027} Следующая активация будет доступна через 24 часа`,
				reply: true
			}
		} else {
			return {
				text: `Я не знаю такого промокода`,
				reply: true
			}
		}
	}
}
