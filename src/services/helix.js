const got = require(`got`)

const helix = got.extend({
	prefixUrl: `https://api.twitch.tv/helix`,
	throwHttpErrors: false,
	responseType: `json`,
	headers: {
		authorization: `Bearer ${bb.config.Twitch.OAuth}`,
		'client-id': bb.config.Twitch.ClientID
	}
})

module.exports = {
	helix,
	getUsersByID: async function (ids) {
		const { body } = await helix.get(`users?id=${ids.join(`&id=`)}`)
		const arr = body.data.map(i => i.login)
		return arr
	},
	getUsersByLogin: async function (logins) {
		const { body } = await helix.get(`users?login=${logins.join(`&login=`)}`)
		const arr = body.data.map(i => i.id)
		return arr
	},
	whisper: async function (userID, message) {
		return helix.post(`whispers?from_user_id=${bb.config.Bot.ID}&to_user_id=${userID}`, {
			throwHttpErrors: true,
			json: { message: message }
		})
	}
}
