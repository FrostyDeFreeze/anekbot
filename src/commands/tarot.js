const got = require(`got`)

module.exports = {
	name: `tarot`,
	access: [],
	active: true,
	aliases: [`taro`, `таро`],
	cooldown: 10,
	requires: [],
	async execute(client, ctx, utils) {
		const query = ctx.args.join(` `)

		if (!query) {
			return {
				text: `\u{1F534} Необходимо указать вопрос для расклада`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const upOrRev = bb.utils.randArr([`Straight`, `Reversed`])

		try {
			const res = await got(`https://tarotapi.dev/api/v1/cards/random?n=1`).json()
			const card = res.cards[0]
			const { name, meaning_up, meaning_rev } = card
			const meaning = upOrRev === `Straight` ? meaning_up : meaning_rev

			const ai = await bb.services.ai.gpt(
				`Карта: ${upOrRev} ${name}. Значение: ${meaning} Вопрос: ${query}`,
				350,
				1,
				`Ты выступаешь в роли таролога. Отвечай в пределах 450 символов. Не используй эмодзи. Ответь только на русском языке.`
			)
			const body = JSON.parse(ai.body)

			if (body.error) {
				return {
					text: `\u{1F534} ${body.error.message}`,
					reply: true
				}
			}

			const response = body.choices[0].message.content.replace(/[\n\r]/g, ` `)

			return {
				text: `\u{1F52E} ${response}`,
				reply: true,
				emoji: false,
				action: true
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message} `)
			return {
				text: `\u{1F534} ${e.message} `,
				reply: true
			}
		}
	}
}
