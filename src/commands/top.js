module.exports = {
	name: `top`,
	access: [],
	active: true,
	aliases: [`topchik`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const channelCheck = ctx.args.join(` `).match(/(channel)(:|=)(\d+)/i)
		let channelTarget = channelCheck ? channelCheck[3] : ctx.channel.id
		if (channelCheck) {
			ctx.args.splice(ctx.args.indexOf(channelCheck[0]), 1)
		}

		const top = bb.utils.coins.getTopUsersInChannel(channelTarget)

		if (top.length === 0) {
			return {
				text: `На канале нет пользователей в топе`,
				reply: true
			}
		}

		const sliced = top.slice(0, 10)
		const mapped = sliced.map(i => i.userID)
		const logins = await bb.services.helix.getUsersByID(mapped)

		const formatted = sliced.map((user, idx) => {
			const login = bb.utils.unping(logins[idx])
			const coins = user.coins.toFixed(1)
			const rank = user.rank
			return `${login} - ${coins} [${rank}]`
		})

		return {
			text: formatted.join(` \u{2027} `),
			reply: true
		}
	}
}
