<script lang="ts">
	//////
	import { createEventDispatcher } from 'svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';

	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { editRoleSchema } from '../schema';

	import { messages } from '$lib/stores';

	//////
	export let open: boolean;
	export let id: string;
	export let email: string;
	export let role: string;

	//////
	const dispatch = createEventDispatcher();

	//////
	const form = superForm(
		{ id, email, role },
		{
			dataType: 'json',
			validators: zodClient(editRoleSchema),
			onResult: ({ result }) => {
				if (result.type === 'success') {
					setTimeout(() => {
						toast.success('Role updated successfully.');
					}, 150);
				}
			},
			onError: () => {
				toast.error($messages.error);
			}
		}
	);

	const { form: formData, submitting, enhance } = form;

	//////
	$: selectedRole = $formData.role
		? {
				label: $formData.role,
				value: $formData.role
			}
		: undefined;
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
		<Dialog.Content class="max-w-[450px]">
			<Dialog.Header>
				<Dialog.Title>Edit Role</Dialog.Title>
			</Dialog.Header>
			<p class="text-[0.90rem] leading-[1.6rem] text-muted-foreground">
				Update the role for <span class="font-medium text-foreground/70">bfnsga@gmail.com</span>.
			</p>
			<form method="POST" action="/members?/editRole" class="space-y-4 -mt-1.5" use:enhance>
				<Form.Field {form} name="role">
					<Form.Control let:attrs>
						<Select.Root
							selected={selectedRole}
							onSelectedChange={(v) => {
								v && ($formData.role = v.value);
							}}
							disabled={$submitting}
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
				<input type="hidden" value={id} name="id" />
				<Dialog.Footer class="pt-1">
					<Form.Button class="w-28" disabled={$submitting}>
						{#if $submitting}
							<LoaderCircle class="size-4 animate-spin" />
						{:else}
							Update Role
						{/if}
					</Form.Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
