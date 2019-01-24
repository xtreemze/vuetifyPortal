<template>
	<VCard
		:id="'orderCard' + id"
		color="info"
		flat
		>
		<VContainer
			fill-height
			fluid
			ma-0
			pa-0
			>
			<VLayout
				row
				wrap
				>
				<VFlex
					grow
					pa-3
					ma-3
					class=""
					>
					<VLayout
						column
						justify-center
						align-center
						>
						{{ name }}
						<VLayout
							mt-2
							row
							justify-center
							align-center
							>
							<VFlex
								v-for="(item, index) in multiCategory"
								:key="index"
								shrink
								>
								<VIcon
									small
									class="pb-1  text--lighten-2"
									>
									{{ item === 'internet' ? 'network_check' : '' }}
									{{ item === 'telephony' ? 'phone_in_talk' : '' }}
									{{ item === 'television' ? 'live_tv' : '' }}
								</VIcon>
							</VFlex>
						</VLayout>

						<VFlex
							class="font-weight-medium"
							>
							{{ price }} SEK
						</VFlex>
					</VLayout>
				</VFlex>
				<VBtn
					flat
					class="cardHover"
					@click.stop="toggled = !toggled"
					>
					<VIcon>
						{{ toggled ? 'keyboard_arrow_left' : 'keyboard_arrow_right' }}
					</VIcon>
				</VBtn>
				<VSlideXTransition>
					<VFlex
						v-show="toggled"
						shrink
						mr-5
						>
						<VContainer
							fill-height
							ma-0
							pa-0
							fluid
							>
							<VLayout
								column
								justify-space-around
								align-start
								>
								<VBtn
									v-if="terminationDate.length > 0"
									flat
									disabled
									>
									<VIcon
										small
										left
										>
										{{ activationDate ? 'event_available' : 'calendar_today' }}
									</VIcon>
									<span class="caption">
										{{ activationDate ? activationDate : 'Activation' }}
									</span>
								</VBtn>
								<VDialog
									v-else
									ref="activationDateDialog"
									v-model="activationDateModal"
									persistent
									min-width="400"
									max-width="800"
									transition="slide-y-reverse-transition"
									>
									<VBtn
										slot="activator"
										v-model="activationDateModel"
										grow
										flat
										>
										<VIcon
											small
											left
											>
											{{ activationDate ? 'event_available' : 'calendar_today' }}
										</VIcon>
										<span class="caption">
											{{ activationDate ? activationDate : 'Activation' }}
										</span>
									</VBtn>

									<VDatePicker
										v-model="activationDateModel"
										type="date"
										scrollable
										color="success"
										:min="new Date().toISOString().substr(0, 10)"
										full-width
										>
										<VBtn
											disabled
											flat
											>
											{{ name }}
										</VBtn>
										<VBtn
											flat
											block
											color="success"
											@click.stop="activationDate = activationDateModel; activationDateModal = false; toggleCard()"
											>
											Set activation date
										</VBtn>
									</VDatePicker>
								</VDialog>
								<VBtn
									v-if="activationDate.length === 0"
									grow
									disabled
									flat
									>
									<VIcon
										left
										small
										>
										{{ terminationDate ? 'event_available' : 'calendar_today' }}
									</VIcon>
									{{ terminationDate ? terminationDate : 'Termination' }}
								</VBtn>
								<VDialog
									v-else
									ref="terminationDateDialog"
									v-model="terminationDateModal"
									min-width="400"
									max-width="800"
									transition="slide-y-reverse-transition"
									>
									<VBtn
										slot="activator"
										v-model="terminationDateModel"
										grow
										flat
										>
										<VIcon
											small
											left
											>
											{{ terminationDate ? 'event_available' : 'calendar_today' }}
										</VIcon>
										<span class="caption">
											{{ terminationDate ? terminationDate : 'Termination' }}
										</span>
									</VBtn>

									<VDatePicker
										v-model="terminationDateModel"
										type="date"
										scrollable
										color="error"
										:min="activationDate"
										full-width
										>
										<VBtn
											disabled
											flat
											>
											{{ name }}
										</VBtn>
										<VSpacer />
										<VBtn
											flat
											@click.stop="terminationDate = ''; terminationDateModal = false; toggleCard()"
											>
											Indefinite
										</VBtn>
										<VBtn
											flat
											color="error"
											@click.stop="terminationDate = terminationDateModel; terminationDateModal = false; toggleCard()"
											>
											Set termination date
										</VBtn>
									</VDatePicker>
								</VDialog>
							</VLayout>
						</VContainer>
					</VFlex>
				</VSlideXTransition>
			</VLayout>
		</VContainer>
	</VCard>
</template>

<script>

export default {
	name: "OrderCard",
	props: {
		startDate: { type: String, default: null },
		endDate: { type: String, default: null },
		id: { type: String, default: '' },
		name: { type: String, default: null },
		bandwidth: { type: Number, default: null },
		channels: { type: Number, default: null },
		description: { type: String, default: null },
		price: { type: Number, default: null },
		picture: { type: String, default: null },
		providerLogo: { type: String, default: null },
		provider: { type: String, default: null },
		link: { type: String, default: null },
		multiCategory: { type: Array, default: null }
	},
	data: () => ({
		toggled: false,
		activationDateModal: false,
		terminationDateModal: false,
		activationDateModel: new Date().toISOString()
			.substr(0, 10),
		terminationDateModel: new Date().toISOString()
			.substr(0, 7),
		activationDate: '',
		terminationDate: ''

	}),
	created() {

		setTimeout(() => {

			this.activationDateModal = true;

		}, 800);

		this.toggled = true;

	},
	methods: {
		toggleCard(){

			setTimeout(() => {

				this.toggled = !this.toggled;

			}, 500);

		}

	}

};
</script>

<style>
.cardHover {
	height: initial;
}
</style>
