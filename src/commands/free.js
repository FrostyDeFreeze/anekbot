module.exports = {
	name: `free`,
	access: [],
	active: true,
	aliases: [`богатство`],
	cooldown: 3600,
	requires: [],
	async execute(client, ctx, utils) {
		if (ctx.channel.id !== `739044027` && ctx.channel.id !== `239373609`) return

		return {
			text: `!addpoints ${ctx.user.login} 10000`,
			reply: false
		}
	}
}
