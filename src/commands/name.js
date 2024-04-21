module.exports = {
	name: `name`,
	access: [],
	active: true,
	aliases: [`dn`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const name = ctx.args[0]

		if (!name) {
			return {
				text: `Укажи новое отображаемое имя aga`,
				reply: true,
				emoji: true
			}
		}

		if (name.toLowerCase() !== bb.config.Bot.Login) {
			return {
				text: `В моём имени можно изменить только регистр aga`,
				reply: true,
				emoji: true
			}
		}

		if (bb.misc.admins.includes(ctx.user.id) || ctx.user.id === bb.config.Dev.ID) {
			bb.services.gql.changeDisplay(name)
			await bb.utils.sleep(1500)

			return {
				text: `Сделано, босс \u{1F60E}`,
				reply: true,
				emoji: true
			}
		} else {
			const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
			const balance = userData.coins
			const price = 35

			if (balance >= price) {
				bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, price)
				bb.services.gql.changeDisplay(name)
				await bb.utils.sleep(1500)

				return {
					text: `Отображаемое имя успешно изменено \u{2027} Я списал с твоего баланса ${price} монет \u{2027} Твой текущий баланс: ${(
						balance - price
					).toFixed(1)}`,
					reply: true,
					emoji: true
				}
			} else {
				const diff = (price - balance).toFixed(1)

				return {
					text: `Недостаточно монет для изменения моего отображаемого имени \u{2027} Необходимо: ${price} \u{2027} У тебя: ${balance.toFixed(
						1
					)} \u{2027} Осталось накопить: ${diff}`,
					reply: true,
					emoji: true
				}
			}
		}
	}
}
