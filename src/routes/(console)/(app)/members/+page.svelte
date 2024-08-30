<script lang="ts">
	import { Page } from '$lib/components/page';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import { userSchema } from './schema';

	import { toast } from 'svelte-sonner';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import DataTableMembers from './data-table-members/data-table.svelte';
	import DataTablePending from './data-table-pending/data-table.svelte';
	import { invalidateAll } from '$app/navigation';

	import { messages } from '$lib/stores';

	//////
	export let data;

	//////
	let submitted = false;
	$: users = data.users;
	const userRole = data.userRole;

	//////
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(userSchema),
		onSubmit: () => {
			submitted = true;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				setTimeout(() => {
					submitted = false;
					toast.success('Invite sent successfully.');
				}, 150);
				invalidateAll();
			} else {
				submitted = false;
				if (result.status && result.status >= 500) {
					toast.error($messages.error);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	//////
	$: selectedRole = $formData.role
		? {
				label: $formData.role,
				value: $formData.role
			}
		: undefined;
</script>

<Page header="Members" description="Manage the members of your team" class="lg:w-5/6">
	{#if userRole === 'primary_owner' || userRole === 'owner'}
		<Card.Root>
			<Card.Header>
				<Card.Title>Invite Member</Card.Title>
				<Card.Description>Invite new members by email address</Card.Description>
			</Card.Header>
			<form method="POST" use:enhance action="?/invite">
				<Card.Content class="grid md:grid-cols-2 gap-2">
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<Input {...attrs} bind:value={$formData.email} disabled={submitted} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="role">
						<Form.Control let:attrs>
							<Form.Label>Role</Form.Label>
							<Select.Root
								selected={selectedRole}
								onSelectedChange={(v) => {
									v && ($formData.role = v.value);
								}}
								disabled={submitted}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content sameWidth={true}>
									<Select.Item value="Member" label="Member" />
									<Select.Item value="Owner" label="Owner" />
								</Select.Content>
							</Select.Root>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
				<Card.Footer class="border-t py-3 md:py-4">
					<Form.Button class="w-[7.75rem]" disabled={submitted}>
						{#if submitted}
							<LoaderCircle class="size-5 animate-spin" />
						{:else}
							Invite Member
						{/if}
					</Form.Button>
				</Card.Footer>
			</form>
		</Card.Root>
	{/if}
	<Tabs.Root value="members" class="relative mr-auto w-full overflow-x-scroll">
		<div class="flex items-center justify-between pb-3">
			<Tabs.List class="w-full justify-start rounded-none border-b bg-transparent p-0 space-x-4">
				<Tabs.Trigger
					value="members"
					class="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-3 pb-3 pt-2 font-medium shadow-none transition-none data-[state=active]:shadow-none"
				>
					Team Members
				</Tabs.Trigger>
				<Tabs.Trigger
					value="pending"
					class="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-3 pb-3 pt-2 font-medium shadow-none transition-none data-[state=active]:shadow-none"
				>
					Pending Invitations
				</Tabs.Trigger>
			</Tabs.List>
		</div>
		<Tabs.Content value="members">
			{#key users}
				<DataTableMembers {users} {userRole} />
			{/key}
		</Tabs.Content>
		<Tabs.Content value="pending">
			{#key users}
				<DataTablePending {users} {userRole} />
			{/key}
		</Tabs.Content>
	</Tabs.Root>
</Page>
