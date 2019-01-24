<template>
	<VCard
		flat
		>
		<VResponsive>
			<VCardTitle
				class="title"
				>
				<VFlex>
					{{ name }}
				</VFlex>

				<VFlex
					pt-2
					xs12
					>
					<span class="display-1 font-weight-medium ">
						{{ price }}
					</span>
					<span class="caption ml-0">
						SEK/mo
					</span>
				</VFlex>

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
				<VSpacer />
				<VFlex

					xs12
					>
					<h6
						class="grey--text text--lighten-2"
						>
						<VIcon
							small
							>
							{{ multiCategory.includes('internet') ? 'slow_motion_video':"signal_cellular_connected_no_internet_0_bar" }}
						</VIcon>

						{{ multiCategory.includes('internet') ? bandwidth + ' Mbps':"" }}
					</h6>
				</VFlex>
				<VFlex xs12>
					<h6 class="grey--text">
						{{ provider }}
					</h6>
				</VFlex>
			</VCardTitle>
			<VSlideYReverseTransition>
				<VCardText
					v-show="showDescription"
					class="caption secondary lighten-1  grey--text text--lighten-2 v-card--reveal cardDescription"
					>
					<p />
					<p>
						{{ description }}
					</p>
					<p>
						Available to: <VIcon
							small
							>
							{{ subscriptionTypeIcon() }}
						</VIcon>{{ subscriptionType }} customers
					</p>
				</VCardText>
			</VSlideYReverseTransition>
		</VResponsive>

		<VCardActions>
			<VSpacer />

			<VBtn
				icon
				flat
				color="grey"
				@click.stop="showDescription = !showDescription"
				>
				<VIcon>
					{{ showDescription ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
				</VIcon>
			</VBtn>

			<VBtn
				:color="addedToCart === false ? 'primary': 'info'"
				flat
				icon
				@click.stop="toCart"
				>
				<VIcon>
					{{ addedToCart === false ? 'add_shopping_cart' : 'shopping_cart' }}
				</VIcon>
			</VBtn>
		</VCardActions>
	</VCard>
</template>

<script>

export default {
	name: "SubscriptionCard",
	model: { prop: 'selectedArray', event: 'change' },

	props: {
		selectedArray: { type: Boolean, default: null },
		subscriptionType: { type: String, default: null },
		addedToCart: { type: Boolean, default: false },
		id: { type: String, default: '' },
		selected: { type: String, default: '' },
		name: { type: String, default: null },
		bandwidth: { type: Number, default: null },
		channels: { type: Number, default: null },
		description: { type: String, default: null },
		price: { type: Number, default: null },
		provider: { type: String, default: null },
		link: { type: String, default: null },
		multiCategory: { type: Array, default: null }
	},
	data: () => {

		return {
			showDescription: false,
			toggled: false		};

	},
	methods: {
		subscriptionTypeIcon() {

			if (this.subscriptionType === 'private') {

				return 'home'
				;

			}
			if (this.subscriptionType === 'company') {

				return 'business'
				;

			}

		},
		toCart() {

			if (this.addedToCart === true) {

				this.$emit('change', null);

			} else {

				this.$emit('change', true);

				this.$nextTick(() => {

					document.getElementById('orderCard' + this.id).scrollIntoView({ behavior: "smooth" });

				});

			}

		}

	}

};
</script>

<style>
.gradientBackground {
	background: linear-gradient(
		0deg,
		rgba(0, 0, 0, 0.2) 0%,
		rgba(0, 0, 0, 0.9) 100%
	);
}

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
</style>
