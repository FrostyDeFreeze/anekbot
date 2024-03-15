const { client } = require(`./src/misc/connection.js`)
const { paste, upload } = require(`./src/utils/utils.js`)

const fs = require(`fs`)
const path = require(`path`)
const cron = require(`node-cron`)
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
bb.misc.channels = [`799145942`, `239373609`, `739044027`, `509583526`, `753723636`, `931338266`, `405731639`, `236605657`, `700957107`, `86811418`]
bb.misc.admins = [`799145942`, `239373609`, `739044027`, `509583526`, `753723636`, `452164565`]

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

cron.schedule(`0 */2 * * *`, async () => {
	const pronouns = [
		`Баклан`,
		`Баламошка`,
		`Баран`,
		`Бзыря`,
		`Выхухоль`,
		`Глуподырый`,
		`Дуболом`,
		`Дура`,
		`Дурак`,
		`Захухря`,
		`Идиот`,
		`Клоун`,
		`Коза`,
		`Лох`,
		`Мимозыря`,
		`Негораздок`,
		`Оболтус`,
		`Овца`,
		`Остолоп`,
		`Охламон`,
		`Пентюх`,
		`Придурок`,
		`Пустослов`,
		`Пыня`,
		`Тартыга`,
		`Тетеря`,
		`Тефтеля`,
		`Фрик`,
		`Фуфлыга`,
		`Хрящ`,
		`Чушпан`,
		`Чёрт`
	]

	const channel = bb.utils.randArr(Array.from(bb.client.joinedChannels).filter(i => i !== bb.config.Bot.Login))
	const chatters = await bb.services.gql.getChatters(channel)
	const data = chatters.data.user.channel.chatters
	const all = Object.values(data)
		.flat()
		.map(i => i.login)
	const chatter = bb.utils.randArr(all)

	return bb.client.privmsg(channel, `${bb.utils.randArr(pronouns)} на следующие 2 часа — ${chatter} :tf:`)
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

	if (ctx.user.id === `100135110` && ctx.channel.id === `739044027`) {
		if (ctx.msg.text.includes(`По моим подсчётам сегодня ты топчик`)) {
			const responses = [`Он тебя обманул`, `Продолжай ему верить`, `Сделаю вид, что согласен`]
			return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
		}
		if (ctx.msg.text.includes(`По моим подсчётам сегодня ты нечто среднее между топчик и не топчик`)) {
			const responses = [`Наполовину правда`, `Не отчаивайся, завтра тебе перестанут врать`, `Среднее не считается`]
			return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
		}
		if (ctx.msg.text.includes(`По моим подсчётам сегодня ты не топчик`)) {
			const responses = [`Полностью согласен с коллегой`, `Ты чертовски прав, мой дорогой друг`, `Выпьем в честь этого`]
			return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
		}
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
