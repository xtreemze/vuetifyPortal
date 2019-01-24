<template>
	<VFlex
		grow
		>
		<VContainer
			fluid
			my-0
			py-0
			fill-height
			>
			<VLayout
				row
				justify-center
				align-center
				>
				<h1 class="text--secondary">
					<VIcon
						large
						class="text--secondary"
						>
						{{ icon }}
					</VIcon>

					{{ text }}
				</h1>
			</VLayout>
		</VContainer>
	</VFlex>
</template>

<script>
export default {
	name: "ShoppingCart",
	props: {
		title: { type: String, default: '' },
		text: { type: String, default: '' },
		color: { type: String, default: null },
		icon: { type: String, default: null }
	}
};
</script>
