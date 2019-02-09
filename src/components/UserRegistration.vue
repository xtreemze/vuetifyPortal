<template>
	<VFlex
		xs12
		sm6
		md4
		lg4
		xl4
		>
		<VSlideYReverseTransition>
			<VContainer
				fill-height
				pa-0
				ma-0
				mt-3
				>
				<VLayout
					v-if="!newUser"
					row
					align-center
					justify-center
					>
					<VChip
						close
						color="info"
						label
						@input="logOut"
						>
						<VAvatar>
							<VBadge
								:value="items !== '0'"
								left
								color="primary"
								>
								<span
									slot="badge"
									>
									{{ items }}
								</span>
								<VIcon>
									shopping_cart
								</VIcon>
							</VBadge>
						</VAvatar>
						{{ userAccount.firstName }}
					</VChip>
				</VLayout>
				<VLayout
					v-if="newUser"
					column
					align-end
					justify-center
					>
					<VBtn

						:flat="createAccountSnackbar"

						color="info"
						@click.stop="newUserSnackbar = false; bottomSheet = true; stepper = 0;"
						>
						Create account
					</VBtn>

					<VBtn
						:flat="createAccountSnackbar"

						color="info"
						@click.stop=" emainingLoginAttempts = 0; newUserSnackbar = false; newUser = true; loginPrompt = true; stepper = 1;"
						>
						Password reset
					</VBtn>

					<VBtn
						:flat="createAccountSnackbar"

						color="info"
						@click.stop="remainingLoginAttempts = 3; newUserSnackbar = false; newUser = true; loginPrompt = true; stepper = 1;"
						>
						Log in
					</VBtn>
				</VLayout>
			</VContainer>
		</VSlideYReverseTransition>

		<VSnackbar
			v-if="remainingLoginAttempts > 0"
			v-model="newUserSnackbar"
			:timeout="infinity"
			top
			color="secondary"
			>
			Have an existing account?
			<VBtn
				color="info"
				flat
				@click.stop="newUserSnackbar = false; loginPrompt = true; stepper = 1;"
				>
				Log in
			</VBtn>
		</VSnackbar>

		<VSnackbar
			v-model="verifyEmailSnackbar"
			:timeout="infinity"
			top
			color="success"
			>
			<VIcon left>
				email
			</VIcon>
			Please check your email
			<VSpacer />

			<VBtn
				flat
				color="white"
				@click.native="verifyEmailSnackbar = false"
				>
				Close
			</VBtn>
		</VSnackbar>
		<VSnackbar
			v-model="loggedOutSnackbar"
			:timeout="4000"
			top
			color="warning"
			>
			You have logged out
			<VSpacer />
		</VSnackbar>

		<VSnackbar
			v-model="loginValidated"
			:timeout="4000"
			top
			color="success"
			>
			<VIcon left>
				sentiment_satisfied_alt
			</VIcon>
			Welcome, {{ userAccount.firstName }} {{ userAccount.lastName }}!
			<VSpacer />
		</VSnackbar>

		<VDialog
			v-model="loginPrompt"
			transition="dialog-bottom-transition"
			max-width="380px"
			>
			<VCard
				v-if="newUser"
				flat
				>
				<VCardText>
					<VContainer grid-list-md>
						<VLayout column>
							<VForm
								v-model="validLogin"
								>
								<VFlex
									xs12

									mb-3
									pb-3
									>
									<h1
										align-center
										justify-center
										class="font-weight-light display-1"
										>
										{{ remainingLoginAttempts > 0 ? 'Log in': 'Password reset' }}
									</h1>
								</VFlex>
								<VTextField
									v-if="loginPrompt && remainingLoginAttempts > 0"
									v-model.trim="userLogin.email"
									autofocus
									required
									:rules="[rules.required]"
									type="email"
									label="E-mail"
									browser-autocomplete="email"
									min="4"
									prepend-icon="email"
									@keypress.enter="$refs.emailField.focus()"
									/>

								<VTextField
									v-if="loginPrompt && remainingLoginAttempts > 0"
									ref="emailField"
									v-model.trim="userLogin.password"
									class="my-3"
									:rules="[rules.required]"
									required
									name="password"
									label="Password"
									:append-icon="visible ? 'visibility_off' : 'visibility'"
									:type="visible ? 'text' : 'password'"
									min="8"
									prepend-icon="vpn_key"
									@click:append="() => (visible = !visible)"
									@keypress.enter="verifyEmailPassword"
									/>

								<VTextField
									v-if="loginPrompt && remainingLoginAttempts < 1"

									v-model.trim="userLogin.email"
									autofocus
									required
									:rules="[rules.required, rules.email]"
									type="email"
									label="E-mail"
									browser-autocomplete="email"
									min="4"
									prepend-icon="email"
									/>

								<VTextField
									v-if="loginPrompt && remainingLoginAttempts < 1"
									v-model.trim="userLogin.password"
									class="my-3"
									:rules="[rules.required, rules.password]"
									required
									name="password"
									:append-icon="visible ? 'visibility_off' : 'visibility'"
									:type="visible ? 'text' : 'password'"
									label="Your new password"
									min="8"
									prepend-icon="vpn_key"
									@click:append="() => (visible = !visible)"
									/>
								<VTextField
									v-if="loginPrompt && remainingLoginAttempts < 1"
									v-model.trim="userLogin.passwordRepeat"
									class="my-3"
									:rules="[rules.passwordRepeat]"
									required
									:append-icon="visible2 ? 'visibility_off' : 'visibility'"
									:type="visible2 ? 'text' : 'password'"
									name="passwordRepeat"
									label="Repeat password"
									min="8"
									prepend-icon="vpn_key"
									@click:append="() => (visible2 = !visible2)"
									/>
								<VBtn
									v-if="remainingLoginAttempts > 0"
									ref="loginButton"
									color="primary"
									flat
									:disabled="!validLogin"
									block
									large
									@click="verifyEmailPassword"
									>
									Log in
								</VBtn>
								<VBtn
									v-else
									color="primary"
									flat
									:disabled="!validLogin"
									block
									large
									@click="resetPassword"
									>
									Reset password via email
								</VBtn>
							</VForm>
						</VLayout>
					</VContainer>
				</VCardText>
			</VCard>
		</VDialog>

		<VDialog
			v-model="bottomSheet"
			transition="dialog-bottom-transition"
			max-width="600px"
			>
			<VLayout

				wrap
				justify-space-around
				>
				<VStepper
					v-if="newUser"
					v-model="stepper"
					vertical
					non-linear
					>
					<VStepperStep
						:complete="validatedFormField[0]"
						step="0"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						GDPR Agreement
						<small>
							In order to provide the services that you are requesting, we need to collect and record some of your personal information
						</small>
					</VStepperStep>

					<VStepperContent
						v-if="userAccount.gdprConsent"
						step="0"
						>
						<VForm
							ref="step0"
							v-model="validatedFormField[0]"
							>
							<VCard
								class="mb-5"
								flat
								color="transparent"
								>
								<VCardText>
									Because your privacy is important to us, we ask your consent to collect and keep your personally identifiable information and want to remind you of your right to be forgotten.
									<VCheckbox
										v-model="userAccount.gdprConsent[0]"
										color="primary"
										:rules="[rules.required]"
										required
										label="I consent that personally identifiable information I provide on this site will be collected and recorded."
										/>

									<VCheckbox
										v-model="userAccount.gdprConsent[1]"
										color="primary"
										:rules="[rules.required]"
										required
										label="	I understand that I have the 'right to be forgotten' and I may, at any time, request the complete and irreversible removal of all my personally identifiable information via phone or email."
										/>
								</VCardText>
							</VCard>
							<VLayout row>
								<VFlex>
									<VBtn
										color="primary"
										flat
										:disabled="!validatedFormField[0]"
										block
										large
										@click="stepper = 1"
										>
										Agree to consent
									</VBtn>
								</VFlex>
								<VFlex>
									<VBtn
										flat
										block
										large
										@click="cancelRegistration()"
										>
										Disagree
									</VBtn>
								</VFlex>
							</VLayout>
						</VForm>
					</VStepperContent>
					<VStepperStep
						:editable="validatedFormField[0]"
						edit-icon="check"
						:complete="validatedFormField[1]"
						step="1"
						>
						Your identity
						<small>
							Your personal identity information
						</small>
					</VStepperStep>

					<VStepperContent
						step="1"
						>
						<VForm
							ref="step1"
							v-model="validatedFormField[1]"
							>
							<VCard
								class="mb-5"
								flat
								color="transparent"
								>
								<VCardText>
									<VTextField
										v-model.trim="userAccount.firstName"
										:rules="[rules.required]"
										required
										label="First name"
										/>
									<VTextField
										v-model.trim="userAccount.lastName"
										:rules="[rules.required]"
										required
										name="lastName"
										label="Last name"
										/>
									<VTextField
										v-model.trim="userAccount.socialSecurity"
										:rules="[rules.social]"
										required
										label="Social security #"
										/>
								</VCardText>
							</VCard>
							<VLayout row>
								<VFlex>
									<VBtn
										color="primary"
										flat
										:disabled="!validatedFormField[1]"
										block
										large
										@click="stepper = 2"
										>
										Continue
									</VBtn>
								</VFlex>
								<VFlex>
									<VBtn
										flat
										block
										large
										@click="cancelRegistration()"
										>
										Cancel
									</VBtn>
								</VFlex>
							</VLayout>
						</VForm>
					</VStepperContent>

					<VStepperStep
						:complete="validatedFormField[2]"
						step="2"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						Contact information
						<small>
							Provide your email and phone number
						</small>
					</VStepperStep>

					<VStepperContent
						step="2"
						>
						<VForm
							ref="step2"
							v-model="validatedFormField[2]"
							>
							<VCard
								color="transparent"
								flat
								class="mb-5"
								>
								<VTextField
									v-model="userAccount.email"
									:rules="[rules.email]"
									required
									type="email"
									label="E-mail"
									hint="You will need to verify your email before your subscriptions are activated"
									/>
								<VTextField
									v-model="userAccount.phone"
									label="Phone"
									:rules="[rules.phone]"
									required
									hint="+CC AAA-XXX XX XX"
									/>
							</VCard>
							<VLayout>
								<VBtn
									flat
									color="primary"
									pl-0
									:disabled="!validatedFormField[2]"
									block
									large
									@click="stepper = 3"
									>
									Continue
								</VBtn>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									Cancel
								</VBtn>
							</vlayout>
						</VForm>
					</VStepperContent>

					<VStepperStep
						:complete="validatedFormField[3]"
						step="3"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						Payment information
						<small>
							If you would like to change these options, please contact your service provider
						</small>
					</VStepperStep>
					<VStepperContent
						step="3"
						>
						<VForm
							ref="step3"
							v-model="validatedFormField[3]"
							>
							<VCard
								color="transparent"
								flat
								class="mb-5"
								>
								<VTextField
									v-model="userAccount.paymentType"
									label="Payment method"
									disabled
									/>
							</VCard>
							<VLayout row>
								<VFlex>
									<VBtn
										color="primary"
										flat
										:disabled="!validatedFormField[3]"
										block
										large
										@click="stepper = 4"
										>
										Continue
									</VBtn>
								</VFlex>
								<VFlex>
									<VBtn
										flat
										block
										large
										@click="cancelRegistration()"
										>
										Cancel
									</VBtn>
								</VFlex>
							</VLayout>
						</VForm>
					</VStepperContent>
					<VStepperStep
						:complete="validatedFormField[4]"
						step="4"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						Invoice address
						<small>
							Verify your billing address
						</small>
					</VStepperStep>
					<VStepperContent
						step="4"
						>
						<VForm
							ref="step4"
							v-model="validatedFormField[4]"
							>
							<VCard
								color="transparent"
								flat
								class="mb-5"
								>
								<VTextField
									label="Service address"
									:value="addressSearch"
									disabled
									@change="()=>{addressSearch}"
									/>
								<VTextField
									v-model="userAccount.invoiceAddress"
									label="Invoice address"
									:value="addressSearch"
									:rules="[rules.required]"
									required
									/>
							</VCard>
							<VLayout row>
								<VFlex>
									<VBtn
										color="primary"
										flat
										:disabled="!validatedFormField[4]"
										block
										large
										@click="stepper = 5"
										>
										Continue
									</VBtn>
								</VFlex>
								<VFlex>
									<VBtn
										flat
										block
										large
										@click="cancelRegistration()"
										>
										Cancel
									</VBtn>
								</VFlex>
							</VLayout>
						</VForm>
					</VStepperContent>
					<VStepperStep
						:complete="validatedFormField[5]"
						step="5"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						Contact persons
						<small>
							Provide contact people that you know
						</small>
					</VStepperStep>
					<VStepperContent
						step="5"
						>
						<VForm
							ref="step5"
							v-model="validatedFormField[5]"
							>
							<VCard
								color="transparent"
								flat
								class="mb-5"
								>
								<VTextField
									:rules="[rules.required]"
									required
									label="First name"
									/>
								<VTextField
									:rules="[rules.required]"
									required
									name="lastName"
									label="Last name"
									/>
								<VTextField
									:rules="[rules.email]"
									required
									type="email"
									label="E-mail"
									hint="You will need to verify your email before your subscriptions are activated"
									/>
								<VTextField
									label="Phone"
									:rules="[rules.phone]"
									required
									hint="+CC AAA-XXX XX XX"
									/>
								<VBtn
									color="primary"
									flat
									:disabled="!validatedFormField[5]"
									block
									large

									@click=" ateNewContact()"
									>
									<VIcon left>
										person_add
									</VIcon>
									Add contact
								</VBtn>
								<VChip
									label
									color="info"
									close
									>
									<VIcon left>
										account_circle
									</VIcon> Contact
								</VChip>
							</VCard>
							<VLayout row>
								<VFlex>
									<VBtn
										color="primary"
										flat
										:disabled="!validatedFormField[5]"
										block
										large
										@click="stepper = 6"
										>
										Continue
									</VBtn>
								</VFlex>
								<VFlex>
									<VBtn
										flat
										block
										large
										@click="cancelRegistration()"
										>
										Cancel
									</VBtn>
								</VFlex>
							</VLayout>
						</VForm>
					</VStepperContent>
					<VStepperStep
						:complete="validatedFormField[6]"
						step="6"
						:editable="validatedFormField[0]"
						edit-icon="check"
						>
						Account security
						<small>
							Create a secure password
						</small>
					</VStepperStep>

					<VStepperContent
						step="6"
						>
						<VForm
							ref="step6"
							v-model="validatedFormField[6]"
							>
							<VCard
								color="transparent"
								flat
								class="mb-5"
								>
								<VTextField
									v-model.trim="userAccount.password"
									:rules="[rules.password, rules.required]"
									required
									:append-icon="visible ? 'visibility_off' : 'visibility'"
									:type="visible ? 'text' : 'password'"
									name="password"
									label="Password"
									min="8"
									@click:append="() => (visible = !visible)"
									/>
								<VTextField
									v-model.trim="userAccount.passwordRepeat"
									:rules="[rules.passwordRepeat]"
									required
									:append-icon="visible2 ? 'visibility_off' : 'visibility'"
									:type="visible2 ? 'text' : 'password'"
									name="passwordRepeat"
									label="Repeat password"
									min="8"
									@click:append="() => (visible2 = !visible2)"
									/>
							</VCard>
							<VLayout>
								<VBtn
									flat
									:disabled="!validatedFormField[6]"
									color="primary"
									block
									large
									@click="createNewUser()"
									>
									Continue
								</VBtn>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									Cancel
								</VBtn>
							</vlayout>
						</VForm>
					</VStepperContent>
				</VStepper>
			</VLayout>
		</VDialog>
	</VFlex>
