<script lang="ts">
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Users from 'lucide-svelte/icons/users';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import Files from 'lucide-svelte/icons/files';
	import { Key } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	import { toggleMode } from 'mode-watcher';

	import FeedbackDialog from './dialog-feedback.svelte';
	import SupportDialog from './dialog-support.svelte';

	import { email } from '$lib/stores';

	import { page } from '$app/stores';
	import { PUBLIC_DOCS_URL } from '$env/static/public';

	//////
	export let data;
	$email = data.email;
	const avatar = data.avatar;
	let feedbackDialog = false;
	let supportDialog = false;
	let mobileMenu = false;

	//////
</script>

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
	<div class="hidden border-r bg-muted/40 md:block">
		<div class="flex h-full max-h-screen flex-col gap-2 fixed">
			<div class="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
				<a href="/dashboard" class="flex items-center gap-2 font-semibold">
					<Package2 class="h-6 w-6" />
					<span class="">Acme Inc</span>
				</a>
			</div>
			<div class="flex-1">
				<nav class="grid items-start px-2 text-[0.9rem] lg:px-5 mt-2">
					<a
						href="/dashboard"
						class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all {$page
							.url.pathname === '/dashboard'
							? 'text-primary font-medium'
							: 'hover:text-primary'}"
					>
						<LayoutDashboard class="size-4" />
						Dashboard
					</a>
					<p
						class="text-muted-foreground/90 text-[0.65rem] font-medium mt-6 mb-1.5 uppercase tracking-wide"
					>
						Account
					</p>
					<a
						href="/members"
						class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all {$page
							.url.pathname === '/members'
							? 'text-primary font-medium'
							: 'hover:text-primary'}"
					>
						<Users class="size-4" />
						Members
					</a>
					<a
						href="/api-keys"
						class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all {$page
							.url.pathname === '/api-keys'
							? 'text-primary font-medium'
							: 'hover:text-primary'}"
					>
						<Key class="size-4" />
						API Keys
					</a>

					<a
						href="/billing"
						class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all {$page
							.url.pathname === '/billing'
							? 'text-primary font-medium'
							: 'hover:text-primary'}"
					>
						<CreditCard class="size-4" />
						Billing
					</a>
				</nav>
			</div>
			<div class="mt-auto lg:pb-8 lg:px-5 text-[0.9rem]">
				<p
					class="text-muted-foreground/90 text-[0.65rem] font-medium mt-5 mb-1.5 uppercase tracking-wide"
				>
					Resources
				</p>
				<a
					href={PUBLIC_DOCS_URL}
					target="_blank"
					class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
				>
					<Files class="size-4" />
					Docs
				</a>

				<button
					on:click={() => (feedbackDialog = true)}
					class="w-full flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
				>
					<MessageCircleMore class="size-4" />
					Feedback
				</button>
				<button
					on:click={() => (supportDialog = true)}
					class="flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
				>
					<LifeBuoy class="size-4" />
					Support
				</button>
			</div>
		</div>
	</div>
	<div class="flex flex-col">
		<header
			class="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[56px] lg:px-6 sticky top-0 z-50"
		>
			<Sheet.Root bind:open={mobileMenu}>
				<Sheet.Trigger asChild let:builder>
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col">
					<a
						on:click={() => {
							mobileMenu = false;
						}}
						href="/dashboard"
						class="flex items-center gap-2 font-semibold -mt-0.5"
					>
						<Package2 class="h-6 w-6" />
						<span class="">Acme Inc</span>
					</a>

					<nav class="grid gap-1 text-base font-medium mt-4">
						<a
							on:click={() => (mobileMenu = false)}
							href="/dashboard"
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 hover:text-foreground {$page
								.url.pathname === '/dashboard'
								? 'bg-muted text-foreground'
								: 'text-muted-foreground'}"
						>
							<LayoutDashboard class="size-5" />
							Dashboard
						</a>
						<p
							class="text-muted-foreground/90 text-[0.675rem] font-medium mt-3.5 uppercase tracking-wide"
						>
							Account
						</p>
						<a
							on:click={() => (mobileMenu = false)}
							href="/members"
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 hover:text-foreground {$page
								.url.pathname === '/members'
								? 'bg-muted text-foreground'
								: 'text-muted-foreground'}"
						>
							<Users class="size-5" />
							Members
						</a>
						<a
							on:click={() => (mobileMenu = false)}
							href="/billing"
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 hover:text-foreground {$page
								.url.pathname === '/billing'
								? 'bg-muted text-foreground'
								: 'text-muted-foreground'}"
						>
							<CreditCard class="size-5" />
							Billing
						</a>
					</nav>
					<div class="mt-auto font-medium">
						<p
							class="text-muted-foreground/90 text-[0.675rem] font-medium mb-2 uppercase tracking-wide"
						>
							Resources
						</p>
						<a
							href={PUBLIC_DOCS_URL}
							target="_blank"
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<Files class="size-5" />
							Docs
						</a>
						<button
							on:click={() => (feedbackDialog = true)}
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<MessageCircleMore class="size-5" />
							Feedback
						</button>
						<button
							on:click={() => (supportDialog = true)}
							class="mx-[-0.65rem] flex items-center gap-3.5 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<LifeBuoy class="size-5" />
							Support
						</button>
					</div>
				</Sheet.Content>
			</Sheet.Root>
			<a href="/dashboard" class="flex items-center gap-2 font-semibold md:hidden">
				<Package2 class="h-6 w-6" />
				<span class="">Acme Inc</span>
			</a>
			<div class="flex items-center justify-end md:w-full">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
							<Avatar.Root>
								<Avatar.Fallback>{avatar}</Avatar.Fallback>
							</Avatar.Root>

							<span class="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="min-w-[12rem]">
						<DropdownMenu.Group>
							<DropdownMenu.Item class="data-[highlighted]:!bg-background text-[0.775rem]">
								<span class="text-muted-foreground truncate no-underline">{$email}</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item href="/profile" class="cursor-pointer">
								<CircleUser class="size-4.5 me-2.5" />
								Profile
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={toggleMode} class="cursor-pointer">
								<Sun
									class="size-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 me-2.5"
								/>
								<Moon
									class="absolute size-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 me-2.5"
								/>
								Toggle Theme
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<form action="/?/logout" method="POST">
								<button type="submit" class="w-full">
									<DropdownMenu.Item class="w-full cursor-pointer">
										<LogOut class="size-4.5 me-2.5" />
										Logout
									</DropdownMenu.Item>
								</button>
							</form>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</header>
		<main
			class="flex flex-1 flex-col gap-4 px-5 pt-4.5 pb-12 md:px-10 md:pt-7 md:pb-16 lg:gap-6 lg:px-14 lg:pt-10 lg:pb-20"
		>
			<slot />
		</main>
	</div>
</div>

<FeedbackDialog
	{data}
	open={feedbackDialog}
	on:close={() => {
		feedbackDialog = false;
	}}
/>

<SupportDialog
	{data}
	open={supportDialog}
	on:close={() => {
		supportDialog = false;
	}}
/>
