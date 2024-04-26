const data = require(`../data/holidays.json`)

module.exports = {
	name: `holiday`,
	access: [],
	active: true,
	aliases: [`hd`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const regex = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/

		const format = date => {
			const [month, day] = date.split(`-`)
			const formattedDate = `${parseInt(month, 10)}-${parseInt(day, 10)}`
			return formattedDate
		}

		const currDate = new Date().toLocaleString(`en-US`, { timeZone: `Europe/Moscow` })
		const currMonth = new Date(currDate).getMonth() + 1
		const currDay = new Date(currDate).getDate()
		const formatted = format(`${currMonth}-${currDay}`)

		let targetDate = formatted

		if (ctx.args.length && ctx.args[0].match(regex)) {
			targetDate = format(ctx.args[0])
		}

		const holidays = data.filter(item => {
			const itemDate = format(`${item.date[0]}-${item.date[1]}`)
			return itemDate === targetDate
		})

		const text = holidays.length
			? `${targetDate}: ${holidays.map(item => item.name).join(` \u{2027} `)} HolidayLog`
			: `${targetDate}: Праздников нет PoroSad`

		return {
			text: text,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
