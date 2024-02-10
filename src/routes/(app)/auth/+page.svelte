<script lang="ts">
	import { startRegistration } from '@simplewebauthn/browser';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	export let data: PageData;
	let success: string;
	let error: string;

	async function authReg() {
		let regRes;
		try {
			// Pass the options to the authenticator and wait for a response
			regRes = await startRegistration(data.options);
		} catch (err: any) {
			if (err.name === 'InvalidStateError') {
				error = 'Error: Authenticator was probably already registered by user';
			} else {
				error = err;
			}

			throw error;
		}

		// Send the response to the server for verification
		const verificationResp = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(regRes)
		});

		const verificationJSON = (await verificationResp.json()) as {
			success: boolean;
			error?: string;
		};

		// Show UI appropriate for the `verified` status
		if (verificationJSON.success) {
			success = 'Success!';
		} else {
			error = `Oh no, something went wrong! ${verificationJSON?.error}`;
		}
	}
</script>

<div class="flex flex-col items-center pt-10">
	<h1 class="text-4xl font-bold">Add authenticator</h1>
	<p class="text-xl">Click the button to get started</p>

	<Button type="button" class="my-7" on:click={() => authReg()}>
		<strong>Add authenticator</strong>
	</Button>

	{#if success}
		<p class="text-green-500">{success}</p>
	{/if}
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</div>
