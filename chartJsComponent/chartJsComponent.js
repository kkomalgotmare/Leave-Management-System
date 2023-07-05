import { LightningElement, track, wire } from 'lwc';
import retriveDataForSickLeave from '@salesforce/apex/retriveLeaveRequests.retriveDataForSickLeave'
import retriveDataForPlannedLeave from '@salesforce/apex/retriveLeaveRequests.retriveDataForPlannedLeave'
import retriveDataForUnPaidLeave from '@salesforce/apex/retriveLeaveRequests.retriveDataForUnpaidLeave'
import { refreshApex } from '@salesforce/apex';

import chartjs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ChartJsComponent extends LightningElement {

    @track sickLeaveData;
    @track plannedLeaveData;
    @track unpaidLeaveData;

    @track Sick_Total_Allocated__c;
    @track Sick_Total_Consumed__c;
    @track Sick_Remaining_Leaves__c;

    @track Planned_Total_Allocated__c;
    @track Planned_Total_Consumed__c;
    @track Planned_Remaining_Leaves__c;

    @track Unpaid_Total_Allocated__c;
    @track Unpaid_Total_Consumed__c;
    @track Unpaid_Remaining_Leaves__c;


    /* Wire Method for SickLeave */
    @wire(retriveDataForSickLeave)
    fetchSickLeave({ error, data }) {
        if (data) {

            this.sickLeaveData = data;
            refreshApex(data);

            this.Sick_Total_Allocated__c = data[Object.keys(data)[0]].Total_Allocated__c;
            this.Sick_Total_Consumed__c = data[Object.keys(data)[0]].Total_Consumed__c;
            this.Sick_Remaining_Leaves__c = data[Object.keys(data)[0]].Remaining_Leaves__c;

            //refreshApex(this.Sick_Total_Allocated__c, this.Sick_Total_Consumed__c, this.Sick_Remaining_Leaves__c);

            console.log('In Sick Leave:');

            error = undefined;
        } else {
            this.error = error;
            this.sickLeaveData = undefined;
        }
    }

    /*  Wire Method for Planned Leave */
    @wire(retriveDataForPlannedLeave)
    fetchPlannedLeave({ error, data }) {
        if (data) {

            this.plannedLeaveData = data;
            refreshApex(data);

            this.Planned_Total_Allocated__c = data[Object.keys(data)[0]].Total_Allocated__c;
            this.Planned_Total_Consumed__c = data[Object.keys(data)[0]].Total_Consumed__c;
            this.Planned_Remaining_Leaves__c = data[Object.keys(data)[0]].Remaining_Leaves__c;

            //refreshApex(this.Planned_Total_Allocated__c, this.Planned_Total_Consumed__c, this.Planned_Remaining_Leaves__c);

            console.log('Planned Leaves Data:  ', this.Planned_Total_Allocated__c, this.Planned_Total_Consumed__c, this.Planned_Remaining_Leaves__c);

            error = undefined;
        } else {
            this.error = error;
            this.plannedLeaveData = undefined;
        }
    }

    /* Wire Method for UnPaid Leave */
    @wire(retriveDataForUnPaidLeave)
    fetchUnpaidLeave({ error, data }) {
        if (data) {

            this.unpaidLeaveData = data;
            refreshApex(data);

            this.Unpaid_Total_Allocated__c = data[Object.keys(data)[0]].Total_Allocated__c;
            this.Unpaid_Total_Consumed__c = data[Object.keys(data)[0]].Total_Consumed__c;
            this.Unpaid_Remaining_Leaves__c = data[Object.keys(data)[0]].Remaining_Leaves__c;

            //refreshApex(this.Unpaid_Total_Allocated__c, this.Unpaid_Total_Consumed__c, this.Unpaid_Remaining_Leaves__c);
            console.log('Unapid Leave Data:', this.Unpaid_Total_Allocated__c, this.Unpaid_Total_Consumed__c, this.Unpaid_Remaining_Leaves__c);

            error = undefined;
        } else {
            this.error = error;
            this.unpaidLeaveData = undefined;
        }
    }



    @track chart;

    renderedCallback() {
        if (this.chart) {
            return;
        }

        Promise.all([
            loadScript(this, chartjs)
        ])
            .then(() => {
                this.initializeSickChart();
                this.initializePlannedChart();
                this.initializeUnpaidChart();

            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
            });
    }

    initializeSickChart() {
        const ctx = this.template.querySelector('canvas.SickLeaveDonut').getContext('2d');

        const chartData = {
            labels: ['Consumed Leaves', 'Remaining Leaves'],
            datasets: [{
                data: [this.Sick_Total_Consumed__c, this.Sick_Remaining_Leaves__c],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ]
            }]
        };

        this.chart = new window.Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    }

    initializePlannedChart() {
        const ctx = this.template.querySelector('canvas.PlannedLeaveDonut').getContext('2d');

        const chartData = {
            labels: ['Consumed Leaves', 'Remaining Leaves'],
            datasets: [{
                data: [this.Planned_Total_Consumed__c, this.Planned_Remaining_Leaves__c],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ]
            }]
        };

        this.chart = new window.Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    }

    initializeUnpaidChart() {
        const ctx = this.template.querySelector('canvas.UnpaidLeaveDonut').getContext('2d');

        const chartData = {
            labels: ['Consumed Leaves', 'Remaining Leaves'],
            datasets: [{
                data: [this.Unpaid_Total_Consumed__c, this.Unpaid_Remaining_Leaves__c],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ]
            }]
        };

        this.chart = new window.Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    }
}
