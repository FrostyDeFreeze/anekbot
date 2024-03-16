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
				text: `Пользователь выдуман`,
				reply: true
			}
		}

		if (!channel) {
			return {
				text: `Канал выдуман`,
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
			`Правильно, тут работяг без сабок больше любят`,
			`В жизни и другие радости есть!`,
			`Правильно, лучше на Братишкина сабнись`,
			`Кому вообще эта сабка нужна, купи Милку лучше`,
			`Похуй, прорвёмся`,
			`Может пора исправлять?`,
			`Ну чего вы сидите, смотрите? Исправьте человеку ситуацию!`,
			`Да похуй, был и был!`
		]

		const giftedSub = [
			`Сколько ты уже нюдсов отправил в лс ?… monkaS`,
			`Это ты какой медальон для удачи используешь ? `,
			`А мне можно так же ? `,
			`Надеюсь, что на гаечку тебе не дарят`,
			`Твоё любимое число не 69 ? Других причин для подарка не вижу`,
			`Понабирали гарем и теперь подарочные получают \u{1F612}`,
			`Ничего - ничего, я топчик и без сабки`,
			`Самодостаточные люди сабаются сами \u{1F60E}`,
			`Бро, у нас теперь СБП работает, сабнись уже наконец - то сам`,
			`- 130р у кого - то \u{1F92D}`,
			`На дипинса тебе тоже так дарят, да ? `,
			`Я так понимаю твои услуги стоят ровно одну сабку ? `,
			`Какие щедрые сабгифтеры в наше время! А вот раньше...`
		]

		const paidSub = [
			`Оставим это без комментариев`,
			`Ого, чё по личной жизни ? `,
			`Лучше бы на что - то полезное деньги тратил(а)`,
			`На этом может хватит ? Деньги жаль`,
			`Круто, а мне ? `
		]

		const primeSub = [
			`Праймер \u{1F449} \u{1F6AA}`,
			`Деньги на булочку в школе потратил и теперь сабается с праймом, дебил \u{1F644}`,
			`Привет, подари мне тоже \u{1F60A}`,
			`Праймеры п...`,
			`Такие дела!`
		]

		try {
			const response = await got(`https://api.ivr.fi/v2/twitch/subage/${user.login}/${channel.login}`).json()

			if (response.statusHidden === null || response.statusHidden === true) {
				return {
					text: `\u{274C} Статус сабочки скрыт`,
					reply: true
				}
			}

			const uPronouns = user.login === ctx.user.login ? `Ты` : `${bb.utils.unping(user.login)}`
			const cPronouns = channel.login === ctx.channel.login ? `этот канал` : `${bb.utils.unping(channel.login)}`

			if (response.meta === null) {
				const old = response.cumulative

				if (old === null || !old.months || old.months === 0) {
					return {
						text: `\u{274C} ${uPronouns} никогда не ловил(а) подарочную сабочку на ${cPronouns} \u{2027} ${bb.utils.randArr(
							neverSubbed
						)}`,
						reply: true
					}
				} else {
					const end = bb.utils.humanizer(new Date().getTime() - Date.parse(old.end))

					return {
						text: `\u{274C} ${uPronouns} был(а) подписан(а) на ${cPronouns} в течение ${old.months} месяцев \u{2027} 
						Сабочка кончилась ${end} назад \u{2027} ${bb.utils.randArr(expiredSub)}`,
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
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} кастомной сабочкой в течение ${cumulative.months} 
						месяцев`,
						reply: true
					}
				}

				if (meta.endsAt === null) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} перманентной сабочкой в течение ${cumulative.months} 
						месяцев \u{2027} Юбилей сабочки наступит через ${anniversary}`,
						reply: true
					}
				}

				if (meta.type === `paid`) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} платной сабочкой ${meta.tier} уровня в течение ${cumulative.months
							} месяцев \u{2027} 
						Юбилей сабочки наступит через ${anniversary} \u{2027} Сабочка кончится/возобновится через ${end} \u{2027} ${bb.utils.randArr(paidSub)}`,
						reply: true
					}
				}

				if (meta.type === `prime`) {
					return {
						text: `\u{2705} ${uPronouns} подписан(а) на ${cPronouns} Prime сабочкой в течение ${cumulative.months} месяцев \u{2027} Юбилей сабочки наступит через ${anniversary} \u{2027} 
						Сабочка кончится/возобновится через ${end} \u{2027} ${bb.utils.randArr(
							primeSub
						)}`,
						reply: true
					}
				}

				if (meta.type === `gift`) {
					const gifter = meta.giftMeta.gifter === null ? `Анонима` : bb.utils.unping(meta.giftMeta.gifter.login)

					return {
						text: `\u{2705} ${uPronouns} получил(а) подарочную сабочку ${meta.tier} уровня от ${gifter} и теперь подписан(а) в течение ${cumulative.months
							} месяцев \u{2027} Юбилей сабочки наступит через ${anniversary} \u{2027} Сабочка кончится/возобновится через ${end} \u{2027} ${bb.utils.randArr(
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
					text: `\u{274C} Пользователь или канал находится в бане`,
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
