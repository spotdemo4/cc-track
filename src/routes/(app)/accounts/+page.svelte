<script lang="ts">
	import type { PageData } from './$types';
	import { DollarSign } from 'lucide-svelte';
	import { PlusSquare } from 'lucide-svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';

	export let data: PageData;

	function formatCurrency(num: number) {
		return num.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<h1 class="font-bold text-4xl py-8">Accounts</h1>

<div class="grid gap-4 lg:grid-cols-3">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Total Balance</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.stream.balance}
				<Skeleton class="w-full h-8 rounded" />
			{:then balance}
				<div class="text-2xl font-bold">{formatCurrency(balance)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Total Debt</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.stream.debt}
				<Skeleton class="w-full h-8 rounded" />
			{:then debt}
				<div class="text-2xl font-bold">{formatCurrency(debt)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Net Worth</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.stream.net_worth}
				<Skeleton class="w-full h-8 rounded" />
			{:then net_worth}
				<div class="text-2xl font-bold">{formatCurrency(net_worth)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<div class="flex gap-4 flex-wrap justify-center py-8">
	{#await data.stream.accounts}
		<Skeleton class="h-48 w-96" />
		<Skeleton class="h-48 w-96" />
		<Skeleton class="h-48 w-96" />
	{:then accounts}
		{#each accounts as account}
			<Card.Root class="w-96 hover:bg-slate-900 hover:cursor-pointer">
				<a href="/accounts/{account.id}">
					<Card.Header>
						<div class="flex justify-between">
							<Card.Title>{account.name}</Card.Title>
							<h2 class="text-neutral-400">{account.mask}</h2>
						</div>
						<Card.Description>{account.institution} / {account.type} / {account.subtype}</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2">
						{#if account.balance_current}
							<div class="flex flex-row items-center justify-between gap-2 space-y-0">
								<h1 class="font-bold">Current Balance</h1>
								{formatCurrency(account.balance_current)}
							</div>
						{/if}
						{#if account.balance_available}
							<div class="flex flex-row items-center justify-between gap-2 space-y-0">
								<h1 class="font-bold">Available Balance</h1>
								{formatCurrency(account.balance_available)}
							</div>
						{/if}
						{#if account.balance_limit}
							<div class="flex flex-row items-center justify-between gap-2 space-y-0">
								<h1 class="font-bold">Limit</h1>
								{formatCurrency(account.balance_limit)}
							</div>
						{/if}
                        {#if account.official_name}
							{account.official_name}
						{/if}
					</Card.Content>
				</a>
			</Card.Root>
		{/each}
	{/await}
	<Card.Root class="w-96 min-h-48 hover:bg-slate-900 hover:cursor-pointer">
		<a href="/accounts/add">
			<Card.Content class="flex flex-col items-center justify-center h-full pt-6">
				<PlusSquare size="60" />
			</Card.Content>
		</a>
	</Card.Root>
</div>
