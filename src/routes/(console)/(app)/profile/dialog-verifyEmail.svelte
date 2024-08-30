<script lang="ts">
	//////
	import { createEventDispatcher } from 'svelte';
	import { email } from '$lib/stores';
	import { invalidateAll } from '$app/navigation';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';

	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { codeSchema } from './schema';

	import { PinInput } from '$lib/components/ui/pin-input';

	import { messages } from '$lib/stores';

	//////
	export let data;
	export let newEmail: string;
	export let open = false;

	//////
	const dispatch = createEventDispatcher();

	//////
	const form = superForm(data.verifyForm, {
		dataType: 'json',
		validators: zodClient(codeSchema),
		onSubmit: () => {
			$formData.email = newEmail;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				$email = newEmail;
				invalidateAll();
				setTimeout(() => {
					dispatch('close');
				}, 1000);
				setTimeout(() => {
					toast.success('Email updated successfully.');
				}, 1150);
			}
		},
		onError: () => {
			toast.error($messages.error);
		}
	});

	const { form: formData, submitting, enhance } = form;

	//////
	$: {
		const code = $formData.code.join('');
		if (code.length === 6) {
			form.submit();
		}
	}
</script>

<!-- Feedback Dialog -->
<div class="mx-10">
	<Dialog.Root
		onOpenChange={() => {
			dispatch('close');
			setTimeout(() => {
				form.reset();
			}, 150);
		}}
		bind:open
	>
		<Dialog.Content class="max-w-[400px]">
			<Dialog.Header>
				<Dialog.Title>Verify Email</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Enter the code from your verification email</Dialog.Description>
			<form method="POST" use:enhance action="?/verifyCode">
				<Form.Field {form} name="code">
					<Form.Control let:attrs>
						<PinInput bind:value={$formData.code} name={attrs.name} disabled={$submitting} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Dialog.Footer class="pt-1">
					<Form.Button class="w-full" disabled={$submitting}>
						{#if $submitting}
							<LoaderCircle class="size-4 animate-spin" />
						{:else}
							Verify
						{/if}
					</Form.Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
