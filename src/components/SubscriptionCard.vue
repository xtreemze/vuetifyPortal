<template>
	<VCard
		flat
		>
		<VResponsive>
			<VFlex shrink>
				<VCardTitle
					class="title"
					>
					<VFlex>
						{{ name }}
					</VFlex>
					<VFlex
						pt-1
						pb-0
						xs12
						>
						<span class="display-1 font-weight-medium ">
							{{ price }}
						</span>
						<span class="caption ml-0">
							{{ $t('sekMo') }}
							<span class=" ml-2 title font-weight-bold">
								{{ setupFee }}
								<span class="caption ml-0">
									{{ $t('setup') }}
								</span>
							</span>
						</span>
					</VFlex>
					<VFlex xs12>
						<VLayout
							row
							wrap
							>
							<VFlex
								v-for="(item, index) in multiCategory"
								:key="index"
								shrink
								>
								<VIcon
									small
									class="pb-1 grey--text text--lighten-2"
									>
									{{ item === 'internet' ? 'network_check' : '' }}
									{{ item === 'telephony' ? 'phone_in_talk' : '' }}
									{{ item === 'television' ? 'live_tv' : '' }}
								</VIcon>
							</VFlex>
						</VLayout>
					</VFlex>
					<VFlex shrink>
						<h6
							class="grey--text text--lighten-2"
							>
							<VIcon
								small
								:color="multiCategory.includes('internet')? '' : 'transparent' "
								>
								arrow_upward
							</VIcon>
							{{ multiCategory.includes('internet') ? bandwidth.up + ' Mbps': "&nbsp;" }}
							<VIcon
								small
								:color="multiCategory.includes('internet')? '' : 'transparent' "
								>
								arrow_downward
							</VIcon>
							{{ multiCategory.includes('internet') ? bandwidth.down + ' Mbps': "&nbsp;" }}
						</h6>
					</VFlex>
				</VCardTitle>
			</VFlex>
			<VSlideYReverseTransition>
				<VCardText
					v-show="showDescription"
					class="caption secondary lighten-1  grey--text text--lighten-2 v-card--reveal cardDescription"
					>
					<p>
						{{ $t('providedBy') }}: {{ provider }}
					</p>
					<p>
						{{ description }}
					</p>
					<p>
						{{ $t('availableTo') }}: <VIcon
							small
							>
							{{ subscriptionTypeIcon() }}
						</VIcon>{{ subscriptionType }} {{ $t('customers') }}
					</p>
				</VCardText>
			</VSlideYReverseTransition>
		</VResponsive>
		<VCardActions>
			<VBtn
				flat
				disabled
				small
				>
				<VImg
					contain
					:class="{greyScale: userLoggedIn} "
					max-height="30"
					:src="providerLogo"
					:alt="provider"
					/>
			</VBtn>
			<VSpacer />
			<VTooltip bottom>
				<template v-slot:activator="{ on }">
					<VBtn
						icon
						flat
						color="grey"
						@click.stop="showDescription = !showDescription"
						v-on="on"
						>
						<VIcon>
							{{ showDescription ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
						</VIcon>
					</VBtn>
				</template>
				<span>{{ !showDescription? $t('showDescription')
					: $t('hideDescription')
				}}</span>
			</VTooltip>
			<VTooltip bottom>
				<template v-slot:activator="{ on }">
					<VBtn
						:color="userLoggedIn? addedToCart === false ? 'primary': 'info' : 'grey'"
						flat
						icon
						@click.stop="toCart()"
						v-on="on"
						>
						<VIcon>
							{{ addedToCart === false ? 'add_shopping_cart' : 'shopping_cart' }}
						</VIcon>
					</VBtn>
				</template>
				<span>{{ addedToCart === false ? $t('addToCart')
					: $t("removeFromCart") }}</span>
			</VTooltip>
		</VCardActions>
	</VCard>
</template>
<script>
export default {
	name: "SubscriptionCard",
	model: { prop: 'selectedArray', event: 'change' },
	props: {
		userLoggedIn: { type: Boolean, default: null }, // whether there is any user logged in
		selectedArray: { type: Boolean, default: null }, // all subscriptions that are currently added to the shopping cart
		subscriptionType: { type: String, default: null }, // specifies a private or business subscription
		addedToCart: { type: Boolean, default: false }, // whether this subscription has been added to the shopping cart
		id: { type: String, default: '' },
		selected: { type: String, default: '' },
		name: { type: String, default: null },
		bandwidth: { type: Object, default: null },
		channels: { type: Number, default: null },
		description: { type: String, default: null },
		price: { type: Number, default: null },
		setupFee: { type: Number, default: null },
		picture: { type: String, default: null },
		providerLogo: { type: String, default: null },
		provider: { type: String, default: null },
		link: { type: String, default: null },
		multiCategory: { type: Array, default: null } // the category of services offered as part of the subscription
	},
	data: () => {

		return {
			showDescription: false,
			toggled: false
		};
	
	},
	methods: {
		subscriptionTypeIcon () {

			if (this.subscriptionType === 'private') {

				return 'home';
			
			}
			if (this.subscriptionType === 'company') {

				return 'business';
			
			}
		
		},
		toCart () {

			if (this.userLoggedIn === false) {

				this.$emit('error', true);
			
			}
			else if (this.addedToCart === true) {

				this.showDescription = false;
				this.$emit('change', null);
			
			} else {

				this.$emit('change', true);
				this.$vuetify.goTo('#cart', {
					duration: 1000,
					offset: 100,
					easing: 'easeInOutQuint'
				});
			
			}
		
		}
	}
};
</script>
<style>
.transparent {
	background: none;
}
.button {
	width: 80px;
}
.v-card--reveal {
	bottom: 0;
	position: absolute;
	width: 100%;
	overflow-y: auto;
	height: 100%;
}
.greyScale {
	filter: grayscale(15%);
	/* filter: brightness(70%); */
	/* background: grey;
	padding: 4px;
	border-radius: 6px; */
}
</style>
