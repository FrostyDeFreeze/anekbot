const { exec, execSync } = require(`child_process`)

module.exports = {
	name: `bot`,
	access: [`Dev`],
	active: true,
	aliases: [],
	cooldown: 0,
	requires: [],
	async execute(client, ctx, utils) {
		const opt = ctx.args[0]?.toLowerCase()

		if (!opt) {
			return {
				text: `\u{1F534} Опция не указана`,
				reply: true
			}
		}

		const loadCommand = (cmd, action) => {
			const command = bb.commands.get(cmd)

			if (action === `load` && command) {
				return {
					text: `\u{1F534} Команда ${command.name} уже загружена`,
					reply: true
				}
			}

			if (action === `unload` && !command) {
				return {
					text: `\u{1F534} Команда ${cmd} не загружена/найдена`,
					reply: true
				}
			}

			if (action === `reload`) {
				bb.commands.delete(cmd)
			}

			const newCommand = require(`./${cmd}.js`)

			if (!newCommand) {
				return {
					text: `\u{1F534} Не удалось найти файл с названием ${cmd}`,
					reply: true
				}
			}

			bb.commands.add(newCommand)

			return {
				text: `\u{1F7E2} Команда ${cmd} успешно ${action === `load` ? `загружена` : `перезагружена`}`,
				reply: true
			}
		}

		switch (opt) {
			case `load`:
			case `unload`:
			case `reload`: {
				const cmd = ctx.args[1]?.toLowerCase()

				if (!cmd) {
					return {
						text: `\u{1F534} Название команды не указано`,
						reply: true
					}
				}

				return loadCommand(cmd, opt)
			}

			case `pull`: {
				const res = execSync(`git pull`).toString().split(`\n`).filter(Boolean)

				if (res.includes(`Already up to date.`)) {
					return {
						text: `\u{1F534} Изменений не обнаружено`,
						reply: true
					}
				}

				return {
					text: `\u{1F7E2} ${res.join(` | `)}`,
					reply: true
				}
			}

			case `restart`: {
				const res = execSync(`git pull`).toString().split(`\n`).filter(Boolean)
				const msg = res.includes(`Already up to date.`)
					? `\u{1F534} Изменений не обнаружено, перезапуск без изменений`
					: `\u{1F7E2} ${res.join(` | `)}`

				await ctx.send(msg, true)
				exec(`pm2 restart anekbot`)
				break
			}

			case `exec`: {
				const cmd = ctx.args.slice(1).join(` `)

				if (!cmd) {
					return {
						text: `\u{1F534} Необходимо указать код для выполнения`,
						reply: true
					}
				}

				exec(cmd, error => {
					if (error) {
						return {
							text: `\u{1F534} ${error}`,
							reply: true
						}
					}
				})
				break
			}

			default:
				return {
					text: `\u{1F534} Опция указана неверно`,
					reply: true
				}
		}
	}
}
