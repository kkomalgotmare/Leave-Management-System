//Auto Update the User Lookup Field as the owner of the Record
public class leaveRequestTriggerHandler {
    public static void autoPopulateUserFiled(List<Leave_Request__c> listofLeaveRequest){
        for(Leave_Request__c lr : listofLeaveRequest){
            //lr.User__c = UserInfo.getName();
            lr.User__c = lr.OwnerId;
        }
    }
    
// Update the Total_Consumed__c field on User_Leaves__c if the Leave_Request__c Record's edited and if Leave_Type__c and User__c field matches the existing User_Leaves__c objects records
    public static void updateConsumedLeaveFieldOfUserLeavesObject(List<Leave_Request__c> listofLeaveRequest){
        List<User_Leaves__c> userLeavesRecords = new List<User_Leaves__c>();
        for(Leave_Request__c leaveList : listofLeaveRequest){
            //retirve the related matching records fromm User_Leaves__c and update the Total_Consumed__c field 
            if(leaveList.Status__c == 'Approved'){                
                userLeavesRecords = [SELECT Total_Consumed__c, Leave_Type__c, User__c 
                                     FROM User_Leaves__c 
                                     WHERE Leave_Type__c =: leaveList.Leave_Type__c AND User__c =: leaveList.User__c];
            }
        }
        
        for(User_Leaves__c userleaves : userLeavesRecords){
            userleaves.Total_Consumed__c = userleaves.Total_Consumed__c + 1;
        }
        try{
          update userLeavesRecords;  
        }catch(Exception e){
            System.debug('An Exception Occurred: '+e.getMessage());
        }
        
    }
   
    // Send the Email to Manager on Submission of new Leave Request
    public static void SendEmailToMgr(List<Leave_Request__c> listofLeaveRequest){
        //Retrive User Name from lookUp field
        String lookupUserName;
        Set<Id> lookupIds = new Set<Id>();
        for (Leave_Request__c record : listofLeaveRequest) {
            lookupIds.add(record.User__c);
        }
        Map<Id, User> relatedRecords = new Map<Id, User>(
            [SELECT Id, Name FROM User WHERE Id IN :lookupIds]
        );
        
        for (Leave_Request__c record : listofLeaveRequest) {
            Id lookupId = record.User__c;
            if (relatedRecords.containsKey(lookupId)) {
                User relatedRecord = relatedRecords.get(lookupId);
                lookupUserName = relatedRecord.Name;
                // Use the lookupName as needed
            }
        }
        
        //Send Email to Manager after creation of new Leave Request
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
       
        for(Leave_Request__c leaveRequests : listofLeaveRequest){
            // Step 1: Create a new Email
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            
            // Step 2: Set who should get the email
            String[] toAddresses = new String[] {'komalgotmare.officialonly@gmail.com'};
            mail.setToAddresses(toAddresses);
            
            // Step 4. Set email contents - you can use variables!
            mail.setSubject('New Leave Request Submitted');
            mail.setPlainTextBody('Dear Manager, '+'\n\n'+  'New Leave is Assigned To You.'+'\n\n'+'Request you to verify the details of the submission and Approve/Reject accordingly.'+'\n\n'+'Below are details of Leave Submission'+'\n\n'+
                            'From Date:'+ leaveRequests.From_Date__c + '\n' +'To Date: '+ leaveRequests.To_Date__c +'\n'+ 'Leave Type: ' +leaveRequests.Leave_Type__c + '\n'+ 'Reason: ' + leaveRequests.Reason__c +'\n' + 'User Name:' +lookupUserName);
            
            // Step 5. Add your email to the master list
            mails.add(mail);
        }
        try{
            Messaging.sendEmail(mails);
        }catch(Exception e){
            System.debug('An Exception Occurred: '+e.getMessage());
        }
        
    }
}