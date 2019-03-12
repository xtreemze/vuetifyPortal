<template>
	<VCard
		class="pt-2 customHeader"
		color="primary"
		width="width"
		flat
		tile
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
					href="tel:+0416585050"
					class="title"
					>
					<VIcon>
						phone
					</VIcon>
					+0416-585050
				</VBtn>
				<section
					class="display-4  font-weight-thin
					hidden-sm-and-down
					"
					>
					{{ $t("welcome") }}!
				</section>
				<section
					class="display-3  font-weight-thin
					hidden-md-and-up
					"
					>
					{{ $t("welcome") }}!
				</section>
				<section class="font-weight-light">
					<p>
						{{ $t("instructions") }}
						<br>
						{{ $t("instructions2") }}
					</p>
				</section>
				<VContainer
					ma-0
					pa-0
					>
					<VLayout>
						<VFlex shrink>
							<VSelect
								v-model="$i18n.locale"
								flat
								:items="langs"
								item-value="value"
								item-text="label"
								:label="$t('language')"
								prepend-icon="language"
								color="white"
								/>
						</VFlex>
					</VLayout>
				</VContainer>
			</VFlex>
			<VFlex xs4>
				<VResponsive
					:height="width"
					contain
					@click.stop="newPerson"
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
		langs: [{value: 'sv', label: 'Svenska'}, {value: 'en', label: 'English'}], // add new languages here and a .json in the locales folder
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
		this.$i18n.locale = this.determineLocale(); // automatic language detection
	
	},
	methods: {
		determineLocale() {

			if (navigator.languages && navigator.languages.length) {

				return navigator.languages[1];
			
			} else {

				return navigator.userLanguage || navigator.language[0] + navigator.language[1] || navigator.browserLanguage || 'en';
			
			}
		
		},
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
	min-height: 460px;
}
</style>
