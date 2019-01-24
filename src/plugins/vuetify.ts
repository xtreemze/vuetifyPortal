import Vue from "vue";
//@ts-ignore
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
	theme: {
		primary: "#fa9700",
		secondary: "#424242",
		accent: "#82B1FF",
		error: "#FF5252",
		info: "#8a3afa",
		success: "#4CAF50",
		warning: "#FFC107"
	},
	customProperties: true,
	iconfont: "md"
});
