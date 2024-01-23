<script lang="ts">
	import { X } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Combobox from '$lib/components/Combobox.svelte';
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import { parseDate } from '@internationalized/date';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		applyAction: true
	});

	function formatCategory(category: string) {
		return category
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

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
								label: formatCategory(category.PRIMARY) + ": " + formatCategory(category.DETAILED.replace(category.PRIMARY + '_', '')),
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
					$form.cash_back[i].start = event.detail.start.toDate();
					$form.cash_back[i].end = event.detail.end.toDate();
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
