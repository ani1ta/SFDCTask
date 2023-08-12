import { LightningElement, api, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getRelatedRecords from '@salesforce/apex/TaskController.getRelatedRecords';
import getNameRecords from '@salesforce/apex/TaskController.getNameRecords';
import insertTaskRecord from '@salesforce/apex/TaskController.insertTaskRecord';
import sendEmailToLeadOwner from '@salesforce/apex/TaskController.sendEmailToLeadOwner';
import updateLeadWithSuccessMessage from '@salesforce/apex/TaskController.updateLeadWithSuccessMessage';

import TASK_OBJECT from '@salesforce/schema/Task';
import LEAD_OBJECT from '@salesforce/schema/Lead'; 

export default class LogACallModal extends LightningElement {
    @api lead;

    @track subject = '';
    @track comments = '';
    @track relatedToId = '';
    @track nameId = '';

    subjectOptions = [
        { label: '--None--', value: '--None--' },
        { label: 'Call', value: 'Call' },
        { label: 'Email', value: 'Email' },
        { label: 'Send Letter', value: 'Send Letter' },
        { label: 'Send Quote', value: 'Send Quote' },
        { label: 'Other', value: 'Other' }
    ];

    @wire(getRelatedRecords)
    relatedRecords;

    get relatedToOptions() {
        if (this.relatedRecords.data) {
            return this.relatedRecords.data.map(record => ({
                label: record.Name, // Replace 'Name' with the appropriate field API name
                value: record.Id
            }));
        }
        return [];
    }

    @wire(getNameRecords)
    nameRecords;

    get nameOptions() {
        if (this.nameRecords.data) {
            return this.nameRecords.data.map(record => ({
                label: record.Name, // Replace 'Name' with the appropriate field API name
                value: record.Id
            }));
        }
        return [];
    }

    handleSubjectChange(event) {
        this.subject = event.detail.value;
    }

    handleCommentsChange(event) {
        this.comments = event.target.value;
    }

    handleRelatedToChange(event) {
        this.relatedToId = event.detail.value;
    }

    handleNameChange(event) {
        this.nameId = event.detail.value;
    }

    handleSave() {
        console.log('Lead Data in Child Component:', this.lead);
        
        // Validate form inputs and insert Task record
        if (this.lead) {
            // Validate form inputs and insert Task record
            const taskRecord = {
                Subject: this.subject,
                Comments: this.comments,
                WhoId: this.nameId,
                WhatId: this.relatedToId,
                // Other Task fields...
            };
    
            insertTaskRecord({ taskRecord })
            .then(() => {
                // Call sendEmailToLeadOwner method to send the email
                return sendEmailToLeadOwner({
                    taskRecord: taskRecord,
                    leadId: this.lead.Id,
                    leadName: this.lead.Name,
                    leadEmail: this.lead.Email,
                    leadPhone: this.lead.Phone,
                    leadCompany: this.lead.Company,
                });
            })
        .then(() => {
            return updateLeadWithSuccessMessage({ leadId: this.lead.Id });
        })
        .then(() => {
            this.dispatchEvent(new CustomEvent('close'));
    
            const successEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Task logged successfully and email sent.',
                variant: 'success'
            });
            this.dispatchEvent(successEvent);
        })
        .catch(error => {
            // Handle any errors that occurred during the process
            let errorMessage = 'An error occurred. Please try again.';
        
            if (error && error.body && Array.isArray(error.body)) {
                errorMessage = error.body.map(e => e.message).join('\n');
            }
        
            // Display the error message or perform any necessary actions
            console.error(errorMessage);
        
            // You can also show an error toast or other notification to the user
            const errorEvent = new ShowToastEvent({
                title: 'Error',
                message: errorMessage,
                variant: 'error'
            });
            this.dispatchEvent(errorEvent);
        });
    }
}

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}