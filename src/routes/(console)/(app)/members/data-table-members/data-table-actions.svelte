<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import UserCog from 'lucide-svelte/icons/user-cog';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	import EditUserDialog from './dialog-editUser.svelte';

	import { messages } from '$lib/stores';

	//////
	export let id: string;
	export let email: string;
	export let role: string;
	export let disabled: boolean;

	if (!disabled && role === 'primary_owner') {
		disabled = true;
	}

	//////
	let roleDialog = false;
	let deleteDialog = false;
</script>

<EditUserDialog open={roleDialog} {id} {email} {role} on:close={() => (roleDialog = false)} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<div class={disabled ? 'cursor-not-allowed inline-flex' : ''}>
			<Button
				variant="ghost"
				builders={[builder]}
				size="icon"
				class="relative h-8 w-8 p-0 {disabled ? 'text-muted-foreground' : ''}"
				{disabled}
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top">
		<DropdownMenu.Item
			on:click={() => {
				roleDialog = true;
			}}
		>
			<UserCog class="size-4 mr-2.5" />
			Edit role
		</DropdownMenu.Item>
		<DropdownMenu.Item
			on:click={() => {
				deleteDialog = true;
			}}
			class="text-destructive data-[highlighted]:!bg-destructive/[.08] data-[highlighted]:!text-destructive"
		>
			<Trash2 class="size-4 mr-2.5" />
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={deleteDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Member</AlertDialog.Title>
			<AlertDialog.Description class="!leading-[1.6rem] text-[0.925rem]">
				Are you sure you want to delete <span class="font-medium text-foreground/70">{email}</span>?
				This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="pt-1">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'failure') {
							toast.error($messages.error);
						} else {
							toast.success('Member deleted successfully.');
							update();
						}
					};
				}}
			>
				<input type="hidden" value={id} name="id" />
				<AlertDialog.Action type="submit">Delete Member</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
