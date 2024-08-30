<script lang="ts">
	//////
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { feedbackSchema } from './schema';

	import { LoaderCircle } from 'lucide-svelte';

	import { messages } from '$lib/stores';

	//////
	export let data;
	export let open = false;

	//////
	const form = superForm(data.feedbackForm, {
		dataType: 'json',
		validators: zodClient(feedbackSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => {
					toast.success('Feedback submitted. Thank you!');
				}, 150);
			} else {
				if (result.status && result.status >= 500) {
					toast.error($messages.error);
				}
			}
		}
	});

	const { form: formData, submitting, enhance } = form;
</script>

<!-- Feedback Dialog -->
<Dialog.Root
	onOpenChange={() => {
		dispatch('close');
		setTimeout(() => {
			form.reset();
		}, 150);
	}}
	bind:open
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Submit Feedback</Dialog.Title>
		</Dialog.Header>
		<Dialog.Separator />
		<form method="POST" use:enhance action="/?/feedback">
			<Form.Field {form} name="message">
				<Form.Control let:attrs>
					<Textarea
						{...attrs}
						bind:value={$formData.message}
						rows={5}
						placeholder="Share your feedback"
						disabled={$submitting}
						class="resize-none"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Dialog.Footer>
				<Form.Button class="w-20" disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						Submit
					{/if}
				</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
