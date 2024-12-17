const got = require(`got`)

module.exports = {
	name: `motivation`,
	access: [],
	active: true,
	aliases: [`мотивация`],
	cooldown: 43200,
	requires: [],
	async execute(client, ctx, utils) {
		try {
			const response = await got(`https://zenquotes.io/?api=random`).json()
			const quote = `${response[0].q} — ${response[0].a}`
			const translate = await bb.utils.translate(quote)

			return {
				text: `Мотивация на сегодняшний день: ${translate.translation}`,
				reply: true,
				emoji: true,
				action: true
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			return {
				text: `\u{1F534} ${e.message}`,
				reply: true
			}
		}
	}
}
