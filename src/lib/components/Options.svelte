<script lang="ts">
	import { Settings2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let columns: { checked: boolean; header: string }[] = [];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" size="sm" class="ml-auto flex h-8" builders={[builder]}>
			<Settings2 class="mr-2 h-4 w-4" />
			View
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each columns as col}
			<DropdownMenu.CheckboxItem bind:checked={col.checked}>
				{col.header}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
