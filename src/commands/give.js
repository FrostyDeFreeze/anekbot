module.exports = {
	name: `give`,
	access: [],
	active: true,
	aliases: [`богатство`],
	cooldown: 3600,
	requires: [],
	async execute(client, ctx, utils) {
		if (ctx.channel.id !== `739044027`) return

		return {
			text: `!addpoints ${ctx.sender.login} 10000`,
			reply: false
		}
	}
}
