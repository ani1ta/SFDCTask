import { LightningElement, track, wire } from 'lwc';
import getTop10Leads from '@salesforce/apex/LeadController.getTop10Leads';

export default class LeadRecordList extends LightningElement {
    @track leads;
    selectedLead;

    columns = [
        {
            label: 'Name',
            fieldName: 'Name'
        },
        {
            label: 'Email',
            fieldName: 'Email'
        },
        {
            label: 'Phone',
            fieldName: 'Phone'
        },
        {
            label: 'Company',
            fieldName: 'Company'
        }
    ];

    @wire(getTop10Leads)
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowSelection(event) {
        this.selectedLead = event.detail.selectedRows[0];
        console.log('Selected Lead:', this.selectedLead);
    }

    handleModalClose() {
        this.selectedLead = null;
    }
}
