<script lang="ts">
	import { PlusCircle, Check } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { createEventDispatcher } from 'svelte';

	export let values: string[] = [];
	export let title: string;
	export let options: { label: string; value: string }[] = [];

	const dispatch = createEventDispatcher();
	let open = false;
	let init_values = values;

	const handleSelect = (currentValue: string) => {
		if (Array.isArray(values) && values.includes(currentValue)) {
			values = values.filter((v) => v !== currentValue);
		} else {
			values = [...(Array.isArray(values) ? values : []), currentValue];
		}
	};

	$: if (values && values !== init_values) {
		dispatch('change', values);
		init_values = values;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="sm" class="h-8 border-dashed">
			<PlusCircle class="mr-2 h-4 w-4" />
			{title}

			{#if values.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
					{values.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#if values.length > 2}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{values.length} Selected
						</Badge>
					{:else}
						{#each options.filter((option) => {
							return values.includes(option.value);
						}) as option}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{option.label}
							</Badge>
						{/each}
					{/if}
				</div>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start" side="bottom">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							class="cursor-pointer"
							value={option.value}
							onSelect={(selectValue) => {
								handleSelect(selectValue);
							}}
						>
							<div
								class={cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									values.includes(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check className={cn('h-4 w-4')} />
							</div>
							<span>
								{option.label}
							</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if values.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center cursor-pointer"
						onSelect={() => {
							values = [];
						}}
					>
						Clear filters
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
