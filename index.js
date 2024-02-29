const { client } = require(`./src/misc/connection.js`)
const { paste, upload } = require(`./src/utils/utils.js`)

const fs = require(`fs`)
const path = require(`path`)
const coinsPath = path.join(__dirname, `./src/data/coins.json`)
const promoPath = path.join(__dirname, `./src/data/promocodes.json`)

global.bb = {}
bb.misc = {}

bb.client = client
bb.commands = require(`./src/misc/commands.js`)
bb.config = require(`./config.json`)
bb.services = require(`./src/services/index.js`)
bb.utils = require(`./src/utils/index.js`)
bb.logger = require(`./src/utils/logger.js`)
bb.paste = paste
bb.upload = upload

bb.misc.connectedAt = new Date().toString()
bb.misc.issuedCommands = 1
bb.misc.channels = [`239373609`, `931338266`, `739044027`, `509583526`, `799145942`, `753723636`]
bb.misc.admins = [`799145942`, `739044027`, `509583526`, `753723636`]

client.on(`ready`, async () => {
	bb.logger.info(`Successfully connected to TMI!`)

	await bb.utils.joiner()
	setInterval(bb.utils.joiner, 300_000)
})

client.on(`close`, async error => {
	if (error) {
		return bb.logger.error(`Client closed due to error: ${error}`)
	}

	bb.logger.error(`Client closed without an error`)
})

client.on(`JOIN`, async ({ channelName }) => {
	client.joinedChannels.add(channelName)
	bb.logger.info(`[JOIN] Joined ${channelName} | Channels: ${client.joinedChannels.size + 1}`)
})

client.on(`PART`, ({ channelName }) => {
	client.joinedChannels.delete(channelName)
	bb.logger.info(`[PART] Parted ${channelName} | Channels: ${client.joinedChannels.size - 1}`)
})

client.on(`PRIVMSG`, async msg => {
	const ts = Date.now()

	const ctx = {
		user: {
			id: msg.senderUserID,
			login: msg.senderUsername,
			name: msg.displayName,
			color: msg.colorRaw,
			badges: msg.badgesRaw,
			perms: { mod: msg.isMod, broadcaster: msg.badges.hasBroadcaster, vip: msg.badges.hasVIP }
		},
		channel: {
			id: msg.channelID,
			login: msg.channelName
		},
		msg: {
			id: msg.messageID,
			text: msg.messageText.replace(bb.utils.regex.invis, ``),
			raw: msg.rawSource
		},
		emotes: msg.emotes,
		tags: msg.ircTags,
		prefix: bb.config.Bot.Prefix,
		timestamp: msg.serverTimestampRaw,
		send: async function (message, reply, channel) {
			let id = this.msg.id ? this.msg.id : ``
			if (this.msg.raw.includes(`reply-parent-msg-id=`)) {
				const match = /reply-parent-msg-id=([^;]+)/i.exec(this.msg.raw)
				if (match) {
					id = match[1]
				}
			}
			message = bb.utils.fit(message, 470)
			reply = reply ? `;reply-parent-msg-id=${id}` : ``
			channel = channel ? channel : this.channel.login

			client.sendRaw(`@sent-ts=${ts}${reply} PRIVMSG #${channel} :${message}`)
		}
	}

	if (ctx.user.id === bb.config.Bot.ID) return

	if (ctx.tags[`reply-parent-user-login`] && ctx.tags[`reply-parent-msg-body`]) {
		const display = ctx.tags[`reply-parent-display-name`]
		const remainder = ctx.msg.text.slice(display.length + 2)
		const parent = ctx.tags[`reply-parent-msg-body`]
		ctx.msg.text = `${remainder} ${parent}`
	}

	if (!fs.existsSync(coinsPath)) {
		fs.writeFileSync(coinsPath, `{}`)
	}

	if (!fs.existsSync(promoPath)) {
		fs.writeFileSync(promoPath, `{}`)
	}

	// coinsData
	const coinsData = bb.utils.coins.loadData()

	// channelData
	if (!coinsData[ctx.channel.id]) {
		coinsData[ctx.channel.id] = {
			login: ctx.channel.login,
			promocode: null,
			users: {}
		}
	} else {
		if (coinsData[ctx.channel.id].login !== ctx.channel.login) {
			coinsData[ctx.channel.id].login = ctx.channel.login
		}
	}

	// userData
	if (!coinsData[ctx.channel.id].users[ctx.user.id]) {
		coinsData[ctx.channel.id].users[ctx.user.id] = {
			id: ctx.user.id,
			login: ctx.user.login,
			coins: 0.2,
			rank: 0,
			messages: 1,
			firstSeen: new Date(),
			lastGuess: 0,
			lastPromocode: 0
		}
	} else {
		if (coinsData[ctx.channel.id].users[ctx.user.id].login !== ctx.user.login) {
			coinsData[ctx.channel.id].users[ctx.user.id].login = ctx.user.login
		}

		coinsData[ctx.channel.id].users[ctx.user.id].coins += 0.2
		coinsData[ctx.channel.id].users[ctx.user.id].messages += 1
	}

	// saveData
	bb.utils.coins.saveData(coinsData)

	ctx.args = ctx.msg.text.slice(bb.config.Bot.Prefix.length).trim().split(/ +/)
	ctx.command = ctx.args.shift().toLowerCase()

	const command = bb.commands.get(ctx.command)

	if (command) {
		const key = `${command.name}-${ctx.user.id}`

		if (bb.utils.cooldown.has(key) || !ctx.msg.text.toLowerCase().startsWith(bb.config.Bot.Prefix)) {
			return
		}

		const { access, active, requires } = command

		const channelState = bb.client.userStateTracker.channelStates[ctx.channel.login]

		if (access && ctx.user.id !== bb.config.Dev.ID) {
			if (access.includes(`Dev`)) return
			if (access.includes(`Mod`) && !ctx.user.perms.mod) return
			if (access.includes(`Admin`) && !bb.misc.admins.includes(ctx.user.id)) return
		}

		if (!active && ctx.user.id !== bb.config.Dev.ID) return

		if (requires) {
			if (requires.includes(`Mod`) && !channelState.isMod) {
				return ctx.send(`Мне необходимо быть модератором для выполнения этого действия`, true)
			}
		}

		try {
			if (command.cooldown && ctx.user.id !== bb.config.Dev.ID && !bb.misc.admins.includes(ctx.user.id)) {
				bb.utils.cooldown.set(key, command.cooldown * 1000)
			}

			const result = await command.execute(bb.client, ctx, bb.utils)

			if (result) {
				await ctx.send(result.text.replace(/\n|\r/g, ` `), result.reply, result.channel)
			}

			bb.misc.issuedCommands++
			bb.logger.info(`[COMMAND] ${ctx.user.login} executed ${command.name} in ${ctx.channel.login}`)
		} catch (e) {
			bb.logger.error(`[COMMAND] Execution error: ${e.message || `N/A`} | ${command.name} by ${ctx.user.login} in #${ctx.channel.login}`)
			await ctx.send(`\u{1F534} ${e.message || `Выполнение команды привело к неожиданной ошибке`}`, true)
		}
	}
})
