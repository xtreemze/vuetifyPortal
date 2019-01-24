<template>
	<VLayout
		row
		wrap
		justify-space-around
		>
		<VFlex>
			<VTextField
				v-model="search"
				class="headline"
				block
				hide-actions
				hide-details
				prepend-icon="my_location"
				label="Service address..."
				/>
		</VFlex>
		<VFlex shrink>
			<VBtn
				flat
				large
				>
				<VIcon
					large
					>
					search
				</VIcon>
			</VBtn>
		</VFlex>
	</VLayout>
</template>

<script>

export default {
	name: "Address",

	data: () => ({
		search: ''
	})
};

</script>
