module.exports = {
	name: `color`,
	access: [`Mod`],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const color = ctx.args[0]

		if (!color) {
			const user = await bb.services.gql.getUser(bb.config.Bot.Login)

			return {
				text: `мой текущий цвет: ${user.data.user.chatColor}`,
				reply: true
			}
		}

		if (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(ctx.args[0]) === false) {
			return {
				text: `это не похоже на HEX код aga`,
				reply: true
			}
		}

		bb.services.gql.updateColor(ctx.args[0])
		await bb.utils.sleep(1500)

		return {
			text: `сделано, босс \u{1F607}`,
			reply: true
		}
	}
}
