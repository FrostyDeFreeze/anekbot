const Twitch = require(`@kararty/dank-twitch-irc`)
const config = require(`../../config.json`)

const client = new Twitch.ChatClient({
	username: config.Bot.Login,
	password: config.Twitch.OAuth,
	rateLimits: `verifiedBot`,
	maxChannelCountPerConnection: 1,
	connectionRateLimits: {
		parallelConnections: 400,
		releaseTime: 10
	},
	ignoreUnhandledPromiseRejections: true
})

client.use(new Twitch.AlternateMessageModifier(client))

client.connect()

exports.client = client
