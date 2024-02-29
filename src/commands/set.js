module.exports = {
	name: `set`,
	access: [`Admin`],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const promo = ctx.args[0]
		const activations = Number(ctx.args[1]) ?? null

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
