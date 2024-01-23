<script lang="ts">
	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import type { DateRange } from 'bits-ui';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	export let value: DateRange = { start: undefined, end: undefined };
	let init_value = value;

	$: if (value?.end && value != init_value) {
		dispatch('change', value);
		init_value = value;
	}
</script>

<div class="grid gap-2">
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={cn(
					'min-w-[300px] justify-start text-left font-normal',
					!value && 'text-muted-foreground'
				)}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{#if value && value.start}
					{#if value.end}
						{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
							value.end.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(value.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else}
					Pick a date
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar bind:value initialFocus numberOfMonths={2} placeholder={value?.start} />
		</Popover.Content>
	</Popover.Root>
</div>
