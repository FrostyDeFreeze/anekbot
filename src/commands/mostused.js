const got = require(`got`)

module.exports = {
	name: `mostused`,
	access: [],
	active: true,
	aliases: [`mu`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const count = !isNaN(ctx.args[0]) ? parseInt(ctx.args[0], 10) : 5
		const res = await got(`https://7tv.markzynk.com/c/${ctx.channel.login}`).json()

		if (res.success === false) {
			return {
				text: res.message,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (count > 20) {
			return {
				text: `Максимальное количество: 20`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const stvUser = await bb.services.stv.getUserREST(ctx.channel.id)
		const setEmotes = stvUser.emote_set.emotes

		const validEmoteIds = new Set(setEmotes.map(emote => emote.id))
		const filteredEmotes = res.emotes.filter(emote => validEmoteIds.has(emote.id))
		const sortedEmotes = filteredEmotes.sort((a, b) => b.count - a.count)

		const top = sortedEmotes
			.slice(0, count)
			.map((emote, index) => {
				const name = emote.alias !== null ? emote.alias : emote.name
				const count = emote.count.toLocaleString(`en-EN`)
				return `${index + 1}. ${name} (${count})`
			})
			.join(` \u{2027} `)

		return {
			text: top,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
