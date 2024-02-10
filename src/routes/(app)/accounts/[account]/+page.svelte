<script lang="ts">
	import { X } from 'lucide-svelte';
	import { formatCategory, capitalize } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { parseDate } from '@internationalized/date';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import Combobox from '$lib/components/Combobox.svelte';
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		applyAction: true
	});

	function getDateRangeValue(index: number) {
		if (!$form.cash_back[index].start || !$form.cash_back[index].end) {
			return undefined;
		}
		return {
			start: parseDate($form.cash_back[index].start?.toISOString().split('T')[0] ?? ''),
			end: parseDate($form.cash_back[index].end?.toISOString().split('T')[0] ?? '')
		};
	}
</script>

<h1 class="font-bold text-4xl pt-8 pb-1 text-center">Edit Account</h1>

<form action="?/edit" method="POST" class="my-4 flex flex-col gap-4 items-center" use:enhance>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="institution">Institution</Label>
		<Input type="text" bind:value={$form.institution} required />
		<span class="text-sm text-muted-foreground"
			>The full institution name, such as 'Wells Fargo'</span
		>
		{#if $errors.institution}
			<span class="text-red-500 text-sm">{$errors.institution.join(', ')}</span>
		{/if}
	</div>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="name">Account name</Label>
		<Input type="text" id="name" bind:value={$form.name} required />
		<span class="text-sm text-muted-foreground">The account name</span>
		{#if $errors.name}
			<span class="text-red-500 text-sm">{$errors.name.join(', ')}</span>
		{/if}
	</div>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="name">Account details</Label>
		<Input type="text" id="name" bind:value={$form.official_name} required />
		<span class="text-sm text-muted-foreground">The account details</span>
		{#if $errors.official_name}
			<span class="text-red-500 text-sm">{$errors.official_name.join(', ')}</span>
		{/if}
	</div>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="mask">Account mask</Label>
		<Input type="text" id="mask" bind:value={$form.mask} required />
		<span class="text-sm text-muted-foreground">
			The last 2-4 alphanumeric characters of an account's official account number
		</span>
		{#if $errors.mask}
			<span class="text-red-500 text-sm">{$errors.mask.join(', ')}</span>
		{/if}
	</div>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="type">Account type</Label>
		<Input type="text" id="type" bind:value={$form.type} readonly />
		<span class="text-sm text-muted-foreground">
			The account type. See Plaid's <a
				href="https://plaid.com/docs/api/accounts#account-type-schema">account schema</a
			> for a full list of possible values
		</span>
		{#if $errors.type}
			<span class="text-red-500 text-sm">{$errors.type.join(', ')}</span>
		{/if}
	</div>
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="subtype">Account subtype</Label>
		<Input type="text" id="subtype" bind:value={$form.subtype} readonly />
		<span class="text-sm text-muted-foreground">
			The account subtype. See Plaid's <a
				href="https://plaid.com/docs/api/accounts#account-type-schema">account schema</a
			> for a full list of possible values
		</span>
		{#if $errors.subtype}
			<span class="text-red-500 text-sm">{$errors.subtype.join(', ')}</span>
		{/if}
	</div>
	{#if $form.type != 'depository'}
		<div class="flex flex-col w-full max-w-sm gap-1.5">
			<Label for="funding_account">Funding account</Label>
			<Select.Root
				onSelectedChange={(data) => {
					$form.funding_account = data
						? {
								id: data.value,
								name: data.label ?? ''
							}
						: {
								id: '',
								name: 'None'
							};
				}}
				selected={$form.funding_account
					? {
							value: $form.funding_account.id,
							label: $form.funding_account.name
						}
					: {
							value: '',
							label: 'None'
						}}
			>
				<Select.Trigger>
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					{#await data.stream.accounts}
						<Select.Item value="loading">Loading...</Select.Item>
					{:then accounts}
						<Select.Item value="">None</Select.Item>
						{#each accounts as account}
							<Select.Item value={account.id}>{account.name}</Select.Item>
						{/each}
					{/await}
				</Select.Content>
			</Select.Root>
			<span class="text-sm text-muted-foreground"> The account that funds this account </span>
			{#if $errors.funding_account}
				<span class="text-red-500 text-sm"
					>{$errors.funding_account.id
						?.join(', ')
						.concat($errors.funding_account.name?.join(', ') ?? '')}</span
				>
			{/if}
		</div>
	{/if}
	<div class="flex flex-col w-full max-w-sm gap-1.5">
		<Label for="limit">Spending limit</Label>
		<div class="flex gap-2">
			<Input type="number" step="0.01" id="limit" bind:value={$form.limit} />
			{#key $form.limit_timeframe}
				<Select.Root
					onSelectedChange={(data) => {
						$form.limit_timeframe = data?.value;
					}}
					selected={$form.limit_timeframe
						? {
								value: $form.limit_timeframe,
								label: capitalize($form.limit_timeframe)
							}
						: undefined}
				>
					<Select.Trigger>
						<Select.Value />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="month">Month</Select.Item>
						<Select.Item value="quarter">Quarter</Select.Item>
						<Select.Item value="year">Year</Select.Item>
					</Select.Content>
				</Select.Root>
			{/key}
			<Button
				variant="ghost"
				size="icon"
				on:click={() => {
					$form.limit = null;
					$form.limit_timeframe = null;
				}}
			>
				<X />
			</Button>
		</div>
		<span class="text-sm text-muted-foreground">
			Limit spending by setting a maximum amount for this account, as well as a time period
		</span>
		{#if $errors.limit}
			<span class="text-red-500 text-sm">{$errors.limit.join(', ')}</span>
		{/if}
	</div>
	{#each $form.cash_back as _, i}
		<div class="flex flex-col gap-1">
			<div class="flex justify-around items-center w-full max-w-sm gap-2">
				<Combobox
					name="category"
					options={Array.from(new Set(data.categories.map((category) => category.PRIMARY)))
						.map((category) => ({
							label: formatCategory(category),
							value: category
						}))
						.concat(
							data.categories.map((category) => ({
								label:
									formatCategory(category.PRIMARY) +
									': ' +
									formatCategory(category.DETAILED.replace(category.PRIMARY + '_', '')),
								value: category.DETAILED
							}))
						)}
					bind:value={$form.cash_back[i].category}
				/>
				<Input
					type="number"
					min="0"
					max="100"
					step=".01"
					bind:value={$form.cash_back[i].percentage}
					required
				/>
				<span class="text-nowrap">%</span>
				<Button
					variant="ghost"
					size="icon"
					on:click={() => {
						$form.cash_back = $form.cash_back.filter((_, index) => index !== i);
					}}
				>
					<X />
				</Button>
			</div>
			<DateRangePicker
				on:change={(event) => {
					$form.cash_back[i].start = event.detail.start;
					$form.cash_back[i].end = event.detail.end;
				}}
				value={getDateRangeValue(i)}
			/>
			{#if $errors.cash_back?.[i]?.category}
				<span class="text-red-500 text-sm">{$errors.cash_back[i]?.category?.join(', ') ?? ''}</span>
			{/if}
			{#if $errors.cash_back?.[i]?.percentage}
				<span class="text-red-500 text-sm"
					>{$errors.cash_back[i]?.percentage?.join(', ') ?? ''}</span
				>
			{/if}
		</div>
	{/each}
	<Button
		type="button"
		variant="outline"
		on:click={() => {
			$form.cash_back.push({ category: '', percentage: 0 });
			$form.cash_back = $form.cash_back;
		}}
	>
		<strong>Add Cash Back Category</strong>
	</Button>
	<div class="flex justify-center mt-7 gap-1">
		<Button type="submit">
			<strong>Save</strong>
		</Button>
		<Dialog.Root>
			<Dialog.Trigger
				class="{buttonVariants({ variant: 'secondary' })} !bg-red-800 hover:!bg-red-900"
			>
				Delete
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Delete Account</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete this account? This action cannot be undone.
					<form action="?/delete" method="POST" class="flex justify-center pt-6" use:enhance>
						<Button type="submit" class="bg-red-800 hover:bg-red-900 text-white">
							<strong>Yes I'm sure!</strong>
						</Button>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</form>
