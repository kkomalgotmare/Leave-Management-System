import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Leave_Req_Obj from '@salesforce/schema/Leave_Request__c';

export default class LeaveRequestCreateForm extends LightningElement {
    leave_req_obj = Leave_Req_Obj;
    @api myfields;
    @api rowidtopass;

    handleSuccess(event) {

        event.preventDefault(); // stop the form from submitting

        const fromDateField = event.detail.fields.From_Date__c;
        const toDateField = event.detail.fields.To_Date__c;
        const todaysDate = new Date().toISOString()

        /* Toast msg based on differnt validation rules */
        if (fromDateField > toDateField) {
            const validationToastEvent1 = new ShowToastEvent({
                title: "From Date Must Be Smaller Than To Date",
                variant: "error"
            })
            this.dispatchEvent(validationToastEvent1);
        } else if (fromDateField <= todaysDate) {
            const validationToastEvent2 = new ShowToastEvent({
                title: "From Date Must Be In Future",
                variant: "error"
            })
            this.dispatchEvent(validationToastEvent2);
        } else {
            const toastEvent = new ShowToastEvent({
                title: "Leave Request Submitted",
                variant: "success"
            })
            this.dispatchEvent(toastEvent);
            this.template.querySelector('lightning-record-form').submit();
        }

        /*  To Clear The Form */
        const editForm = this.template.querySelector('lightning-record-form');
        editForm.recordId = null;
    }
}