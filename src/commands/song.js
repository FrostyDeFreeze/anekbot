const got = require(`got`)

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
		let text = ctx.args.join(` `)

		if (ctx.args[0]?.startsWith(`@`)) {
			user = bb.utils.findFMData(bb.utils.parseUser(ctx.args[0]))
			text = ctx.args.slice(1).join(` `)

			if (user === null) {
				return {
					text: `Пользователь ${bb.utils.parseUser(
						ctx.args[0]
					)} не привязал свой LastFM аккаунт \u{2027} Гайд: https://i.cuvi.pw/fm-guide.txt`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			user = user.fmLogin
		} else {
			user = data[ctx.user.id]?.fmLogin
		}

		if (!user) {
			return {
				text: `Пользователь не привязал(а) свой аккаунт last.fm \u{2027} Гайд: https://i.cuvi.pw/fm-guide.txt`,
				reply: true,
				emoji: true,
				action: true
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
					reply: true,
					emoji: true,
					action: true
				}
			}

			const statuses = [
				`${user} балдеет от`,
				`${user} вайбит вместе с`,
				`${user} засыпает под`,
				`${user} кайфует под`,
				`${user} наслаждается`,
				`${user} отдыхает вместе с`,
				`${user} получает наслаждение от`,
				`${user} слушает`,
				`${user} танцует под`,
				`${user} чиллит под`
			]
			const isNowPlaying = data[0][`@attr`]?.nowplaying
			const status = isNowPlaying
				? `${bb.utils.randArr(statuses)} \u{25B6}`
				: `Последний сыгранный у ${user} (${bb.utils.humanizer(new Date() - new Date(data[0].date[`uts`] * 1000), {
					largest: 2
				})} назад) \u{23EF}`

			return {
				text: `${status} ${data[0].artist.name} - ${data[0].name}${text ? ` | ${text}` : ``}`,
				reply: true,
				emoji: true,
				action: true
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			if (e.response.statusCode === 404) {
				return {
					text: `LastFm пользователь не найден`,
					reply: true,
					emoji: true,
					action: true
				}
			}
			return {
				text: `\u{1F534} ${e.message}`,
				reply: true
			}
		}
	}
}
