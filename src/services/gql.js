const got = require(`got`)
const crypto = require(`crypto`)

const nameHash = `991718a69ef28e681c33f7e1b26cf4a33a2a100d0c7cf26fbff4e2c0a26d15f2`
const badgeHash = `5e1b7f0ba771ca8eb81c0fcd5b8f4ff559ec2dc71cc9256e04ec2665049fc4e5`
const followHash = `800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08`
const unfollowHash = `f7dae976ebf41c755ae2d758546bfd176b4eeb856656098bb40e0a672ca0d880`
const colorHash = `0371259a74a3db4ff4bf4473d998d8ae8e4f135b20403323691d434f2790e081`
const rewardsHash = `1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024`
const redeemHash = `d56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42`
const foundersHash = `c5792bd231bd97cd600c3da23420a8aab02086a59f0047d6bcea1a3fe456e97c`
const rolesHash = `a0a9cd40e047b86927bf69b801e0a78745487e9560f3365fed7395e54ca82117`
const renameHash = `caed6a3d336fc50251da7b944462ea321d7f276ee6fcccdf7e2e3de4d6ab5204`
const usernameHash = `fd1085cf8350e309b725cf8ca91cd90cac03909a3edeeedbd0872ac912f3d660`
const resubHash = `61045d4a4bb10d25080bc0a01a74232f1fa67a6a530e0f2ebf05df2f1ba3fa59`
const highlightHash = `bb187d763156dc5c25c6457e1b32da6c5033cb7504854e6d33a8b876d10444b6`
const usercardHash = `d8d64f5127527f29b17fc9c6324abda64b56c0ceb39d2515bd07373994170b6a`
const banHash = `319f2a9a3ac7ddecd7925944416c14b818b65676ab69da604460b68938d22bea`
const emotesHash = `7c15c1c83a9cf574aa202ddf6f40594ff75b2715746d98a20eea068e0c1179b7`
const chattersHash = `2e71a3399875770c1e5d81a9774d9803129c44cf8f6bad64973aa0d239a88caf`
const badgesHash = `a0300a9d8c43ec7a6bf653d46478948cc943d4ad9b2b28654241916b621dbfe5`
const changeHash = `c611ec7794e2c8a0f368fa8bb2bce9ff84fbd66f768d0e5dfc86440eeb18f2aa`
const pointsHash = `1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024`
const modHash = `5898414f627d2fbc85c3e774bfa8a91699ec299a41c4d58e9cc4a0dbd10101f1`

const resubToken = `MTk3Mjk4MjA4OjExNjczODExMjoxNzpjdW11bGF0aXZl`

const gql = got.extend({
	prefixUrl: `https://gql.twitch.tv/gql`,
	throwHttpErrors: false,
	responseType: `json`,
	headers: {
		authorization: `OAuth ${bb.config.Twitch.OAuth}`,
		'client-id': bb.config.Twitch.ClientID
	}
})

function generateHash(type) {
	const input = crypto.randomBytes(16)
	const hash = crypto
		.createHash(type || `md5`)
		.update(input)
		.digest(`hex`)
	return hash
}

let currentIndex = -1

