<script lang="ts">
	import { RefreshCcw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';

	export let data: LayoutData;
	let refreshing = false;

	async function sync() {
		refreshing = true;
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		await invalidateAll();
		const data = await res.json();
		if (data.sync_account_success && data.sync_transaction_success) {
			toast.success('Synced accounts & transactions!', {
				description: new Date().toLocaleString()
			});
		} else if (!data.sync_account_success && !data.sync_transaction_success) {
			toast.error('Failed to sync accounts & transactions!', {
				description: new Date().toLocaleString()
			});
		} else if (!data.sync_account_success) {
			toast.error('Failed to sync accounts!', {
				description: new Date().toLocaleString()
			});
		} else if (!data.sync_transaction_success) {
			toast.error('Failed to sync transactions!', {
				description: new Date().toLocaleString()
			});
		}

		refreshing = false;
	}

	async function logout() {
		const res = await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();
		if (data.success) {
			goto('/login');
		}
	}

	async function detectSWupdate() {
		const registration = await navigator.serviceWorker.getRegistration();

		registration?.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					newSW.postMessage({ type: 'SKIP_WAITING' });
					toast.info('New version available!', {
						description: 'Please refresh the page to update.'
					});
				}
			});
		});
	}

	onMount(() => {
		detectSWupdate();
	});
</script>

<Toaster />

<div
	class="flex h-14 items-center gap-4 overflow-auto xl:px-64 lg:px-32 md:px-16 sm:px-8 px-4 border-b"
>
	<a href="/" class="font-bold tracking-wider">CCTrack</a>
	<a
		href="/"
		class="{$page.route.id == '/(app)'
			? 'text-neutral-100'
			: 'text-neutral-400'} hover:text-neutral-100">Dashboard</a
	>
	<a
		href="/accounts"
		class="{$page.route.id == '/(app)/accounts'
			? 'text-neutral-100'
			: 'text-neutral-400'} hover:text-neutral-100">Accounts</a
	>
	<div class="ml-auto flex gap-4 items-center">
		{#if refreshing}
			<Button variant="outline" class="flex gap-2" disabled>
				<RefreshCcw class="animate-spin" size="20" />
				Refresh
			</Button>
		{:else}
			<Button variant="outline" class="flex gap-2" on:click={sync}>
				<RefreshCcw size="20" />
				Refresh
			</Button>
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="w-9 h-9">
					<Avatar.Fallback>{data.user.name.substring(0, 2)}</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>{data.user.name}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Profile</DropdownMenu.Item>
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item on:click={logout} class="cursor-pointer">Log out</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<div class="xl:px-64 lg:px-32 md:px-16 sm:px-8 px-4">
	<slot />
</div>
