<template>
	<VCard
		class="orderCard"
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
				>
				<VFlex
					grow
					py-3
					my-3
					ml-4
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
						<VLayout
							column
							align-end
							>
							<VFlex

								class="font-weight-medium pr-2 mr-0"
								>
								{{ price }} <small class="caption font-weight-light">
									SEK monthly
								</small>
							</VFlex>
							<VFlex
								class="font-weight-medium pr-1 mr-3"
								>
								{{ setupFee }} <small class="caption font-weight-light nudge">
									SEK setup
								</small>
							</VFlex>
						</VLayout>
					</VLayout>
				</VFlex>
				<VBtn
					ma-0
					pa-0
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
									<span class="caption">
										{{ activationDate ? activationDate : 'Activation' }}
									</span>
								</VBtn>
								<VDialog
									v-else
									ref="activationDateDialog"
									v-model="activationDateModal"
									persistent
									min-width="300"
									max-width="400"
									transition="slide-y-reverse-transition"
									>
									<VBtn
										slot="activator"
										v-model="activationDateModel"
										grow
										flat
										@click="calendarDisplayed()"
										>
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
										<VLayout
											column
											align-center
											>
											<VFlex>
												<small class="grey--text">
													Pick the day when your subscription should start.
												</small>
											</VFlex>
											<VFlex>
												<VBtn
													flat
													block

													large
													color="success"
													@click="activationDate = activationDateModel; terminationDateModel = minimumTerminationDate(); activationDateModal = false; toggleCard(); calendarDisplayed()"
													>
													Set activation date
												</VBtn>
											</VFlex>
										</VLayout>
									</VDatePicker>
								</VDialog>
								<VBtn
									v-if="activationDate.length === 0"
									grow
									disabled
									flat
									>
									<span class="caption">
										{{ terminationDate ? terminationDate : 'Termination' }}
									</span>
								</VBtn>
								<VDialog
									v-else
									ref="terminationDateDialog"
									v-model="terminationDateModal"
									min-width="300"
									max-width="400"
									transition="slide-y-reverse-transition"
									>
									<VBtn
										slot="activator"
										v-model="terminationDateModel"
										grow
										flat
										small
										@click="calendarDisplayed()"
										>
										<span class="caption">
											{{ terminationDate ? terminationDate : 'Termination' }}
										</span>
									</VBtn>

									<VDatePicker
										v-model="terminationDateModel"
										type="date"
										scrollable
										color="error"
										:min="minimumTerminationDate()"
										full-width
										>
										<VLayout
											row
											wrap
											align-center
											justify-center
											>
											<VFlex shrink>
												<small class="grey--text">
													Select a day when your subscription should end or press 'Indefinite' to keep your subscription activated.
												</small>
											</VFlex>
											<VFlex>
												<VBtn
													large
													block
													flat
													@click="terminationDate = ''; terminationDateModal = false; toggleCard(); calendarDisplayed();"
													>
													Indefinite
												</VBtn>
											</VFlex>
											<VFlex>
												<VBtn
													large
													block
													flat
													color="error"
													@click="terminationDate = terminationDateModel; terminationDateModal = false; toggleCard(); calendarDisplayed();"
													>
													Set termination date
												</VBtn>
											</VFlex>
										</VLayout>
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
		id: { type: String, default: '' },
		name: { type: String, default: null },
		bandwidth: { type: Number, default: null },
		channels: { type: Number, default: null },
		description: { type: String, default: null },
		price: { type: Number, default: null },
		setupFee: { type: Number, default: null },
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
		terminationDateModel: '',
		activationDate: '',
		terminationDate: ''

	}),
	created() {

		this.calendarDisplayed();

		this.activationDateModal = true;

		this.toggled = true;

	},

	methods: {

		minimumTerminationDate() {

			const activation = new Date(this.activationDate).getTime();
			const millisecondDay = 86400000;
			const noticeDate = activation + (millisecondDay * 30);

			return new Date(noticeDate).toISOString()
				.substr(0, 10);

		},
		calendarDisplayed() {

			if (this.activationDateModal === true || this.terminationDateModal === true) {

				this.$emit('change', true);
				this.$emit('input', this.id, this.activationDate, this.terminationDate);

			} else {

				this.$emit('change', false);
				this.$emit('input', this.id, this.activationDate, this.terminationDate);

			}

		},
		toggleCard() {

			this.toggled = !this.toggled;

		}

	}

};
</script>

<style>
.cardHover {
	height: initial;
	width: 30px;
	min-width: 30px;
	max-width: 30px;
	margin-left: 0;
	margin-right: 4px;
}
.nudge{
	margin-right: 1.6px;
}
</style>
