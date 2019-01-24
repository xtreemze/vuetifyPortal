<template>
	<VApp dark>
		<Header />
		<VContent>
			<Iterator />
		</VContent>
		<VFooter
			class="footer"
			color="transparent"
			/>
	</VApp>
</template>

<script>
import Iterator from "./components/Iterator";
import Header from "./components/Header";

export default {
	components: { Iterator, Header }
};
</script>

<style>
.footer {
	min-height: calc(100vh / 8) !important;
}

</style>
