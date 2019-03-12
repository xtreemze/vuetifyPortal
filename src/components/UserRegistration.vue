<template>
	<VFlex
		v-if="newUser"
		xs12
		sm6
		md4
		lg4
		xl4
		mb-4
		mt-4
		pt-4
		pb-4
		>
		<VContainer
			fill-height
			pa-0
			ma-0
			mt-3
			>
			<VLayout
				justify-center
				wrap
				align-center
				>
				<VFlex>
					<VBtn
						:flat="createAccountSnackbar"
						color="info"
						@click.stop=" bottomSheet = true; stepper = 0;"
						>
						{{ $t("createAccount") }}
					</VBtn>
				</VFlex>
				<VFlex>
					<VBtn
						:flat="createAccountSnackbar"
						color="info"
						@click.stop=" remainingLoginAttempts = 0; newUser = true; loginPrompt = true; stepper = 1;"
						>
						{{ $t("passwordReset") }}
					</VBtn>
				</VFlex>
				<VFlex>
					<VBtn
						:flat="createAccountSnackbar"
						color="info"
						:ripple="false"
						@click.stop="remainingLoginAttempts = 3; newUser = true; loginPrompt = true; stepper = 1;"
						>
						{{ $t("login") }}
					</VBtn>
				</VFlex>
			</VLayout>
		</VContainer>
		<VSnackbar
			v-if="!loggedOutSnackbar"
			v-model="verifyEmailSnackbar"
			:timeout="infinity"
			top
			color="success"
			>
			<VIcon left>
				email
			</VIcon>
			{{ $t("checkEmail") }}
			<VSpacer />
			<VBtn
				flat
				color="white"
				@click.native="verifyEmailSnackbar = false"
				>
				<VIcon>
					close
				</VIcon>
			</VBtn>
		</VSnackbar>
		<VSnackbar
			v-if="!loggedOutSnackbar"
			v-model="loginValidated"
			:timeout="4000"
			top
			color="success"
			>
			<VIcon left>
				sentiment_satisfied_alt
			</VIcon>
			{{ $t("welcome") }} {{ userAccount.name }}!
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
									:label="$t('email')"
									browser-autocomplete="email"
									min="4"
									prepend-icon="email"
									@keypress.enter="$refs.emailField.focus()"
									/>
								<VTextField
									v-if="loginPrompt && remainingLoginAttempts > 0"
									v-model.trim="userLogin.password"
									class="my-3"
									:rules="[rules.required]"
									required
									name="password"
									browser-autocomplete="current-password"
									:label="$t('password')"
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
									:label="$t('email')"
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
									:label="$t('newPassword')"
									browser-autocomplete="new-password"
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
									browser-autocomplete="new-password"
									:label="$t('repeatPassword')"
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
									:ripple="false"
									large
									@click="verifyEmailPassword"
									>
									{{ $t("login") }}
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
									{{ $t("resetPasswordEmail") }}
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
			<VStepper
				v-model="stepper"
				vertical
				non-linear
				>
				<VStepperStep
					:complete="validatedFormField[0]"
					step="0"
					edit-icon="check"
					>
					{{ $t("gpdrAgreement") }}
					<small>
						{{ $t("gpdrDescription") }}
					</small>
				</VStepperStep>
				<VStepperContent
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
								{{ $t('step0Intro') }}
								<VCheckbox
									v-model="userAccount.gdprConsent[0]"
									color="primary"
									:rules="[rules.required]"
									required
									:label="$t('step0Label')"
									/>
								<VCheckbox
									v-model="userAccount.gdprConsent[1]"
									color="primary"
									:rules="[rules.required]"
									required
									:label="$t('step0Label2')"
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
									{{ $t("agree") }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("disagree") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="validatedFormField[1]"
					step="1"
					edit-icon="check"
					>
					{{ $t("step1Label") }}
					<small>
						{{ $t("step1Intro") }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="1"
					>
					<VForm
						ref="step1"
						v-model="validatedFormField[1]"
						@submit.enter.prevent
						>
						<VCard
							class="mb-5"
							flat
							color="transparent"
							>
							<VCardText>
								<VRadioGroup
									v-model="userAccount.type"
									mandatory
									:rules="[rules.required]"
									>
									<VRadio
										color="primary"
										value="private"
										:label="$t('step1Radio1')"
										/>
									<VRadio
										color="primary"
										value="business"
										:label="$t('step1Radio2')"
										/>
								</VRadioGroup>
							</VCardText>
						</VCard>
						<VLayout row>
							<VFlex>
								<VBtn
									color="primary"
									flat
									:disabled="!validatedFormField[1]"
									block
									type="submit"
									large
									@click="stepper = 2"
									>
									{{ $t('proceed') }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("cancel") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					:complete="validatedFormField[2]"
					step="2"
					>
					{{ $t('step2Label') }}
					<small>
						{{ $t('step2Description') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="2"
					>
					<VForm
						ref="step2"
						v-model="validatedFormField[2]"
						@submit.enter.prevent
						>
						<VCard
							class="mb-5"
							flat
							color="transparent"
							>
							<VCardText>
								<VTextField
									v-model.trim="userAccount.name"
									:rules="[rules.required]"
									required
									:label="userAccount.type === 'private'? $t('step2Field1') : $t('step2Field2')"
									/>
								<VTextField
									v-model.trim="userAccount.identificationNumber"
									:rules="userAccount.type === 'private'? [rules.social]: []"
									required
									type="tel"
									:label="userAccount.type === 'private'? $t('step2Field3')
										: $t('step2Field4')
									"
									/>
								<VTextField
									v-model.trim="userAccount.extraIdentificationNumber"
									type="tel"
									disabled
									:label="$t('step2Field5')"
									/>
							</VCardText>
						</VCard>
						<VLayout row>
							<VFlex>
								<VBtn
									color="primary"
									flat
									:disabled="!validatedFormField[2]"
									type="submit"
									block
									large
									@click="stepper = 3"
									>
									{{ $t("continue") }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("cancel") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="validatedFormField[3]"
					step="3"
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					>
					{{ $t('step3Label') }}
					<small>
						{{ $t('step3Intro') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="3"
					>
					<VForm
						ref="step3"
						v-model="validatedFormField[3]"
						@submit.enter.prevent
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
								:label="$t('email')"
								:hint="$t('step3Field1')"
								/>
							<VTextField
								v-model="userAccount.telephone"
								:label="$t('telephone')"
								type="tel"
								:rules="userAccount.telephone.length>4? [rules.phone]: []"
								hint="+CC AAA-XXX XX XX"
								/>
							<VTextField
								v-model="userAccount.cellphone"
								:label="$t('cellphone')"
								type="tel"
								:rules="userAccount.cellphone.length>4? [rules.phone]: []"
								hint="+CC AAA-XXX XX XX"
								/>
							<VTextField
								v-model="userAccount.url"
								:label="$t('homepage')"
								type="url"
								:hint="$t('optionalURL')"
								/>
						</VCard>
						<VLayout>
							<VBtn
								flat
								pl-0
								type="submit"
								color="primary"
								:disabled="!validatedFormField[3]"
								block
								large
								@click="stepper = 4"
								>
								{{ $t("continue") }}
							</VBtn>
							<VBtn
								flat
								block
								large
								@click="cancelRegistration()"
								>
								{{ $t("cancel") }}
							</VBtn>
						</vlayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="validatedFormField[4]"
					step="4"
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					>
					{{ $t('step4Label') }}
					<small>
						{{ $t('step4Description') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="4"
					>
					<VForm
						ref="step4"
						v-model="validatedFormField[4]"
						@submit.enter.prevent
						>
						<VCard
							color="transparent"
							flat
							class="mb-5"
							>
							<VTextField
								v-model="userAccount.paymentMethod"
								:label="$t('step4Field1')"
								disabled
								/>
							<VTextField
								v-model="userAccount.paymentPeriod"
								:label="$t('step4Field2')"
								disabled
								/>
						</VCard>
						<VLayout row>
							<VFlex>
								<VBtn
									flat
									color="primary"
									:disabled="!validatedFormField[4]"
									block
									type="submit"
									large
									@click="stepper = 5"
									>
									{{ $t("continue") }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("cancel") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="validatedFormField[5]"
					step="5"
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					>
					{{ $t('step5Label') }}
					<small>
						{{ $t('step5Description') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="5"
					>
					<VForm
						ref="step5"
						v-model="validatedFormField[5]"
						@submit.enter.prevent
						>
						<VCard
							color="transparent"
							flat
							class="mb-5"
							>
							<VTextField
								v-model="userAccount.invoiceAddress"
								:label="$t('step5Field1')"
								:value="addressSearch"
								:rules="[rules.required]"
								required
								/>
						</VCard>
						<VLayout row>
							<VFlex>
								<VBtn
									flat
									color="primary"
									:disabled="!validatedFormField[5]"
									block
									type="submit"
									large
									@click="stepper = 6"
									>
									{{ $t("continue") }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("cancel") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="userAccount.type ==='business' && userAccount.contactPersons.length > 0 || true"
					step="6"
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					>
					{{ $t('step6Label') }}
					<small>
						{{ $t('step6Description') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="6"
					>
					<VForm
						ref="step6"
						v-model="validatedFormField[6]"
						@submit.enter.prevent
						>
						<VCard
							color="transparent"
							flat
							class="mb-5"
							>
							<VTextField
								v-model="contact.name"
								:rules="[rules.required]"
								required
								:label="$t('name')"
								/>
							<VTextField
								v-model="contact.email"
								:rules="[rules.email]"
								required
								type="email"
								:label="$t('email')"
								/>
							<VTextField
								v-model="contact.telephone"
								:label="$t('telephone')"
								:rules="contact.telephone.length > 4? [rules.phone] : []"
								type="tel"
								hint="+CC AAA-XXX XX XX"
								/>
							<VTextField
								v-model="contact.cellphone"
								:label="$t('cellphone')"
								type="tel"
								:rules="contact.cellphone.length > 4? [rules.phone] : []"
								hint="+CC AAA-XXX XX XX"
								/>
							<VBtn
								color="primary"
								flat
								:disabled="!validatedFormField[6]"
								block
								large
								@click="createNewContact()"
								>
								<VIcon left>
									person_add
								</VIcon>
								{{ $t('addContact') }}
							</VBtn>
							<VChip
								v-for="(person, index) in userAccount.contactPersons"
								:key="index"
								label
								color="info"
								close
								@input="userAccount.contactPersons.splice(index, 1);"
								@click="contact = person"
								>
								<VIcon left>
									account_circle
								</VIcon> {{ person.name }}
							</VChip>
						</VCard>
						<VLayout row>
							<VFlex>
								<VBtn
									color="primary"
									flat
									:disabled="(userAccount.contactPersons.length < 1 && userAccount.type === 'business')"
									block
									type="submit"
									large
									@click="stepper = 7"
									>
									{{ $t("continue") }}
								</VBtn>
							</VFlex>
							<VFlex>
								<VBtn
									flat
									block
									large
									@click="cancelRegistration()"
									>
									{{ $t("cancel") }}
								</VBtn>
							</VFlex>
						</VLayout>
					</VForm>
				</VStepperContent>
				<VStepperStep
					:complete="validatedFormField[7]"
					step="7"
					:editable="validatedFormField[0] && validatedFormField[1]"
					edit-icon="check"
					>
					{{ $t('step7Label') }}
					<small>
						{{ $t('step7Description') }}
					</small>
				</VStepperStep>
				<VStepperContent
					step="7"
					>
					<VForm
						ref="step7"
						v-model="validatedFormField[7]"
						@submit.enter.prevent
						>
						<VCard
							color="transparent"
							flat
							class="mb-5"
							>
							<VTextField
								v-model.trim="userAccount.email"
								:label="$t('email')"
								browser-autocomplete="email"
								disabled
								/>
							<VTextField
								v-model.trim="userAccount.password"
								:rules="[rules.password, rules.required]"
								required
								:append-icon="visible ? 'visibility_off' : 'visibility'"
								:type="visible ? 'text' : 'password'"
								name="password"
								:label="$t('password')"
								browser-autocomplete="new-password"
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
								:label="$t('repeatPassword')"
								browser-autocomplete="new-password"
								min="8"
								@click:append="() => (visible2 = !visible2)"
								/>
						</VCard>
						<VLayout>
							<VBtn
								flat
								:disabled="validateAccountCreation"
								color="primary"
								block
								type="submit"
								large
								@click="createNewUser()"
								>
								{{ $t("createAccount") }}
							</VBtn>
							<VBtn
								flat
								block
								large
								@click="cancelRegistration()"
								>
								{{ $t("cancel") }}
							</VBtn>
						</VLayout>
					</VForm>
				</VStepperContent>
			</VStepper>
		</VDialog>
	</VFlex>
</template>
<script>
export default {
	name: "UserRegistration",
	props: {
		loggedOutSnackbar: { type: Boolean, default: false },
		userRegistrationLogOut: { type: Boolean, default: false },
		cart: { type: Boolean, default: false },
		calendarDisplayed: { type: Boolean, default: false },
		addressSearch: { type: String, default: null },
		createAccountSnackbar: { type: Boolean, default: false },
		editedAccount: { type: Object, default: null }
	},
	data () {

		const defaultUser = {
			uniqueKey: Date.now(),
			name: '',
			type: '',
			email: '',
			password: '',
			telephone: '+46 ',
			cellphone: '+46 ',
			serviceAddress: this.addressSearch,
			invoiceAddress: this.addressSearch,
			paymentMethod: 'paper',
			paymentPeriod: 'monthly',
			identificationNumber: '',
			extraIdentificationNumber: '',
			provisions: [], // subscriptions are stored here
			contactPersons: [], // contact persons are stored here
			gdprConsent: [false, false] // the record for the agreement of the GDPR terms
		};

		return {
			remainingLoginAttempts: 3,
			visible: false,
			visible2: false,
			emptyUser: { ...defaultUser }, // the initial default user values
			existingAccounts: [{ // used for the fake backend as test accounts
				uniqueKey: '1549289140953',
				name: 'John Smith',
				type: 'private',
				email: 'a',
				password: 'a',
				telephone: '+1123123',
				cellphone: '+1123123',
				serviceAddress: 'Malmö, Sweden',
				invoiceAddress: 'Malmö, Sweden',
				identificationNumber: '1234534343',
				extraIdentificationNumber: '1234534343',
				provisions: [],
				contactPersons: [],
				gdprConsent: [true, true]
			}, {
				uniqueKey: '1549289140954',
				name: 'Joanna Smith',
				type: 'private',
				email: 'a@a.com',
				password: 'aaa',
				telephone: '+1123123',
				cellphone: '+1123123',
				serviceAddress: 'Malmö, Sweden',
				invoiceAddress: 'Malmö, Sweden',
				identificationNumber: '1234534344',
				extraIdentificationNumber: '1234534344',
				provisions: [],
				contactPersons: [],
				gdprConsent: [true, true]
			}],
			userLogin: {
				email: '',
				password: '',
				passwordRepeat: ''
			},
			contact: {
				name: '',
				email: '',
				telephone: '+46 ',
				cellphone: '+46 '
			},
			validLogin: '', // validity check for login
			verifyEmailSnackbar: false, // whether snackbar is displayed
			loginValidated: '', // whether the login has been validated
			validatedFormField: [false, false, false, false, false], // validity checks for various form fields
			newUser: true, // whether a new user is detected
			stepper: 0, // stepper index
			userAccount: { ...defaultUser },
			loginPrompt: false, // whether the login prompt is showing
			bottomSheet: false, // whether the bottom sheet is showing, which contains the new account registration form/vertical stepper
			infinity: 0,
			pageEnd: false, // whether the vertical end of the viewport has is currently reached
			rules: {
				required: value => !!value || this.$t('required'),
				email: value => {

					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					return pattern.test(value) || this.$t('invalidEmail');

				},
				phone: value => {

					const pattern = /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/g;

					return pattern.test(value) || this.$t('phoneValidation');

				}
				,
				social: value => {

					const pattern = /^(19|20)?(\d{6}([-+]|\s)\d{4}|(?!19|20)\d{10})$/;

					return pattern.test(value) || this.$t('invalidNumber');

				}
				,
				password: value => {

					const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

					return pattern.test(value) || this.$t('passwordValidation');

				}
				,
				passwordRepeat: value => {

					return (value === this.userLogin.password || value === this.userAccount.password) || this.$t('mismatchPassword');

				}
			}
		};

	},
	computed: {
		validateAccountCreation(){

			return !((this.validatedFormField[7]) && !((this.userAccount.contactPersons.length < 1) && this.userAccount.type === 'business') && (this.validatedFormField[5]) && (this.validatedFormField[4]) && (this.validatedFormField[3]) && (this.validatedFormField[2]));

		}
	},
	watch: {
		editedAccount: function () {

			const existingAccountIndex = this.existingAccounts.findIndex(account => account.uniqueKey === this.editedAccount.uniqueKey);

			this.existingAccounts[existingAccountIndex] = this.editedAccount;

		},
		addressSearch: function () {

			this.userAccount.invoiceAddress = this.addressSearch;

		},
		userRegistrationLogOut: function () {

			this.logOut();

		}
	},
	created () {

		this.$nextTick(() => {

			this.newUser = true;

		});

	},
	methods: {
		resetUser () {

			this.userLogin.email = '';
			this.userLogin.password = '';
			this.userLogin.passwordRepeat = '';
			this.userAccount = {
				uniqueKey: Date.now(),
				name: '',
				type: '',
				email: '',
				password: '',
				telephone: '+46 ',
				cellphone: '+46 ',
				serviceAddress: this.addressSearch,
				invoiceAddress: this.addressSearch,
				paymentMethod: 'paper',
				paymentPeriod: 'monthly',
				identificationNumber: '',
				extraIdentificationNumber: '',
				provisions: [], // subscriptions are stored here
				contactPersons: [], // contact persons are stored here
				gdprConsent: [false, false] // the record for the agreement of the GDPR terms
			};
			this.newUser = true;
			if (this.$refs.step0) {

				this.$refs.step0.resetValidation();

			}
			if (this.$refs.step1) {

				this.$refs.step1.resetValidation();

			}
			if (this.$refs.step2) {

				this.$refs.step2.resetValidation();

			}
			if (this.$refs.step3) {

				this.$refs.step3.resetValidation();

			}
			if (this.$refs.step4) {

				this.$refs.step4.resetValidation();

			}
			if (this.$refs.step5) {

				this.$refs.step5.resetValidation();

			}
			if (this.$refs.step6) {

				this.$refs.step6.resetValidation();

			}
			if (this.$refs.step7) {

				this.$refs.step7.resetValidation();

			}

		},
		resetPassword () {

			this.existingAccounts.forEach((account) => {

				if (account.email && account.email === this.userLogin.email) {

					account.password = this.userLogin.password;

				}

			});
			this.loginPrompt = false;
			this.bottomSheet = false;
			this.stepper = 0;
			this.resetUser();
			this.verifyEmailSnackbar = true;
			this.remainingLoginAttempts = 3;

		},
		cancelRegistration () {

			this.resetUser();
			this.stepper = 0;
			this.loginPrompt = false;
			this.bottomSheet = false;

		},
		logOut () {

			if (this.newUser === false) {

				// User log out
				this.loginPrompt = false;
				this.stepper = 0;
				this.resetUser();
				this.loginValidated = false;
				this.loginPromptValidated = false;
				this.loginPromptSnackbar = true;
				this.remainingLoginAttempts = 3;
				this.validatedFormField = [false, false, false, false, false, false, false];
				this.$emit('change', false);

			}

		},
		createNewUser () {

			// Create new user
			this.stepper = 0;
			this.existingAccounts.push(this.userAccount);
			this.verifyEmailSnackbar = true;
			this.bottomSheet = false;
			this.resetUser();

		},
		createNewContact () {

			this.userAccount.contactPersons.push({
				name: this.contact.name,
				email: this.contact.email,
				telephone: this.contact.telephone,
				cellphone: this.contact.cellphone
			});
			this.contact = {
				name: '',
				email: '',
				telephone: '+46 ',
				cellphone: '+46 '
			};
			this.$refs.step6.resetValidation();

		},
		verifyEmailPassword () {

			// Existing user log in simulation
			// Tries to find out if the user exists in the fake accounts. Modify this for final production version!
			const userAccount = this.existingAccounts.find(userAccount => userAccount.email === this.userLogin.email && userAccount.password === this.userLogin.password);

			if (userAccount !== undefined) {

				// logged in effect
				this.loggedOutSnackbar = false;
				this.loginPromptValidated = true;
				this.loginPromptSnackbar = false;
				this.loginPrompt = false;
				this.stepper = 2;
				this.userAccount = userAccount;
				this.newUser = false;
				this.loginValidated = true;
				this.$emit('change', true, this.userAccount);

			} else {

				// log out effect
				this.remainingLoginAttempts -= 1;
				this.loggedOutSnackbar = false;
				this.validatedFormField = [false, false, false, false, false, false, false];
				this.loginPromptValidated = false;
				this.loginPromptSnackbar = true;
				this.stepper = 0;
				this.resetUser();
				this.loginValidated = false;

			}

		}
	}
};
</script>
