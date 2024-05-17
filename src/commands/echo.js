module.exports = {
	name: `echo`,
	access: [`Admin`],
	active: true,
	aliases: [`e`],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		const channelCheck = ctx.args.join(` `).match(/(channel)(:|=)([a-z0-9]\w{0,24})/i)
		let channelTarget = channelCheck ? channelCheck[3]?.toLowerCase() : ctx.channel.login
		if (channelCheck) {
			ctx.args.splice(ctx.args.indexOf(channelCheck[0]), 1)
		}

		let text = ctx.args.join(` `)

		if (!text) {
			return {
				text: `Текст не указан`,
				reply: true
			}
		}

		if (text.startsWith(`$`) && ctx.user.id !== bb.config.Dev.ID) {
			text = text.replace(`$`, `\u{1F4B2}`)
		}

		try {
			ctx.send(text, false, false, false, channelTarget)
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			return {
				text: `\u{1F534} ${e.message}`,
				reply: true
			}
		}
	}
}
