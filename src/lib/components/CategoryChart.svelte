<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { formatCurrency } from '$lib/utils';
    import type { ApexOptions } from 'apexcharts';

    export let amounts: number[] = [];
    export let categories: string[] = [];
	let chart: HTMLElement;
    let apexChart: ApexCharts;

	let options: ApexOptions = {
		chart: {
			type: 'pie',
			height: 300,
            foreColor: '#fff',
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
			y: {
				formatter: (val) => {
					return formatCurrency(val);
				},
			},
		},
		legend: {
			show: true,
			position: 'bottom',
		},
		series: amounts.map((d) => parseInt(d.toString())),
		labels: categories.map((category) => category),
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
