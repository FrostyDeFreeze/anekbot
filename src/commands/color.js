const got = require(`got`)
const data = require(`../data/colors.json`)

function hexToRGB(hex) {
	let r = parseInt(hex.slice(1, 3), 16)
	let g = parseInt(hex.slice(3, 5), 16)
	let b = parseInt(hex.slice(5, 7), 16)
	return [r, g, b]
}

function calculateDist(rgb1, rgb2) {
	return Math.sqrt(Math.pow(rgb1[0] - rgb2[0], 2) + Math.pow(rgb1[1] - rgb2[1], 2) + Math.pow(rgb1[2] - rgb2[2], 2))
}

function closestColor(hex) {
	let rgb = hexToRGB(hex)
	let closest = null
	let minDist = Infinity

	data.forEach(color => {
		let colorRgb = [color.r, color.g, color.b]
		let distance = calculateDist(rgb, colorRgb)
		if (distance < minDist) {
			minDist = distance
			closest = color.name
		}
	})

	return closest
}

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
			const userColor = user.data.user.chatColor ?? `none`
			const colorData = await got(`https://api.potat.app/twitch/colors?color=${encodeURIComponent(userColor)}`).json()
			let colorRes = ``

			if (colorData.status === 404 || colorData?.data[0].user_count === 1) {
				colorRes = ` \u{2027} Ты единственный пользователь с этим цветом!`
			} else {
				const userCount = colorData.data[0].user_count.toLocaleString(`en-EN`)
				const percentage = colorData.data[0].percentage > 1 ? ` (${colorData.data[0].percentage.toFixed(1)}%) ` : ` `
				colorRes = ` \u{2027} Ты украл(а) этот цвет у ${userCount}${percentage}пользователей Twitch`
			}

			const colorName = closestColor(userColor === `none` ? `#000000` : userColor)

			return {
				text: `Твой текущий цвет: ${userColor === `none` ? `#000000` : userColor} \u{2027} ${colorName}${colorRes}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (/^(@?[A-Z_\d]{3,25})$/i.test(color) === true) {
			const user = await bb.services.gql.getUser(bb.utils.parseUser(color))

			if (user.data.user === null) {
				return {
					text: `Пользователь выдуман`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			const userColor = user.data.user.chatColor ?? `none`
			const colorData = await got(`https://api.potat.app/twitch/colors?color=${encodeURIComponent(userColor)}`).json()
			let colorRes = ``

			if (colorData.status === 404 || colorData?.data[0].user_count === 1) {
				colorRes = ` \u{2027} Единственный пользователь с этим цветом!`
			} else {
				const userCount = colorData.data[0].user_count.toLocaleString(`en-EN`)
				const percentage = colorData.data[0].percentage > 1 ? ` (${colorData.data[0].percentage.toFixed(1)}%) ` : ` `
				colorRes = ` \u{2027} Украл(а) этот цвет у ${userCount}${percentage}пользователей Twitch`
			}

			const colorName = closestColor(userColor === `none` ? `#000000` : userColor)

			return {
				text: `Текущий цвет ${bb.utils.unping(user.data.user.login)}: ${
					userColor === `none` ? `#000000` : userColor
				} \u{2027} ${colorName}${colorRes}`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(ctx.args[0]) === false) {
			return {
				text: `Это не похоже на HEX код aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (bb.misc.admins.includes(ctx.user.id) || ctx.user.id === bb.config.Dev.ID) {
			const update = await bb.services.gql.updateColor(color)

			if (update.errors && update.data.updateChatColor === null) {
				return {
					text: `У меня нет Прайма aga`,
					reply: true,
					emoji: true,
					action: true
				}
			}

			await bb.utils.sleep(1500)

			return {
				text: `Сделано, босс \u{1F60E}`,
				reply: true,
				emoji: false,
				action: true
			}
		} else {
			const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
			const balance = userData.coins
			const price = 35

			if (balance >= price) {
				const update = await bb.services.gql.updateColor(color)
				const colorName = closestColor(color)

				if (update.errors && update.data.updateChatColor === null) {
					return {
						text: `У меня нет Прайма aga`,
						reply: true,
						emoji: true,
						action: true
					}
				}

				bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, price)
				await bb.utils.sleep(1500)

				return {
					text: `Цвет успешно изменён на ${color.toUpperCase()} (${colorName}) \u{2027} Я списал с твоего баланса ${price} монет \u{2027} Твой текущий баланс: ${(
						balance - price
					).toFixed(1)}`,
					reply: true,
					emoji: true,
					action: true
				}
			} else {
				const diff = (price - balance).toFixed(1)

				return {
					text: `Недостаточно монет для изменения моего цвета \u{2027} Необходимо: ${price} \u{2027} У тебя: ${balance.toFixed(
						1
					)} \u{2027} Осталось накопить: ${diff}`,
					reply: true,
					emoji: true,
					action: true
				}
			}
		}
	}
}
