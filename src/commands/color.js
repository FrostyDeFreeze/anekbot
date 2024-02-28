module.exports = {
	name: `color`,
	access: [`Mod`],
	active: true,
	aliases: [],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		const color = ctx.args[0]

		if (!color) {
			const user = await bb.services.gql.getUser(bb.config.Bot.Login)

			return {
				text: `Мой текущий цвет: ${user.data.user.chatColor}`,
				reply: true
			}
		}

		if (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(ctx.args[0]) === false) {
			return {
				text: `Это не похоже на HEX код aga`,
				reply: true
			}
		}

		bb.services.gql.updateColor(color)
		await bb.utils.sleep(1500)

		return {
			text: `Сделано, босс \u{1F60E}`,
			reply: true
		}
	}
}
