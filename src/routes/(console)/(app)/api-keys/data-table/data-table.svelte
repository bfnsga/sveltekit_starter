<script lang="ts">
	//////
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';

	//////
	type Key = {
		id: string;
		name: string;
		key_partial: string;
		created_at: string;
		last_used_at: string;
	};

	//////
	export let data: Key[];

	//////
	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'key_partial',
			header: 'Key'
		}),
		table.column({
			accessor: 'created_at',
			header: 'Created',
			cell: ({ value }) => {
				// Parse the ISO string to a Date object
				const date = new Date(value);

				// Format the date using toLocaleDateString
				const options: Intl.DateTimeFormatOptions = {
					year: 'numeric',
					month: 'short', // Short month name (e.g., "Aug")
					day: 'numeric'
				};

				return date.toLocaleDateString('en-US', options);
			}
		}),
		table.column({
			accessor: 'last_used_at',
			header: 'Last Used',
			cell: ({ value }) => {
				if (value) {
					// Parse the ISO string to a Date object
					const date = new Date(value);

					// Format the date using toLocaleDateString
					const options: Intl.DateTimeFormatOptions = {
						year: 'numeric',
						month: 'short', // Short month name (e.g., "Aug")
						day: 'numeric'
					};

					return date.toLocaleDateString('en-US', options);
				}
				return 'Never';
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				const keyObject = data.find((obj) => obj.id === value);
				const key = keyObject?.key_partial as string;
				return createRender(DataTableActions, { id: value, key });
			}
		})
	]);

	//////
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border overflow-x-scroll {data.length === 0 ? 'px-4 py-8 text-center' : ''}">
	{#if data.length > 0}
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
										{#if cell.id === 'name'}
											<div class="font-medium">
												<Render of={cell.render()} />
											</div>
										{:else}
											<div class="text-primary/80">
												{#if cell.id}
													<Render of={cell.render()} />
												{:else}
													<div class="text-right">
														<Render of={cell.render()} />
													</div>
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
		<p class="font-semibold">Create API Key</p>
		<p class="text-sm text-muted-foreground mt-1">There are no active API Keys.</p>
	{/if}
</div>
