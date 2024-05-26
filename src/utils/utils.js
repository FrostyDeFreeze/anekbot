const got = require(`got`)
const fs = require(`fs`)
const path = require(`path`)
const humanize = require(`humanize-duration`)
const { translate } = require(`bing-translate-api`)

const fmPath = path.join(__dirname, `../data/fm.json`)
const actionsPath = path.join(__dirname, `../data/actions.json`)

const shortHumanizer = humanize.humanizer({
	language: `shortRu`,
	languages: {
		shortRu: {
			y: () => `г`,
			mo: () => `мес`,
			w: () => `нед`,
			d: () => `д`,
			h: () => `ч`,
			m: () => `м`,
			s: () => `с`,
			ms: () => `мс`
		}
	}
})

exports.fit = (text, max) => {
	return text.length > max ? `${text.substring(0, max)}...` : text
}

exports.humanizer = (ms, options) => {
	return shortHumanizer(ms, {
		...options,
		round: true,
		spacer: ``,
		units: [`y`, `mo`, `d`, `h`, `m`, `s`]
	})
}

exports.joiner = async () => {
	const channels = await bb.services.helix.getUsersByID(bb.misc.channels)
	if (!bb.client.joinedChannels.has(channels)) {
		bb.client.joinAll(channels)
	}
}

exports.paste = async (text, raw) => {
	const paste = await got.post(`https://p.dankfreeze.space/documents`, { body: text }).json()
	return raw ? `https://p.dankfreeze.space/raw/${paste.key}` : `https://p.dankfreeze.space/${paste.key}`
}

exports.ping = async () => {
	const before = Date.now()
	await bb.client.ping()
	return Date.now() - before
}

