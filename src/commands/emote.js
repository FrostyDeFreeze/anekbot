module.exports = {
	name: `emote`,
	access: [],
	active: true,
	aliases: [`смайл`, `эмоут`],
	cooldown: 3600,
	requires: [],
	async execute(client, ctx, utils) {
		const stvChannel = await bb.services.stv.getUser(ctx.channel.id)

		if (stvChannel.errors) {
			return {
				text: `Ошибка получения ${ctx.channel.login}: ${stvChannel.errors[0].message}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const currSet = stvChannel.data.userByConnection.connections.filter(i => i.platform === `TWITCH`)[0].emote_set_id
		const emotes = stvChannel.data.userByConnection.emote_sets.find(i => i.id === currSet).emotes
		const randEmote = bb.utils.randArr(emotes)

		return {
			text: `Эмоут, описывающий тебя сегодня — ${randEmote.name}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