</template>

<script>

export default {
	name: "UserRegistration",
	props: {
		cart: { type: Boolean, default: false },
		calendarDisplayed: { type: Boolean, default: false },
		addressSearch: { type: String, default: null },
		items: { type: String, default: null },
		createAccountSnackbar: {type: Boolean, default: false}
	},

	data() {

		const emptyUser = {
			uniqueKey: Date.now(),
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			passwordRepeat: '',
			phone: '+46 ',
			serviceAddress: this.addressSearch,
			invoiceAddress: this.addressSearch,
			paymentType: 'paper',
			socialSecurity: '',
			subscriptions: [],
			contactPersons: [],
			gdprConsent: [false, false]
		};

		return {
			remainingLoginAttempts: 3,
			visible: false,
			visible2: false,
			loggedOutSnackbar: false,
			emptyUser: emptyUser,
			existingAccounts: [{
				uniqueKey: '1549289140953',
				firstName: 'Carlos',
				lastName: 'Velasco',
				email: 'a',
				password: 'a',
				passwordRepeat: '',
				phone: '+1123123',
				serviceAddress: 'Malmö, Sweden',
				invoiceAddress: 'Malmö, Sweden',
				socialSecurity: '1234534343',
				subscriptions: [],
				contactPersons: [],
				gdprConsent: [true, true]
			}],
			userLogin: {
				email: '',
				password: ''
			},
			validLogin: '',
			verifyEmailSnackbar: false,
			loginValidated: '',
			validatedFormField: [false, false, false, false, false],
			newUser: true,
			stepper: 0,
			stepperLoggedIn: '',
			userAccount: emptyUser,
			loginPrompt: false,
			bottomSheet: false,
			newUserSnackbar: false,
			infinity: 0,
			pageEnd: false,
			rules: {
				required: value => !!value || 'Required',
				email: value => {

					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					return pattern.test(value) || 'Invalid e-mail';

				},
				phone: value => {

					const pattern = /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/g;

					return pattern.test(value) || 'Use international format +CC AAA-XXX XX XX';

				}
				,
				social: value => {

					const pattern = /^(19|20)?(\d{6}([-+]|\s)\d{4}|(?!19|20)\d{10})$/;

					return pattern.test(value) || 'Invalid number';

				}
				,
				password: value => {

					const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

					return pattern.test(value) || 'At least 8 characters, 1 uppercase and lowercase letter, and 1 number';

				}
				,
				passwordRepeat: value => {

					return (value === this.userLogin.password || value === this.userAccount.password) || 'Passwords do not match';

				}
			}

		};

	},
	watch: {
		addressSearch: function () {

			this.userAccount.invoiceAddress = this.addressSearch
			;

		},
		calendarDisplayed: function () {

			this.toggleSnackbar();

		},
		bottomSheet: function () {

			this.toggleSnackbar();

		},
		pageEnd: function () {

			this.toggleSnackbar();

		}

	},
	destroyed() {

		window.removeEventListener('scroll', this.bodyTotallyScrolled);

	},
	created() {

		window.addEventListener('scroll', this.bodyTotallyScrolled);

		this.$nextTick(() => {

			this.newUser = true;
			this.newUserSnackbar = true;
			// this.newUser = false;
			// this.newUserSnackbar = false;

			// this.loginPrompt = true;
			// this.userLogin.email = 'a';
			// this.userLogin.password = 'a';

		});

	},
	methods: {
		complicate(string) {

			const salt = '!#)fe%t32xo#-!&@#AS4DsdfJej';

			const result = string[6] + salt[3] + string[4] + '57003AARs40@$';

			string += salt + result + salt[7] + (2544323235 * 34552123224) + result;

			const level1 = 'Confused?' + string + result.split(string[4]).reverse()
				.join(string[4]) + string[21];

			const level2 = level1 + level1.split(salt[5]).reverse()
				.join(salt[5]) + salt + (2593423424235 * 3452235405234);

			return level2.split(string[2]).reverse()
				.join(string[2]);

		},

		resetPassword(){

			this.loginPrompt = false;
			this.bottomSheet = false;
			this.stepper = 0;
			this.userLogin.email = '';
			this.userLogin.password = '';
			this.userLogin.passwordRepeat = '';
			this.verifyEmailSnackbar = true;
			this.newUser = true;

			this.remainingLoginAttempts = 3;

		},
		cancelRegistration() {

			this.loginPrompt = false;
			this.bottomSheet = false;
			this.stepper = 0;

		},
		logOut() {

			this.loginPrompt = false;
			this.loggedOutSnackbar = true;
			this.newUser = true;
			this.stepper = 0;
			this.userAccount = this.emptyUser;
			this.userLogin.email = '';
			this.userLogin.password = '';
			this.loginValidated = false;
			this.loginPromptValidated = false;
			this.loginPromptSnackbar = true;
			this.remainingLoginAttempts = 3;
			this.validatedFormField = [false, false, false, false, false];
			this.$emit('change', false);

		},
		createNewUser() {

			this.stepper = 0;
			this.verifyEmailSnackbar = true;
			this.bottomSheet = false;
			this.existingAccounts.push(userAccount);

		},
		verifyEmailPassword() {

			const userAccount = this.existingAccounts.find(userAccount => userAccount.email === this.userLogin.email && userAccount.password === this.userLogin.password);

			if (userAccount !== undefined) {

				this.loggedOutSnackbar = false;
				this.loginPromptValidated = true;
				this.loginPromptSnackbar = false;
				this.loginPrompt = false;
				this.stepper = 1;
				this.userAccount = userAccount;
				this.newUser = false;
				this.loginValidated = true;
				this.$emit('change', true, this.userAccount);

			} else {

				this.remainingLoginAttempts -= 1;
				this.loggedOutSnackbar = false;
				this.validatedFormField = [false, false, false, false, false];
				this.newUser = true;
				this.loginPromptValidated = false;
				this.loginPromptSnackbar = true;
				this.stepper = 0;
				this.userAccount = this.emptyUser;
				// this.userLogin.email = '';
				this.userLogin.password = '';
				this.loginValidated = false;

			}

		},

		validate() {

			return this.$refs.form.validate();

		},
		reset() {

			this.$refs.form.reset();

		},
		resetValidation() {

			this.$refs.form.resetValidation();

		},
		bodyTotallyScrolled() {

			if (this.bottomSheet === false && this.loginPrompt === false && (document.body.clientHeight - window.scrollY <= window.innerHeight + 80)) {

				this.pageEnd = 1;

			} else if (this.bottomSheet === false && this.loginPrompt === false && (window.scrollY <= 10)) {

				this.pageEnd = 2;

			} else if (this.bottomSheet === false && this.loginPrompt === false && (window.scrollY <= window.innerHeight + 80)) {

				this.pageEnd = 1;

			} else {

				this.pageEnd = 0;

			}
			this.toggleSnackbar();

		},
		toggleSnackbar() {

			if (!this.newUser || this.bottomSheet === true || this.loginPrompt === true || this.calendarDisplayed === true || this.pageEnd < 2) {

				this.newUserSnackbar = false;

			} else if (this.calendarDisplayed === false && this.bottomSheet === false && this.loginPrompt === false && this.newUser) {

				this.newUserSnackbar = true;

			}

		}
	}
};
</script>
