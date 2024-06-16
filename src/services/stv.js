const got = require(`got`)

const gql = got.extend({
	prefixUrl: `https://7tv.io/v3/gql`,
	throwHttpErrors: false,
	responseType: `json`,
	headers: {
		authorization: `Bearer ${bb.config.API.SevenTV}`
	}
})

let currentPaintIndex = -1
let currentBadgeIndex = -1

module.exports = {
	request: async function (query) {
		const request = await gql
			.post({
				json: query
			})
			.json()

		if (request.errors) {
			bb.logger.error(`[7TV] Ошибка при 7TV GQL запросе: ${request.errors[0].message}\n${JSON.stringify(request, null, 2)}`)
		}

		return request
	},
	cycler: async function () {
		const paints = [
			`61bee045b6b41ea54419bbb3`,
			`61bede3db6b41ea54419bbb0`,
			`61bedf64b6b41ea54419bbb1`,
			`61cecdad07f6416558e0a4c7`,
			`61d8bb2be39922abc6944338`,
			`61d8bbc4e39922abc6944339`,
			`61d8bc37e39922abc694433a`,
			`6281560aea0fb7b69a2ea9ea`,
			`628156e1ea0fb7b69a2ea9f0`,
			`62815663ea0fb7b69a2ea9ec`,
			`62815691ea0fb7b69a2ea9ee`,
			`62815712ea0fb7b69a2ea9f2`,
			`62a7725e6e0cf034a03703ce`,
			`62a7738f6e0cf034a03703d2`,
			`62a7772dc864b7a8369bc3f0`,
			`62a7730e6e0cf034a03703d0`,
			`62a7722c6e0cf034a03703cc`,
			`62fe2cbbc7976e265fdcee39`,
			`62fe29abdff0c083ea60fb73`,
			`63018c61bf53270de52c7f3a`,
			`63698d8138d7a07f2714d450`,
			`636a7bd73c6305a341c95345`,
			`638e537aee5660219ae559de`,
			`636e633b86a2f371c22b5483`,
			`6387708e11dfd13a4213f283`,
			`62fe2c29dff0c083ea60fba2`,
			`63420522efba6924f134f8da`,
			`63dedc1c4af186f390db9d56`,
			`63dee2e1617e063efa7583a7`,
			`63ffc2be009ac2d481a50b81`,
			`63fbea54a27fda24e806dc68`,
			`63dee27b01d3b54083316710`,
			`641ca4b75c90d6791857deaf`,
			`641ef5fb131be9db5329ba94`,
			`641c0ef3e4bd6a3d85522715`,
			`6428c0046e1aaced882fb792`,
			`6428bffb6e1aaced882fb791`,
			`649f3ee6dd00d86e1be3b2fa`,
			`649f3ef1dd00d86e1be3b2fb`,
			`649f3efcdd00d86e1be3b2fc`,
			`649f3f0add00d86e1be3b2fd`,
			`649f3f1add00d86e1be3b2fe`,
			`64c822181ebfdbc3dd5ac6f4`,
			`64c822341ebfdbc3dd5ac6f5`,
			`64c8224a1ebfdbc3dd5ac6f6`,
			`64c822541ebfdbc3dd5ac6f7`,
			`64c8225f1ebfdbc3dd5ac6f8`,
			`64f22d5bbddcf4735fddd750`,
			`64f22d7abddcf4735fddd751`,
			`64f22d8bbddcf4735fddd752`,
			`64f22da1bddcf4735fddd753`,
			`64f22dafbddcf4735fddd754`,
			`65169249d1696328456c5cae`,
			`6519aec569ad46458bcc1fae`,
			`6519aed269ad46458bcc1faf`,
			`6519aefb69ad46458bcc1fb0`,
			`6519af0b69ad46458bcc1fb1`,
			`64f76b7f28f093ba044e947b`,
			`65691ec8a0615b0a9fb42937`,
			`65691eb9a0615b0a9fb42936`,
			`65691eaca0615b0a9fb42935`,
			`6568a346fec968ea03055fab`,
			`656519ebdf131cd95635483f`,
			`656c84e98482ee7708edbae4`,
			`656e35ad02083e64deb63c4f`
		]

		const badges = [
			`62f97c05e46eb00e438a696a`,
			`62f97db2e46eb00e438a696b`,
			`62f97e19e46eb00e438a696c`,
			`62f97e71e46eb00e438a696d`,
			`6508d5bd55deb74f50368f40`,
			`65786330ffc9d968e5102164`
		]

		currentPaintIndex = (currentPaintIndex + 1) % paints.length
		currentBadgeIndex = (currentBadgeIndex + 1) % badges.length
		const nextPaint = paints[currentPaintIndex]
		const nextBadge = badges[currentBadgeIndex]

		const paintOperation = {
			operationName: `UpdateUserCosmetics`,
			query: `mutation UpdateUserCosmetics($user_id: ObjectID! $update: UserCosmeticUpdate!) { user(id: $user_id) { cosmetics(update: $update) } }`,
			variables: {
				update: {
					id: nextPaint,
					kind: `PAINT`,
					selected: true
				},
				user_id: `60f7e811c07d1ac193ec8aee`
			}
		}

		const badgeOperation = {
			operationName: `UpdateUserCosmetics`,
			query: `mutation UpdateUserCosmetics($user_id: ObjectID! $update: UserCosmeticUpdate!) { user(id: $user_id) { cosmetics(update: $update) } }`,
			variables: {
				update: {
					id: nextBadge,
					kind: `BADGE`,
					selected: true
				},
				user_id: `60f7e811c07d1ac193ec8aee`
			}
		}

		const updatePaint = await this.request(paintOperation)
		const updateBadge = await this.request(badgeOperation)

		return { updatePaint, updateBadge }
	},
	updatePresence: async function (stvID, userID) {
		const updatePresence = await got.post(`https://7tv.io/v3/users/${stvID}/presences`, {
			json: {
				kind: 1,
				passive: false,
				session_id: undefined,
				data: {
					platform: `TWITCH`,
					id: userID
				}
			}
		})

		return updatePresence
	},
	getUser: async function (userID) {
		const operation = {
			operationName: `GetUserByConnection`,
			query: `query GetUserByConnection($platform: ConnectionPlatform! $id: String!) { userByConnection (platform: $platform id: $id) { id type username roles created_at connections { id platform emote_set_id } emote_sets { id emotes { id name } capacity } } }`,
			variables: {
				platform: `TWITCH`,
				id: userID
			}
		}

		const user = await this.request(operation)
		return user
	},
	getEditors: async function (stvID) {
		const operation = {
			operationName: `GetUserForUserPage`,
			query: `query GetUserForUserPage($id: ObjectID!) { user(id: $id) { id username editors { user { id username } } } }`,
			variables: {
				id: stvID
			}
		}

		const editors = await this.request(operation)
		return editors
	},
	getDefaultEmoteSet: async function (stvID) {
		const operation = {
			operationName: `GetUserForUserPage`,
			query: `query GetUserForUserPage($id: ObjectID!) { user(id: $id) { id username connections { id username platform emote_capacity emote_set_id } } }`,
			variables: {
				id: stvID
			}
		}

		const set = await this.request(operation)
		return set
	},
	getEmotesInSet: async function (setID) {
		const operation = {
			operationName: `GetEmoteSet`,
			query: `query GetEmoteSet($id: ObjectID!) { emoteSet(id: $id) { id name emotes { id name } } }`,
			variables: {
				id: setID
			}
		}

		const emotes = await this.request(operation)
		return emotes
	},
	modifyEmoteSet: async function (emoteSetID, action, emoteID, emoteName) {
		const operation = {
			operationName: `ChangeEmoteInSet`,
			query: `mutation ChangeEmoteInSet($id: ObjectID! $action: ListItemAction! $emote_id: ObjectID! $name: String) { emoteSet(id: $id) { id emotes(id: $emote_id action: $action name: $name) { id name } } }`,
			variables: {
				action: action,
				id: emoteSetID,
				emote_id: emoteID,
				name: emoteName
			}
		}

		const modify = await this.request(operation)
		return modify
	},
	searchEmotes: async function (emote, limit, exact, sens) {
		const filter = {
			category: `TOP`,
			exact_match: false,
			case_sensitive: false
		}

		if (exact) filter.exact_match = true
		if (sens) filter.case_sensitive = true

		const operation = {
			operationName: `SearchEmotes`,
			query: `query SearchEmotes($query: String! $page: Int $limit: Int $filter: EmoteSearchFilter) { emotes(query: $query page: $page limit: $limit filter: $filter) { items { id name } } }`,
			variables: {
				query: emote,
				page: 1,
				limit: limit,
				filter
			}
		}

		const search = await this.request(operation)
		return search
	},
	getCosmetics: async function (stvID) {
		const operation = {
			operationName: `GetUserCosmetics`,
			query: `query GetUserCosmetics($id: ObjectID!) { user(id: $id) { id cosmetics { id kind selected } } }`,
			variables: {
				id: stvID
			}
		}

		const cosmetics = await this.request(operation)
		return cosmetics
	},
	getCosmeticsInfo: async function (cosmeticID) {
		const operation = {
			operationName: `GetCosmestics`,
			query: `query GetCosmestics($list: [ObjectID!]) { cosmetics(list: $list) { paints { id kind name } badges { id kind name } } }`,
			variables: {
				list: [cosmeticID]
			}
		}

		const info = await this.request(operation)
		return info
	},
	getSubage: async function (stvID) {
		const egVault = await got(`https://egvault.7tv.io/v1/subscriptions/${encodeURIComponent(stvID)}`).json()
		return egVault
	},
	getEmote: async function (emoteID) {
		const operation = {
			operationName: `Emote`,
			query: `query Emote($id: ObjectID!) { emote(id: $id) { id created_at name state trending tags owner { id username } host { ...HostFragment } versions { id name description created_at host { ...HostFragment } } animated } } fragment HostFragment on ImageHost { url files { name format width height size } }`,
			variables: {
				id: emoteID
			}
		}

		const info = await this.request(operation)
		return info
	}
}
