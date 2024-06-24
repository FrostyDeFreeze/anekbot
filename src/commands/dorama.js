const got = require(`got`)

module.exports = {
	name: `dorama`,
	access: [],
	active: true,
	aliases: [`дорама`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const res = await got(`https://moredoram.ru/api/rand?type=foreign-serial&genre=&country=&year=`).json()
		const data = res.material_data

		const title = `\u{1F37F} ${data.title} (${data.year})`
		const description = bb.utils.fit(data.description, 330)
		const genres = `Жанры: ${data.all_genres.join(`, `)}`
		const countries = `Страна: ${data.countries.join(`, `)}`
		const episodes = `Эпизоды: ${data.episodes_total || `не знаю`}`
		const rating = `Оценка: ${data.imdb_rating || data.kinopoisk_rating || data.mydramalist_rating || `не знаю`}`

		const result = [title, description, genres, countries, episodes, rating]
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
			emoji: false,
			action: true
		}
	}
}
