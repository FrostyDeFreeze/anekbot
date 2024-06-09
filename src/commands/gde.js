module.exports = {
	name: `gde`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const user = ctx.args[0] ? bb.utils.parseUser(ctx.args[0]) : ctx.user.login

		if (user === ctx.user.login) {
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

		const search = bb.utils.coins.findLastSeen(user)

		if (search === null) {
			return {
				text: `Ни разу не видел этого пользователя PoroSad`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const channelLogin = bb.utils.unping(search.channel)
		const userLogin = bb.utils.unping(search.info.login)
		const lastSeen = search.info.lastSeen
		const timeDiff = bb.utils.humanizer(Date.now() - new Date(lastSeen))

		return {
			text: `В последний раз ${userLogin} был(а) обнаружен(а) на канале ${channelLogin} ${timeDiff} назад \u{1F92D}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
