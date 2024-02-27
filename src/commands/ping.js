const fs = require(`fs`)

module.exports = {
	name: `ping`,
	access: [],
	active: true,
	aliases: [`pong`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const response = ctx.command === `ping` ? `хуинг` : `хуёнг`
		const uptime = bb.utils.humanizer(new Date().getTime() - Date.parse(bb.misc.connectedAt), {
			largest: 3
		})
		const ping = await bb.utils.ping()
		const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
		const issued = bb.misc.issuedCommands

		return {
			text: `${response} aga \u{1F3D3} ${ping}мс \u{2027} Не сплю уже ${uptime} \u{2027} Использую ${usage}% ваших нервов \u{2027} Приказов выполнил: ${issued}`,
			reply: true
		}
	}
}
