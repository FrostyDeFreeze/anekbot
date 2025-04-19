const userList = {
	'15-01': [`Саша (whxducky)`],
	'26-01': [`Геля (g1shiny)`],
	'28-01': [`Лера (vlerxq)`],
	'31-01': [`Дуня (feechkkaa_)`],
	'03-02': [`Маря (immaryqop)`],
	'04-02': [`Даша (ricus_s)`],
	'07-02': [`Петра (petra_devilx7)`],
	'10-02': [`Арина (tvoya_eblanka229)`],
	'12-02': [`Тим (cpp16)`],
	'16-02': [`Сеня (detective_midnight)`],
	'25-02': [`Ева (grebok06)`],
	'26-02': [`Соня (slybi6aju)`, `Настя (NASTAZZIA_)`],
	'01-03': [`Никита (pelmen4ees)`],
	'03-03': [`Даня (dan1lew)`],
	'07-03': [`Серёжа (darksy72)`],
	'12-03': [`Даня (zhestykey)`],
	'13-03': [`Ден (arctica_)`],
	'14-03': [`Никита (viperrr1441)`, `Соня (sakera_hirose)`],
	'16-03': [`Славик (bershkal)`],
	'18-03': [`Ерлан (felugoz)`],
	'19-03': [`Костя (cokeberrt)`],
	'23-03': [`Огонёк (ogonekk101)`],
	'27-03': [`Рома (qdilex3)`],
	'02-04': [`Олеся (ylllasticst)`],
	'07-04': [`Гоша (aventty)`, `Тим (kozvel)`],
	'08-04': [`Кринга (la_cringa)`],
	'10-04': [`Луиза (shnnapiii)`, `Вика (s0va03)`],
	'14-04': [`Хамчек (xam4ek)`, `Тема (lennypai)`],
	'15-04': [`Даша (shue137)`],
	'20-04': [`Егор (shishaaa464)`, `Никита (ovrht)`],
	'21-04': [`Максим (jezelfy)`],
	'26-04': [`Фрикила (freekila)`],
	'06-05': [`Варя (mawwiktyt)`],
	'07-05': [`Анфиса (fisskkk)`, `Лиза (vghare__)`],
	'09-05': [`Лера (kalerya37)`, `Сергей (usett)`],
	'11-05': [`Ира (orokaato)`],
	'12-05': [`Ксю (xenk_l)`],
	'13-05': [`Егор (mallairr)`],
	'19-05': [`Никита (niktarnik)`, `Ника (gnicksen)`],
	'24-05': [`Владлен (WaveHearts)`, `Ваня (E1LlAS)`],
	'29-05': [`Никита (fofee_n)`, `Соня (bezdarj02)`],
	'31-05': [`Ника (nikusik0)`],
	'08-06': [`Олег (TetoHasDied)`],
	'09-06': [`Оля (i_olya)`, `Игорь (stalker0800)`],
	'10-06': [`Веста (vess1a)`],
	'16-06': [`Доминика (nikaxwn)`],
	'18-06': [`Настя (astenochka)`],
	'20-06': [`Света (caelestisstella)`],
	'23-06': [`Владик (frostydefreeze)`, `Дима (chhrda)`],
	'24-06': [`Алёна (alenakuz03)`],
	'26-06': [`Алиса (ELIS_WW)`],
	'03-07': [`Алиса (alicee_n)`],
	'08-07': [`Даша (gogoghk)`],
	'12-07': [`Юля (ummbft)`, `Стёпа (subayaya)`],
	'14-07': [`Алена (maybexs)`],
	'17-07': [`Юлька (juliaxx011)`],
	'21-07': [`Илья (envtt)`],
	'22-07': [`Евгений (k1lk4_)`],
	'23-07': [`Аня (void_666_)`],
	'26-07': [`Ярик (d1fforr)`],
	'27-07': [`Вова (sqvand)`],
	'29-07': [`Маша (nezechkaa)`],
	'30-07': [`Паша (ICREATEANDESTROYTHISWORLD)`],
	'04-08': [`Антон (sleepzoff)`],
	'07-08': [`Вижн (vizionnnnnnnnnn)`],
	'08-08': [`Руслан (eduardofrick)`],
	'09-08': [`Лиза (vodichka07)`, `Ванёк (deepins02)`],
	'10-08': [`Яна (bulgakovaaa)`],
	'24-08': [`Дима (diloindys)`],
	'26-08': [`Давид (deitopoteito)`],
	'08-09': [`Егор (eropbl4_)`, `Фортиза (f0rtizza)`],
	'11-09': [`Филипп (filip_broooo)`],
	'14-09': [`Катя (e_kkaterina)`],
	'16-09': [`Скам (ck4m)`],
	'19-09': [`Виктория (vviisskkass)`, `Диана (dinizavrik_di)`, `Настя (nasquais)`],
	'24-09': [`Полина (jopee_n)`],
	'27-09': [`Маша (marichko)`],
	'28-09': [`Ислам (kvgch)`],
	'01-10': [`Лейла (freedomcheek)`],
	'06-10': [`Тимоха (tmh616)`],
	'07-10': [`Антон (wizzyy6)`],
	'10-10': [`Дима (filinnnnnnnnn)`],
	'16-10': [`Вика (snego_vik_25)`],
	'17-10': [`Артём (v0kky)`],
	'18-10': [`Андрей (turb0k0tuk)`],
	'19-10': [`Вероника (virxverok)`],
	'22-10': [`Даша (poolofdar)`, `Амаль (t0pskii)`],
	'24-10': [`Алексей (lousoz)`],
	'28-10': [`Маша (manunya_0)`, `Дионис (offwhiteairforc3)`],
	'31-10': [`Маша (mashaqk)`],
	'01-11': [`Рита (iamri_)`],
	'03-11': [`Лена (lena477)`],
	'05-11': [`Ян (klyneqq)`],
	'08-11': [`Нина (cheliicks)`],
	'09-11': [`Санек (anek)`],
	'10-11': [`Миша (1wenly)`, `Дима (MrDrag0N89)`],
	'11-11': [`Варя (varrvarrass)`],
	'12-11': [`Даня (lostdantea)`],
	'15-11': [`Вера (12mbs203)`],
	'17-11': [`Ваня (teen_wave_)`],
	'18-11': [`Софа (favkurha)`],
	'20-11': [`Анжелика (hainj)`],
	'24-11': [`Вика (shmyyg)`],
	'02-12': [`Макс (dildobeck)`],
	'08-12': [`Саня (sanya_cringe)`],
	'11-12': [`Марина (mikroneziyka)`],
	'14-12': [`Эвелина (evelinadigrizz)`],
	'17-12': [`Эрик (flashliight)`, `Костя (pkt_fade)`],
	'22-12': [`Ванечка (gasvvv)`],
	'23-12': [`Алина (rimerra)`],
	'24-12': [`Настя (jolinefa)`],
	'30-12': [`Даня (wweim)`]
}

