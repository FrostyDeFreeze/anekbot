const got = require(`got`)
const cheerio = require(`cheerio`)

const signs = [
	{ ru: `Овен`, en: `aries`, symbol: `\u{2648}` },
	{ ru: `Телец`, en: `taurus`, symbol: `\u{2649}` },
	{ ru: `Близнецы`, en: `gemini`, symbol: `\u{264A}` },
	{ ru: `Рак`, en: `cancer`, symbol: `\u{264B}` },
	{ ru: `Лев`, en: `leo`, symbol: `\u{264C}` },
	{ ru: `Дева`, en: `virgo`, symbol: `\u{264D}` },
	{ ru: `Весы`, en: `libra`, symbol: `\u{264E}` },
	{ ru: `Скорпион`, en: `scorpio`, symbol: `\u{264F}` },
	{ ru: `Стрелец`, en: `sagittarius`, symbol: `\u{2650}` },
	{ ru: `Козерог`, en: `capricorn`, symbol: `\u{2651}` },
	{ ru: `Водолей`, en: `aquarius`, symbol: `\u{2652}` },
	{ ru: `Рыбы`, en: `pisces`, symbol: `\u{2653}` }
]

module.exports = {
	name: `horoscope`,
	access: [],
	active: true,
	aliases: [`эроскоп`, `эро`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const sign = ctx.args[0]

		if (!sign) {
			return {
				text: `Знак зодиака не указан \u{2027} Доступные: ${signs.map(i => i.ru).join(`, `)}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const find = signs.find(i => i.ru.toLowerCase() === sign.toLowerCase())

		if (!find) {
			return {
				text: `Указанный знак зодиака не существует \u{2027} Доступные: ${signs.map(i => i.ru).join(`, `)}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		const response = await got(`https://www.newsler.ru/horoscope/${find.en}/erotic`)
		const $ = cheerio.load(response.body)

		const text = $(`.horoscope-block .text`).text().trim()

		return {
			text: `${find.symbol} ${find.ru}: ${text}`,
			reply: true,
			emoji: false,
			action: true
		}
	}
}
