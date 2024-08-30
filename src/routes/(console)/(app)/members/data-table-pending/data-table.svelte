<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import DataTableActions from './data-table-actions.svelte';
	import type { Users } from '../types';

	////////////////////////////////////////////////
	export let users: Users[];
	export let userRole;

	////////////////////////////////////////////////
	const data = users;

	////////////////////////////////////////////////
	// Filter data to get only pending members
	const pendingMembers = data.filter((obj) => obj.pending === true);

	// Get the current time in milliseconds
	const currentTime = new Date().getTime();

	const updatedMembers = pendingMembers.map((member) => {
		const invitedTime = new Date(member.invited_at).getTime();
		const invitedTimePlus24Hours = invitedTime + 24 * 60 * 60 * 1000; // add 24 hours in milliseconds

		// Determine the status based on the invitation time
		if (currentTime < invitedTimePlus24Hours) {
			return { ...member, status: 'active' };
		} else {
			return { ...member, status: 'expired' };
		}
	});

	// Sort members by invitation time in descending order
	updatedMembers.sort(
		(a, b) => new Date(b.invited_at).getTime() - new Date(a.invited_at).getTime()
	);

	const pendingMembersCount = updatedMembers.length;

	////////////////////////////////////////////////
	const table = createTable(readable(updatedMembers));

	const columns = table.createColumns([
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			accessor: 'role',
			header: 'Role',
			cell: ({ value }) => {
				return value
					.split('_')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
			}
		}),
		table.column({
			accessor: 'invited_at',
			header: 'Invited at',
			cell: ({ value }) => {
				//////
				const date = new Date(value);
				const localeDate = new Intl.DateTimeFormat(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric'
				}).format(date);
				//////
				return localeDate;
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return value.charAt(0).toUpperCase() + value.slice(1);
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				const index = data.findIndex((obj) => obj.id === value);
				return createRender(DataTableActions, {
					id: value,
					email: data[index].email,
					role: data[index].role,
					disabled: userRole === 'member'
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div
	class="rounded-md border overflow-x-scroll {!pendingMembersCount ? 'px-4 py-8 text-center' : ''}"
>
	{#if updatedMembers.length > 0}
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'role'}
											<Badge
												variant={cell.render() === 'Owner' ? 'default' : 'secondary'}
												class="whitespace-nowrap"
											>
												<Render of={cell.render()} />
											</Badge>
										{:else if !cell.id}
											<div class="text-right">
												<Render of={cell.render()} />
											</div>
										{:else}
											<div class="whitespace-nowrap text-muted-foreground">
												{#if cell.id === 'email'}
													<div class="text-foreground/80 font-medium">
														<Render of={cell.render()} />
													</div>
												{:else if cell.id === 'status'}
													<div class="flex items-center">
														<div
															class="size-2.5 rounded-full me-2 {cell.render() === 'Active'
																? 'bg-[#50e3c2]'
																: 'bg-[#ee0000]'}"
														></div>
														<Render of={cell.render()} />
													</div>
												{:else}
													<Render of={cell.render()} />
												{/if}
											</div>
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p class="font-semibold">Invite Team Members</p>
		<p class="text-sm text-muted-foreground mt-1">There are no new member invitations.</p>
	{/if}
</div>
