<template>
	<VDialog
		v-model="editUserDialog"
		transition="dialog-bottom-transition"
		max-width="600px"
		>
		<VBtn
			slot="activator"
			color="grey"
			flat
			small
			>
			{{ $t("edit") }}
		</VBtn>
		<VStepper
			v-model="stepper"
			vertical
			non-linear
			>
			<VStepperStep
				:complete="validatedFormField[1]"
				step="1"
				editable
				edit-icon="check"
				>
				{{ $t('step3Label') }}
				<small>
					{{ $t('step3Intro') }}
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
							:rules="userAccount.telephone.length>4? [rules.phone]: []"
							hint="+CC AAA-XXX XX XX"
							/>
						<VTextField
							v-model="userAccount.cellphone"
							:label="$t('cellphone')"
							:rules="userAccount.cellphone.length>4? [rules.phone]: []"
							hint="+CC AAA-XXX XX XX"
							/>
						<VTextField
							v-model="userAccount.url"
							:label="$t('homepage')"
							:hint="$t('optionalURL')"
							/>
					</VCard>
					<VLayout>
						<VBtn
							flat
							pl-0
							color="primary"
							:disabled="!validatedFormField[1]"
							block
							type="submit"
							large
							@click="stepper = 2"
							>
							{{ $t("continue") }}
						</VBtn>
						<VBtn
							flat
							block
							large
							@click="close()"
							>
							{{ $t("cancel") }}
						</VBtn>
					</vlayout>
				</VForm>
			</VStepperContent>
			<VStepperStep
				:complete="validatedFormField[2]"
				step="2"
				editable
				edit-icon="check"
				>
				{{ $t('step4Label') }}
				<small>
					{{ $t('step4Description') }}
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
								:disabled="!validatedFormField[2]"
								block
								type="submit"
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
								@click="close()"
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
				editable
				edit-icon="check"
				>
				{{ $t('step5Label') }}
				<small>
					{{ $t('step5Description') }}
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
							v-model="userAccount.invoiceAddress"
							:label="$t('step5Field1')"
							:rules="[rules.required]"
							required
							/>
					</VCard>
					<VLayout row>
						<VFlex>
							<VBtn
								flat
								color="primary"
								:disabled="!validatedFormField[3]"
								block
								type="submit"
								large
								@click="stepper = 4"
								>
								{{ $t("continue") }}
							</VBtn>
						</VFlex>
						<VFlex>
							<VBtn
								flat
								block
								large
								@click="close()"
								>
								{{ $t("cancel") }}
							</VBtn>
						</VFlex>
					</VLayout>
				</VForm>
			</VStepperContent>
			<VStepperStep
				:complete="userAccount.type ==='business' && userAccount.contactPersons.length > 0 || true"
				step="4"
				editable
				edit-icon="check"
				>
				{{ $t('step6Label') }}
				<small>
					{{ $t('step6Description') }}
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
							hint="+CC AAA-XXX XX XX"
							/>
						<VTextField
							v-model="contact.cellphone"
							:label="$t('cellphone')"
							:rules="contact.cellphone.length > 4? [rules.phone] : []"
							hint="+CC AAA-XXX XX XX"
							/>
						<VBtn
							color="primary"
							flat
							:disabled="!validatedFormField[4]"
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
							@input="removeContactPerson(index)"
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
								@click="saveUser"
								>
								{{ $t("continue") }}
							</VBtn>
						</VFlex>
						<VFlex>
							<VBtn
								flat
								block
								large
								@click="close()"
								>
								{{ $t("cancel") }}
							</VBtn>
						</VFlex>
					</VLayout>
				</VForm>
			</VStepperContent>
		</VStepper>
	</VDialog>
</template>
<script>
export default {
	name: "UserEdit",
	props: {
		currentUser: { type: Object, default: null }
	},
	data () {

		return {
			userAccount: this.deepCopy(this.currentUser),
			contact: {
				name: '',
				email: '',
				telephone: '+46 ',
				cellphone: '+46 '
			},
			validatedFormField: [false, false, false, false], // validity checks for various form fields
			stepper: 1, // stepper index
			editUserDialog: false, // whether the bottom sheet is showing, which contains the new account registration form/vertical stepper
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
			}
		};
	
	},
	computed: {
		computedCurrentUser () {

			return this.currentUser;
		
		}
	},
	created () {

		this.resetUser();
	
	},
	methods: {
		deepCopy (o) {

			var output, v, key;

			output = Object.prototype.toString.call(o) !== '[object Object]' ? o : {};
			for (key in o) {

				v = o[key];
				output[key] = (typeof v === "object") ? this.deepCopy(v) : v;
			
			}
			return output;
		
		},
		resetUser () {

			// this.userAccount = this.deepCopy(this.currentUser);
			this.userAccount = this.computedCurrentUser;
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
		
		},
		close () {

			// closing function
			this.stepper = 1;
			this.editUserDialog = false;
			this.resetContact();
			this.resetUser();
		
		},
		saveUser () {

			// Create new user
			this.$emit('change', this.userAccount);
			this.close();
		
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
			this.$refs.step4.resetValidation();
		
		},
		resetContact () {

			this.contact = {
				name: '',
				email: '',
				telephone: '+46 ',
				cellphone: '+46 '
			};
		
		},
		removeContactPerson (index) {

			this.userAccount.contactPersons.splice(index, 1);
			this.resetContact();
			this.$refs.step4.resetValidation();
		
		}
	}
};
</script>