module.exports = {
	request: async function (query) {
		const request = await gql
			.post({
				json: query
			})
			.json()

		if (request.errors) {
			bb.logger.error(`[GQL] Ошибка при Twitch GQL запросе: ${request.errors[0].message}\n${JSON.stringify(request, null, 2)}`)
		}

		return request
	},
	badgeCycler: async function () {
		const badges = [
			// `game-developer`,
			`no_audio`,
			`no_video`,
			`premium`,
			`glhf-pledge`,
			`streamer-awards-2024`
		]

		currentIndex = (currentIndex + 1) % badges.length
		const nextBadge = badges[currentIndex]

		const operation = {
			operationName: `ChatSettings_SelectGlobalBadge`,
			variables: {
				input: {
					badgeSetID: nextBadge,
					badgeSetVersion: `1`
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: badgeHash
				}
			}
		}
		const change = await this.request(operation)
		return change
	},
	changeDisplay: async function (name) {
		const operation = {
			operationName: `UpdateUserProfile`,
			variables: {
				input: {
					displayName: name,
					description: `by d\u{E0000}ankfreeze, a\u{E0000}licee_n, i_o\u{E0000}lya`,
					userID: bb.config.Bot.ID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: nameHash
				}
			}
		}
		const change = await this.request(operation)
		return change
	},
	followUser: async function (userID) {
		const operation = {
			operationName: `FollowButton_FollowUser`,
			variables: {
				input: {
					disableNotifications: true,
					targetID: userID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: followHash
				}
			}
		}
		const follow = await this.request(operation)
		return follow
	},
	unfollowUser: async function (userID) {
		const operation = {
			operationName: `FollowButton_UnfollowUser`,
			variables: {
				input: {
					targetID: userID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: unfollowHash
				}
			}
		}
		const unfollow = await this.request(operation)
		return unfollow
	},
	updateColor: async function (color) {
		const operation = {
			operationName: `Chat_UpdateChatColor`,
			variables: {
				input: {
					color: color
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: colorHash
				}
			}
		}
		const change = await this.request(operation)
		return change
	},
	getChannelRewards: async function (channelLogin) {
		const operation = {
			operationName: `ChannelPointsContext`,
			variables: {
				channelLogin: channelLogin
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: rewardsHash
				}
			}
		}
		const rewards = await this.request(operation)
		return rewards
	},
	redeemCustomReward: function (channelID, cost, prompt, id, text, title) {
		const transactionID = generateHash()
		const operation = {
			operationName: `RedeemCustomReward`,
			variables: {
				input: {
					channelID: channelID,
					cost: cost,
					prompt: prompt || null,
					rewardID: id,
					textInput: text || null,
					title: title,
					transactionID: transactionID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: redeemHash
				}
			}
		}
		const redeem = this.request(operation)
		return redeem
	},
	getFounders: async function (channelID) {
		const operation = {
			operationName: `FoundersBadgePanelQuery`,
			variables: {
				channelID: channelID
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: foundersHash
				}
			}
		}
		const founders = await this.request(operation)
		return founders
	},
	getRoles: async function (channelID) {
		let hasNextPageMods = true
		let hasNextPageVIPs = true
		let artistsData = []
		let modsData = []
		let vipsData = []

		while (hasNextPageMods || hasNextPageVIPs) {
			const operation = {
				operationName: `UserRolesCacheQuery`,
				variables: {
					channelID: channelID,
					includeEditors: false,
					includeMods: true,
					includeVIPs: true,
					includeArtists: true,
					modsCursor: hasNextPageMods ? modsData[modsData.length - 1]?.cursor : null,
					vipsCursor: hasNextPageVIPs ? vipsData[vipsData.length - 1]?.cursor : null
				},
				extensions: {
					persistedQuery: {
						version: 1,
						sha256Hash: rolesHash
					}
				}
			}

			const response = await this.request(operation)

			const artistsResponse = response.data.artists
			artistsData = artistsResponse.edges

			const modsResponse = response.data.user.mods
			if (modsResponse.pageInfo.hasNextPage) {
				hasNextPageMods = true
				modsData = modsData.concat(modsResponse.edges)
			} else {
				hasNextPageMods = false
				modsData = modsData.concat(modsResponse.edges)
			}

			const vipsResponse = response.data.user.vips
			if (vipsResponse.pageInfo.hasNextPage) {
				hasNextPageVIPs = true
				vipsData = vipsData.concat(vipsResponse.edges)
			} else {
				hasNextPageVIPs = false
				vipsData = vipsData.concat(vipsResponse.edges)
			}
		}

		return { artists: artistsData, mods: modsData, vips: vipsData }
	},
	getRename: async function () {
		const operation = {
			operationName: `UsernameRenameStatus`,
			variables: {},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: renameHash
				}
			}
		}
		const rename = await this.request(operation)
		return rename
	},
	checkUsername: async function (username) {
		const operation = {
			operationName: `UsernameValidator_User`,
			variables: {
				username: username
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: usernameHash
				}
			}
		}
		const check = await this.request(operation)
		return check
	},
	sendResub: async function (channelLogin, message) {
		const operation = {
			operationName: `Chat_ShareResub_UseResubToken`,
			variables: {
				input: {
					message: message,
					channelLogin: channelLogin,
					includeStreak: true,
					tokenID: resubToken
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: resubHash
				}
			}
		}
		const resub = await this.request(operation)
		return resub
	},
	highlightMessage: function (channelID, cost, message) {
		const transactionID = generateHash()
		const operation = {
			operationName: `SendHighlightedChatMessage`,
			variables: {
				input: {
					channelID: channelID,
					cost: cost,
					message: message,
					transactionID: transactionID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: highlightHash
				}
			}
		}
		const highlight = this.request(operation)
		return highlight
	},
	usercard: async function (channelID, channelLogin, username) {
		const operation = {
			operationName: `ViewerCard`,
			variables: {
				channelID: channelID,
				channelLogin: channelLogin,
				hasChannelID: true,
				giftRecipientLogin: username,
				isViewerBadgeCollectionEnabled: true,
				withStandardGifting: true
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: usercardHash
				}
			}
		}
		const usercard = this.request(operation)
		return usercard
	},
	banStatus: async function (channelID, userID) {
		const operation = {
			operationName: `ChatRoomBanStatus`,
			variables: {
				channelID: channelID,
				targetUserID: userID
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: banHash
				}
			}
		}
		const status = this.request(operation)
		return status
	},
	twitchEmotes: async function () {
		const operation = {
			operationName: `UserEmotes`,
			variables: {
				withOwner: true
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: emotesHash
				}
			}
		}
		const emotes = this.request(operation)
		return emotes
	},
	getChatters: async function (channelLogin) {
		const operation = {
			operationName: `CommunityTab`,
			variables: {
				login: channelLogin
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: chattersHash
				}
			}
		}
		const chatters = this.request(operation)
		return chatters
	},
	getBadges: async function (channelLogin) {
		const operation = {
			operationName: `ChatSettings_Badges`,
			variables: {
				channelLogin: channelLogin
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: badgesHash
				}
			}
		}
		const badges = this.request(operation)
		return badges
	},
	changeBadges: async function (badgeSetID, badgeSetVersion, channelID) {
		const operation = {
			operationName: `ChatSettings_SelectChannelBadge`,
			variables: {
				input: {
					badgeSetID: badgeSetID,
					badgeSetVersion: badgeSetVersion,
					channelID: channelID
				}
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: changeHash
				}
			}
		}
		const change = this.request(operation)
		return change
	},
	channelPoints: async function (channelLogin) {
		const operation = {
			operationName: `ChannelPointsContext`,
			variables: {
				channelLogin: channelLogin
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: pointsHash
				}
			}
		}
		const points = this.request(operation)
		return points
	},
	getUser: async function (login) {
		const operation = {
			query: `query GetUserByLogin($login:String!){user(login:$login,lookupType:ALL){id login displayName chatColor description createdAt deletedAt profileImageURL(width:600)channel{chatters{count}}follows{totalCount}roles{isAffiliate isPartner isGlobalMod isSiteAdmin isStaff}primaryTeam{name owner{login}}stream{averageFPS bitrate codec id title type viewersCount createdAt game{name}}}}`,
			variables: {
				login: login
			}
		}
		const user = this.request(operation)
		return user
	},
	moderatedChannels: async function () {
		let hasNextPage = true
		let channelsData = []

		while (hasNextPage) {
			const operation = {
				operationName: `ModeratedChannels`,
				variables: {
					cursor: hasNextPage ? channelsData[channelsData.length - 1]?.cursor : null
				},
				extensions: {
					persistedQuery: {
						version: 1,
						sha256Hash: modHash
					}
				}
			}

			const response = await this.request(operation)

			const channelsResponse = response.data.moderatedChannels
			if (channelsResponse.pageInfo.hasNextPage) {
				hasNextPage = true
				channelsData = channelsData.concat(channelsResponse.edges)
			} else {
				hasNextPage = false
				channelsData = channelsData.concat(channelsResponse.edges)
			}
		}

		return channelsData
	}
}
