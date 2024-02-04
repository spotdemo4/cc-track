<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
    import type { ApexOptions } from 'apexcharts';

    export let amounts: number[] = [];
    export let categories: string[] = [];
	let chart: HTMLElement;
    let apexChart: ApexCharts;

	let options: ApexOptions = {
		chart: {
			type: 'pie',
			height: 300,
            foreColor: '#fff'
		},
		series: amounts.map((d) => parseInt(d.toString())),
		labels: categories
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		apexChart = new ApexCharts(chart, options);
		await apexChart.render();
	});

    onDestroy(() => {
        apexChart.destroy();
    });
</script>

<div id="chart" style="h-96" bind:this={chart} />
