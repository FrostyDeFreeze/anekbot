module.exports = {
	name: `ping`,
	access: [],
	active: true,
	aliases: [`pong`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const channelCheck = ctx.args.join(` `).match(/(channel)(:|=)(\d+)/i)
		let channelTarget = channelCheck ? channelCheck[3] : ctx.channel.id
		if (channelCheck) {
			ctx.args.splice(ctx.args.indexOf(channelCheck[0]), 1)
		}

		const response = ctx.command === `ping` ? `Хуинг` : `Хуёнг`
		const uptime = bb.utils.humanizer(new Date().getTime() - Date.parse(bb.misc.connectedAt), {
			largest: 3
		})
		const ping = await bb.utils.ping()
		const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
		const issued = bb.misc.issuedCommands.toLocaleString(`en-EN`)
		const users = bb.utils.coins.getUsers(channelTarget).length.toLocaleString(`en-EN`)

		return {
			text: `${response} aga \u{1F3D3} ${ping}мс \u{2027} Не сплю уже ${uptime} \u{2027} Использую ${usage}% ваших нервов \u{2027} Приказов выполнил: ${issued} \u{2027} Пользователей обнаружил: ${users}`,
			reply: true
		}
	}
}
