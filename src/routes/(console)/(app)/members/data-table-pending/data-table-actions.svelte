<script lang="ts">
	import { enhance } from '$app/forms';

	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DeleteInviteDialog from './dialog-delete-invite.svelte';
	import { toast } from 'svelte-sonner';

	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import MailPlus from 'lucide-svelte/icons/mail-plus';

	import { messages } from '$lib/stores';

	//////
	export let id: string;
	export let email: string;
	export let role: string;
	export let disabled: boolean;

	//////
	let roleDialog = false;
	let deleteInviteDialog = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			size="icon"
			class="relative h-8 w-8 p-0 {disabled || role === 'primary_owner' ? 'invisible' : ''}"
			disabled={disabled || role === 'primary_owner'}
		>
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top">
		<form
			method="POST"
			action="?/resendInvite"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'failure') {
						toast.error($messages.error);
					} else {
						toast.success('Invite resent successfully.');
						update();
					}
				};
			}}
		>
			<input type="hidden" value={id} name="id" />
			<button type="submit">
				<DropdownMenu.Item>
					<MailPlus class="size-4 mr-2.5" />
					Resend Invite
				</DropdownMenu.Item>
			</button>
		</form>
		<DropdownMenu.Item
			on:click={() => {
				deleteInviteDialog = true;
			}}
			class="text-destructive data-[highlighted]:!bg-destructive/[.08] data-[highlighted]:!text-destructive"
		>
			<Trash2 class="size-4 mr-2.5" />
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<DeleteInviteDialog
	bind:open={deleteInviteDialog}
	{id}
	{email}
	{role}
	on:close={() => {
		deleteInviteDialog = false;
	}}
/>
