<script lang="ts">
	import { AlertCircle, DollarSign, PieChartIcon } from 'lucide-svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { formatCurrency, formatCategory, capitalize } from '$lib/utils';
	import * as devalue from 'devalue';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Alert from '$lib/components/ui/alert';
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Options from '$lib/components/Options.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import CategoryChart from '$lib/components/CategoryChart.svelte';
	import CurrencyChart from '$lib/components/CurrencyChart.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let columns = [
		{ checked: true, header: 'Date' },
		{ checked: true, header: 'Account' },
		{ checked: true, header: 'Amount' },
		{ checked: true, header: 'Category' },
		{ checked: false, header: 'Subcategory' },
		{ checked: true, header: 'Merchant' },
		{ checked: true, header: 'Cash Back' }
	];
	const settings = {
		start: new Date(),
		end: new Date(),
		merchants_filter: '',
		accounts_filter: [],
		categories_filter: [],
		page_current: 1,
		page_size: 10
	};

	let transactions = data.stream.transactions;
	let transactions_count = data.stream.transactions_count;
	let revenue = data.stream.revenue;
	let expenses = data.stream.expenses;
	let profit = data.stream.profit;
	let categories = data.stream.categories;
	let subcategories = data.stream.subcategories;

	async function syncTransactions() {
		const res = await (
			await fetch('/api/transactions', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		transactions = devalue.parse(res);
	}

	async function syncTransactionsCount() {
		const res = await (
			await fetch('/api/transactionsCount', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		transactions_count = devalue.parse(res);
	}

	async function syncCategories() {
		const res = await (
			await fetch('/api/categories', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		categories = devalue.parse(res);
	}

	async function syncSubcategories() {
		const res = await (
			await fetch('/api/subcategories', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		subcategories = devalue.parse(res);
	}

	async function syncRevenue() {
		const res = await (
			await fetch('/api/revenue', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		revenue = devalue.parse(res);
	}

	async function syncExpenses() {
		const res = await (
			await fetch('/api/expenses', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		expenses = devalue.parse(res);
	}

	async function syncProfit() {
		const res = await (
			await fetch('/api/profit', {
				method: 'POST',
				body: devalue.stringify(settings)
			})
		).text();
		profit = devalue.parse(res);
	}
</script>

<div class="flex py-8 justify-between flex-wrap gap-2">
	<h1 class="font-bold text-4xl">Dashboard</h1>
	<DateRangePicker
		on:change={async () => {
			await syncTransactions();
			await syncTransactionsCount();
			await syncRevenue();
			await syncExpenses();
			await syncProfit();
			await syncCategories();
			await syncSubcategories();
		}}
		value={{
			start: today(getLocalTimeZone()).subtract({ years: 1 }),
			end: today(getLocalTimeZone())
		}}
		bind:start={settings.start}
		bind:end={settings.end}
	/>
</div>

{#await data.stream.warnings then warnings}
	{#each warnings as warning}
		<Alert.Root class="mb-2 {warning.type == 'error' ? 'bg-red-900' : 'bg-yellow-900'}">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>{capitalize(warning.title)} {capitalize(warning.type)}</Alert.Title>
			<Alert.Description>
				{warning.message}
			</Alert.Description>
		</Alert.Root>
	{/each}
{/await}

<div class="grid gap-4 lg:grid-cols-3 pb-2">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Revenue</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await revenue}
				<Skeleton class="w-full h-8 rounded" />
			{:then revenue}
				<div class="text-2xl font-bold">
					{formatCurrency(revenue.reduce((n, { amount }) => n + Number(amount), 0) * -1)}
				</div>
				{#key revenue}
					<CurrencyChart
						dates={revenue.map((revenue) => revenue.month)}
						amounts={revenue.map((revenue) => parseInt(revenue.amount.toString()) * -1)}
					/>
				{/key}
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Expenses</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await expenses}
				<Skeleton class="w-full h-8 rounded" />
			{:then expenses}
				<div class="text-2xl font-bold">
					{formatCurrency(expenses.reduce((n, { amount }) => n + Number(amount), 0) * -1)}
				</div>
				{#key expenses}
					<CurrencyChart
						dates={expenses.map((expenses) => expenses.month)}
						amounts={expenses.map((expenses) => parseInt(expenses.amount.toString()) * -1)}
					/>
				{/key}
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Profit</Card.Title>
			<DollarSign size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await profit}
				<Skeleton class="w-full h-8 rounded" />
			{:then profit}
				<div class="text-2xl font-bold">
					{formatCurrency(profit.reduce((n, { amount }) => n + Number(amount), 0) * -1)}
				</div>
				{#key profit}
					<CurrencyChart
						dates={profit.map((profit) => profit.month)}
						amounts={profit.map((profit) => parseInt(profit.amount.toString()) * -1)}
					/>
				{/key}
			{/await}
		</Card.Content>
	</Card.Root>
</div>
<div class="grid gap-4 lg:grid-cols-2 py-2">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Categories</Card.Title>
			<PieChartIcon size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await categories}
				<Skeleton class="w-full h-96 rounded" />
			{:then categories}
				{#key categories}
					<CategoryChart
						amounts={categories
							.filter(
								(category) =>
									category.category_primary != 'LOAN_PAYMENTS' &&
									category.category_primary != 'TRANSFER_IN' &&
									category.category_primary != 'TRANSFER_OUT'
							)
							.map((category) => category.amount)}
						categories={categories
							.filter(
								(category) =>
									category.category_primary != 'LOAN_PAYMENTS' &&
									category.category_primary != 'TRANSFER_IN' &&
									category.category_primary != 'TRANSFER_OUT'
							)
							.map((category) => formatCategory(category.category_primary))}
					/>
				{/key}
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title>Subcategories</Card.Title>
			<PieChartIcon size="18" class="text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await subcategories}
				<Skeleton class="w-full h-96 rounded" />
			{:then subcategories}
				{#key subcategories}
					<CategoryChart
						amounts={subcategories
							.filter(
								(category) =>
									category.category_primary != 'LOAN_PAYMENTS' &&
									category.category_primary != 'TRANSFER_IN' &&
									category.category_primary != 'TRANSFER_OUT'
							)
							.map((subcategory) => subcategory.amount)}
						categories={subcategories
							.filter(
								(category) =>
									category.category_primary != 'LOAN_PAYMENTS' &&
									category.category_primary != 'TRANSFER_IN' &&
									category.category_primary != 'TRANSFER_OUT'
							)
							.map((subcategory) =>
								formatCategory(subcategory.category_detailed, subcategory.category_primary)
							)}
					/>
				{/key}
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<div class="py-2">
	<div class="flex py-2 justify-between content-center">
		<div class="flex items-center gap-2 flex-wrap">
			<Input
				type="text"
				placeholder="Filter merchants..."
				class="h-8 w-64"
				bind:value={settings.merchants_filter}
				on:change={async () => {
					await syncTransactions();
					await syncTransactionsCount();
				}}
			/>
			{#await data.stream.accounts}
				<Skeleton class="w-32 h-8 rounded" />
			{:then accounts}
				<Filter
					title="Account"
					options={accounts.map((account) => ({
						label: account.name,
						value: account.id
					}))}
					bind:values={settings.accounts_filter}
					on:change={async () => {
						await syncTransactions();
						await syncTransactionsCount();
					}}
				/>
			{/await}
			{#await categories}
				<Skeleton class="w-32 h-8 rounded" />
			{:then categories}
				<Filter
					title="Category"
					options={categories.map((category) => ({
						label: formatCategory(category.category_primary),
						value: category.category_primary ?? ''
					}))}
					bind:values={settings.categories_filter}
					on:change={async () => {
						await syncTransactions();
						await syncTransactionsCount();
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
			{#key transactions}
				<tbody in:fade>
					{#await transactions}
						{#each Array(settings.page_size) as _}
							<Table.Row>
								{#each columns as column}
									{#if column.checked}
										<Table.Cell>
											<Skeleton class="w-full h-5 rounded" />
										</Table.Cell>
									{/if}
								{/each}
							</Table.Row>
						{/each}
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
									<Table.Cell>{formatCurrency(Number(transaction.amount) * -1)}</Table.Cell>
								{/if}
								{#if columns[3].checked}
									<Table.Cell>{formatCategory(transaction.category_primary)}</Table.Cell>
								{/if}
								{#if columns[4].checked}
									<Table.Cell
										>{formatCategory(
											transaction.category_detailed,
											transaction.category_primary
										)}</Table.Cell
									>
								{/if}
								{#if columns[5].checked}
									<Table.Cell>{transaction.merchant_name ?? ''}</Table.Cell>
								{/if}
								{#if columns[6].checked}
									<Table.Cell
										>{transaction.cash_back ? Number(transaction.cash_back.percentage) + '%' : ''}
									</Table.Cell>
								{/if}
							</Table.Row>
						{/each}
					{/await}
				</tbody>
			{/key}
		</Table.Root>
	</div>
	{#await transactions_count}
		<Skeleton class="w-full h-8 my-2 rounded" />
	{:then count}
		<Pagination
			page_count={Math.ceil(count / settings.page_size)}
			bind:page_current={settings.page_current}
			bind:page_size={settings.page_size}
			on:pageChange={async () => {
				await syncTransactions();
			}}
			on:sizeChange={async () => {
				await syncTransactions();
				await syncTransactionsCount();
			}}
		/>
	{/await}
</div>
