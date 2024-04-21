module.exports = {
	name: `emoji`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)
		const userEmoji = userData?.emoji

		const balance = userData.coins
		let emojiCost = 1000

		if (ctx.user.id === bb.config.Dev.ID) {
			emojiCost = 0
		}

		const emoji = ctx.args[0]

		if (!emoji) {
			return {
				text: `Укажи Emoji для покупки \u{2027} Стоимость: 1000 монет`,
				reply: true
			}
		}

		if (!emoji.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)) {
			return {
				text: `Это не похоже на Emoji`,
				reply: true
			}
		}

		if (bb.utils.ucLen(emoji) > 1) {
			return {
				text: `Составные эмодзи не поддерживаются`,
				reply: true
			}
		}

		const emojiRegex = /\p{Emoji}/u
		const firstEmoji = emoji.match(emojiRegex)[0]

		if (userEmoji && userEmoji === firstEmoji) {
			return {
				text: `Этот Emoji у тебя уже установлен`,
				reply: true
			}
		}

		if (balance < emojiCost) {
			return {
				text: `Недостаточно монет для покупки Emoji \u{2027} Необходимо: ${emojiCost} \u{2027} У тебя: ${balance.toFixed(
					1
				)} \u{2027} Осталось накопить: ${(emojiCost - balance).toFixed(1)}`,
				reply: true
			}
		}

		bb.utils.coins.setEmoji(ctx.user.id, ctx.channel.id, firstEmoji)
		bb.utils.coins.removeCoins(ctx.user.id, ctx.channel.id, emojiCost)

		return {
			text: `Emoji ${firstEmoji} успешно приобретён \u{2027} Я списал с твоего баланса ${emojiCost} монет \u{2027} Твой текущий баланс: ${(
				balance - emojiCost
			).toFixed(1)}`,
			reply: true
		}
	}
}
