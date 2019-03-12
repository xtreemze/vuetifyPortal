<template>
	<VFlex
		xs12
		sm6
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
				<VContainer
					fill-height
					ma-0
					pa-0
					>
					<VLayout
						align-center
						justify-center
						>
						<VFlex>
							<VLayout
								column
								align-end
								>
								<VFlex
									grow
									>
									<h3>
										{{ totalCost }}
									</h3>
								</VFlex>
								<VFlex
									grow
									>
									<h3>
										{{ totalSetupFee }}
									</h3>
								</VFlex>
							</VLayout>
						</VFlex>
						<VFlex>
							<VLayout
								column
								align-start
								>
								<VFlex grow>
									<h3>
										<small class="caption">
											{{ $t("totalMonthlyRate") }}
										</small>
									&nbsp;
									</h3>
								</VFlex>
								<VFlex grow>
									<h3>
										<small class="caption">
											{{ $t("totalSetupFee") }}
										</small>
									&nbsp;
									</h3>
								</VFlex>
							</VLayout>
						</VFlex>
					</VLayout>
				</VContainer>
			</VLayout>
		</VContainer>
	</VFlex>
</template>
<script>
export default {
	name: "ShoppingCart",
	props: {
		totalItems: { type: Number, default: 0 },
		title: { type: String, default: '' },
		totalCost: { type: String, default: '' },
		totalSetupFee: { type: String, default: '' },
		color: { type: String, default: null },
		icon: { type: String, default: null }
	}
};
</script>
