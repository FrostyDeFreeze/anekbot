module.exports = {
	name: `status`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const available = bb.utils.coins.getChannelsForUser(ctx.user.id)

		if (!available.length) {
			return {
				text: `Каналов с доступными догадкой или промокодом нет`,
				reply: true
			}
		}

		const grouped = available.reduce((result, channel) => {
			const type = channel.type === `guess` ? `Догадка` : `Промокод`
			result[type] = result[type] || []
			result[type].push(bb.utils.unping(channel.channelLogin))
			return result
		}, {})

		const result = Object.entries(grouped)
			.map(([type, channels]) => `${type}: ${channels.sort().join(`, `)}`)
			.join(` \u{2027} `)

		return {
			text: result,
			reply: true
		}
	}
}
