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

		const top = bb.utils.coins.getUsers(channelTarget)

		if (top.length === 0) {
			return {
				text: `На канале нет пользователей в топе`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const sliced = top.slice(0, 10)

		const formatted = sliced.map(user => {
			const login = bb.utils.unping(user.login)
			const coins = user.coins.toFixed(1)
			const rank = user.rank
			return `${login} - ${coins} [${rank}]`
		})

		return {
			text: formatted.join(` \u{2027} `),
			reply: true,
			emoji: true,
			action: true
		}
	}
}
