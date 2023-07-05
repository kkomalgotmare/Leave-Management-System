public with sharing class retriveLeaveRequests {
    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> retriveLeaveRequests(String ProfileName, String tabName) {
        
        List<Leave_Request__c> returnList = new List<Leave_Request__c>();
        
        try{
            if (ProfileName == 'System Administrator' && tabName == 'myLeaveStatusTabSet') {
                returnList =  [SELECT Name, Leave_Type__c, From_Date__c, To_Date__c, Reason__c, Status__c, Manager_Comment__c 
                               FROM Leave_Request__c 
                               WHERE OwnerId=:UserInfo.getUserID() with SECURITY_ENFORCED];
            } else {
                returnList =  [SELECT Name, Leave_Type__c, From_Date__c, To_Date__c, Reason__c, Status__c, Manager_Comment__c 
                               FROM Leave_Request__c];
            }
        }catch(System.QueryException emsg){
            throw new AuraHandledException(emsg.getMessage());
        }        
        return returnList;        
    }


    @AuraEnabled(cacheable=true)
    public static List<	User_Leaves__c> retriveDataForSickLeave(){
        List<User_Leaves__c> returnList = new List<User_Leaves__c>();
        
        try{
            returnList = [SELECT Total_Allocated__c, Total_Consumed__c, Remaining_Leaves__c
                          From User_Leaves__c 
                          WHERE Leave_Type__c ='Sick Leave' AND OwnerId=:UserInfo.getUserID() with SECURITY_ENFORCED];
            
        }catch(System.QueryException emsg){
            throw new AuraHandledException(emsg.getMessage());
        }
        return returnList;
    }

    @AuraEnabled(cacheable=true)
    public static List<	User_Leaves__c> retriveDataForPlannedLeave(){
        List<User_Leaves__c> returnList = new List<User_Leaves__c>();
        
        try{
        returnList =  [SELECT Total_Allocated__c, Total_Consumed__c, Remaining_Leaves__c
                From User_Leaves__c 
                WHERE Leave_Type__c ='Planned Leave' AND OwnerId=:UserInfo.getUserID() with SECURITY_ENFORCED];
        }catch(System.QueryException emsg){
            throw new AuraHandledException(emsg.getMessage());
        }        
        return returnList;        
    }

    @AuraEnabled(cacheable=true)
    public static List<	User_Leaves__c> retriveDataForUnpaidLeave(){
        List<User_Leaves__c> returnList = new List<User_Leaves__c>();
        
        try{
        returnList =  [SELECT Total_Allocated__c, Total_Consumed__c, Remaining_Leaves__c
                From User_Leaves__c 
                WHERE Leave_Type__c ='Unpaid Leave' AND OwnerId=:UserInfo.getUserID() with SECURITY_ENFORCED];
        }catch(System.QueryException emsg){
            throw new AuraHandledException(emsg.getMessage());
        }        
        return returnList;
    }
}