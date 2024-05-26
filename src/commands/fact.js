const got = require(`got`)

module.exports = {
	name: `fact`,
	access: [],
	active: true,
	aliases: [`факт`],
	cooldown: 43200,
	requires: [],
	async execute(client, ctx, utils) {
		const res = await got(`https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`).json()
		const fact = res.text
		const translation = (await bb.utils.translate(fact)).translation

		return {
			text: `Твой сегодняшний факт: ${translation}`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
