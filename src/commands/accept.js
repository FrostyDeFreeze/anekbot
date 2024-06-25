const got = require(`got`)

module.exports = {
	name: `accept`,
	access: [],
	active: true,
	aliases: [`принять`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		const quizData = bb.utils.coins.loadQuizData()

		if (!quizData[ctx.channel.id]) {
			return {
				text: `На данный момент на канале нет активного квиза`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (quizData[ctx.channel.id].opponent !== ctx.user.login) {
			return {
				text: `Вызов был брошен не тебе aga`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		if (quizData[ctx.channel.id].accepted) {
			return {
				text: `Вызов уже принят`,
				reply: true,
				emoji: true,
				action: true
			}
		}

		clearTimeout(bb.misc.acceptTimer)
		quizData[ctx.channel.id].accepted = true
		bb.utils.coins.saveQuizData(quizData)

		ctx.send(
			`\u{1F9E9} @${quizData[ctx.channel.id].challenger}, @${ctx.user.login} принял(а) игру. Приготовьтесь. Для ответа на квиз используйте ${bb.config.Bot.Prefix
			}ответ <номер варианта ответа>. Победитель получит от 30 до 60 монет`
		)

		bb.misc.quizTimer = setTimeout(() => {
			const quiz = bb.utils.coins.loadQuizData()

			if (quiz[ctx.channel.id].startTime !== null) {
				delete quiz[ctx.channel.id]
				bb.utils.coins.saveQuizData(quiz)

				ctx.send(
					`\u{1F9E9} @${quizData[ctx.channel.id].challenger}, @${ctx.user.login
					} игра окончена, так как никто не дал верный ответ в течение 45 секунд \u{2027} Правильный ответ: ${quizData[ctx.channel.id].correctAnswer
					}`
				)
			}
		}, 45_000)

		try {
			const res = await got(`https://the-trivia-api.com/v2/questions?limit=1&difficulties=easy,medium&region=RU&types=text_choice`).json()
			const question = await bb.utils.translate(res[0].question.text, `en`, `ru`)
			const answers = await bb.utils.translate(res[0].incorrectAnswers.join(` \u{2027} `), `en`, `ru`)
			const difficulty = await bb.utils.translate(res[0].difficulty, `en`, `ru`)
			const correct = await bb.utils.translate(res[0].correctAnswer, `en`, `ru`)
			const arr = bb.utils.addAndShuffle(correct.translation, answers.translation.split(` \u{2027} `))

			const numberedAnswers = arr.map((answer, index) => `${index + 1}) ${answer}`)

			const questionMessage = `\u{1F9E9} @${quizData[ctx.channel.id].challenger}, @${ctx.user.login} \u{2027} Вопрос: ${question.translation
				} \u{2027} Варианты: ${numberedAnswers.join(` \u{2027} `)} \u{2027} Сложность: ${difficulty.translation}`
			ctx.send(questionMessage)

			quizData[ctx.channel.id].question = res[0]
			quizData[ctx.channel.id].shuffledAnswers = arr
			quizData[ctx.channel.id].correctAnswer = correct.translation
			quizData[ctx.channel.id].correctIndex = arr.indexOf(correct.translation) + 1
			quizData[ctx.channel.id].startTime = Date.now()
			bb.utils.coins.saveQuizData(quizData)

			bb.logger.info(
				`[QUIZ] Q: ${question.translation} \u{2027} O: ${numberedAnswers.join(` \u{2027} `)} \u{2027} D: ${difficulty.translation
				} | Channel: ${ctx.channel.login} | Answer: ${correct.translation} | Index: ${arr.indexOf(correct.translation) + 1}`
			)
		} catch (e) {
			bb.logger.error(`[QUIZ] ${e.message}`)
			delete quizData[ctx.channel.id]
			bb.utils.coins.saveQuizData(quizData)
			ctx.send(`\u{1F534} ${e.message.replace(/\n|\r/g, ` `)}`)
		}
	}
}
