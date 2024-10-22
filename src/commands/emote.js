module.exports = {
	name: `emote`,
	access: [],
	active: true,
	aliases: [`смайл`, `эмоут`],
	cooldown: 3600,
	requires: [],
	async execute(client, ctx, utils) {
		const stvChannel = await bb.services.stv.getUserREST(ctx.channel.id)

		if (!stvChannel) {
			return {
				text: `Ошибка получения ${ctx.channel.login}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const emotes = stvChannel.emote_set.emotes
		const randEmote = bb.utils.randArr(emotes)

		return {
			text: `Эмоут, описывающий тебя сегодня — ${randEmote.name}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
