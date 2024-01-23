<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		applyAction: true
	});
</script>

<div class="flex h-screen items-center justify-center p-2">
	<Tabs.Root value="login" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="login">Log In</Tabs.Trigger>
			<Tabs.Trigger value="register">Register</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<Card.Root>
				<Card.Header>
					<Card.Title>Log In</Card.Title>
					<Card.Description>Enter your email and password below</Card.Description>
				</Card.Header>
				<Card.Content>
					<form
						action="?/login"
						method="POST"
						class="my-4 flex flex-col gap-4 items-center"
						use:enhance
					>
						<div class="flex flex-col w-full max-w-sm gap-1.5">
							<Label for="email">Email</Label>
							<Input
								type="email"
								id="email"
								placeholder="me@example.com"
								bind:value={$form.email}
								required
							/>
							{#if $errors.email}
								<span class="text-red-500 text-sm">{$errors.email.join(', ')}</span>
							{/if}
						</div>
						<div class="flex flex-col w-full max-w-sm gap-1.5">
							<Label for="password">Password</Label>
							<Input type="password" id="password" bind:value={$form.password} required />
							{#if $errors.password}
								<span class="text-red-500 text-sm">{$errors.password.join(', ')}</span>
							{/if}
						</div>
						<Button type="submit">Log In</Button>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
        <Tabs.Content value="register">
			<Card.Root>
				<Card.Header>
					<Card.Title>Register</Card.Title>
					<Card.Description>Enter your desired email and password below</Card.Description>
				</Card.Header>
				<Card.Content>
					<form
						action="?/register"
						method="POST"
						class="my-4 flex flex-col gap-4 items-center"
						use:enhance
					>
						<div class="flex flex-col w-full max-w-sm gap-1.5">
							<Label for="email">Email</Label>
							<Input
								type="email"
								id="email"
								placeholder="me@example.com"
								bind:value={$form.email}
								required
							/>
							{#if $errors.email}
								<span class="text-red-500 text-sm">{$errors.email.join(', ')}</span>
							{/if}
						</div>
						<div class="flex flex-col w-full max-w-sm gap-1.5">
							<Label for="password">Password</Label>
							<Input type="password" id="password" bind:value={$form.password} required />
							{#if $errors.password}
								<span class="text-red-500 text-sm">{$errors.password.join(', ')}</span>
							{/if}
						</div>
                        <div class="flex flex-col w-full max-w-sm gap-1.5">
							<Label for="confirm_password">Confirm Password</Label>
							<Input type="password" id="confirm_password" bind:value={$form.confirm_password} required />
							{#if $errors.confirm_password}
								<span class="text-red-500 text-sm">{$errors.confirm_password.join(', ')}</span>
							{/if}
						</div>
						<Button type="submit">Register</Button>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>