const streamers = [
	'anek',
	'deepins02',
	'dmitriy_lixxx',
	'sindics',
	'sasavot',
	'dinablin',
	'bratishkinoff',
	'yuuechka',
	'fruktozka',
	'fasoollka',
	'muhanjan',
	't2x2',
	'drakeoffc',
	'lagoda1337',
	'zubareff',
	'egorkreed',
	'ekatze007',
	'dasha228play',
	'akyuliych',
	'morfe',
	'jesusavgn',
	'ct0m',
	'shadowkekw',
	'derzko69',
	'nelyaray',
	'mazellovvv',
	'korya_mc',
	'buster',
	'flackjk',
	'recrent',
	'tenderlybae',
	'stintik',
	'evelone192',
	'gensyxa',
	'jojohf',
	'kussia88',
	'priyatnogopoleta',
	'skywhywalker',
	'dangerlyoha',
	'paradeev1ch',
	'koreshzy',
	'frametamer666',
	'rostislav_999',
	'luxgrl',
	'zakvielchannel',
	'lomaka',
	'gwinglade',
	'aratossik',
	'arthas',
	'quickhuntik',
	'edison',
	'danilagorilla',
	'ravshann',
	'kaicenat',
	'guacamolemolly',
	'leva2k',
	'zloyn',
	'mokrivskyi',
	'lumitalle',
	'dkincc',
	'strogo',
	'gaechkatm',
	'aunkere',
	'morphe_ya',
	'morphilina'
]

const replaceRu = user => {
	const cleaned = user.replace(/[^a-zA-Z0-9_]/g, ``)
	return cleaned.toLowerCase()
}

module.exports = {
	name: `info`,
	access: [],
	active: true,
	aliases: [`пробив`, `инфо`],
	cooldown: 15,
	requires: [],
	async execute(client, ctx, utils) {
		let query = ctx.args[0]?.toLowerCase() || ctx.user.login
		query = bb.utils.parseUser(query)

		const supi = await bb.services.supinic.supi
			.post(`bot/command/run`, {
				headers: {
					'Content-Type': `application/json`
				},
				json: {
					query: `$weather @${query}`
				},
				timeout: 180_000
			})
			.json()

		let weatherData = supi.data

		if (weatherData.reason !== null) {
			weatherData = null
		} else {
			weatherData = weatherData.reply.split(` (now)`)[0]
		}

		let findUser = null
		let birthDate = null
		for (const date in userList) {
			const usernames = userList[date].map(u => replaceRu(u))
			const findUsername = usernames.find(i => i === query)
			if (findUsername) {
				findUser = findUsername
				birthDate = date
			}
		}

		const ai = await bb.services.ai.gpt(
			`Никнейм: ${findUser || query}. Дата рождения: ${birthDate || `Неизвестно`}. Город: ${weatherData || `Неизвестно`}`,
			200,
			1,
			`Ты выступаешь в роли оценщика и аналитика. Твоя задача вернуть информацию в следующем формате: "Никнейм (<объективная оценка от 0 до 10>/10, не стесняйся писать низкие оценки, это никого не обидит). Возможное имя: <возможное имя пользователя на основании никнейма>. Дата рождения: <дата рождения пользователя в формате ДД.ММ>. Знак зодиака: <знак зодиака пользователя на основании даты рождения>. Город проживания: <на основании предоставленной информации>. Характеристика: <твоя объективная оценка пользователя на основании предоставленной информации>. Характеристика должна быть длиной до 350 символов. Должна содержать предположительные внешние параметры пользователя, черты его характера, возможные интересы, возможный возраст (больше 13 лет и точность в 2-3 года), несколько стримеров, на которых похож пользователь по характеру и внешности, возможных Twitch стримеров, которых смотрит пользователь". Вот возможные стримеры: ${streamers
				.sort()
				.join(`, `)}.`
		)

		const body = JSON.parse(ai.body)

		if (body.error) {
			return {
				text: `\u{1F534} ${body.error.message}`,
				reply: true,
				emoji: false,
				action: false
			}
		}

		const response = body.choices[0].message.content.replace(/[\n\r]/g, ` `)

		return {
			text: response,
			reply: true,
			emoji: true,
			action: true
		}
	}
}
