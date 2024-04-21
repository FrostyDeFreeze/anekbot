const got = require(`got`)

module.exports = {
	name: `book`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 5,
	requires: [],
	async execute(client, ctx, utils) {
		const input = ctx.args.join(` `)?.toLowerCase()

		if (!input) {
			return {
				text: `Необходимо указать название книги для получения информации`,
				reply: true,
				emoji: true
			}
		}

		try {
			const search = await got
				.post(`https://biblioreads.eu.org/api/search/books`, {
					json: {
						queryURL: `https://www.goodreads.com/search?q=${encodeURIComponent(input)}`
					}
				})
				.json()

			if (search.status !== `Received`) {
				return {
					text: `Ошибка при поиске: ${search.status}`,
					reply: true,
					emoji: true
				}
			}

			if (!search.result.length) {
				return {
					text: `Ничего не нашлось`,
					reply: true,
					emoji: true
				}
			}

			const reg = /\/book\/show\/([\w.-]+)\?/
			const url = search.result[0].bookURL
			const match = url.match(reg)

			const info = await got
				.post(`https://biblioreads.eu.org/api/book-scraper`, {
					json: {
						queryURL: `https://www.goodreads.com/book/show/${match[1]}`
					}
				})
				.json()

			if (info.statusCode !== 200) {
				return {
					text: `Ошибка при получении книги: ${info.status}`,
					reply: true,
					emoji: true
				}
			}

			const title = info.title
			const date = info.publishDate

			let desc = info.desc !== `` ? (await bb.utils.translate(bb.utils.fit(info.desc, 500))).translation : null
			desc = desc !== null ? bb.utils.fit(desc, 300) : null

			const pages = info.bookEdition
			const author = `Автор: ${info.author[0].name}`
			const rating = `Оценка: ${info.rating}`
			const ratingCount = `Голосов: ${info.ratingCount.trim()}`

			const result = [title, date, desc, pages, author, rating, ratingCount]
				.reduce((acc, curr) => {
					if (curr) {
						acc.push(curr)
					}
					return acc
				}, [])
				.join(` \u{2027} `)

			return {
				text: result,
				reply: true,
				emoji: true
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
