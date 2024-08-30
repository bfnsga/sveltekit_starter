<script lang="ts">
	//////
	import OnboardingDialog from './dialog-onboarding.svelte';

	//////
	export let data;

	//////
	let onboarding = data.onboarding;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<OnboardingDialog open={onboarding} />
