<template>
	<VCard
		class="orderCard"
		:color="existingActivationDate? 'primary': 'info'"
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
					xs6
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
							align-center
							>
							<VFlex
								class="font-weight-medium pr-2 mr-0"
								>
								{{ price }} <small class="caption font-weight-light">
									{{ $t("sekMonthly") }}
								</small>
							</VFlex>
							<VFlex
								v-if="!activatedSubscription"
								class="font-weight-medium pr-1 mr-3"
								>
								{{ setupFee }} <small class="caption font-weight-light nudge">
									{{ $t("sekSetup") }}
								</small>
							</VFlex>
							<VFlex
								v-if="activatedSubscription"
								class="font-weight-medium"
								v-text="provider"
								/>
							<VFlex
								class="font-weight-light"
								v-text="serviceAddress"
								/>
						</VLayout>
					</VLayout>
				</VFlex>
				<VFlex
					xs6
					>
					<VContainer
						fill-height
						fluid
						>
						<VLayout
							column
							justify-space-around
							align-center
							>
							<VTextField
								v-if="terminationDate.length > 0 || activatedSubscription"
								v-model="activationDate"
								outline
								hide-details
								disabled
								:label="$t('activation')"
								prepend-inner-icon="power"
								/>
							<VDialog
								v-else
								ref="activationDateDialog"
								v-model="activationDateModal"
								persistent
								min-width="300"
								max-width="400"
								transition="slide-y-reverse-transition"
								>
								<VTextField
									slot="activator"
									v-model="activationDate"
									outline
									hide-details
									:label="$t('activation')"
									prepend-inner-icon="power"
									/>
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
												{{ $t("pickSubscriptionStart") }}
											</small>
										</VFlex>
										<VFlex>
											<VBtn
												flat
												block
												large
												color="success"
												@click="activationDate = activationDateModel; activationDateModal = false; emitDates()"
												>
												{{ $t("setActivationDate") }}
											</VBtn>
										</VFlex>
									</VLayout>
								</VDatePicker>
							</VDialog>
							<VDialog
								ref="terminationDateDialog"
								v-model="terminationDateModal"
								min-width="300"
								max-width="400"
								transition="slide-y-reverse-transition"
								>
								<VTextField
									slot="activator"
									v-model="terminationDate"
									outline
									:disabled="activationDate.length === 0"
									hide-details
									:label="$t('termination')"
									prepend-inner-icon="power_off"
									/>
								<VDatePicker
									v-model="terminationDateModel"
									scrollable
									type="date"
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
												{{ $t("terminationCardDescription") }}
											</small>
										</VFlex>
										<VFlex>
											<VBtn
												large
												block
												flat
												@click="terminationDate = ''; terminationDateModel = terminationDate; terminationDateModal = false; emitDates();"
												>
												{{ $t("indefinite") }}
											</VBtn>
										</VFlex>
										<VFlex>
											<VBtn
												large
												:disabled="!terminationDateModel"
												block
												flat
												color="error"
												@click="terminationDate = terminationDateModel; terminationDateModal = false; emitDates();"
												>
												{{ $t("setTerminationDate") }}
											</VBtn>
										</VFlex>
									</VLayout>
								</VDatePicker>
							</VDialog>
						</VLayout>
					</VContainer>
				</VFlex>
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
		bandwidth: { type: Object, default: null },
		channels: { type: Number, default: null },
		description: { type: String, default: null },
		price: { type: Number, default: null },
		setupFee: { type: Number, default: null },
		providerLogo: { type: String, default: null },
		provider: { type: String, default: null },
		serviceAddress: { type: String, default: null },
		multiCategory: { type: Array, default: null },
		existingActivationDate: { type: String, default: null },
		existingTerminationDate: { type: String, default: null }
	},
	data: () => ({
		activatedSubscription: false,
		activationDateModal: false, // whether the activation date modal is currently displaying
		terminationDateModal: false, // whether the termination date modal is currently displaying
		activationDateModel: new Date().toISOString()
			.substr(0, 10), // default date for activation model
		terminationDateModel: new Date(new Date().getTime() + (86400001 * 30)).toISOString()
			.substr(0, 10), // empty default for termination model
		activationDate: '', // final activation date
		terminationDate: '' // final termination date
	}),
	created () {

		if ( !this.existingActivationDate) {

			this.emitDates();
			this.activationDateModal = true;
		
		} else {

			this.activatedSubscription = true;
			this.activationDate = this.existingActivationDate;
			if (this.existingTerminationDate) {

				this.terminationDate = this.existingTerminationDate;
			
			}
		
		}
	
	},
	methods: {
		minimumTerminationDate () {

			// determines the minimum termination date, set to be 30 days from today
			let activation;

			if (this.activationDate){

				activation = new Date(this.activationDate).getTime();
			
			}
			else {

				activation = new Date().getTime();
			
			}
			const millisecondDay = 86400000;
			const noticeDate = activation + (millisecondDay * 30);
			const result = new Date(noticeDate).toISOString()
				.substr(0, 10);

			return result;
		
		},
		emitDates () {

			// saves the dates by emmiting this to the Iterator compontent
			if (this.activationDateModal === true || this.terminationDateModal === true) {

				this.$emit('change', true);
				this.$emit('input', this.id, this.activationDate, this.terminationDate);
			
			} else {

				this.$emit('change', false);
				this.$emit('input', this.id, this.activationDate, this.terminationDate);
			
			}
		
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
.nudge {
	margin-right: 1.6px;
}
</style>