exports.parseUser = user => {
	return user.replace(/[@#():,.\/\\]/g, ``).toLowerCase()
}

exports.randArr = array => {
	return array[~~(Math.random() * array.length)]
}

exports.shuffleWord = word => {
	return word
		.split(``)
		.sort(function () {
			return 0.5 - Math.random()
		})
		.join(``)
}

exports.sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

exports.translate = async (text, from, to) => {
	if (!from) from = null
	if (!to) to = `ru`
	const translation = await translate(text, from, to)
	return translation
}

exports.ucLen = str => {
	let len = 0
	for (let index of str) {
		let point = str.codePointAt(index)
		let width = 0
		while (point) {
			width += 1
			point >>= 8
		}
		index += Math.round(width * 0.5)
		len += 1
	}
	return len
}

exports.unping = user => `${user[0]}\u{E0000}${user.slice(1)}`

exports.upload = async (text, type) => {
	const url = `https://i.dankfreeze.space/paste`
	let content = text

	if (type) {
		content = JSON.stringify(text, null, 2)
	}

	const paste = await got.post(url, { json: { text: content.toString() } })
	return paste.body
}

exports.saveFMData = data => {
	fs.writeFileSync(fmPath, JSON.stringify(data))
}

exports.loadFMData = () => {
	return fs.existsSync(fmPath) ? JSON.parse(fs.readFileSync(fmPath, `utf8`)) : {}
}

exports.findFMData = twitchLogin => {
	const fmData = this.loadFMData()

	for (const userID in fmData) {
		if (fmData.hasOwnProperty(userID)) {
			if (fmData[userID].twitchLogin === twitchLogin) {
				return fmData[userID]
			}
		}
	}

	return null
}

exports.saveActionsData = data => {
	fs.writeFileSync(actionsPath, JSON.stringify(data))
}

exports.loadActionsData = () => {
	return fs.existsSync(actionsPath) ? JSON.parse(fs.readFileSync(actionsPath, `utf8`)) : {}
}

exports.findActionsData = userID => {
	const actionsData = this.loadActionsData()

	if (actionsData.hasOwnProperty(userID)) {
		return actionsData[userID]
	}

	return null
}

// exports.generateEquation = () => {
// 	const type = Math.floor(Math.random() * 3)
// 	let problem
// 	let answer

// 	switch (type) {
// 		case 0: {
// 			// Линейное уравнение ax + b = 0
// 			const a1 = Math.floor(Math.random() * 10) + 1
// 			const b1 = Math.floor(Math.random() * 20) - 10
// 			problem = `${a1}x + ${b1} = 0`
// 			answer = [-b1 / a1]
// 			break
// 		}

// 		case 1: {
// 			// Квадратное уравнение ax^2 + bx + c = 0
// 			let a2, b2, c2, discriminant
// 			do {
// 				a2 = Math.floor(Math.random() * 5) + 1
// 				b2 = Math.floor(Math.random() * 10) - 5
// 				c2 = Math.floor(Math.random() * 10) - 5
// 				discriminant = b2 * b2 - 4 * a2 * c2
// 			} while (discriminant < 0)

// 			const root1 = (-b2 + Math.sqrt(discriminant)) / (2 * a2)
// 			const root2 = (-b2 - Math.sqrt(discriminant)) / (2 * a2)
// 			problem = `${a2}x^2 + ${b2}x + ${c2} = 0`
// 			answer = [root1, root2]
// 			break
// 		}

// 		case 2: {
// 			// Уравнение с двумя переменными ax + by = c
// 			const a3 = Math.floor(Math.random() * 10) + 1
// 			const b3 = Math.floor(Math.random() * 10) + 1
// 			const x = Math.floor(Math.random() * 10) + 1
// 			const y = Math.floor(Math.random() * 10) + 1
// 			const c3 = a3 * x + b3 * y
// 			problem = `${a3}x + ${b3}y = ${c3}`
// 			answer = [x, y]
// 			break
// 		}
// 	}

// 	// Округление ответов до 2 знаков после запятой, если необходимо
// 	answer = answer.map(num => Math.round(num * 100) / 100)

// 	return { problem, answer }
// }

exports.generateEquation = () => {
	const type = Math.floor(Math.random() * 4)
	let problem
	let answer

	switch (type) {
		case 0: {
			// Линейное уравнение ax + b = 0
			const a1 = Math.floor(Math.random() * 10) + 1
			const b1 = Math.floor(Math.random() * 20) - 10
			problem = `${a1}x + ${b1} = 0`
			answer = [-b1 / a1]
			break
		}

		case 1: {
			// Простой пример на сложение
			const a2 = Math.floor(Math.random() * 100) + 1
			const b2 = Math.floor(Math.random() * 100) + 1
			problem = `${a2} + ${b2}`
			answer = [a2 + b2]
			break
		}

		case 2: {
			// Простой пример на вычитание
			const a3 = Math.floor(Math.random() * 100) + 1
			const b3 = Math.floor(Math.random() * 100) + 1
			problem = `${a3} - ${b3}`
			answer = [a3 - b3]
			break
		}

		case 3: {
			// Простой пример на умножение
			const a4 = Math.floor(Math.random() * 15) + 1
			const b4 = Math.floor(Math.random() * 15) + 1
			problem = `${a4} * ${b4}`
			answer = [a4 * b4]
			break
		}

		case 4: {
			// Простой пример на деление
			const a5 = Math.floor(Math.random() * 100) + 1
			const b5 = Math.floor(Math.random() * 9) + 1 // Исключаем деление на 0
			problem = `${a5} / ${b5}`
			answer = [a5 / b5]
			break
		}

		case 5: {
			// Уравнение с двумя переменными ax + by = c
			const a6 = Math.floor(Math.random() * 10) + 1
			const b6 = Math.floor(Math.random() * 10) + 1
			const x = Math.floor(Math.random() * 10) + 1
			const y = Math.floor(Math.random() * 10) + 1
			const c6 = a6 * x + b6 * y
			problem = `${a6}x + ${b6}y = ${c6}`
			answer = [x, y]
			break
		}
	}

	// Округление ответов до 2 знаков после запятой, если необходимо
	answer = answer.map(num => Math.round(num * 100) / 100)

	return { problem, answer }
}

exports.sendExp = () => {
	const { problem, answer } = this.generateEquation()
	const channel = this.randArr(Array.from(bb.client.joinedChannels).filter(i => i !== bb.config.Bot.Login))

	bb.misc.currExp = problem
	bb.misc.currAns = answer
	bb.misc.expChannel = channel

	bb.logger.info(`Problem: ${problem} | Answer: ${answer} | Channel: ${channel}`)

	bb.client.privmsg(
		channel,
		`.announce \u{1F9EE} Пример для решения: ${problem} \u{2027} За правильный ответ самый быстрый получает 100 монет \u{2027} Для решения используйте команду ${bb.config.Bot.Prefix}answer <ответ> \u{2027} Ответы записываются через пробел, округляются до двух знаков после точки в большую сторону`
	)
}

exports.cleanText = input => {
	// Remove HTML tags
	let cleaned = input.replace(/<\/?[^>]+(>|$)/g, ``)

	// Remove Markdown elements like bold, italic, headings, links, images, etc.
	// Markdown patterns to remove:
	// * **bold** or __bold__
	// * *italic* or _italic_
	// * # Headings
	// * [link](url) and ![image](url)
	// * `inline code` and ```code blocks```
	// * > blockquotes
	// * Lists (e.g., * item, - item, 1. item)
	// * Horizontal rules (e.g., --- or ***)

	// Remove bold, italic, and inline code
	cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, `$2`) // **bold** or __bold__
	cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, `$2`) // *italic* or _italic_
	cleaned = cleaned.replace(/`(.*?)`/g, `$1`) // `inline code`

	// Remove headings
	cleaned = cleaned.replace(/^#{1,6}\s+/gm, ``)

	// Remove links and images
	cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, ``) // ![image](url)
	cleaned = cleaned.replace(/\[.*?\]\(.*?\)/g, ``) // [link](url)

	// Remove blockquotes
	cleaned = cleaned.replace(/^\s*>\s?/gm, ``)

	// Remove lists
	cleaned = cleaned.replace(/^\s*[*+-]\s+/gm, ``) // Unordered list
	cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, ``) // Ordered list

	// Remove horizontal rules
	cleaned = cleaned.replace(/^\s*(---|\*\*\*)\s*$/gm, ``)

	// Remove code blocks
	cleaned = cleaned.replace(/```[\s\S]*?```/g, ``)

	return cleaned
}
