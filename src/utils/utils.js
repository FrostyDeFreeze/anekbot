const got = require(`got`)
const { translate } = require(`bing-translate-api`)
const humanize = require(`humanize-duration`)

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
	const paste = await got.post(`https://p.dankfreeze.xyz/documents`, { body: text }).json()
	return raw ? `https://p.dankfreeze.xyz/raw/${paste.key}` : `https://p.dankfreeze.xyz/${paste.key}`
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
	return word.split(``).sort(function () { return 0.5 - Math.random() }).join(``)
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

exports.unping = user => `${user[0]}\u{E0000}${user.slice(1)}`

exports.upload = async (text, type) => {
	const url = `https://i.dankfreeze.xyz/paste`
	let content = text

	if (type) {
		content = JSON.stringify(text, null, 2)
	}

	const paste = await got.post(url, { json: { text: content.toString() } })
	return paste.body
}
