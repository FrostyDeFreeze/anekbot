module.exports = {
	name: `gayge`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const actionsData = bb.utils.loadActionsData()

		const enabled = `Цветные ответы включены Gayge`
		const disabled = `Цветные ответы отключены FeelsOkayMan`

		if (!actionsData[ctx.user.id]) {
			actionsData[ctx.user.id] = {
				colorRes: true
			}
			res = enabled
		} else {
			actionsData[ctx.user.id].colorRes = !actionsData[ctx.user.id].colorRes
			res = actionsData[ctx.user.id].colorRes ? enabled : disabled
		}

		bb.utils.saveActionsData(actionsData)

		return {
			text: res,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
