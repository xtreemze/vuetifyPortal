<template>
	<VLayout column>
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
					key="1"
					xs12
					pt-1
					>
					<VCard
						flat
						color="transparent"
						>
						<VContainer fill-height>
							<VLayout
								mt-3
								column
								justify-center
								align-center
								>
								<VIcon
									v-if="currentUser.name"
									large
									>
									{{ currentUser.type === 'private'? 'account_circle' : 'business' }}
								</VIcon>
								<VFlex
									v-if="currentUser.name"
									mb-0
									pb-0
									>
									<h1 class="font-weight-light white--text">
										{{ currentUser.name }}
									</h1>
								</VFlex>
								<VFlex
									v-if="currentUser.name"
									mt-0
									pt-0
									>
									<h3 class="font-weight-light primary--text">
										{{ currentUser.serviceAddress }}
									</h3>
								</VFlex>
								<VLayout
									v-if="currentUser.name"
									>
									<VFlex
										mt-0
										pt-0
										>
										<UserEdit
											:current-user="currentUser"
											@change="saveUserEdit"
											/>
									</VFlex>
									<VFlex
										mt-0
										pt-0
										>
										<VBtn
											color="grey"
											flat
											small
											@click="userRegistrationLogOut = true"
											>
											{{ $t("logout") }}
										</VBtn>
									</VFlex>
								</VLayout>
								<UserRegistration
									:user-registration-log-out="userRegistrationLogOut"
									:create-account-snackbar="!loginForCart"
									:calendar-displayed="calendarDisplayed"
									:address-search="addressSearch"
									:logged-out-snackbar="loggedOutSnackbar"
									:edited-account="editedAccount"
									@change="detectUserActivity"
									/>
							</VLayout>
						</VContainer>
					</VCard>
				</VFlex>
				<VFlex
					v-for="provision in currentUser.provisions"
					:key="provision.id"
					xs12
					sm6
					md6
					lg4
					xl3
					>
					<OrderCard
						:id="provision.id"
						:key="provision.id"
						:existing-activation-date="provision.activationDate"
						:existing-termination-date="provision.terminationDate"
						:service-address="provision.serviceAddress"
						:name="provision.name"
						:bandwidth="provision.bandwidth"
						:provider="provision.provider"
						:description="provision.description"
						:price="provision.price"
						:setup-fee="provision.setupFee"
						:link="provision.link"
						:multi-category="provision.multiCategory"
						@change="calendarDisplayed = !calendarDisplayed"
						@input="recieveDatesExistingSubscription"
						/>
				</VFlex>
			</VScaleTransition>
		</VContainer>
		<VFlex>
			<VContainer
				grid-list-xl
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
							<VForm
								ref="serviceAddress"
								v-model="validServiceAddress[0]"
								@submit.enter.prevent="queryServiceAddress"
								>
								<VFlex shrink>
									<VTextField
										ref="serviceAddressInputField"
										v-model="addressSearch"
										autofocus
										class="headline"
										prepend-icon="my_location"
										:label="$t('searchForService')"
										clearable
										required
										type="search"
										:hint="$t('serviceAddress')"
										hide
										@keypress.enter="queryServiceAddress"
										/>
								</VFlex>
								<VFlex shrink>
									<VBtn
										flat
										large
										:disabled="addressSearch < 1"
										icon
										type="submit"
										@click.stop="queryServiceAddress"
										>
										<VIcon
											large
											>
											search
										</VIcon>
									</VBtn>
								</VFlex>
							</VForm>
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
									item-text="label"
									:items="sortables"
									:label="$t('sortBy')"
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
									{{ $t("internet") }}
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
									{{ $t("telephony") }}
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
									{{ $t("television") }}
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
									{{ $t("private") }}
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
									{{ $t("business") }}
								</span>
							</VBtn>
						</VBtnToggle>
					</VFlex>
					<VFlex
						grow
						mt-2
						pr-4
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
						pr-4
						>
						<VRangeSlider
							v-model.lazy="price"
							:disabled="notInitialized"
							type="range"
							thumb-label="always"
							:max="initialPrice[1]"
							:min="initialPrice[0]"
							prepend-icon="payment"
							:label="$t('price')"
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
					v-for="provision in selected"
					:key="provision.id"
					xs12
					sm6
					md6
					lg4
					xl3
					>
					<OrderCard
						:id="provision.id"
						:key="provision.id"
						:name="provision.name"
						:bandwidth="provision.bandwidth"
						:service-address="provision.serviceAddress"
						:provider="provision.provider"
						:description="provision.description"
						:price="provision.price"
						:setup-fee="provision.setupFee"
						:multi-category="provision.multiCategory"
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
			{{ $t("createAccountToLogin") }}
		</VSnackbar>
		<VSnackbar
			v-model="loggedOutSnackbar"
			:timeout="2400"
			top
			color="warning"
			>
			{{ $t("youLoggedOut") }}
			<VSpacer />
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
				<VFlex>
					<VContainer fill-height>
						<VLayout
							v-if="selected.length > 0"
							column
							align-center
							justify-center
							pt-4
							>
							<VBadge
								:value="selected.length !== 0"
								left
								color="info"
								>
								<span
									slot="badge"
									>
									{{ selected.length }}
								</span>
								<VIcon
									large
									>
									shopping_cart
								</VIcon>
							</VBadge>
							<VBtn
								small
								flat
								@click="clearCart"
								>
								<VIcon small>
									close
								</VIcon>
							</VBtn>
						</VLayout>
					</VContainer>
				</VFlex>
				<ShoppingCart
					v-if="selected.length > 0"
					key="13"
					class="cart"
					:title="$t('orderTotals')"
					:total-items="selected.length"
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
										v-show="selected.find(provision => provision.activationDate === '') === undefined && selected.length > 0"
										key="14"
										large
										color="primary"
										block
										@click="checkoutScreen = !checkoutScreen"
										>
										{{ $t("checkout") }}
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
				max-width="450px"
				>
				<VCard
					flat
					>
					<VCardTitle color="info">
						<h1>
							{{ $t("confirmOrder") }}
						</h1>
					</VCardTitle>
					<VDivider />
					<VList
						three-line
						>
						<VSubheader>
							{{ $t("requestedSubscriptions") }}
						</VSubheader>
						<VListTile
							v-for="provision in selected"
							:key="provision.id"
							avatar
							>
							<VListTileAvatar>
								<VLayout column>
									<VFlex
										v-for="(item, index) in provision.multiCategory"
										:key="index"
										shrink
										>
										<VIcon
											left
											>
											{{ item === 'internet' ? 'network_check' : '' }}
											{{ item === 'telephony' ? 'phone_in_talk' : '' }}
											{{ item === 'television' ? 'live_tv' : '' }}
										</VIcon>
									</VFlex>
								</VLayout>
							</VListTileAvatar>
							<VListTileContent>
								<VListTileTitle>
									{{ provision.name }} by {{ provision.provider }}
								</VListTileTitle>
								<VListTileSubTitle>
									{{ provision.price }} SEK/month, {{ provision.setupFee }} SEK setup
								</VListTileSubTitle>
								<VListTileSubTitle>
									{{ provision.serviceAddress }}
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>
						<VDivider />
						<VSubheader>
							{{ $t("totals") }}
						</VSubheader>
						<VListTile avatar>
							<VListTileAvatar>
								<VIcon left>
									payment
								</VIcon>
							</VListTileAvatar>
							<VListTileContent>
								<VListTileTitle>
									{{ $t("monthlyRate") }}
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
									{{ $t("setupFee") }}
									Setup fee
								</VListTileTitle>
								<VListTileSubTitle>
									{{ totalSetupFee }}
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>
						<VDivider />
						<VSubheader>
							{{ $t("agreement") }}
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
									{{ $t("termsConditions") }}
								</VListTileTitle>
								<VListTileSubTitle wrap>
									{{ $t("theTerms") }}
								</VListTileSubTitle>
							</VListTileContent>
						</VListTile>
						<VDivider />
						<VCardActions color="secondary">
							<VBtn
								flat
								block
								color="grey"
								@click.native="checkoutScreen = false"
								>
								{{ $t("cancel") }}
							</VBtn>
							<VBtn
								flat
								block
								color="primary"
								:disabled="!legalConfirmation"
								@click.native="checkOut"
								>
								{{ $t("confirm") }}
							</VBtn>
						</VCardActions>
					</VList>
				</VCard>
			</VDialog>
		</VLayout>
		<VLayout
			row
			justify-center
			>
			<VDialog
				v-model="subscriptionsOrdered"
				max-width="450px"
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
							{{ $t("ordered") }}
						</VFlex>
					</VCardTitle>
					<VCardActions>
						<VBtn
							block
							flat
							@click="subscriptionsOrdered = false"
							>
							<VIcon>
								close
							</VIcon>
						</VBtn>
					</VCardActions>
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
import UserEdit from "./UserEdit";
import a3Logo from "./logos/a3.svg";
import bahnhofLogo from "./logos/bahnhof.svg";
import breband2Logo from "./logos/breband2.svg";
import bredbandssonLogo from "./logos/bredbandsson.svg";
import sydantennLogo from "./logos/sydantenn.svg";
import teleserviceLogo from "./logos/teleservice.svg";
export default {
	name: "Iterator",
	components: { SubscriptionCard, OrderCard, ShoppingCart, UserRegistration, UserEdit },
	data: () => ({
		editedAccount: {}, // temporary user account
		loggedOutSnackbar: false,
		cartHovered: false,
		userRegistrationLogOut: false,
		currentUser: { provisions: [] }, // Who is currently logged in
		understandLegal: false, // Confirmation on Order Checkout for terms and conditions
		legalConfirmation: false, // Terms and conditions confirmed
		userLoggedIn: false, // Whether there is any user logged in or not
		checkoutScreen: false, // Whether a modal window is currently displaying
		calendarDisplayed: false, // Whether a calendar modal is currently displaying
		selected: [], // The subscriptions in the shopping cart
		allSubscriptionsActivated: false, // Whether all subscriptions have a valid activation date
		loginForCart: false, // A snackbar that pops up when there is no user logged in and user clicks on the add to shopping cart button which should be disabled if no user is logged in. The snackbar advises the user to create an account in order to use the shopping cart
		subscriptionsOrdered: false,
		fakeDataIndex: 4, // unique index value that persists for the generation of fake/sample data
		notInitialized: true, // when the filters are reset to their initial values
		addressSearch: null, // service address search
		subscriptionType: ['private'], // filter to show subscriptions availably only to private or company subscribers
		filteredSearch: "", // the text filter used to search through results
		bandwidth: [0, 1000], // the maximum and minimum bandwidth values for the slider filter
		price: [0, 1000], // the maximum and minimum price values for the slider filter
		initialPrice: [0, 1000], // the maximum and minimum price values for the slider filter used for resetting
		initialBandwidth: [0, 1000], // the maximum and minimum bandwidth values for the slider filter used for resetting
		validServiceAddress: [false], // validity check for the service address
		category: [], // The currently selected subscription type filters
		rowsPerPageItems: [-1, 12, 18],
		pagination: {
			rowsPerPage: -1, // infinite rows per page
			descending: false, // sorting order
			sortBy: "price" // sort field for pagination
		},
		items: [
		]
	}),
	computed: {
		sortables () {

			return [{					sortBy: 'provider', label: this.$t('provider')
			}, { sortBy: 'name', label: this.$t('name') }, { sortBy: 'bandwidth', label: this.$t('bandwidth') }, { sortBy: 'price', label: this.$t('price') }];
		
		},
		totalCost () {

			let baseCost = 0;

			this.selected.forEach(provision => {

				baseCost += provision.price;
			
			});
			return `${baseCost} SEK`;
		
		},
		totalSetupFee () {

			let baseFee = 0;

			this.selected.forEach(provision => {

				baseFee += provision.setupFee;
			
			});
			return `${baseFee} SEK`;
		
		},
		totalFilteredItems () {

			return `${this.$t('filter')} ${this.filteredItems.length} ${this.$t('subscriptions')}`;
		
		},
		internetSelected () {

			return this.category.includes('internet');
		
		},
		televisionSelected () {

			return this.category.includes('television');
		
		},
		filteredItems () {

			const initialData = this.items;
			const result = initialData.filter(provision => {

				if (
					this.category.some(service => provision.multiCategory.includes(service)) &&
					this.subscriptionType.includes(provision.subscriptionType) && this.price[0] <= provision.price && this.price[1] >= provision.price
				) {

					if (
						(!provision.multiCategory.includes("internet")) || (
							(provision.bandwidth.up > 0 && this.bandwidth[0] <= provision.bandwidth.up && this.bandwidth[1] >= provision.bandwidth.up) ||
						(provision.bandwidth.down > 0 && this.bandwidth[0] <= provision.bandwidth.down && this.bandwidth[1] >= provision.bandwidth.down))
					) {

						return true;
					
					} else if (provision.bandwidth.up > 0 || provision.bandwidth.down > 0) {

						return false;
					
					}
					else {

						return false;
					
					}
				
				}
			
			});

			return result;
		
		}
	},
	methods: {
		clearCart () {

			this.selected = [];
			this.items.forEach(item => {

				item.addedToCart = false; 

			});
		
		},
		recieveDates (id, activation, termination) {

			// Recieve subscription activation and termination dates emited by the OrderCard component
			const order = this.selected.find(provision => provision.id === id);

			if (order !== undefined) {

				order.activationDate = activation;
				order.terminationDate = termination;
			
			} else {

				return false;
			
			}
		
		},
		recieveDatesExistingSubscription (id, activation, termination) {

			// Recieve subscription activation and termination dates emited by the OrderCard component if the IDs and activation dates match
			const order = this.currentUser.provisions.find(provision => provision.id === id);

			if (order !== undefined && order.activationDate === activation) {

				order.terminationDate = termination;
			
			} else {

				return false;
			
			}
		
		}
		,
		showLoginForCart () {

			this.loginForCart = true;
			this.$vuetify.goTo(0, {
				duration: 1000,
				offset: 0,
				easing: 'easeInOutQuint'
			});
			this.$refs.serviceAddressInputField.focus;
		
		},
		saveUserEdit (userAccount) {

			// detect emiter from the UserEdit component when a user is edited and saved
			if (userAccount !== undefined) {

				this.editedAccount = userAccount;
				this.currentUser = userAccount;
			
			}
			this.$refs.serviceAddressInputField.focus;
		
		},
		detectUserActivity (input, userAccount) {

			// detect emiters from the UserRegistration component
			if (this.userRegistrationLogOut === true) {

				this.userRegistrationLogOut = false; 

			}
			if (input === false) {

				// When the user logs out // log out
				this.userLoggedIn = false;
				this.loggedOutSnackbar = true;
				this.notInitialized = true;
				this.addressSearch = '';
				this.items = [];
				this.selected = [];
				this.currentUser = { provisions: [] };
			
			} else {

				// Function to run when the user logs in // log in
				this.userLoggedIn = true;
				this.currentUser = userAccount;
			
			}
			this.$refs.serviceAddressInputField.focus;
		
		},
		checkOut () {

			// function that occurs when the checkout button is pressed
			this.$vuetify.goTo(0, {
				duration: 1000,
				offset: 0,
				easing: 'easeInOutQuint'
			});
			this.$nextTick(() => {

				this.subscriptionsOrdered = true;
			
			});
			// Order checkout
			this.checkoutScreen = false;
			this.notInitialized = true;
			// Subscriptions added to account and displayed as current subscriptions
			this.currentUser.provisions.push(...this.selected);
			// Search cleared, cart cleared
			this.items = [];
			this.selected = [];
			this.$refs.serviceAddressInputField.focus;
			this.legalConfirmation = false;
		
		},
		randomNumberRange (Min, Max) {

			// used for the fake data generator
			return Math.floor(Math.random() * (Max - Min + 1)) + Min;
		
		},
		fakeInfo (requestedSubscriptions) {

			// fake data generator, to be removed for final production version
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
					serviceAddress: this.addressSearch,
					multiCategory: multiCategories,
					bandwidth: {}
				};

				if (multiCategories.includes('internet')) {

					// subscription.bandwidth = parseInt(this.randomNumberRange(1, 100) * 10, 10);
					subscription.bandwidth.up = parseInt(this.randomNumberRange(1, 10) * 10, 10);
					subscription.bandwidth.down = parseInt(this.randomNumberRange(10, 100) * 10, 10);
				
				}
				this.items.unshift(subscription);
				this.fakeDataIndex += 1;
			
			}
		
		},
		queryServiceAddress (override) {

			if (this.validServiceAddress[0] || override) {

				const cart = [];

				cart.push(...this.selected);
				this.resetSorting();
				this.items = []; // clear resulting search items
				// insert Service address query API below
				this.fakeInfo(16); // generate fake subscriptions with the specified numeric quantity
				// in order to include service address details in each subscription, the address should be added to the subscription object upon search/query. This happens inside fakeInfo and should be replicated when the API runs the query
				// insert Service address query API above
				this.selected.push(...cart);
				this.rangeMinMax(); // adjust sliders to get relevant minimum and maximum
				this.$refs.serviceAddressInputField.blur();
			
			}
		
		},
		rangeMinMax () {

			// Set the minimum and maximum for the range sliders according to available data
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
				if (subscription.bandwidth.up > newBandwidth[1]) {

					newBandwidth[1] = subscription.bandwidth.up;
				
				}
				if (subscription.bandwidth.up < newBandwidth[0]) {

					newBandwidth[0] = subscription.bandwidth.up;
				
				}
				if (subscription.bandwidth.down > newBandwidth[1]) {

					newBandwidth[1] = subscription.bandwidth.down;
				
				}
				if (subscription.bandwidth.down < newBandwidth[0]) {

					newBandwidth[0] = subscription.bandwidth.down;
				
				}
			
			});
			this.initialBandwidth = newBandwidth;
			this.initialPrice = newPrice;
			this.bandwidth = newBandwidth;
			this.price = newPrice;
		
		},
		toggleSortingOrder () {

			// function for the data iterator flipping the pagination sort order
			this.pagination.descending = !this.pagination.descending;
		
		},
		resetSorting () {

			// Reset all filters to initial values
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
