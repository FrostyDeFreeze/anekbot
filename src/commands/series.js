const got = require(`got`)

module.exports = {
	name: `series`,
	access: [],
	active: true,
	aliases: [`tv`],
	cooldown: 5,
	requires: [],
	async execute(client, ctx, utils) {
		const genres = [
			{ id: 10759, name: `боевик` },
			{ id: 37, name: `вестерн` },
			{ id: 35, name: `комедия` },
			{ id: 80, name: `криминал` },
			{ id: 18, name: `драма` },
			{ id: 99, name: `документальный` },
			{ id: 9648, name: `детектив` },
			{ id: 10762, name: `детский` },
			{ id: 10765, name: `фэнтези` },
			{ id: 10763, name: `новости` },
			{ id: 16, name: `мультфильм` },
			{ id: 10759, name: `приключения` },
			{ id: 10764, name: `реалити-шоу` },
			{ id: 10767, name: `ток-шоу` },
			{ id: 10751, name: `семейный` }
		]

		const input = ctx.args.join(` `)?.toLowerCase()

		if (!input) {
			return {
				text: `Необходимо указать жанры через пробел \u{2027} Доступные жанры: ${genres.map(i => i.name).join(`, `)}`,
				reply: true
			}
		}

		const genreIds = input.split(` `).map(genre => {
			const foundGenre = genres.find(i => i.name.toLowerCase() === genre)
			return foundGenre ? foundGenre.id : null
		})

		if (genreIds.some(id => id === null)) {
			return {
				text: `Некоторые из введённых жанров не найдены \u{2027} Доступные жанры: ${genres.map(i => i.name).join(`, `)}`,
				reply: true
			}
		}

		const page = ~~(Math.random() * 5) + 1
		const discoverUrl = `https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=true&language=ru-RU&page=${page}&sort_by=vote_count.desc&with_genres=${encodeURIComponent(
			genreIds.join(`,`)
		)}`

		try {
			const res = await got(discoverUrl, {
				responseType: `json`,
				headers: {
					Authorization: `Bearer ${bb.config.API.TMDB} `
				}
			}).json()

			const series = res.results

			if (!series.length) {
				return {
					text: `Ничего не нашлось`,
					reply: true
				}
			}

			const randSeries = bb.utils.randArr(series)
			const seriesID = randSeries.id
			const detailsUrl = `https://api.themoviedb.org/3/tv/${seriesID}?language=ru-RU`

			const details = await got(detailsUrl, {
				responseType: `json`,
				headers: {
					Authorization: `Bearer ${bb.config.API.TMDB}`
				}
			}).json()

			console.log(details)

			const title = `\u{1F37F} ${details.name} (${details.first_air_date.split(`-`)[0]}-${details.last_air_date.split(`-`)[0]})`
			const description = bb.utils.fit(details.overview, 290)
			const genres = `Жанры: ${details.genres
				.map(i => i.name.toLowerCase())
				.sort()
				.join(`, `)}`
			const seasons = `Сезоны: ${details.number_of_seasons}`
			const episodes = `Эпизоды: ${details.number_of_episodes}`
			let status
			switch (details.status) {
				case `Canceled`:
					status = `Статус: отменён`
					break
				case `Ended`:
					status = `Статус: окончен`
					break
				case `Returning Series`:
					status = `Статус: продолжается`
					break
				default:
					status = `Статус: ${details.status}`
					break
			}
			const rating = `Оценка: ${details.vote_average.toFixed(1)}`

			const result = [title, description, genres, seasons, episodes, status, rating]
				.reduce((acc, curr) => {
					if (curr) {
						acc.push(curr)
					}
					return acc
				}, [])
				.join(` \u{2027} `)

			return {
				text: result,
				reply: true
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
