const got = require(`got`)
const fs = require(`fs`)
const { exec } = require(`child_process`)

module.exports = {
	name: `eval`,
	access: [`Dev`],
	active: true,
	aliases: [`js`],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		if (!ctx.args.length) {
			return {
				text: `\u{1F534}`,
				reply: false
			}
		}

		let js

		try {
			if (ctx.args[0].startsWith(`http`)) {
				const res = await got(ctx.args[0])
				js = await eval(`(async () => {  ${res.body} })()`)
			} else {
				js = await eval(`(async () => { ${ctx.args.join(` `)} })()`)
			}

			if (js === undefined) {
				return
			}

			if (typeof js === `object`) {
				js = JSON.stringify(js)
			}

			bb.logger.info(`[JS] ${js}`)

			return {
				text: String(js),
				reply: false
			}
		} catch (e) {
			bb.logger.error(`[${this.name.toUpperCase()}] ${e.message}`)
			return {
				text: `\u{1F534} ${e.message.split(`\n`)[0]}`,
				reply: false
			}
		}
	}
}
