const got = require(`got`)

module.exports = {
	name: `randomanime`,
	access: [],
	active: true,
	aliases: [`ra`, `anime`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const page = ~~(Math.random() * 1000) + 1

		const operation = {
			query: `query($page:Int = 1 $id:Int $type:MediaType $isAdult:Boolean = false $search:String $format:[MediaFormat]$status:MediaStatus $countryOfOrigin:CountryCode $source:MediaSource $season:MediaSeason $seasonYear:Int $year:String $onList:Boolean $yearLesser:FuzzyDateInt $yearGreater:FuzzyDateInt $episodeLesser:Int $episodeGreater:Int $durationLesser:Int $durationGreater:Int $chapterLesser:Int $chapterGreater:Int $volumeLesser:Int $volumeGreater:Int $licensedBy:[Int]$isLicensed:Boolean $genres:[String]$excludedGenres:[String]$tags:[String]$excludedTags:[String]$minimumTagRank:Int $sort:[MediaSort]=[POPULARITY_DESC,SCORE_DESC]){Page(page:$page,perPage:1){pageInfo{total perPage currentPage lastPage hasNextPage}media(id:$id type:$type season:$season format_in:$format status:$status countryOfOrigin:$countryOfOrigin source:$source search:$search onList:$onList seasonYear:$seasonYear startDate_like:$year startDate_lesser:$yearLesser startDate_greater:$yearGreater episodes_lesser:$episodeLesser episodes_greater:$episodeGreater duration_lesser:$durationLesser duration_greater:$durationGreater chapters_lesser:$chapterLesser chapters_greater:$chapterGreater volumes_lesser:$volumeLesser volumes_greater:$volumeGreater licensedById_in:$licensedBy isLicensed:$isLicensed genre_in:$genres genre_not_in:$excludedGenres tag_in:$tags tag_not_in:$excludedTags minimumTagRank:$minimumTagRank sort:$sort isAdult:$isAdult){id title{native romaji english}coverImage{extraLarge large color}startDate{year month day}endDate{year month day}bannerImage season seasonYear description type format status(version:2)episodes duration chapters volumes genres isAdult averageScore popularity nextAiringEpisode{airingAt timeUntilAiring episode}mediaListEntry{id status}studios(isMain:true){edges{isMain node{id name}}}}}}`,
			variables: {
				page: page,
				type: `ANIME`,
				sort: [`TRENDING_DESC`, `POPULARITY_DESC`]
			}
		}

		try {
			const res = await got.post(`https://graphql.anilist.co/`, { json: operation }).json()
			const content = res.data.Page.media[0]

			const title = `AYAYA [${res.data.Page.pageInfo.currentPage}] ${content.title.english || content.title.romaji} (${
				content.startDate.year || `?`
			}-${content.endDate.year || `?`})`
			let description = bb.utils.fit(bb.utils.cleanText(content.description), 260)
			description = (await bb.utils.translate(description)).translation
			const genres = `${content.genres.sort().join(`, `)}`
			const episodes = `Эпизоды: ${content.episodes || `?`}`
			let status
			switch (content.status) {
				case `FINISHED`:
					status = `Окончено`
					break
				case `RELEASING`:
					status = `Выпускается`
					break
				case `CANCELLED`:
					status = `Отменено`
					break
				case `NOT_YET_RELEASED`:
					status = `Не вышло`
					break
				default:
					status = `${content.status}`
					break
			}
			const rating = `Оценка: ${content.averageScore || `?`}`

			const result = [title, description, genres, episodes, status, rating]
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
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			return {
				text: `\u{1F534} ${e.message}`,
				reply: true
			}
		}
	}
}
