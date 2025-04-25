const got = require(`got`)

const gptURL = `https://api.proxyapi.ru/openai/v1/chat/completions`

const gpt = async (prompt, tokens, temp, content) => {
	const options = {
		headers: {
			Authorization: `Bearer ${bb.config.API.ProxyAPI}`,
			'Content-Type': `application/json`
		},
		throwHttpErrors: false,
		json: {
			model: `gpt-4.1-nano`,
			messages: [
				{
					role: `system`,
					content:
						content ||
						`Ты выступаешь в роли полезного помощника и хорошего знакомого. В своих ответах можешь шутить и использовать мат. Ты отвечаешь в чат Twitch, так что игнорируй темы, которые могут затронуть чувства какой-либо расы или меньшинства. Можешь использовать эмодзи, а также шутить в своих ответах, но если попросят ответить серьёзно или обязательно, выполни эту просьбу. Постарайся отвечать в пределах 500 символов.`
				},
				{
					role: `user`,
					content: prompt
				}
			],
			max_tokens: Number(tokens) || 150,
			temperature: Number(temp) || 0.8
		}
	}

	return await got.post(gptURL, options)
}

module.exports = {
	gpt
}
