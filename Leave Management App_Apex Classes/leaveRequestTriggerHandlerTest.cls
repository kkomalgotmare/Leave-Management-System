@isTest
public class leaveRequestTriggerHandlerTest {
    
    @testSetup public static void testSetup(){
        Profile profile1 = [SELECT Id FROM Profile WHERE Name='Standard User'];
        
        User user1 = new User(Alias = 'nusert', Email='test1@gmail.com',
                              EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
                              LocaleSidKey='en_US', ProfileId = profile1.Id,
                              TimeZoneSidKey='America/Los_Angeles',
                              UserName= 'New2User@testing.com');
        
        System.runAs(user1) {
            List<Leave_Request__c> levaeRequest =  new List<Leave_Request__c>();
            
            for(integer i=0; i<10; i++){
                Leave_Request__c LR = new Leave_Request__c();
                LR.From_Date__c = System.today()+1;
                LR.To_Date__c = System.today()+2;
                LR.Leave_Type__c = 'Sick Leave';
                LR.Status__c = 'Pending';
                LR.Reason__c = 'Cough and Cold'+i;
                LR.User__c = UserInfo.getUserID();
                
                levaeRequest.add(LR);
            }
            
            for(integer i=0; i<10; i++){
                Leave_Request__c LR = new Leave_Request__c();
                LR.From_Date__c = System.today()+1;
                LR.To_Date__c = System.today()+2;
                LR.Leave_Type__c = 'Planned Leave';
                LR.Status__c = 'Pending';
                LR.Reason__c = 'Home Shifting';
                LR.User__c = UserInfo.getUserID();
                
                levaeRequest.add(LR);
            }
            
            insert levaeRequest;
            
            
            User_Leaves__c userLeaves = new User_Leaves__c();
            userLeaves.Total_Allocated__c = 5;
            userLeaves.Total_Consumed__c = 1;
            userLeaves.Leave_Type__c = 'Sick Leave';
            userLeaves.User__c = UserInfo.getUserID();
            
            insert userLeaves;
            
        }
    }
    
    @isTest
    public static void autoPopulateUserFiledTest(){
        
        List<Leave_Request__c> LeaveRequest = [SELECT From_Date__c, To_Date__c, Leave_Type__c, Status__c, User__c, Reason__c,OwnerId
                                               FROM Leave_Request__c];
            
        Test.startTest();        
        leaveRequestTriggerHandler.autoPopulateUserFiled(LeaveRequest);       
        Test.stopTest();
    }
    
    @isTest
    public static void updateConsumedLeaveFieldOfUserLeavesObjectTest(){
        
        List<Leave_Request__c> LeaveRequest = [SELECT From_Date__c, To_Date__c, Leave_Type__c, Status__c, User__c, Reason__c,OwnerId
                                               FROM Leave_Request__c];
        for(Leave_Request__c LR: LeaveRequest){
            if(LR.Leave_Type__c == 'Sick Leave' && LR.Reason__c == 'Cough and Cold0'){
                LR.Status__c = 'Approved';
            }             
        }
        update LeaveRequest;
        
        Test.startTest();
        leaveRequestTriggerHandler.updateConsumedLeaveFieldOfUserLeavesObject(LeaveRequest);
        Test.stopTest();
    }
    
    @isTest
    public static void SendEmailToMgrTest(){
        
        List<Leave_Request__c> LeaveRequest = [SELECT From_Date__c, To_Date__c, Leave_Type__c, Status__c, User__c, Reason__c,OwnerId
                                               FROM Leave_Request__c];
        for(Leave_Request__c LR: LeaveRequest){
            if(LR.Leave_Type__c == 'Sick Leave' && LR.Reason__c == 'Cough and Cold0'){
                LR.Status__c = 'Approved';
            }             
        }
        update LeaveRequest;
        
        Test.startTest();
        leaveRequestTriggerHandler.SendEmailToMgr(LeaveRequest);        
        Test.stopTest();
    }
}