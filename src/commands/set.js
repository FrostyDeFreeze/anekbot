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
			return {
				text: `Укажи промокод aga`,
				reply: true
			}
		}

		bb.utils.coins.setPromocode(promo, activations)

		return {
			text: `Промокод ${promo} успешно установлен \u{2027} Количество активаций: ${activations !== null ? activations : `неограниченно`}`,
			reply: true
		}
	}
}
