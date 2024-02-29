const got = require(`got`)

module.exports = {
	name: `movie`,
	access: [],
	active: true,
	aliases: [`фильм`],
	cooldown: 5,
	requires: [],
	async execute(client, ctx, utils) {
		const genres = [
			{ id: 28, name: `боевик` },
			{ id: 35, name: `комедия` },
			{ id: 80, name: `криминал` },
			{ id: 9648, name: `детектив` },
			{ id: 99, name: `документальный` },
			{ id: 18, name: `драма` },
			{ id: 36, name: `история` },
			{ id: 10402, name: `музыка` },
			{ id: 16, name: `мультфильм` },
			{ id: 10749, name: `мелодрама` },
			{ id: 53, name: `триллер` },
			{ id: 878, name: `фантастика` },
			{ id: 14, name: `фэнтези` },
			{ id: 37, name: `вестерн` },
			{ id: 27, name: `ужасы` },
			{ id: 10751, name: `семейный` },
			{ id: 12, name: `приключения` }
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
				text: `Некоторые из введённых жанров не найдены. Доступные жанры: ${genres.map(i => i.name).join(`, `)}`,
				reply: true
			}
		}

		const page = ~~(Math.random() * 5) + 1
		const discoverUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=ru-RU&page=${page}&sort_by=revenue.desc&with_genres=${encodeURIComponent(
			genreIds.join(`,`)
		)}`

		try {
			const res = await got(discoverUrl, {
				responseType: `json`,
				headers: {
					Authorization: `Bearer ${bb.config.API.TMDB}`
				}
			}).json()

			const movies = res.results

			if (!movies.length) {
				return {
					text: `Ничего не нашлось`,
					reply: true
				}
			}

			const randMovie = bb.utils.randArr(movies)
			const movieID = randMovie.id
			const detailsUrl = `https://api.themoviedb.org/3/movie/${movieID}?language=ru-RU`

			const details = await got(detailsUrl, {
				responseType: `json`,
				headers: {
					Authorization: `Bearer ${bb.config.API.TMDB}`
				}
			}).json()

			const title = `\u{1F37F} ${details.title} (${details.release_date.split(`-`)[0]})`
			const description = bb.utils.fit(details.overview, 310)
			const genres = `Жанры: ${details.genres
				.map(i => i.name)
				.sort()
				.join(`, `)}`
			const runtime = `Длительность: ${bb.utils.humanizer(details.runtime * 60 * 1000, { largest: 2 })}`
			const budget = `Бюджет: $${details.budget.toLocaleString(`en-US`)}`
			const rating = `Оценка: ${details.vote_average.toFixed(1)}`

			const result = [title, description, genres, runtime, budget, rating]
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
