const got = require(`got`)

module.exports = {
	name: `link`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const options = [`fm`]
		const option = ctx.args[0]?.toLowerCase()

		if (!option) {
			return {
				text: `Укажи опцию \u{2027} Доступные: ${options.join(`, `)}`,
				reply: true
			}
		}

		switch (option) {
			case `fm`: {
				const input = ctx.args[1]

				if (!input) {
					return {
						text: `Необходимо указать никнейм аккаунта last.fm`,
						reply: true
					}
				}

				const check = await got(
					`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${input}&api_key=${bb.config.API.LastFM}&format=json`,
					{ throwHttpErrors: false }
				)
				const data = JSON.parse(check.body)

				if (data.message) {
					return {
						text: `${data.message}`,
						reply: true
					}
				}

				const fmData = bb.utils.loadFMData()

				const twitchLogin = ctx.user.login
				const fmLogin = data.user.name

				if (!fmData[ctx.user.id]) {
					fmData[ctx.user.id] = {
						twitchLogin: twitchLogin,
						fmLogin: fmLogin
					}

					bb.utils.saveFMData(fmData)

					return {
						text: `Профиль успешно привязан`,
						reply: true
					}
				} else {
					if (fmData[ctx.user.id].twitchLogin !== ctx.user.login) {
						fmData[ctx.user.id].twitchLogin = ctx.user.login
					}

					if (fmData[ctx.user.id].fmLogin !== fmLogin) {
						fmData[ctx.user.id].fmLogin = fmLogin
					}

					bb.utils.saveFMData(fmData)

					return {
						text: `Профиль успешно перепривязан`,
						reply: true
					}
				}
			}
			default: {
				return {
					text: `Неизвестная опция \u{2027} Доступные: ${options.join(`, `)}`,
					reply: true
				}
			}
		}
	}
}
