<script lang="ts">
	import { DollarSign } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Options from '$lib/components/Options.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { PageData } from './$types';
	import type { DateRange } from 'bits-ui';

	export let data: PageData;
	let date: DateRange = {
		start: $page.url.searchParams.get('start')
			? parseDate($page.url.searchParams.get('start')!)
			: today(getLocalTimeZone()).subtract({ years: 1 }),
		end: $page.url.searchParams.get('end')
			? parseDate($page.url.searchParams.get('end')!)
			: today(getLocalTimeZone())
	};
	let columns = [
		{ checked: true, header: 'Date' },
		{ checked: true, header: 'Account' },
		{ checked: true, header: 'Amount' },
		{ checked: true, header: 'Category' },
		{ checked: false, header: 'Subcategory' },
		{ checked: true, header: 'Merchant' },
		{ checked: true, header: 'Cash Back' }
	];
	let merchant_filter: string = $page.url.searchParams.get('merchants') ?? '';
	let accounts_filter: string[] = $page.url.searchParams.get('accounts')?.split(',') ?? [];
	let categories_filter: string[] = $page.url.searchParams.get('categories')?.split(',') ?? [];
	let page_current = parseInt($page.url.searchParams.get('page_current') ?? '1');
	let page_size = parseInt($page.url.searchParams.get('page_size') ?? '10');

	function formatCurrency(num: number) {
		return num.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<div class="flex py-8 justify-between flex-wrap gap-2">
	<h1 class="font-bold text-4xl">Dashboard</h1>
	<DateRangePicker
		on:change={(event) => {
			const url = new URL($page.url.href);
			url.searchParams.set('start', event.detail.start.toString());
			url.searchParams.set('end', event.detail.end.toString());
			goto(url.href, { replaceState: true });
		}}
		bind:value={date}
	/>
</div>

<div class="grid gap-4 lg:grid-cols-3">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Revenue</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.card_stream.revenue}
				<Skeleton class="w-full h-8 rounded" />
			{:then revenue}
				<div class="text-2xl font-bold">{formatCurrency(revenue)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Expenses</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.card_stream.expenses}
				<Skeleton class="w-full h-8 rounded" />
			{:then expenses}
				<div class="text-2xl font-bold">{formatCurrency(expenses)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Profit</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await data.card_stream.profit}
				<Skeleton class="w-full h-8 rounded" />
			{:then profit}
				<div class="text-2xl font-bold">{formatCurrency(profit)}</div>
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<div class="py-8">
	<div class="flex py-2 justify-between content-center">
		<div class="flex items-center gap-2 flex-wrap">
			<Input 
				type="text" 
				placeholder="Filter merchants..." 
				class="h-8 w-64" 
				bind:value={merchant_filter}
				on:change={() => {
					const url = new URL($page.url.href);
					if (merchant_filter !== '') {
						url.searchParams.set('merchants', merchant_filter);
					} else {
						url.searchParams.delete('merchants');
					}
					goto(url.href, { replaceState: true });
				}}
			/>
			{#await data.filter_stream.accounts}
				<Skeleton class="w-32 h-8 rounded" />
			{:then accounts}
				<Filter
					title="Account"
					options={accounts.map((account) => ({
						label: account.name,
						value: account.id
					}))}
					bind:values={accounts_filter}
					on:change={(event) => {
						const url = new URL($page.url.href);
						if (event.detail.length > 0) {
							url.searchParams.set('accounts', event.detail.join(','));
						} else {
							url.searchParams.delete('accounts');
						}
						goto(url.href, { replaceState: true });
					}}
				/>
			{/await}
			{#await data.filter_stream.categories}
				<Skeleton class="w-32 h-8 rounded" />
			{:then categories}
				<Filter
					title="Category"
					options={categories.map((category) => ({
						label: category.name,
						value: category.real_name
					}))}
					bind:values={categories_filter}
					on:change={(event) => {
						const url = new URL($page.url.href);
						if (event.detail.length > 0) {
							url.searchParams.set('categories', event.detail.join(','));
						} else {
							url.searchParams.delete('categories');
						}
						goto(url.href, { replaceState: true });
					}}
				/>
			{/await}
		</div>
		<Options bind:columns />
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column}
						{#if column.checked}
							<Table.Head>{column.header}</Table.Head>
						{/if}
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#await data.table_stream.transactions}
					<Table.Row>
						{#each columns as column}
							{#if column.checked}
								<Table.Cell>
									<Skeleton class="w-full h-8 rounded" />
								</Table.Cell>
							{/if}
						{/each}
					</Table.Row>
				{:then transactions}
					{#each transactions as transaction}
						<Table.Row>
							{#if columns[0].checked}
								<Table.Cell>{transaction.date.toLocaleDateString()}</Table.Cell>
							{/if}
							{#if columns[1].checked}
								<Table.Cell>{transaction.account_name}</Table.Cell>
							{/if}
							{#if columns[2].checked}
								<Table.Cell>{formatCurrency(transaction.amount)}</Table.Cell>
							{/if}
							{#if columns[3].checked}
								<Table.Cell>{transaction.category_primary}</Table.Cell>
							{/if}
							{#if columns[4].checked}
								<Table.Cell>{transaction.category_detailed}</Table.Cell>
							{/if}
							{#if columns[5].checked}
								<Table.Cell>{transaction.merchant_name ?? ''}</Table.Cell>
							{/if}
							{#if columns[6].checked}
								<Table.Cell>{transaction.cash_back ? Number(transaction.cash_back.percentage) + "%" : ''}</Table.Cell>
							{/if}
						</Table.Row>
					{/each}
				{/await}
			</Table.Body>
		</Table.Root>
	</div>
	{#await data.table_stream.transactions_count}
		<Skeleton class="w-full h-8 rounded" />
	{:then count}
		<Pagination 
			page_count={Math.ceil(count / page_size)} 
			bind:page_current 
			bind:page_size 
			on:pageChange={(event) => {
				const url = new URL($page.url.href);
				url.searchParams.set('page_current', event.detail.toString());
				goto(url.href, { replaceState: true });
			}}
			on:sizeChange={(event) => {
				const url = new URL($page.url.href);
				url.searchParams.set('page_size', event.detail.toString());
				goto(url.href, { replaceState: true });
			}}
		/>
	{/await}
</div>
