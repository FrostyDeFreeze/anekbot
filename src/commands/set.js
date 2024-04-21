module.exports = {
	name: `set`,
	access: [`Admin`],
	active: true,
	aliases: [],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		const promo = ctx.args[0]
		const activations = ctx.args[1] ? Number(ctx.args[1]) : null

		if (!promo) {
			const promoData = bb.utils.coins.loadPromoData()
			const currCode = promoData.code
			const currAct = promoData.activations
			return {
				text: `Текущий код: ${currCode} \u{2027} Количество активаций: ${currAct !== null ? currAct : `неограниченно`}`,
				reply: true,
				emoji: true
			}
		}

		bb.utils.coins.setPromocode(promo, activations)

		return {
			text: `Промокод ${promo} успешно установлен \u{2027} Количество активаций: ${activations !== null ? activations : `неограниченно`}`,
			reply: true,
			emoji: true
		}
	}
}
