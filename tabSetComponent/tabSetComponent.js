import { LightningElement, track } from 'lwc';
import Form_Date from '@salesforce/schema/Leave_Request__c.From_Date__c';
import To_Date from '@salesforce/schema/Leave_Request__c.To_Date__c';
import Leave_Type from '@salesforce/schema/Leave_Request__c.Leave_Type__c';
import Reason from '@salesforce/schema/Leave_Request__c.Reason__c';


export default class TabSetComponent extends LightningElement {

    myEmpFields = [Form_Date, To_Date, Leave_Type, Reason];

    /* Send the Current Tab Name to   leaveRequestRecodsForm to show fileds based on profile and tabName*/
    myLeaveStatusTabSet = 'myLeaveStatusTabSet';
    myLeaveAppliedTabSet = 'myLeaveAppliedTabSet';
    @track shouldOpenForm = false;

    handleOnClickAddButton() {
        this.shouldOpenForm = true;
    }

    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.shouldOpenForm = false;
    }
}