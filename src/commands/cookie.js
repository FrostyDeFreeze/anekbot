const fortunes = require(`../data/fortunes.json`)

module.exports = {
	name: `cookie`,
	access: [],
	active: true,
	aliases: [`c`, `\u{1F36A}`, `\u{1F960}`],
	cooldown: 28800,
	requires: [],
	async execute(client, ctx, utils) {
		const cookie = bb.utils.randArr(fortunes)
		const translate = await bb.utils.translate(cookie)

		return {
			text: `\u{1F36A} ${translate.translation}`,
			reply: true,
			emoji: false,
			action: true
		}
	}
}
