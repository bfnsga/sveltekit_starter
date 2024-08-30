<script lang="ts">
	////////////////////////////////////////////////////////////
	// Import
	////////////////////////////////////////////////////////////
	// Svelte
	import { readable } from 'svelte/store';

	// Stores
	import { email } from '$lib/stores';

	// UI
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';

	// Local
	import DataTableActions from './data-table-actions.svelte';
	import type { Users } from '../types';

	////////////////////////////////////////////////////////////
	// Export
	////////////////////////////////////////////////////////////
	export let users;
	export let userRole;

	////////////////////////////////////////////////////////////
	const data: Users[] = users;
	const filteredData = data.filter((obj) => obj.pending !== true);

	const userIndex = filteredData.findIndex((obj) => obj.email === $email);

	if (userIndex !== -1) {
		// Remove the object from the array
		const [obj] = filteredData.splice(userIndex, 1);
		// Add the object to the start of the array
		filteredData.unshift(obj);
	}

	////////////////////////////////////////////////////////////
	const table = createTable(readable(filteredData));

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
			accessor: 'joined_at',
			header: 'Joined at',
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
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				const index = data.findIndex((obj) => obj.id === value);
				const email = data[index].email;
				const role = data[index].role;
				return createRender(DataTableActions, {
					id: value,
					email: email,
					role: role.charAt(0).toUpperCase() + role.slice(1),
					disabled: userRole === 'member' || role === 'owner' || email === $email
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border overflow-x-scroll">
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
										<div class="whitespace-nowrap text-primary/80">
											{#if cell.id === 'email'}
												<div class="text-primary font-medium">
													<Render of={cell.render()} />
													{#if cell.render() === $email}
														<span class="ml-1 text-[0.825rem] text-muted-foreground font-normal"
															>(You)</span
														>
													{/if}
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
</div>
