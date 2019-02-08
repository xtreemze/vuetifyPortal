<template>
	<VLayout column>
		<VFlex>
			<VContainer
				grid-list-xl
				mt-5
				mb-3
				>
				<VLayout
					row
					justify-space-between
					wrap
					>
					<VFlex
						grow
						>
						<VLayout
							row
							>
							<VFlex shrink>
								<VForm
									ref="serviceAddress"
									v-model="validServiceAddress[0]"
									>
									<VTextField
										ref="serviceAddressInputField"
										v-model="addressSearch"
										autofocus
										class="headline"
										prepend-icon="my_location"
										label="Your service address"
										clearable
										required
										:rules="[rules.required]"
										hint="Where service will be installed"
										hide
										@keyup.enter.stop="queryServiceAddress"
										/>
								</VForm>
							</VFlex>
							<VFlex shrink>
								<VBtn
									flat
									large
									:disabled="!validServiceAddress[0]"
									icon
									@click.stop="queryServiceAddress"
									>
									<VIcon
										large
										>
										search
									</VIcon>
								</VBtn>
							</VFlex>
						</VLayout>
					</VFlex>
					<VFlex grow>
						<VLayout row>
							<VFlex shrink>
								<VSelect
									id="sortingSelect"
									v-model="pagination.sortBy"
									:disabled="notInitialized"
									item-value="sortBy"
									item-text="sortBy"
									:items="sortables"
									label="Sort by"
									prepend-icon="sort_by_alpha"
									hide-selected
									/>
							</VFlex>
							<VFlex shrink>
								<VBtn
									icon
									large
									flat
									:disabled="notInitialized"
									@click.stop="toggleSortingOrder"
									>
									<VIcon
										large

										:class="{flipped: !pagination.descending, flipAnimation: true
										}"
										>
										sort
									</VIcon>
								</VBtn>
							</VFlex>
						</VLayout>
					</VFlex>
					<VFlex

						shrink
						>
						<VTextField
							id="textFieldSearch"
							v-model.trim="filteredSearch"
							:disabled="notInitialized"
							type="text"
							class="headline mb-4"
							hide-actions
							hide-details
							prepend-icon="find_in_page"
							:label="totalFilteredItems"
							clearable
							/>
					</VFlex>

					<VFlex
						shrink
						py-4
						mb-3
						>
						<VBtnToggle
							v-model="category"
							multiple
							mandatory
							class="transparent"
							>
							<VBtn
								id="internetCategory"
								class="px-4"
								flat
								outline
								:disabled="notInitialized"
								value="internet"
								>
								<VIcon
									medium
									class="header"
									>
									network_check
								</VIcon>
								<span class="hidden-xs-only ml-3">
									Internet
								</span>
							</VBtn>

							<VBtn
								id="telephonyButton"
								:disabled="notInitialized"
								flat
								outline
								class="px-4"
								value="telephony"
								>
								<VIcon
									medium
									class="header"
									>
									phone_in_talk
								</VIcon>
								<span class="hidden-xs-only ml-3">
									Telephony
								</span>
							</VBtn>

							<VBtn
								id="televisionButton"
								:disabled="notInitialized"
								class="px-4"
								flat
								outline
								value="television"
								>
								<VIcon
									medium
									class="header"
									>
									live_tv
								</VIcon>
								<span class="hidden-xs-only ml-3">
									Television
								</span>
							</VBtn>
						</VBtnToggle>
					</VFlex>
					<VFlex
						shrink
						py-4
						mb-3
						>
						<VBtnToggle
							v-model="subscriptionType"
							class="transparent"
							mandatory
							>
							<VBtn
								:disabled="notInitialized"
								class="px-4"
								flat
								outline
								value="private"
								>
								<VIcon
									medium
									class="header"
									>
									home
								</VIcon>
								<span class="hidden-xs-only ml-3">
									Private
								</span>
							</VBtn>

							<VBtn
								:disabled="notInitialized"
								flat
								outline

								class="px-4"
								value="business"
								>
								<VIcon
									medium
									class="header"
									>
									work
								</VIcon>
								<span class="hidden-xs-only ml-3">
									Business
								</span>
							</VBtn>
						</VBtnToggle>
					</VFlex>

					<VFlex
						grow
						mt-2
						>
						<VRangeSlider
							v-model.lazy="bandwidth"
							:disabled="notInitialized"
							type="range"
							thumb-label="always"
							:max="initialBandwidth[1]"
							:min="initialBandwidth[0]"
							prepend-icon="slow_motion_video"
							label="Mbps"
							always-dirty
							/>
					</VFlex>

					<VFlex
						grow
						mt-2
						>
						<VRangeSlider
							v-model.lazy="price"
							:disabled="notInitialized"
							type="range"
							thumb-label="always"
							:max="initialPrice[1]"
							:min="initialPrice[0]"
							prepend-icon="payment"
							label="Price"
							always-dirty
							/>
					</VFlex>
				</VLayout>
			</VContainer>
		</VFlex>

		<VFlex>
			<VContainer
				grid-list-md
				my-4
				>
				<VDataIterator
					v-show="filteredItems.length > 0"
					v-model="selected"
					hide-actions
					:items="filteredItems"
					:rows-per-page-items="rowsPerPageItems"
					:pagination.sync="pagination"
					content-class="layout row wrap"
					:search="filteredSearch"
					no-results-text=""
					no-data-text=""
					>
					<VFlex
						slot="item"
						slot-scope="props"
						class="xs12 sm6 md6 lg4 xl3"
						>
						<SubscriptionCard
							:id="props.item.id"
							:key="props.item.id"
							v-model="props.selected"
							:user-logged-in="userLoggedIn"
							:added-to-cart="props.item.addedToCart"
							:name="props.item.name"
							:bandwidth="props.item.bandwidth"
							:channels="props.item.channels"
							:provider="props.item.provider"
							:provider-logo="props.item.providerLogo"
							:description="props.item.description"
							:price="props.item.price"
							:setup-fee="props.item.setupFee"
							:multi-category="props.item.multiCategory"
							:subscription-type="props.item.subscriptionType"
							@change="props.item.addedToCart = !props.item.addedToCart"
							@error="showLoginForCart"
							/>
					</VFlex>
				</VDataIterator>
			</VContainer>
		</VFlex>
		<VContainer
			grid-list-md
			fill-height
			>
			<VScaleTransition
				group
				tag="div"
				class="layout row wrap"
				>
				<VFlex
					v-for="subscription in selected"
					:key="subscription.id"
					xs12
					sm6
					md6
					lg4
					xl3
					>
					<OrderCard
						:id="subscription.id"

						:key="subscription.id"
						:name="subscription.name"
						:bandwidth="subscription.bandwidth"
						:provider="subscription.provider"
						:description="subscription.description"
						:price="subscription.price"
						:setup-fee="subscription.setupFee"
						:link="subscription.link"
						:multi-category="subscription.multiCategory"
						@change="calendarDisplayed = !calendarDisplayed"
						@input="recieveDates"
						/>
				</VFlex>
			</VScaleTransition>
		</VContainer>
		<VSnackbar
			v-model="loginForCart"
			color="info"
			top
			:timeout="2400"
			>
			<VIcon left>
				shopping_cart
			</VIcon>
			Create an account and log in to order
		</VSnackbar>
		<VContainer
			grid-list-md
			fill-height
			>
			<VLayout
				id="cart"
				class="pt-2 mt-3 mb-5"
				row
				wrap
				>
				<UserRegistration
					key="12"
					:create-account-snackbar="!loginForCart"
					:calendar-displayed="calendarDisplayed"
					:address-search="addressSearch"
					:items="selected.length.toString()"
					@change="detectUserActivity"
					/>

				<ShoppingCart
					v-if="selected.length > 0"
					key="13"
					class="cart"
					title="Order totals"
					:total-cost="totalCost"
					:total-setup-fee="totalSetupFee"
					icon="payment"
					/>
				<VFlex
					xs12
					sm12
					md4
					lg4
					xl4
					>
					<VContainer
						fill-height
						ma-0
						pa-0
						mt-3
						>
						<VLayout
							column
							align-center
							justify-center
							>
							<VFlex shrink>
								<VFadeTransition>
									<VBtn
										v-show="selected.find(subscription => subscription.activationDate === '') === undefined && selected.length > 0"
										key="14"
										large
										color="primary"
										block
										@click="checkoutScreen = !checkoutScreen"
										>
										Checkout
										<VIcon
											right
											>
											arrow_forward
										</VIcon>
									</VBtn>
								</VFadeTransition>
							</VFlex>
						</VLayout>
					</VContainer>
				</VFlex>
			</VLayout>
		</VContainer>
		<VLayout
			row
			justify-center
			>
			<VDialog
				v-model="checkoutScreen"
				scrollable
				max-width="400px"
				>
				<VCard flat>
					<VCardTitle>
						Confirm your order
					</VCardTitle>
					<VDivider />

					<VList
						three-line
						>
						<VSubheader>
							Requested subscriptions
						</VSubheader>
						<VListTile
							v-for="subscription in selected"
							:key="subscription.id"
							avatar
							>
							<VListTileAvatar>
								<VIcon left>
									shop
								</VIcon>
							</VListTileAvatar>
							<VListTileContent>
								<VListTileTitle>
									{{ subscription.name }} by {{ subscription.provider }}
								</VListTileTitle>
								<VListTileSubTitle>
									{{ subscription.price }} SEK monthly rate
								</VListTileSubTitle>
								<VListTileSubTitle>
									{{ subscription.setupFee }} SEK setup fee
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>

						<VDivider />
						<VSubheader>
							Totals
						</VSubheader>
						<VListTile avatar>
							<VListTileAvatar>
								<VIcon left>
									payment
								</VIcon>
							</VListTileAvatar>
							<VListTileContent>
								<VListTileTitle>
									Monthly rate
								</VListTileTitle>
								<VListTileSubTitle>
									{{ totalCost }}
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>
						<VListTile avatar>
							<VListTileAvatar />
							<VListTileContent>
								<VListTileTitle>
									Setup fee
								</VListTileTitle>
								<VListTileSubTitle>
									{{ totalSetupFee }}
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>

						<VDivider />
						<VSubheader>
							Agreement
						</VSubheader>

						<VListTile
							avatar
							@click.stop="legalConfirmation = !legalConfirmation"
							>
							<VListTileAction>
								<VCheckbox
									v-model="legalConfirmation"
									color="primary"
									@click.stop="legalConfirmation = !legalConfirmation"
									/>
							</VListTileAction>

							<VListTileContent>
								<VListTileTitle>
									Terms and conditions
								</VListTileTitle>
								<VListTileSubTitle wrap>
									I have read and understand the terms and conditions for all requested subscriptions.
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>
					</VList>

					<VDivider />
					<VCardActions>
						<VBtn
							flat
							block
							color="grey"
							@click.native="checkoutScreen = false"
							>
							Cancel
						</VBtn>
						<VBtn
							flat
							block
							color="primary"
							:disabled="!legalConfirmation"
							@click.native="checkOut"
							>
							Confirm
						</VBtn>
					</VCardActions>
				</VCard>
			</VDialog>
		</VLayout>
		<VLayout
			row
			justify-center
			>
			<VDialog
				v-model="subscriptionsOrdered"
				max-width="400px"
				>
				<VCard
					color="success"
					flat
					>
					<VCardTitle>
						<VFlex
							class="title"
							pa-5
							>
							Your subscriptions have been ordered!
						</VFlex>
					</VCardTitle>
				</VCard>
			</VDialog>
		</VLayout>
	</VLayout>
