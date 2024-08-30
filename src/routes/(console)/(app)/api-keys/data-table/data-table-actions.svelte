<script lang="ts">
	//////
	import { Button } from '$lib/components/ui/button';
	import { Trash2 } from 'lucide-svelte';
	import DeleteKeyDialog from './dialog-deleteKey.svelte';
	import { invalidateAll } from '$app/navigation';

	//////
	export let id: string;
	export let key: string;
	let deleteKeyDialog = false;
</script>

<Button
	on:click={() => {
		deleteKeyDialog = true;
	}}
	variant="ghost"
	class="text-muted-foreground hover:text-primary hover:bg-muted/60 w-10"
>
	<Trash2 class="size-[0.95rem] flex-none" />
</Button>

<DeleteKeyDialog
	open={deleteKeyDialog}
	keyId={id}
	{key}
	name="Testing"
	on:close={() => {
		deleteKeyDialog = false;
	}}
	on:deleted={() => {
		invalidateAll();
		deleteKeyDialog = false;
	}}
/>
