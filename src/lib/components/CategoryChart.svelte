<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { formatCurrency } from '$lib/utils';
	import type { ApexOptions } from 'apexcharts';

	export let amounts: number[] = [];
	export let categories: string[] = [];

	let chart: HTMLElement;
	let smolChart: HTMLElement;

	let apexChart: ApexCharts;
	let smolApexChart: ApexCharts;

	let options: ApexOptions = {
		chart: {
			type: 'pie',
			height: 350,
			foreColor: '#fff'
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
			y: {
				formatter: (val) => {
					return formatCurrency(val);
				}
			}
		},
		legend: {
			show: true
		},
		series: amounts.map((d) => parseInt(d.toString())),
		labels: categories,
		colors: ['#890000', '#ae3d00', '#4a3c00', '#3b5828', '#014c63']
	};

	let smolOptions: ApexOptions = {
		chart: {
			type: 'pie',
			height: 1000,
			foreColor: '#fff'
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
			y: {
				formatter: (val) => {
					return formatCurrency(val);
				}
			}
		},
		legend: {
			show: true,
			position: 'bottom'
		},
		series: amounts.map((d) => parseInt(d.toString())),
		labels: categories,
		colors: ['#890000', '#ae3d00', '#4a3c00', '#3b5828', '#014c63']
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		apexChart = new ApexCharts(chart, options);
		smolApexChart = new ApexCharts(smolChart, smolOptions);
		await apexChart.render();
		await smolApexChart.render();
	});

	onDestroy(() => {
		apexChart.destroy();
		smolApexChart.destroy();
	});
</script>

<div class="h-96 overflow-y-auto overflow-x-hidden">
	<div id="chart" class="hidden xl:block" bind:this={chart} />
	<div id="smolchart" class="block xl:hidden" bind:this={smolChart} />
</div>
