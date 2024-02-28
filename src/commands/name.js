module.exports = {
	name: `name`,
	access: [`Mod`],
	active: true,
	aliases: [`dn`],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		const name = ctx.args[0]

		if (!name) {
			return {
				text: `Укажи новое отображаемое имя aga`,
				reply: true
			}
		}

		if (name.toLowerCase() !== bb.config.Bot.Login) {
			return {
				text: `В моём имени можно изменить только регистр aga`,
				reply: true
			}
		}

		bb.services.gql.changeDisplay(name)
		await bb.utils.sleep(1500)

		return {
			text: `Сделано, босс \u{1F60E}`,
			reply: true
		}
	}
}