</template>

<script>

import SubscriptionCard from "./SubscriptionCard";
import OrderCard from "./OrderCard";
import ShoppingCart from "./ShoppingCart";
import UserRegistration from "./UserRegistration";
import a3Logo from "./logos/a3.svg";
import bahnhofLogo from "./logos/bahnhof.svg";
import breband2Logo from "./logos/breband2.svg";
import bredbandssonLogo from "./logos/bredbandsson.svg";
import sydantennLogo from "./logos/sydantenn.svg";
import teleserviceLogo from "./logos/teleservice.svg";

export default {
	name: "Iterator",
	components: { SubscriptionCard, OrderCard, ShoppingCart, UserRegistration },

	data: () => ({
		understandLegal: false,
		legalConfirmation: false,
		userLoggedIn: false,
		checkoutScreen: false,
		rules: {
			required: value => !!value || 'Required'		},
		calendarDisplayed: false,
		selected: [],
		allSubscriptionsActivated: false,
		loginForCart: false,
		subscriptionsOrdered: false,
		fakeDataIndex: 4,
		notInitialized: true,
		addressSearch: null,
		subscriptionType: ['private'],
		sortables: [{ sortBy: 'provider' }, { sortBy: 'name' }, { sortBy: 'bandwidth' }, { sortBy: 'price' }],
		filteredSearch: "",
		bandwidth: [0, 1000],
		channels: [0, 1000],
		price: [0, 1000],
		initialPrice: [0, 1000],
		initialBandwidth: [0, 1000],
		validServiceAddress: [false],
		category: [],
		rowsPerPageItems: [-1, 12, 18],
		pagination: {
			rowsPerPage: -1,
			descending: false,
			sortBy: "price"
		},

		items: [

		]
	}),
	computed: {

		totalCost() {

			let baseCost = 0;

			this.selected.forEach(subscription => {

				baseCost += subscription.price;

			});

			return `${baseCost} SEK`;

		},
		totalSetupFee() {

			let baseFee = 0;

			this.selected.forEach(subscription => {

				baseFee += subscription.setupFee;

			});

			return `${baseFee} SEK`;

		},
		totalFilteredItems() {

			return `Filter ${this.filteredItems.length} subscriptions`
			;

		},
		internetSelected() {

			return this.category.includes('internet');

		},
		televisionSelected() {

			return this.category.includes('television');

		},
		filteredItems() {

			const initialData = this.items;

			const result = initialData.filter(subscription => {

				if (
					this.category.some(service => subscription.multiCategory.includes(service)) &&
					this.subscriptionType.includes(subscription.subscriptionType) && this.price[0] <= subscription.price && this.price[1] >= subscription.price
				) {

					if (
						subscription.bandwidth > 0 && this.bandwidth[0] <= subscription.bandwidth && this.bandwidth[1] >= subscription.bandwidth) {

						return true;

					} else if (subscription.bandwidth > 0) {

						return false;

					} else {

						return true;

					}

				} else {

					return false;

				}

			});

			return result;

		}
	},

	methods: {

		recieveDates(id, activation, termination) {

			const order = this.selected.find(subscription => subscription.id === id);

			order.activationDate = activation;
			order.terminationDate = termination;

		}
		,
		showLoginForCart() {

			this.loginForCart = true;

			this.$vuetify.goTo('#cart', {
				duration: 2000,
				offset: 100,
				easing: 'easeInOutQuint'
			});

			this.$refs.serviceAddressInputField.focus;

		},
		detectUserActivity(input, userAccount) {

			if (input === false) {

				this.userLoggedIn = false;
				this.notInitialized = true;
				this.addressSearch = '';
				this.items = [];
				this.selected = [];

			} else {

				this.userLoggedIn = true;

				if (this.selected.length === 0 ){

					this.addressSearch = userAccount.serviceAddress;

					this.queryServiceAddress(true);

				}

			}

			this.$refs.serviceAddressInputField.focus;

			this.$vuetify.goTo(0, {
				duration: 2000,
				offset: 0,
				easing: 'easeInOutQuint'
			});

		},
		checkOut(){

			this.subscriptionsOrdered = true;
			this.checkoutScreen = false;
			this.notInitialized = true;
			this.items = [];
			this.selected = [];
			this.$refs.serviceAddressInputField.focus;

		},
		randomNumberRange(Min, Max) {

			return Math.floor(Math.random() * (Max - Min + 1)) + Min;

		},

		fakeInfo(requestedSubscriptions) {

			const logos = [teleserviceLogo, sydantennLogo, bredbandssonLogo, breband2Logo, bahnhofLogo, a3Logo];
			const providers = ['Teleservice', 'Sydantenn', 'Bredbandsson', 'Breband2', 'Bahnhof', 'A3'];
			const category = ['internet', 'telephony', 'television'];
			const subscriptionType = ['private', 'business'];
			const firstNames = ['Prime', 'Great', 'First', 'Mega', 'Extreme', 'Family', 'Triple', 'Double', "Premium"];
			const secondNames = ['value', 'service', 'package', 'entertainment', 'education', 'play', 'business'];

			for (let n = 0; n < requestedSubscriptions; n += 1) {

				const multiCategories = [];

				category.sort(() => Math.random() - 0.5); // shuffle categories

				for (let i = this.randomNumberRange(0, 2); i < category.length; i += 1) {

					multiCategories.push(category[i]);

				}

				multiCategories.sort();
				const providerIndex = this.randomNumberRange(0, providers.length - 1);
				const subscription = {
					id: this.fakeDataIndex + n.toString(),
					addedToCart: false,
					subscriptionType: subscriptionType[this.randomNumberRange(0, 1)],
					provider: providers[providerIndex],
					providerLogo: logos[providerIndex],
					name: firstNames[this.randomNumberRange(0, firstNames.length - 1)] + " " + secondNames[this.randomNumberRange(0, secondNames.length - 1)],
					price: parseInt(this.randomNumberRange(99, 699), 10),
					setupFee: parseInt(this.randomNumberRange(30, 499), 10),
					description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero consequatur natus esse blanditiis sint ipsa dolorem aliquam pariatur amet illum maiores, odit eos. Expedita, aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit exercitationem expedita at explicabo, recusandae quasi nemo temporibus quo placeat, itaque culpa, unde earum. Deleniti quis quod doloribus odit? Qui fuga laboriosam sit velit sapiente, numquam laudantium rerum voluptatem accusantium dignissimos vero, molestias debitis neque ipsum ea incidunt odio obcaecati! Suscipit provident vel, quidem impedit iusto eaque error sapiente harum amet! Eius ab vel odit laboriosam aliquid facilis totam veniam odio ducimus officia repellendus corrupti, dolore eum recusandae ad quo modi ut ipsam. Quas aliquid ea incidunt suscipit, velit adipisci quaerat ducimus saepe soluta sint obcaecati sit, voluptatum quo vel iusto perspiciatis earum assumenda officiis commodi nam delectus ipsam ad odio! Repellendus odio eaque porro nisi voluptas asperiores, tempora repudiandae cum? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, aliquam sequi nisi commodi nobis harum doloribus fugit ex maxime officia hic repudiandae odit quidem omnis, blanditiis alias mollitia corrupti placeat cum! Voluptatum cumque magnam ex nam minus facilis voluptates obcaecati inventore odio tenetur? Voluptatem corporis eligendi nisi eos! Et, dolores.`,
					address: "Malmo, Sweden",
					// picture: 'https://picsum.photos/600/400/' + '?image=' + this.randomNumberRange(0, 1084),
					picture: '',
					// providerLogo: 'https://picsum.photos/300/100/' + '?image=' + this.randomNumberRange(0, 1084),
					// link: 'nolink',
					multiCategory: multiCategories
				};

				if (multiCategories.includes('television')) {

					subscription.channels = parseInt(this.randomNumberRange(1, 100) * 10, 10);

				}

				if (multiCategories.includes('internet')) {

					subscription.bandwidth = parseInt(this.randomNumberRange(1, 100) * 10, 10);

				}

				this.items.unshift(subscription);
				this.fakeDataIndex += 1;

			}

		},
		queryServiceAddress(override) {

			if (this.validServiceAddress[0] || override) {

				this.resetSorting();
				// insert Service address query API below
				this.fakeInfo(6);

				// insert Service address query API above
				this.rangeMinMax();

			}

		},
		rangeMinMax() {

			const initialData = this.items;
			const newBandwidth = [100000, 0];
			const newPrice = [100000, 0];

			initialData.forEach((subscription) => {

				if (subscription.price > newPrice[1]) {

					newPrice[1] = subscription.price;

				}
				if (subscription.price < newPrice[0]) {

					newPrice[0] = subscription.price;

				}

				if (subscription.bandwidth > newBandwidth[1]) {

					newBandwidth[1] = subscription.bandwidth;

				}
				if (subscription.bandwidth < newBandwidth[0]) {

					newBandwidth[0] = subscription.bandwidth;

				}

			});

			this.initialBandwidth = newBandwidth;
			this.initialPrice = newPrice;

			this.bandwidth = newBandwidth;
			this.price = newPrice;

		},
		toggleSortingOrder() {

			this.pagination.descending = !this.pagination.descending;

		},

		resetSorting() {

			this.notInitialized = false;
			this.pagination.sortBy = "price";
			this.subscriptionType = ['private'];
			this.filteredSearch = "";
			this.category = ['internet', 'telephony', 'television'];

		}

	}

};
</script>

<style>
.cart {
	min-height: 128.1px;
}
.flipAnimation {
	transition: transform 0.2s ease-in-out !important;
}

.flipped {
	transform: scaleY(-1);
}

.pointerCursor,
.v-slider__thumb,
.v-slider__track__container,
.v-slider__thumb-label,
.v-slider input {
	cursor: pointer !important;
}
</style>
