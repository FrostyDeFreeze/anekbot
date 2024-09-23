const got = require(`got`)
const cheerio = require(`cheerio`)

module.exports = {
	name: `fact`,
	access: [],
	active: true,
	aliases: [`факт`],
	cooldown: 43200,
	requires: [],
	async execute(client, ctx, utils) {
		try {
			const response = await got(`https://randstuff.ru/fact/`)
			const $ = cheerio.load(response.body)
			const fact = $(`#fact .text td`).text().trim()

			return {
				text: `Твой сегодняшний факт: ${fact}`,
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
