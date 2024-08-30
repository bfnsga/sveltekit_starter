<script lang="ts">
	//////
	import { Page } from '$lib/components/page';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { codeSchema } from './schema';

	import CodeDialog from './dialog-verifyEmail.svelte';

	import { emailSchema } from './schema';
	import { invalidateAll } from '$app/navigation';

	import { toast } from 'svelte-sonner';

	import { dev } from '$app/environment';
	import { email } from '$lib/stores';

	import { messages } from '$lib/stores';

	//////
	export let data;

	//////
	let updateEmailDialog = false;
	let newEmail: string;
	let disabled = true;

	//////
	const form = superForm(data.emailForm, {
		dataType: 'json',
		validators: zodClient(emailSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				newEmail = $formData.email;

				if (!dev) {
					updateEmailDialog = true;
				} else {
					$email = newEmail;
				}
			}
		},
		onError: () => {
			toast.error($messages.error);
		}
	});

	const { form: formData, submitting, enhance } = form;

	$: if ($formData.email !== data.email) {
		disabled = false;
	} else {
		disabled = true;
	}
</script>

<Page header="Profile" description="Manage your account settings" class="lg:w-5/6">
	<div class="grid gap-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Email</Card.Title>
				<Card.Description
					>Update the email address you use to login to your account.</Card.Description
				>
			</Card.Header>
			<form method="POST" action="?/updateEmail" use:enhance>
				<Card.Content>
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Input {...attrs} bind:value={$formData.email} disabled={$submitting} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
				<Card.Footer class="border-t py-3 md:py-4">
					<Form.Button class="w-[7.5rem]" disabled={$submitting || disabled}>
						{#if $submitting}
							<LoaderCircle class="size-4 animate-spin" />
						{:else}
							Update Email
						{/if}
					</Form.Button>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</Page>

{#key newEmail}
	<CodeDialog
		{data}
		{newEmail}
		open={updateEmailDialog}
		on:close={() => {
			updateEmailDialog = false;
		}}
	/>
{/key}
