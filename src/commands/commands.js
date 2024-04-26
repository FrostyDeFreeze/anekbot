module.exports = {
	name: `commands`,
	access: [],
	active: true,
	aliases: [`help`, `помощь`, `команды`],
	cooldown: 3,
	requires: [],
	async execute(client, ctx, utils) {
		return {
			text: `Список моих команд и другая полезная информация: https://i.dankfreeze.space/boomboty.txt anek02Knife`,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
