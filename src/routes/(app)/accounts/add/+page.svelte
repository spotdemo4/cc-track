<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		resetForm: true
	});
	let plaidHandler: any;

	onMount(async () => {
		await new Promise((resolve) => {
			const interval_id = setInterval(() => {
				// @ts-ignore
				if (window?.Plaid) {
					clearInterval(interval_id);
					resolve('done');
				}
			}, 200);
		});

		// @ts-ignore
		plaidHandler = Plaid.create({
			token: data.link_token,
			// @ts-ignore
			onSuccess: (public_token, metadata) => {
				console.log(public_token, metadata);
				$form.public_token = public_token;
				$form.institution = metadata.institution.name;
				$form.accounts = metadata.accounts;
			},
			// @ts-ignore
			onExit: (err, metadata) => {
				console.log(err, metadata);
			}
		});
	});
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<div class="flex flex-col items-center pt-10">
	<h1 class="text-4xl font-bold">Add account</h1>
	<p class="text-xl">Connect your bank account to get started</p>

	{#if !$form.accounts || !$form.institution}
		<Button type="button" class="my-7" on:click={() => plaidHandler.open()}>
			<strong>Get account</strong>
		</Button>
	{:else}
		<form action="?/add" method="POST" class="mt-7 w-96" use:enhance>
			<div class="flex flex-col w-full max-w-sm gap-1.5">
				<Label for="institution">Institution</Label>
				<Input type="text" bind:value={$form.institution} required />
				<p class="text-sm text-muted-foreground">
					The full institution name, such as 'Wells Fargo'
				</p>
			</div>
			<Accordion.Root>
				{#each $form.accounts as _, i}
					<Accordion.Item value="item-{i}">
						<Accordion.Trigger>{$form.accounts[i].name}</Accordion.Trigger>
						<Input type="hidden" bind:value={$form.accounts[i].id} readonly />
						<Accordion.Content>
							<div class="pb-2 flex flex-col w-full max-w-sm gap-1.5">
								<Label for="name-{i}">Account name</Label>
								<Input type="text" id="name-{i}" bind:value={$form.accounts[i].name} required />
								<p class="text-sm text-muted-foreground">The account name</p>
								{#if $errors.accounts?.[i]?.name}
									<p class="text-sm text-red-500">{$errors.accounts[i]?.name?.join(', ') ?? ''}</p>
								{/if}
							</div>
							<div class="py-2 flex flex-col w-full max-w-sm gap-1.5">
								<Label for="mask-{i}">Account mask</Label>
								<Input type="text" id="mask-{i}" bind:value={$form.accounts[i].mask} required />
								<p class="text-sm text-muted-foreground">
									The last 2-4 alphanumeric characters of an account's official account number
								</p>
								{#if $errors.accounts?.[i]?.mask}
									<p class="text-sm text-red-500">{$errors.accounts[i]?.mask?.join(', ') ?? ''}</p>
								{/if}
							</div>
							<div class="py-2 flex flex-col w-full max-w-sm gap-1.5">
								<Label for="type-{i}">Account type</Label>
								<Input type="text" id="type-{i}" bind:value={$form.accounts[i].type} readonly />
								<p class="text-sm text-muted-foreground">
									The account type. See Plaid's <a
										href="https://plaid.com/docs/api/accounts#account-type-schema">account schema</a
									> for a full list of possible values
								</p>
								{#if $errors.accounts?.[i]?.type}
									<p class="text-sm text-red-500">{$errors.accounts[i]?.type?.join(', ') ?? ''}</p>
								{/if}
							</div>
							<div class="py-2 flex flex-col w-full max-w-sm gap-1.5">
								<Label for="subtype-{i}">Account subtype</Label>
								<Input
									type="text"
									id="subtype-{i}"
									bind:value={$form.accounts[i].subtype}
									readonly
								/>
								<p class="text-sm text-muted-foreground">
									The account subtype. See Plaid's <a
										href="https://plaid.com/docs/api/accounts#account-type-schema">account schema</a
									> for a full list of possible values
								</p>
								{#if $errors.accounts?.[i]?.subtype}
									<p class="text-sm text-red-500">
										{$errors.accounts[i]?.subtype?.join(', ') ?? ''}
									</p>
								{/if}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
			<Input type="hidden" bind:value={$form.public_token} readonly />
			<div class="flex justify-center mt-7">
				<Button type="submit">
					<strong>Submit</strong>
				</Button>
			</div>
		</form>
	{/if}
</div>
