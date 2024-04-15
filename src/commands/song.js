const got = require(`got`)

function increaseHours(date, hours) {
	return date.setTime(date.getTime() + hours * 60 * 60 * 1000)
}

module.exports = {
	name: `song`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const data = bb.utils.loadFMData()
		let user

		if (ctx.args[0]?.startsWith(`@`)) {
			user = bb.utils.findFMData(bb.utils.parseUser(ctx.args[0]))

			if (user === null) {
				return {
					text: `Пользователь ${bb.utils.parseUser(ctx.args[0])} не привязал свой LastFM аккаунт`,
					reply: true
				}
			}

			user = user.fmLogin
		} else {
			user = ctx.args[0] ?? data[ctx.user.id]?.fmLogin
		}

		if (!user) {
			return {
				text: `Пользователь не привязал(а) свой аккаунт last.fm \u{2027} Для привязки используйте ${bb.config.Bot.Prefix}link fm никнейм`,
				reply: true
			}
		}

		try {
			const response = await got(
				`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${bb.config.API.LastFM}&format=json&limit=1&extended=1`
			).json()

			const data = response.recenttracks.track

			if (data.length === 0) {
				return {
					text: `У ${user} нет недавних треков`,
					reply: true
				}
			}

			const statuses = [`${user} засыпает под`, `${user} наслаждается этим`, `${user} чиллит под`, `${user} отдыхает вместе с этим`]
			const isNowPlaying = data[0][`@attr`]?.nowplaying
			const status = isNowPlaying
				? `${bb.utils.randArr(statuses)} \u{25B6}`
				: `Последний сыгранный у ${user} (${bb.utils.humanizer(new Date() - new Date(data[0].date[`uts`] * 1000), {
					largest: 2
				})} назад) \u{23EF}`

			return {
				text: `${status} ${data[0].artist.name} - ${data[0].name}`,
				reply: true
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			if (e.response.statusCode === 404) {
				return {
					text: `LastFm пользователь не найден`,
					reply: true
				}
			}
			return {
				text: `\u{1F534} ${e.message}`,
				reply: true
			}
		}
	}
}
