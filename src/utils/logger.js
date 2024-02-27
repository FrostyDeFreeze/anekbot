const { addColors, createLogger, format, transports } = require(`winston`)
const { combine, colorize, printf, timestamp } = format
const util = require(`util`)

const levels = {
	colors: {
		info: `green`,
		error: `underline bold red`,
		debug: `bold magenta`,
		warn: `yellow`
	}
}

const logFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)

const winston = createLogger({
	format: combine(
		format(info => {
			info.level = info.level.toUpperCase()
			return info
		})(),
		timestamp({
			format: `DD.MM.YY HH:mm:ss.SSS`
		}),
		colorize(),
		logFormat
	),
	transports: [
		new transports.Console({
			stderrLevels: [`error`],
			colorize: true
		})
	]
})

addColors(levels.colors)

const logger = {
	info: (...args) => winston.info(...args),
	error: (...args) => winston.error(...args),
	debug: (...args) => winston.debug(...args),
	warn: (...args) => winston.warn(...args),
	json: (...args) => winston.debug(util.inspect(...args))
}

module.exports = logger
