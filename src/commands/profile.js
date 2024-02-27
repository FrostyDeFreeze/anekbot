const got = require(`got`)
const fs = require(`fs`)
const path = require(`path`)

const coinsPath = path.join(__dirname, `../data/coins.json`)

module.exports = {
	name: `profile`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const ranks = {
			0: `Зародыш`,
			1: `Новичок`,
			2: `Обычный юзер`,
			3: `Болтун`,
			4: `Любитель-балбес`,
			5: `Человек без личной жизни`,
			6: `Сплетник чата`,
			7: `Топчик`,
			8: `Гуру чата`,
			9: `Легенда чата`,
			10: `Главный ебантяй`
		}

		let roles = ``
		let subage = ``
		let se = ``
		let coins = ``
		let rank = ``

		if (ctx.user.perms.mod || ctx.user.perms.vip) {
			const check = await bb.services.gql.getRoles(ctx.channel.id)

			if (ctx.user.perms.mod) {
				const mod = check.data.user.mods.edges.filter(i => i.node !== null).find(i => i.node.id === ctx.user.id)
				const granted = bb.utils.humanizer(new Date().getTime() - Date.parse(mod.grantedAt), { largest: 2 })
				const date = new Date(mod.grantedAt).toLocaleDateString(`ru-RU`)
				roles = `Модератор на этом канале уже ${granted} (${date})`
			}

			if (ctx.user.perms.vip) {
				const vip = check.data.user.vips.edges.filter(i => i.node !== null).find(i => i.node.id === ctx.user.id)
				const granted = bb.utils.humanizer(new Date().getTime() - Date.parse(vip.grantedAt), { largest: 2 })
				const date = new Date(vip.grantedAt).toLocaleDateString(`ru-RU`)
				roles = `VIP на этом канале уже ${granted} (${date})`
			}
		}

		if (ctx.tags.subscriber === `1`) {
			const sa = await got(`https://api.ivr.fi/v2/twitch/subage/${ctx.user.login}/${ctx.channel.login}`).json()

			if (sa.statusHidden === null || sa.statusHidden === true) {
				return
			}

			if (sa.meta === null) {
				const old = sa.cumulative

				if (old === null || !old.months || old.months === 0) {
					subage = `Никогда не был(а) подписан(а) на этот канал`
				} else {
					subage = `Был(а) подписан(а) на этот канал в течение ${old.months} месяцев`
				}
			} else {
				const meta = sa.meta
				const cumulative = sa.cumulative

				if (meta.endsAt === null) {
					subage = `Подписан(а) на этот канал перманентной подпиской в течение ${cumulative.months} месяцев`
				}

				if (meta.type === `paid`) {
					subage = `Подписан(а) на этот канал платной подпиской ${meta.tier} уровня в течение ${cumulative.months} месяцев`
				}

				if (meta.type === `prime`) {
					subage = `Подписан(а) на этот канал Prime подпиской в течение ${cumulative.months} месяцев`
				}

				if (meta.type === `gift`) {
					const gifter = meta.giftMeta.gifter === null ? `Анонима` : bb.utils.unping(meta.giftMeta.gifter.login)
					subage = `Подписан(а) на этот канал подарочной подпиской ${meta.tier} уровня, полученной от ${gifter}, в течение ${cumulative.months} месяцев`
				}
			}
		}

		let cs
		try {
			cs = await got(`https://api.streamelements.com/kappa/v2/chatstats/${ctx.channel.login}/stats`).json()
		} catch (e) {
			cs = null
		}

		if (cs) {
			const find = cs.chatters.find(i => i.name === ctx.user.login)

			if (find) {
				se = `Статка: ${find.amount.toLocaleString(`en-EN`)} (#${cs.chatters.indexOf(find) + 1})`
			}
		}

		const name = ctx.user.login === ctx.user.name.toLowerCase() ? ctx.user.name : ctx.user.login
		const data = getUserData(ctx.user.id, ctx.channel.id)

		coins = `Монеты: ${data.coins.toFixed(1)}`
		rank = `Ранг: ${data.rank} [${ranks[data.rank]}]`

		const result = [name, roles, subage, se, coins, rank]
			.reduce((acc, curr) => {
				if (curr) {
					acc.push(curr)
				}
				return acc
			}, [])
			.join(` \u{2027} `)

		return {
			text: result,
			reply: true
		}
	}
}

function loadCoinsData() {
	if (fs.existsSync(coinsPath)) {
		const coinsData = fs.readFileSync(coinsPath, `utf8`)
		return JSON.parse(coinsData)
	}

	return {}
}

function getUserData(userID, channelID) {
	const coinsData = loadCoinsData()

	if (coinsData[userID] && coinsData[userID].channels[channelID]) {
		return coinsData[userID].channels[channelID]
	}

	return 0
}
