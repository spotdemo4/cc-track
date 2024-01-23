<script lang="ts">
    import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let page_current: number;
    export let page_count: number;
    export let page_size: number;

    $: if (page_current) {
        dispatch('pageChange', page_current);
    }

    $: if (page_size) {
        dispatch('sizeChange', page_size);
    }
</script>

<div class="flex justify-between my-2 flex-wrap gap-2">
    <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select.Root
            onSelectedChange={(selected) => {
                page_size = selected?.value ?? 10;
            }}
            selected={{ value: page_size, label: page_size.toString() }}
        >
            <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Select page size" />
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="10">10</Select.Item>
                <Select.Item value="20">20</Select.Item>
                <Select.Item value="30">30</Select.Item>
                <Select.Item value="40">40</Select.Item>
                <Select.Item value="50">50</Select.Item>
            </Select.Content>
        </Select.Root>
    </div>
    <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {page_current} of {page_count}
    </div>
    <div class="flex items-center space-x-2">
        <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            on:click={() => (page_current = 1)}
            disabled={page_current === 1}
        >
            <span class="sr-only">Go to first page</span>
            <ChevronsLeft size={15} />
        </Button>
        <Button
            variant="outline"
            class="p-0 w-8 h-8"
            on:click={() => (page_current = page_current - 1)}
            disabled={page_current === 1}
        >
            <span class="sr-only">Go to previous page</span>
            <ChevronLeft size={15} />
        </Button>
        <Button
            variant="outline"
            class="p-0 w-8 h-8"
            disabled={page_current === page_count}
            on:click={() => (page_current = page_current + 1)}
        >
            <span class="sr-only">Go to next page</span>
            <ChevronRight size={15} />
        </Button>
        <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            disabled={page_current === page_count}
            on:click={() => (page_current = page_count)}
        >
            <span class="sr-only">Go to last page</span>
            <ChevronsRight size={15} />
        </Button>
    </div>
</div>