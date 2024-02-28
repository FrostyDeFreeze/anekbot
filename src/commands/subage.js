const got = require(`got`)

module.exports = {
	name: `subage`,
	access: [],
	active: true,
	aliases: [`sa`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const user = await bb.services.ivr.getUser(bb.utils.parseUser(ctx.args[0] ?? ctx.user.login))
		const channel = await bb.services.ivr.getUser(bb.utils.parseUser(ctx.args[1] ?? ctx.channel.login))

		if (!user) {
			return {
				text: `пользователь выдуман`,
				reply: true
			}
		}

		if (!channel) {
			return {
				text: `канал выдуман`,
				reply: true
			}
		}

		const neverSubbed = [
			`Ну ничего, когда-то и на нашей улице будет праздник PoroSad`,
			`Я вижу везение не твоя сильная сторона`,
			`Минусы какие? Вот и я думаю, что их нет`,
			`Кажется пора запускать пасту «я молоденькая студенточка без сабочки»`,
			`Возможно, это и к лучшему`,
			`Ещё не думаешь найти себе папика?`
		]

		const expiredSub = [
			`На что теперь деньги тратишь?`,
			`Булочки в школе важнее, да? \u{1F614}`,
			`Самое время оформить подписку!`,
			`Зато на гайку сабка есть наверное, да?`,
			`Тоже ждёшь подарочную от Анонима?`,
			`Ну ничего, главное ты человек хороший!`,
			`Правильно, тут работяг без сабок больше любят`
		]

		const giftedSub = [
			`Сколько ты уже нюдсов отправил в лс?… monkaS`,
			`Это ты какой медальон для удачи используешь?`,
			`А мне можно так же?`,
			`Надеюсь, что на гаечку тебе не дарят`,
			`Твоё любимое число не 69? Других причин для подарка не вижу`
		]

		const paidSub = [
			`Оставим это без комментариев`,
			`Ого, чё по личной жизни?`,
			`Лучше бы на что-то полезное деньги тратил(а)`,
			`На этом может хватит? Деньги жаль`,
			`Круто, а мне?`
		]

		try {
			const response = await got(`https://api.ivr.fi/v2/twitch/subage/${user.login}/${channel.login}`).json()

			if (response.statusHidden === null || response.statusHidden === true) {
				return {
					text: `статус подписки скрыт`,
					reply: true
				}
			}

			const uPronouns = user.login === ctx.user.login ? `Ты` : `${bb.utils.unping(user.login)}`
			const cPronouns = channel.login === ctx.channel.login ? `этот канал` : `${bb.utils.unping(channel.login)}`

			if (response.meta === null) {
				const old = response.cumulative

				if (old === null || !old.months || old.months === 0) {
					return {
						text: `\u{274C} ${uPronouns} не удалось поймать ни одной подарочной сабочки на ${cPronouns}. ${bb.utils.randArr(
							neverSubbed
						)}`,
						reply: true
					}
				} else {
					const end = bb.utils.humanizer(new Date().getTime() - Date.parse(old.end))

					return {
						text: `\u{274C} ${uPronouns} был(а) сабом ${cPronouns} в течение ${
							old.months
						} месяцев \u{2027} Сабочка закончилась ${end} назад! ${bb.utils.randArr(expiredSub)}`,
						reply: true
					}
				}
			} else {
				const meta = response.meta
				const cumulative = response.cumulative

				const end = bb.utils.humanizer(new Date().getTime() - Date.parse(meta.endsAt))
				const anniversary = bb.utils.humanizer(new Date().getTime() - Date.parse(cumulative.end))

				if (meta.tier === `Custom`) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} кастомной подпиской в течение ${cumulative.months} 
						месяцев`,
						reply: true
					}
				}

				if (meta.endsAt === null) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} перманентной подпиской в течение ${cumulative.months} 
						месяцев \u{2027} Юбилей подписки наступит через ${anniversary}`,
						reply: true
					}
				}

				if (meta.type === `paid`) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} платной сабкой ${meta.tier} уровня в течение ${
							cumulative.months
						} месяцев \u{2027} 
						Юбилей подписки наступит через ${anniversary} \u{2027} Подписка кончится/возобновится через ${end}. ${bb.utils.randArr(paidSub)}`,
						reply: true
					}
				}

				if (meta.type === `prime`) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} Prime подпиской в течение ${cumulative.months} месяцев \u{2027} Юбилей подписки наступит через ${anniversary} \u{2027} 
						Подписка кончится/возобновится через ${end}`,
						reply: true
					}
				}

				if (meta.type === `gift`) {
					const gifter = meta.giftMeta.gifter === null ? `Анонима` : bb.utils.unping(meta.giftMeta.gifter.login)

					return {
						text: `\u{2705} ${uPronouns} получил(а) подарочную подписку ${meta.tier} уровня от ${gifter} и теперь подписан(а) в течение ${
							cumulative.months
						} месяцев \u{2027} Юбилей подписки наступит через ${anniversary} \u{2027} Подписка кончится/возобновится через ${end}. ${bb.utils.randArr(
							giftedSub
						)}`,
						reply: true
					}
				}
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			if (e.response.statusCode === 404) {
				return {
					text: `\u{1F534} Пользователь или канал находится в бане`,
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
