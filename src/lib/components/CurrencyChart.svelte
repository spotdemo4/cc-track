<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { formatCurrency } from '$lib/utils';
    import type { ApexOptions } from 'apexcharts'
    import type ApexCharts from 'apexcharts';

    export let dates: Date[] = [];
	export let amounts: number[] = [];
	let chart: HTMLElement;
    let apexChart: ApexCharts;

	let options: ApexOptions = {
		chart: {
			type: 'line',
			height: 80,
			sparkline: {
				enabled: true
			}
		},
		series: [
			{
				name: 'Amount',
				data: amounts.map((d) => parseInt(d.toString()))
			},
		],
		stroke: {
			curve: 'straight'
		},
        xaxis: {
            categories: dates.map((d) => d.toLocaleString('default', { month: 'long', year: 'numeric' }))
        },
        tooltip: {
            theme: 'dark',
			enabled: true,
			y: {
				formatter: (val) => {
					return formatCurrency(val);
				}
			}
        },
		colors: ['#DCE6EC', '#E91E63', '#9C27B0']
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

<div class="h-20" id="chart" bind:this={chart} />
