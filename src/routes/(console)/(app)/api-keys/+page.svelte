<script lang="ts">
	//////
	import { invalidateAll } from '$app/navigation';

	import { Page } from '$lib/components/page';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	import CreateKeyDialog from './dialog-createKey.svelte';
	import DataTable from './data-table/data-table.svelte';

	//////
	export let data;

	//////
	let createKeyDialog = false;
</script>

<Page header="API Keys" class="lg:w-5/6">
	<!-- Header -->
	<Button
		slot="headerAction"
		on:click={() => {
			createKeyDialog = true;
		}}
	>
		<Plus class="size-4 me-1.5 -ml-1" />
		Create Key
	</Button>
	<!-- Main -->
	{#key data.apiKeys}
		<DataTable data={data.apiKeys} />
	{/key}
</Page>

{#key data.apiKeys}
	<CreateKeyDialog
		open={createKeyDialog}
		on:close={() => {
			createKeyDialog = false;
		}}
		on:done={() => {
			invalidateAll();
			createKeyDialog = false;
		}}
	/>
{/key}
