<script lang="ts">
	//////
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	import { toast } from 'svelte-sonner';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { supportSchema } from './schema';

	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { createEventDispatcher } from 'svelte';

	import { messages } from '$lib/stores';

	//////
	export let data;
	export let open = false;
	let submitted = false;
	const dispatch = createEventDispatcher();

	//////
	const form = superForm(data.supportForm, {
		dataType: 'json',
		validators: zodClient(supportSchema),
		onSubmit: () => {
			submitted = true;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => {
					submitted = false;
					toast.success('Support ticket successfully created.');
				}, 150);
			} else {
				submitted = false;
				if (result.status && result.status >= 500) {
					toast.error($messages.error);
				}
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	//////
	$: selectedSeverity = $formData.severity
		? {
				label: $formData.severity,
				value: $formData.severity
			}
		: undefined;
</script>

<Dialog.Root
	onOpenChange={() => {
		dispatch('close');
		setTimeout(() => {
			form.reset();
		}, 150);
	}}
	bind:open
>
	<Dialog.Content class="sm:max-w-[725px]">
		<Dialog.Header>
			<Dialog.Title>Support Ticket</Dialog.Title>
		</Dialog.Header>
		<Dialog.Separator />
		<form method="POST" use:enhance action="/?/supportTicket">
			<div class="grid gap-2">
				<div class="grid sm:grid-cols-3 gap-2">
					<Form.Field {form} name="subject" class="sm:col-span-2">
						<Form.Control let:attrs>
							<Form.Label>Subject</Form.Label>
							<Input {...attrs} bind:value={$formData.subject} disabled={submitted} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="severity">
						<Form.Control let:attrs>
							<Form.Label>Severity</Form.Label>
							<Select.Root
								selected={selectedSeverity}
								onSelectedChange={(v) => {
									v && ($formData.severity = v.value);
								}}
								disabled={submitted}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content sameWidth={true}>
									<Select.Item value="Low" label="Low" />
									<Select.Item value="Medium" label="Medium" />
									<Select.Item value="High" label="High" />
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.severity} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="message">
					<Form.Control let:attrs>
						<Form.Label>Problem description</Form.Label>
						<Textarea
							{...attrs}
							bind:value={$formData.message}
							rows={5}
							placeholder="Provide a detailed description of the problem"
							disabled={submitted}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Form.Button class="w-[7.5rem]" disabled={submitted}
					>{#if submitted}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						Submit Ticket
					{/if}</Form.Button
				>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
