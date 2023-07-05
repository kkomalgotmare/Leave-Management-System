import { api, LightningElement, track, wire } from 'lwc';
import getLeaveReq from '@salesforce/apex/retriveLeaveRequests.retriveLeaveRequests';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import userProfile from '@salesforce/schema/User.Profile.Name';
import Form_Date from '@salesforce/schema/Leave_Request__c.From_Date__c';
import To_Date from '@salesforce/schema/Leave_Request__c.To_Date__c';
import Leave_Type from '@salesforce/schema/Leave_Request__c.Leave_Type__c';
import Reason from '@salesforce/schema/Leave_Request__c.Reason__c';
import Mgr_Comment from '@salesforce/schema/Leave_Request__c.Manager_Comment__c';
import Status from '@salesforce/schema/Leave_Request__c.Status__c';
import User from '@salesforce/schema/Leave_Request__c.User__c';

export default class LeaveRequestRecords extends LightningElement {

    @track shouldOpenEditForm = false;
    rowidtopass;
    @track error;
    @track userId = Id;
    @api userProfileName;
    @api tabname;

    @track isLoading = true;
    @track shouldDisplayLeaveRecords = false;

    myEmpFields = [Form_Date, To_Date, Leave_Type, Reason];
    myMgrFields = [Form_Date, To_Date, Leave_Type, Reason, Status, Mgr_Comment, User];
    myFields;

    @track leaveReqToDisplay;
    @track columns = [
        {
            label: 'RequestID', fieldName: 'Name', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'Leave Type', fieldName: 'Leave_Type__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'From Date', fieldName: 'From_Date__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'To Date', fieldName: 'To_Date__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'Reason', fieldName: 'Reason__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'Status', fieldName: 'Status__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            label: 'Manager Commnet', fieldName: 'Manager_Comment__c', type: 'text', cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
        {
            type: "button", label: '', initialWidth: 100, typeAttributes: {
                label: 'Edit',
                name: 'Edit',
                title: 'Edit',
                disabled: false,
                value: 'edit',
                variant: 'brand-outline'
            }, cellAttributes: {
                class: { fieldName: 'statusColor' }
            }
        },
    ];

    /* Wire method to retrive loign User Details */

    @wire(getRecord, { recordId: Id, fields: [userProfile] })
    fetchCurrentUserInfo({ error, data }) {
        if (data) {
            this.userProfileName = data.fields.Profile.value.fields.Name.value;
            /* send MyFields dynamically to leaveRequestCreateForm Component */
            if (this.userProfileName === 'Salesforce Developer') {
                this.myFields = this.myEmpFields;
            } else if (this.userProfileName === 'System Administrator') {
                if (this.tabname === 'myLeaveStatusTabSet') {
                    this.myFields = this.myEmpFields;
                } else {
                    this.myFields = this.myMgrFields;
                }
            }
        } else if (error) {
            this.error = error;
        }
    }

    /* Wire Method to retrive records */
    @wire(getLeaveReq, { ProfileName: '$userProfileName', tabName: '$tabname' })
    fetchLeaveRecords({ error, data }) {
        if (data) {
            //Set the spninner to false to stop showing
            this.isLoading = false;
            // after the spinner stops it should show the dataTable and records
            this.shouldDisplayLeaveRecords = true;

            /* To apply color to cell from data table based on differnt value */
            this.leaveReqToDisplay = data.map(item => {
                let statusColor = item.Status__c === 'Approved' ? "slds-text-color_default slds-theme_success" : item.Status__c === 'Rejected' ? "slds-theme_warning" : '';
                return { ...item, "statusColor": statusColor };
            });
            this.error = undefined;
        } else {
            this.error = error;
            this.leaveReqToDisplay = undefined;
        }
    }

    navigateToEditRecordPage(event) {
        const recid = event.detail.row.Id;
        this.rowidtopass = recid;
        this.shouldOpenEditForm = true;
    }

    closeModal() {
        this.shouldOpenEditForm = false;
    }
}