module.exports = {
	name: `join`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const data = bb.utils.croc.loadData()

		if (!data[ctx.channel.id] || data[ctx.channel.id].startTime !== 0) {
			return {
				text: `Сейчас нет активной игры или время для присоединения закончилось \u{1F62D}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (data[ctx.channel.id].players.find(player => player.id === ctx.user.id)) {
			return {
				text: `Ты уже присоединился к игре \u{1F60F}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		data[ctx.channel.id].players.push({ id: ctx.user.id, login: ctx.user.login })
		bb.utils.croc.saveData(data)

		return {
			text: `${ctx.user.login} присоединился(ась) к игре \u{1F608}`,
			reply: false,
			emoji: true,
			action: true
		}
	}
}
