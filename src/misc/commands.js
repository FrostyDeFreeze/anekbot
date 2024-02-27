const fs = require(`fs`)

bb.misc.commands = new Map()
bb.misc.aliases = new Map()

exports.add = command => {
	if (!command.aliases) command.aliases = []

	bb.misc.commands.set(command.name, command)

	for (const alias of command.aliases) {
		bb.misc.aliases.set(alias, command.name)
	}
}

exports.delete = command => {
	bb.misc.commands.delete(command)

	const file = require.resolve(`../commands/${command}.js`)

	if (file) delete require.cache[file]
}

exports.get = commandName => {
	return bb.misc.commands.get(commandName) || bb.misc.commands.get(bb.misc.aliases.get(commandName))
}

const files = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(`.js`))

for (const file of files) {
	const command = require(`../commands/${file}`)
	this.add(command)
}
