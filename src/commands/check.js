module.exports = {
	name: `check`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const user = ctx.args[0] ? bb.utils.parseUser(ctx.args[0]) : ctx.user.login

		if (user.toLowerCase() === ctx.user.login) {
			return {
				text: `Ты прямо здесь aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (user === bb.config.Bot.Login) {
			return {
				text: `Отличная попытка aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const search = bb.utils.coins.getUserByLogin(ctx.channel.login, user)

		if (search === null) {
			return {
				text: `Ни разу не видел этого пользователя здесь PoroSad`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const lastSeen = search.lastSeen

		if (!lastSeen) {
			return {
				text: `Пользователь был здесь, однако я забыл записать его время PoroSad`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const userLogin = bb.utils.unping(search.login)
		const timeDiff = bb.utils.humanizer(Date.now() - new Date(lastSeen))

		return {
			text: `В последний раз ${userLogin} был(а) обнаружен(а) здесь ${timeDiff} назад \u{1F92D}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
