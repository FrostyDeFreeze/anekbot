const got = require(`got`)

module.exports = {
	name: `top-artists`,
	access: [],
	active: true,
	aliases: [`topartists`, `ta`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const limitCheck = ctx.args.join(` `).match(/(count|c)(:|=)(\d+)/i)
		let limit = limitCheck ? limitCheck[3] : 5
		if (limitCheck) {
			ctx.args.splice(ctx.args.indexOf(limitCheck[0]), 1)
		}

		if (limit === `0`) {
			limit = 1
		}

		const data = bb.utils.loadFMData()
		let user

		if (ctx.args[0]?.startsWith(`@`)) {
			user = bb.utils.findFMData(bb.utils.parseUser(ctx.args[0]))

			if (user === null) {
				return {
					text: `Пользователь ${bb.utils.parseUser(
						ctx.args[0]
					)} не привязал свой LastFM аккаунт \u{2027} Гайд: https://i.dankfreeze.space/fm-guide.txt`,
					reply: true
				}
			}

			user = user.fmLogin
		} else {
			user = ctx.args[0] ?? data[ctx.user.id]?.fmLogin
		}

		if (!user) {
			return {
				text: `Пользователь не привязал свой аккаунт last.fm \u{2027} Гайд: https://i.dankfreeze.space/fm-guide.txt`,
				reply: true
			}
		}

		const period = `&period=overall`

		try {
			const response = await got(
				`http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${bb.config.API.LastFM}&format=json&limit=${limit}${period}`
			).json()

			const data = response.topartists.artist

			if (data.length === 0) {
				return {
					text: `У ${user} нет недавних треков`,
					reply: true
				}
			}

			const mapped = data.map(i => `${i.name} - ${i.playcount}`)
			const all = mapped.join(` \u{2027} `)

			if (all.length > 500) {
				const post = await bb.paste(mapped.join(`\n`), true)
				return {
					text: `Ответ слишком длинный: ${post}`,
					reply: true
				}
			}

			return {
				text: `Топ исполнителей у ${user}: ${all}`,
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
