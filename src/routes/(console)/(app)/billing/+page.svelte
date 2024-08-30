<script lang="ts">
	import { Page } from '$lib/components/page';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { CircleCheckBig, CircleX, ExternalLink } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	import { messages } from '$lib/stores';

	//////
	export let data;

	//////
	let submittingPlan = false;
	let submittingBilling = false;
	const plans = data.plans;
	let subscribedPlan = data.subscribedPlan;
	let billingPeriod = data.billingPeriod;
	const cancelled = data.cancelled;
</script>

<Page header="Billing" description="Manage your billing and subscription" class="lg:w-5/6">
	<div slot="headerAction">
		<form
			method="POST"
			action="?/customerPortal"
			use:enhance={() => {
				submittingBilling = true;
			}}
		>
			<Button type="submit" disabled={submittingBilling}>
				Manage Billing
				<ExternalLink class="ms-2 size-3.5" />
			</Button>
		</form>
	</div>
	<Card.Root>
		<div class="flex items-center justify-between w-full">
			<Card.Header>
				<Card.Title class="flex items-center justify-between">Manage your Plan</Card.Title>
				<Card.Description class="text-[0.9rem] !leading-[1.6rem]"
					>Upgrade or downgrade your plan at any time.</Card.Description
				>
			</Card.Header>
			<div class="p-6 text-muted-foreground text-[0.85rem] space-y-1.5 text-right">
				<p>
					<span class="font-medium text-primary">Current Plan:</span>
					{#if subscribedPlan.type === 'free'}
						Free
					{:else}
						{subscribedPlan.name}
						{#if cancelled}(Cancels {billingPeriod.end}){/if}
					{/if}
				</p>
				<p>
					<span class="font-medium text-primary">Billing Period:</span>
					{billingPeriod.start} - {billingPeriod.end}
				</p>
			</div>
		</div>
		<Card.Content>
			<div class="border-t -mt-1 pt-7 -mx-2">
				<div class="grid grid-cols-2 divide-x px-2">
					{#each plans as { name, price, features, type, limits, priceId }}
						<div class="pt-1 px-8 divide-y divide-dashed -ml-6">
							<div class="pb-2">
								<p class="font-semibold">{name}</p>
								<p class="mt-5 mb-4">
									<span class="text-4xl font-semibold">
										${price}
									</span>
									<span class="text-muted-foreground">/month</span>
								</p>
							</div>
							<div class="h-[4.75rem] flex flex-col justify-center text-[0.925rem]">
								<div class="space-y-2">
									{#each limits as limit}
										<p>{limit}</p>
									{/each}
								</div>
							</div>
							<div class="pt-7">
								<ul class="space-y-3 text-[0.9rem]">
									{#each features.included as feature}
										<li class="flex items-center gap-4">
											<CircleCheckBig class="size-4 text-green-600" />
											{feature}
										</li>
									{/each}
									{#each features.excluded as feature}
										<li class="flex items-center gap-4 text-muted-foreground/60">
											<CircleX class="size-4" />
											{feature}
										</li>
									{/each}
								</ul>
								<div class="mt-9">
									<form
										action="?/changePlan"
										method="POST"
										use:enhance={() => {
											submittingPlan = true;
											return async ({ result, update }) => {
												if (result.type === 'failure') {
													submittingPlan = false;
													toast.error($messages.error);
												}
												update();
											};
										}}
									>
										<input type="hidden" name="priceId" value={priceId} />
										<Button
											type="submit"
											class="w-full text-base h-11"
											variant={type === 'free' ? 'secondary' : 'default'}
											disabled={submittingPlan ||
												(subscribedPlan.priceId === priceId && !cancelled && type !== 'free') ||
												(cancelled && type === 'free') ||
												(subscribedPlan.priceId === priceId && type !== 'paid')}
										>
											{#if subscribedPlan.priceId === priceId && !cancelled}
												Current Plan
											{:else if type === 'free'}
												{#if cancelled}
													Pending Cancellation
												{:else}
													Downgrade Plan
												{/if}
											{:else if !cancelled}
												Upgrade to {name}
											{:else}
												Renew {name} Plan
											{/if}
										</Button>
									</form>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</Page>
