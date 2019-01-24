<template>
	<VCard
		class="pt-2 customHeader"
		color="primary"
		width="width"
		flat
		tile
		@click.stop="newPerson"
		>
		<VLayout
			align-end
			fill-height
			>
			<VFlex
				offset-xs1
				xs7
				offset-lg2
				lg6
				offset-xl2
				xl6
				class="mt-4 mb-4"
				>
				<VBtn
					flat
					color="white"
					href="tel:+0419995050"
					class="title"
					>
					<VIcon>
						phone
					</VIcon>
					+0419-995050
				</VBtn>

				<div
					class="display-4  font-weight-thin
					hidden-sm-and-down
					"
					>
					Welcome!
				</div>
				<div
					class="display-3  font-weight-thin
					hidden-md-and-up
					"
					>
					Welcome!
				</div>
				<div class="font-weight-light">
					Type in your desired service address below to search for available subscriptions. If you encounter any difficulty, give us a call!
				</div>
			</VFlex>
			<VFlex xs4>
				<VResponsive
					:height="width"
					contain
					>
					<Avataaar
						:width="width"
						avatar-style="Transparent"
						:accessories-type="accessoriesType"
						:clothe-type="clotheType"
						:eyebrow-type="eyebrowType"
						:eye-type="eyeType"
						:facial-hair-type="facialHairType"
						:facial-hair-color="facialHairColor"
						:mouth-type="mouthType"
						:skin-color="skinColor"
						:top-type="topType"
						/>
				</VResponsive>
			</VFlex>
		</VLayout>
	</VCard>
</template>

<script>

import Avataaar from 'vue-avataaar';
import * as AvatarProps from './avatarProps';

export default {
	name: "Avatar",
	components: { Avataaar },
	props: {
		width: { default: '52px', type: String }
	},
	data: () => ({
		accessoriesType: '',
		clotheType: '',
		eyebrowType: '',
		eyeType: '',
		facialHairType: '',
		facialHairColor: '',
		mouthType: '',
		skinColor: '',
		topType: ''

	}),

	created() {

		this.newPerson();

	},
	methods: {
		newPerson() {

			this.accessoriesType = this.randomPick(AvatarProps.accessoriesType);
			this.clotheType = this.randomPick(AvatarProps.clotheType);
			this.eyebrowType = this.randomPick(AvatarProps.eyebrowType);
			this.eyeType = this.randomPick(AvatarProps.eyeType);
			this.facialHairType = this.randomPick(AvatarProps.facialHairType);
			this.facialHairColor = this.randomPick(AvatarProps.facialHairColor);
			this.mouthType = this.randomPick(AvatarProps.mouthType);
			this.skinColor = this.randomPick(AvatarProps.skinColor);
			this.topType = this.randomPick(AvatarProps.topType);

		},

		randomNumberRange(Min, Max) {

			return Math.floor(Math.random() * (Max - Min + 1)) + Min;

		},

		randomPick(array) {

			const index = this.randomNumberRange(0, array.length);

			return array[index];

		}

	}
};
</script>

<style>
.customHeader {
	height: calc((100vh / 3));
	min-height: 300px;
}

</style>
