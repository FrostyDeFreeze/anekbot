module.exports = {
	name: `status`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const available = bb.utils.coins.getChannelsForUser(ctx.user.id)
		const filtered = available.filter(channel => bb.client.joinedChannels.has(channel.channelLogin))

		if (!filtered.length) {
			return {
				text: `Каналов с доступными догадкой или промокодом нет`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const grouped = filtered.reduce((result, channel) => {
			const type = channel.type === `guess` ? `Догадка` : `Промокод`
			result[type] = result[type] || []
			result[type].push(bb.utils.unping(channel.channelLogin))
			return result
		}, {})

		const result = Object.entries(grouped)
			.map(([type, channels]) => `${type} на каналах: ${channels.sort().join(`, `)}`)
			.join(` \u{2027} `)

		return {
			text: `У тебя остались доступные способы заработка \u{2027} ${result}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
