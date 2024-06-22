const { client } = require(`./src/misc/connection.js`)
const { paste, upload } = require(`./src/utils/utils.js`)

const fs = require(`fs`)
const path = require(`path`)
const cron = require(`node-cron`)
const got = require(`got`)
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
bb.misc.channels = [
	`239373609`,
	`739044027`,
	`509583526`,
	`753723636`,
	`931338266`,
	`405731639`,
	`236605657`,
	`700957107`,
	`86811418`,
	`770088711`,
	`447568190`,
	`452164565`,
	`596589808`
]
bb.misc.admins = [`799145942`, `239373609`, `739044027`, `509583526`, `753723636`, `452164565`]

client.on(`ready`, async () => {
	bb.logger.info(`Successfully connected to TMI!`)

	await bb.utils.joiner()
	setInterval(bb.utils.joiner, 300_000)

	client.privmsg(bb.config.Bot.Login, `nyam`)
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

// cron.schedule(`0 */2 * * *`, async () => {
// const pronouns = [
// 	`Баклан`,
// 	`Баламошка`,
// 	`Баран`,
// 	`Бзыря`,
// 	`Выхухоль`,
// 	`Глуподырый`,
// 	`Дуболом`,
// 	`Дура`,
// 	`Дурак`,
// 	`Захухря`,
// 	`Идиот`,
// 	`Клоун`,
// 	`Коза`,
// 	`Лох`,
// 	`Мимозыря`,
// 	`Негораздок`,
// 	`Оболтус`,
// 	`Овца`,
// 	`Остолоп`,
// 	`Охламон`,
// 	`Пентюх`,
// 	`Придурок`,
// 	`Пустослов`,
// 	`Пыня`,
// 	`Тартыга`,
// 	`Тетеря`,
// 	`Тефтеля`,
// 	`Фрик`,
// 	`Фуфлыга`,
// 	`Хрящ`,
// 	`Чушпан`,
// 	`Чёрт`
// ]

// 	const channel = bb.utils.randArr(Array.from(bb.client.joinedChannels).filter(i => i !== bb.config.Bot.Login))
// 	const chatters = await bb.services.gql.getChatters(channel)
// 	const data = chatters.data.user.channel.chatters
// 	const all = Object.values(data)
// 		.flat()
// 		.map(i => i.login)
// 		.filter(i => i !== undefined)
// 		.filter(i => i !== bb.config.Bot.Login)
// 	const chatter = bb.utils.randArr(all)

// 	return bb.client.privmsg(channel, `${bb.utils.randArr(pronouns)} на следующие 2 часа — ${chatter} :tf:`)
// })

cron.schedule(`0 3 * * *`, () => {
	bb.client.privmsg(`zhestykey`, `$$cookie YummyCummies`)
})

bb.misc.currExp = null
bb.misc.currAns = null
bb.misc.expChannel = null

cron.schedule(`0 */4 * * *`, () => {
	bb.utils.sendExp()
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
		send: async function (message, reply, emoji, action, channel) {
			let id = this.msg.id ? this.msg.id : ``

			if (this.msg.raw.includes(`reply-parent-msg-id=`)) {
				const match = /reply-parent-msg-id=([^;]+)/i.exec(this.msg.raw)
				if (match) {
					id = match[1]
				}
			}

			const findEmoji = emoji ? bb.utils.coins.getUser(this.user.id, this.channel.id)?.emoji : false
			const findAction = action ? bb.utils.findActionsData(this.user.id)?.colorRes : false

			message = bb.utils.fit(message, 470)
			reply = reply ? `;reply-parent-msg-id=${id}` : ``
			emoji = findEmoji ? `${findEmoji} ` : ``
			action = findAction ? `.me ` : ``
			channel = channel ? channel : this.channel.login

			client.sendRaw(`@sent-ts=${ts}${reply} PRIVMSG #${channel} :${action}${emoji}${message}`)
		}
	}

	if (ctx.user.id === bb.config.Bot.ID) return

	if (ctx.tags[`reply-parent-user-login`] && ctx.tags[`reply-parent-msg-body`]) {
		const display = ctx.tags[`reply-parent-display-name`]
		const remainder = ctx.msg.text.slice(display.length + 2)
		const parent = ctx.tags[`reply-parent-msg-body`]
		ctx.msg.text = `${remainder} ${parent}`
	}

	// if (ctx.user.id === `100135110` && ctx.channel.id === `739044027`) {
	// 	if (ctx.msg.text.includes(`По моим подсчётам сегодня ты топчик`)) {
	// 		const responses = [`Он тебя обманул`, `Продолжай ему верить`, `Сделаю вид, что согласен`]
	// 		return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
	// 	}
	// 	if (ctx.msg.text.includes(`По моим подсчётам сегодня ты нечто среднее между топчик и не топчик`)) {
	// 		const responses = [`Наполовину правда`, `Не отчаивайся, завтра тебе перестанут врать`, `Среднее не считается`]
	// 		return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
	// 	}
	// 	if (ctx.msg.text.includes(`По моим подсчётам сегодня ты не топчик`)) {
	// 		const responses = [`Полностью согласен с коллегой`, `Ты чертовски прав, мой дорогой друг`, `Выпьем в честь этого`]
	// 		return ctx.send(bb.utils.randArr(responses), true, `alicee_n`)
	// 	}
	// }

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
			lastSeen: new Date(),
			lastGuess: 0,
			lastPromocode: 0
		}
	} else {
		if (coinsData[ctx.channel.id].users[ctx.user.id].login !== ctx.user.login) {
			coinsData[ctx.channel.id].users[ctx.user.id].login = ctx.user.login
		}

		if (!coinsData[ctx.channel.id].users[ctx.user.id]?.lastSeen || coinsData[ctx.channel.id].users[ctx.user.id]?.lastSeen !== new Date()) {
			coinsData[ctx.channel.id].users[ctx.user.id].lastSeen = new Date()
		}

		coinsData[ctx.channel.id].users[ctx.user.id].coins += 0.2
		coinsData[ctx.channel.id].users[ctx.user.id].messages += 1
	}

	// saveData
	bb.utils.coins.saveData(coinsData)

	ctx.args = ctx.msg.text.slice(bb.config.Bot.Prefix.length).trim().split(/ +/)
	ctx.command = ctx.args.shift().toLowerCase()

	const quizData = bb.utils.coins.loadQuizData()

	if (
		ctx.command === `принять` &&
		quizData[ctx.channel.id] &&
		quizData[ctx.channel.id].opponent === ctx.user.login &&
		!quizData[ctx.channel.id].accepted
	) {
		clearTimeout(bb.misc.quizTimer)
		quizData[ctx.channel.id].accepted = true
		bb.utils.coins.saveQuizData(quizData)

		ctx.send(
			`\u{1F9E9} @${quizData[ctx.channel.id].challenger}, @${ctx.user.login} принял(а) игру. Приготовьтесь. Для ответа на квиз используйте ${
				bb.config.Bot.Prefix
			}ответ <вариант ответа>. Победитель получит от 30 до 60 монет`
		)

		try {
			const res = await got(`https://the-trivia-api.com/v2/questions?limit=1&difficulties=easy,medium&region=RU&types=text_choice`).json()
			const question = await bb.utils.translate(res[0].question.text, `en`, `ru`)
			const answers = await bb.utils.translate(res[0].incorrectAnswers.join(` \u{2027} `), `en`, `ru`)
			const difficulty = await bb.utils.translate(res[0].difficulty, `en`, `ru`)
			const correct = await bb.utils.translate(res[0].correctAnswer, `en`, `ru`)
			const arr = bb.utils.addAndShuffle(correct.translation, answers.translation.split(` \u{2027} `))

			const questionMessage = `\u{1F9E9} @${ctx.user.login}, @${quizData[ctx.channel.id].challenger} \u{2027} Вопрос: ${
				question.translation
			} \u{2027} Варианты: ${arr.join(` \u{2027} `)} \u{2027} Сложность: ${difficulty.translation}`
			ctx.send(questionMessage)

			quizData[ctx.channel.id].question = res[0]
			quizData[ctx.channel.id].shuffledAnswers = arr
			quizData[ctx.channel.id].correctAnswer = correct.translation
			quizData[ctx.channel.id].startTime = Date.now()
			bb.utils.coins.saveQuizData(quizData)

			bb.logger.info(
				`[QUIZ] Q: ${question.translation} \u{2027} O: ${arr.join(` \u{2027} `)} \u{2027} D: ${difficulty.translation} | Channel: ${
					ctx.channel.login
				} | Answer: ${correct.translation}`
			)
		} catch (e) {
			bb.logger.error(`[QUIZ] ${e.message}`)
			ctx.send(`\u{1F534} ${e.message}`)
		}
	}

	if (
		ctx.command === `ответ` &&
		quizData[ctx.channel.id] &&
		quizData[ctx.channel.id].accepted &&
		(quizData[ctx.channel.id].challenger === ctx.user.login || quizData[ctx.channel.id].opponent === ctx.user.login)
	) {
		const answer = ctx.args.join(` `)

		if (!answer) {
			return ctx.send(`\u{1F9E9} @${ctx.user.login}, необходимо один из вариантов ответа`)
		}

		const rightAnswer = quizData[ctx.channel.id].correctAnswer
		let reward = null

		if (quizData[ctx.channel.id].question.difficulty === `easy`) {
			reward = 30
		}

		if (quizData[ctx.channel.id].question.difficulty === `medium`) {
			reward = 60
		}

		if (answer.toLowerCase() === rightAnswer.toLowerCase()) {
			ctx.send(`\u{1F9E9} @${ctx.user.login} ответил(а) правильно и выиграл(а)! За победу начислил ${reward} монет`)
			delete quizData[ctx.channel.id]
			bb.utils.coins.addCoins(ctx.user.id, ctx.channel.id, reward)
			bb.utils.coins.saveQuizData(quizData)
		} else {
			ctx.send(`\u{1F9E9} @${ctx.user.login} ответил(а) неправильно!`)
		}
	}

	if (ctx.command === `cl` && ctx.channel.id === `405731639` && ctx.user.id === `405731639`) {
		for (let i = 0; i < 200; i++) {
			ctx.send(`.clear`)
			await bb.utils.sleep(30)
		}
	}

	if (ctx.command === `123` && ctx.channel.id === `239373609`) {
		ctx.send(`Иди нахуй be`, true)
	}

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
			if (command.cooldown && ctx.user.id !== bb.config.Dev.ID) {
				bb.utils.cooldown.set(key, command.cooldown * 1000)
			}

			const result = await command.execute(bb.client, ctx, bb.utils)

			if (result) {
				await ctx.send(result.text.replace(/\n|\r/g, ` `), result.reply, result.emoji, result.action, result.channel)
			}

			bb.misc.issuedCommands++
			bb.logger.info(`[COMMAND] ${ctx.user.login} executed ${command.name} in ${ctx.channel.login}`)
		} catch (e) {
			bb.logger.error(`[COMMAND] Execution error: ${e.message || `N/A`} | ${command.name} by ${ctx.user.login} in #${ctx.channel.login}`)
			await ctx.send(`\u{1F534} ${e.message || `Выполнение команды привело к неожиданной ошибке`}`, true)
		}
	}
})
