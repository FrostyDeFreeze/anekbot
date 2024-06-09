module.exports = {
	name: `lastseen`,
	access: [],
	active: true,
	aliases: [`ls`, `gde`, `stalk`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const user = bb.utils.parseUser(ctx.args[0]) || ctx.user.login

		if (user === ctx.user.login) {
			return {
				text: `Ты прямо тут aga`,
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
			text: `В последний раз ${userLogin} был обнаружен на канале ${channelLogin} ${timeDiff} назад`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
