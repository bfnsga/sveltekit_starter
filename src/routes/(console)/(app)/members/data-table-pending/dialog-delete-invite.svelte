<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';

	import { messages } from '$lib/stores';

	//////
	export let open: boolean;
	export let id: string;
	export let email: string;
	export let role: string;
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Invite</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete the invite for <span class="font-semibold">{email}</span>?
				This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => dispatch('close')}>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'failure') {
							toast.error($messages.error);
						} else {
							dispatch('close');
							toast.success('Member deleted successfully.');
							update();
						}
					};
				}}
			>
				<input type="hidden" value={id} name="id" />
				<AlertDialog.Action type="submit">Delete Invite</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
