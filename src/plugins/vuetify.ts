import Vue from "vue";
//@ts-ignore
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
Vue.use(Vuetify, {
	theme: {
		primary: "#ee44aa",
		secondary: "#424242",
		accent: "#82B1FF",
		error: "#d75757",
		info: "#2196F3",
		success: "#46b94b",
		warning: "#FFC107"
	},
	customProperties: true,
	iconfont: "md"
});
