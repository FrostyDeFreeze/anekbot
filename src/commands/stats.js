const got = require(`got`)

module.exports = {
	name: `stats`,
	access: [],
	active: true,
	aliases: [`стата`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const emote = ctx.args[0]

		if (!emote) {
			return {
				text: `(7TV) Эмоут не указан`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const res = await got(`https://7tv.markzynk.com/c/${ctx.channel.login}`).json()

		if (res.success === false) {
			return {
				text: res.message,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const stvUser = await bb.services.stv.getUserREST(ctx.channel.id)
		const setEmotes = stvUser.emote_set.emotes

		const validEmoteIds = new Set(setEmotes.map(emote => emote.id))
		const filteredEmotes = res.emotes.filter(emote => validEmoteIds.has(emote.id))
		const find = filteredEmotes.find(i => (i.alias || i.name) === emote)

		if (!find) {
			return {
				text: `Эмоут ${emote} не найден \u{2027} Название чувствительно к регистру`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const name = find.alias !== null ? find.alias : find.name
		const count = find.count.toLocaleString(`en-EN`)

		const sortedEmotes = filteredEmotes.sort((a, b) => b.count - a.count)
		const position = sortedEmotes.findIndex(i => i.id === find.id) + 1

		return {
			text: `Эмоут ${name} был использован ${count} раз(а) \u{2027} Позиция в топе: ${position}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
