module.exports = {
	name: `color`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const color = ctx.args[0]

		if (!color) {
			const user = await bb.services.gql.getUser(ctx.user.login)

			return {
				text: `Твой текущий цвет: ${user.data.user.chatColor}`,
				reply: true
			}
		}

		if (/^[A-Z_\d]{3,25}$/i.test(color) === true) {
			const user = await bb.services.gql.getUser(color)

			if (user.data.user === null) {
				return {
					text: `Пользователь не существует`,
					reply: true
				}
			}

			return {
				text: `Текущий цвет ${bb.utils.unping(user.data.user.login)}: ${user.data.user.chatColor}`,
				reply: true
			}
		}

		if (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(ctx.args[0]) === false) {
			return {
				text: `Это не похоже на HEX код aga`,
				reply: true
			}
		}

		if (bb.misc.admins.includes(ctx.user.id) || ctx.user.id === bb.config.Dev.ID) {
			const update = await bb.services.gql.updateColor(color)

			if (update.errors && update.data.updateChatColor === null) {
				return {
					text: `У меня нет Прайма aga`,
					reply: true
				}
			}

			await bb.utils.sleep(1500)

			return {
				text: `Сделано, босс \u{1F60E}`,
				reply: true
			}
		} else {
			const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
			const balance = userData.coins
			const price = 35

			if (balance >= price) {
				const update = await bb.services.gql.updateColor(color)

				if (update.errors && update.data.updateChatColor === null) {
					return {
						text: `У меня нет Прайма aga`,
						reply: true
					}
				}

				bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, price)
				await bb.utils.sleep(1500)

				return {
					text: `Цвет успешно изменён на ${color.toUpperCase()} \u{2027} Я списал с твоего баланса ${price} монет \u{2027} Твой текущий баланс: ${(
						balance - price
					).toFixed(1)}`,
					reply: true
				}
			} else {
				const diff = (price - balance).toFixed(1)

				return {
					text: `Недостаточно монет для изменения моего цвета \u{2027} Необходимо: ${price} \u{2027} У тебя: ${balance.toFixed(
						1
					)} \u{2027} Осталось накопить: ${diff}`,
					reply: true
				}
			}
		}
	}
}
