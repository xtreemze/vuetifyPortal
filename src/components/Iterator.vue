<template>
	<div>
		<VContainer
			grid-list-xl
			mt-5
			mb-3
			>
			<VLayout
				row
				justify-space-around
				wrap
				>
				<VFlex
					grow
					>
					<VLayout
						row
						wrap
						>
						<VFlex grow>
							<VTextField
								v-model.lazy="addressSearch"
								class="headline"
								hide-actions
								hide-details
								prepend-icon="my_location"
								label="Your service address"
								browser-autocomplete="street-address"
								clearable
								/>
						</VFlex>
						<VFlex shrink>
							<VBtn
								flat
								large
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
					<VSelect
						id="sortingSelect"
						v-model="pagination.sortBy"
						:disabled="notInitialized"
						item-value="sortBy"
						item-text="sortBy"
						:items="sortables"
						label="Sort by"
						prepend-icon="sort_by_alpha"
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
				<VFlex

					grow
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
							value="company"
							>
							<VIcon
								medium
								class="header"
								>
								business
							</VIcon>
							<span class="hidden-xs-only ml-3">
								Company
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
					class="xs12 sm6 md4 lg3 xl2"
					>
					<SubscriptionCard
						:id="props.item.id"
						:key="props.item.id"
						v-model="props.selected"
						:added-to-cart="props.item.addedToCart"
						:name="props.item.name"
						:bandwidth="props.item.bandwidth"
						:channels="props.item.channels"
						:provider="props.item.provider"
						:description="props.item.description"
						:price="props.item.price"
						:link="props.item.link"
						:multi-category="props.item.multiCategory"
						:subscription-type="props.item.subscriptionType"
						@change="props.item.addedToCart = !props.item.addedToCart"
						/>
				</VFlex>
			</VDataIterator>
		</VContainer>

		<VCard
			flat
			tile
			color="transparent"
			class="
			pt-2
			mt-3
			"
			>
			<VContainer
				grid-list-md
				fill-height
				>
				<VFadeTransition
					group
					tag="div"
					class="layout row wrap"
					>
					<ShoppingCart
						key="1"
						title="Items"
						color="info"
						:text="selected.length.toString()"
						icon="shopping_cart"
						class="cart"
						/>

					<VScaleTransition
						key="2"
						group
						tag="div"
						class="layout row wrap"
						>
						<VFlex
							v-for="subscription in selected"
							:key="subscription.id"
							grow
							>
							<OrderCard
								:id="subscription.id"

								:key="subscription.id"
								:name="subscription.name"
								:bandwidth="subscription.bandwidth"
								:channels="subscription.channels"
								:provider="subscription.provider"
								:provider-logo="subscription.providerLogo"
								:description="subscription.description"
								:price="subscription.price"
								:picture="subscription.picture"
								:link="subscription.link"
								:multi-category="subscription.multiCategory"
								/>
						</VFlex>
					</VScaleTransition>

					<ShoppingCart
						key="3"
						class="cart"
						title="Cost"
						:text="totalCost"
						icon="payment"
						color="info"
						/>
				</VFadeTransition>
			</VContainer>
		</VCard>
		<UserRegistration />
	</div>
</template>

<script>

import SubscriptionCard from "./SubscriptionCard";
import OrderCard from "./OrderCard";
import ShoppingCart from "./ShoppingCart";

export default {
	name: "Iterator",
	components: { SubscriptionCard, OrderCard, ShoppingCart },
	data: () => ({
		selected: [],
		notInitialized: true,
		addressSearch: '',
		subscriptionType: ['private', 'company'],
		sortables: [{ sortBy: 'provider' }, { sortBy: 'name' }, { sortBy: 'bandwidth' }, { sortBy: 'price' }],
		filteredSearch: "",
		bandwidth: [0, 1000],
		channels: [0, 1000],
		price: [0, 1000],
		initialPrice: [0, 1000],
		initialBandwidth: [0, 1000],
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
		totalFilteredItems() {

			return `Filter ${this.filteredItems.length} subscriptions`
			;

		},

		totalCost() {

			let baseCost = 0;

			this.selected.forEach(subscription => {

				baseCost += subscription.price;

			});

			return `${baseCost} SEK`;

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
		randomNumberRange(Min, Max) {

			return Math.floor(Math.random() * (Max - Min + 1)) + Min;

		},

		fakeInfo(requestedSubscriptions) {

			const providers = ['Comcast', 'ATT', 'Time Warner', 'AOL', 'Verizon', 'Sprint', 'Bell', 'T-Mobile'];
			const category = ['internet', 'telephony', 'television'];
			const subscriptionType = ['private', 'company'];
			const firstNames = ['Prime', 'Great', 'First', 'Mega', 'Extreme', 'Family', 'Triple', 'Double', "Premium"];
			const secondNames = ['value', 'service', 'package', 'entertainment', 'education', 'play', 'business'];

			for (let n = 0; n < requestedSubscriptions; n += 1) {

				const multiCategories = [];

				category.sort(() => Math.random() - 0.5); // shuffle categories

				for (let i = this.randomNumberRange(0, 2); i < category.length; i += 1) {

					multiCategories.push(category[i]);

				}

				multiCategories.sort();

				const subscription = {
					id: n.toString(),
					addedToCart: false,
					subscriptionType: subscriptionType[this.randomNumberRange(0, 1)],
					provider: providers[this.randomNumberRange(0, providers.length - 1)],
					name: firstNames[this.randomNumberRange(0, firstNames.length - 1)] + " " + secondNames[this.randomNumberRange(0, secondNames.length - 1)],
					price: parseInt(this.randomNumberRange(99, 699), 10),
					description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero consequatur natus esse blanditiis sint ipsa dolorem aliquam pariatur amet illum maiores, odit eos. Expedita, aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit exercitationem expedita at explicabo, recusandae quasi nemo temporibus quo placeat, itaque culpa, unde earum. Deleniti quis quod doloribus odit? Qui fuga laboriosam sit velit sapiente, numquam laudantium rerum voluptatem accusantium dignissimos vero, molestias debitis neque ipsum ea incidunt odio obcaecati! Suscipit provident vel, quidem impedit iusto eaque error sapiente harum amet! Eius ab vel odit laboriosam aliquid facilis totam veniam odio ducimus officia repellendus corrupti, dolore eum recusandae ad quo modi ut ipsam. Quas aliquid ea incidunt suscipit, velit adipisci quaerat ducimus saepe soluta sint obcaecati sit, voluptatum quo vel iusto perspiciatis earum assumenda officiis commodi nam delectus ipsam ad odio! Repellendus odio eaque porro nisi voluptas asperiores, tempora repudiandae cum? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, aliquam sequi nisi commodi nobis harum doloribus fugit ex maxime officia hic repudiandae odit quidem omnis, blanditiis alias mollitia corrupti placeat cum! Voluptatum cumque magnam ex nam minus facilis voluptates obcaecati inventore odio tenetur? Voluptatem corporis eligendi nisi eos! Et, dolores.`,
					address: "Malmo, Sweden",
					multiCategory: multiCategories
				};

				if (multiCategories.includes('television')) {

					subscription.channels = parseInt(this.randomNumberRange(1, 100) * 10, 10);

				}

				if (multiCategories.includes('internet')) {

					subscription.bandwidth = parseInt(this.randomNumberRange(1, 100) * 10, 10);

				}

				this.items.unshift(subscription);

			}

		},
		queryServiceAddress() {

			this.resetSorting();
			// insert Service address query API below
			this.fakeInfo(12);

			// insert Service address query API above
			this.rangeMinMax();

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
