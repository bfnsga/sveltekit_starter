<script lang="ts">
	// Import(s)
	///////////////////////////////////////////////
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { signupSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	// Data
	///////////////////////////////////////////////
	export let data;

	// Form
	///////////////////////////////////////////////
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(signupSchema)
	});

	const { form: formData, submitting, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title tag="h2">Signup</Card.Title>
		<Card.Description>Enter your email to signup for an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="grid gap-2.5">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Input
						{...attrs}
						bind:value={$formData.email}
						disabled={$submitting}
						type="email"
						placeholder="example@email.com"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button disabled={$submitting} class="w-full">
				{#if $submitting}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					Continue
				{/if}
			</Form.Button>
		</form>
	</Card.Content>
	<Card.Footer class="justify-center">
		<p class="text-[0.925rem]">
			Already have an account? <a
				href="/auth/login"
				class="font-medium underline underline-offset-2">Login</a
			>.
		</p>
	</Card.Footer>
</Card.Root>
