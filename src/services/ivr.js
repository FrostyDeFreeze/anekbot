const got = require(`got`)

const ivr = got.extend({
	prefixUrl: `https://api.ivr.fi/v2/twitch`,
	throwHttpErrors: false,
	responseType: `json`
})

module.exports = {
	ivr,
	getUser: async function (user) {
		user = encodeURIComponent(user)
		let data = await ivr(`user?login=${user}`)

		if (!data.body[0]?.id) {
			data = await ivr(`user?id=${user}`)
			if (!data.body[0]?.id) {
				return
			}
		}

		return data.body[0]
	}
}
