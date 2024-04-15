const got = require(`got`)

module.exports = {
	name: `profile`,
	access: [],
	active: true,
	aliases: [],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		let roles = ``
		let subage = ``
		let se = ``
		let coins = ``
		let rank = ``
		let position = ``
		// let firstSeen = ``

		if (ctx.user.perms.mod || ctx.user.perms.vip) {
			const check = await bb.services.gql.getRoles(ctx.channel.id)

			if (ctx.user.perms.mod) {
				const mod = check.mods.filter(i => i.node !== null).find(i => i.node.id === ctx.user.id)
				const granted = bb.utils.humanizer(new Date().getTime() - Date.parse(mod?.grantedAt), { largest: 2 })
				roles = `Модератор (${granted})`
			}

			if (ctx.user.perms.vip) {
				const vip = check.vips.filter(i => i.node !== null).find(i => i.node.id === ctx.user.id)
				const granted = bb.utils.humanizer(new Date().getTime() - Date.parse(vip?.grantedAt), { largest: 2 })
				roles = `VIP (${granted})`
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
					subage = `Подписан(а) перманентной подпиской (${cumulative.months} месяцев)`
				}

				if (meta.type === `paid`) {
					subage = `Подписан(а) платной подпиской ${meta.tier} уровня (${cumulative.months} месяцев)`
				}

				if (meta.type === `prime`) {
					subage = `Подписан(а) Prime подпиской (${cumulative.months} месяцев)`
				}

				if (meta.type === `gift`) {
					const gifter = meta.giftMeta.gifter === null ? `Анонима` : bb.utils.unping(meta.giftMeta.gifter.login)
					subage = `Подписан(а) подарочной подпиской ${meta.tier} уровня, полученной от ${gifter} (${cumulative.months} месяцев)`
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
		const userData = bb.utils.coins.getUser(ctx.user.id, ctx.channel.id)

		coins = `Монеты: ${userData.coins.toFixed(1)}`
		rank = `Ранг: ${userData.rank} [${bb.utils.coins.ranks[userData.rank].name}]`

		const top = bb.utils.coins.getUsers(ctx.channel.id)
		const userPos = top.findIndex(i => i.id === ctx.user.id) + 1
		const total = top.length

		position = `Позиция в топе: ${userPos}/${total}`
		// firstSeen = `Впервые обнаружен ${bb.utils.humanizer(new Date() - new Date(userData.firstSeen), { largest: 2 })}`

		const result = [name, roles, subage, se, coins, rank, position]
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
