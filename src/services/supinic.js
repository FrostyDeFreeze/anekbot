const got = require(`got`)

const supi = got.extend({
	prefixUrl: `https://supinic.com/api/`,
	throwHttpErrors: false,
	responseType: `json`,
	headers: {
		authorization: `Basic ${bb.config.Supinic.ID}:${bb.config.Supinic.OAuth}`
	}
})

module.exports = {
	supi
}
