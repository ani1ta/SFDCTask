/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRelatedRecords() {
        // Replace 'ObjectApiName__c' with the actual API name of the related object
        // Example: SELECT Id, Name FROM Account LIMIT 10
        return [SELECT Id, Name FROM Account LIMIT 10];
        
    }
    @AuraEnabled(cacheable=true)
    public static List<SObject> getNameRecords() {
        // Replace 'ObjectApiName__c' with the actual API name of the name object
        // Example: SELECT Id, Name FROM Contact LIMIT 10
        return [SELECT Id, Name FROM Lead LIMIT 10];
    }
    @AuraEnabled

        // Implement logic to insert Task record
        public static void insertTaskRecord(Map<String, Object> taskRecordMap) {
            try {
                Task taskRecord = (Task) taskRecordMap.get('taskRecord');
                insert taskRecord;
            } catch (Exception ex) {
                // Handle exception and error
                String errorMessage = 'Error inserting Task record: ' + ex.getMessage();
                System.debug(errorMessage);
            }
        }
    @AuraEnabled
    public static void sendEmailToLeadOwner(Task taskRecord, Id leadId, String leadName, String leadEmail, String leadPhone, String leadCompany) {
        // Implement email sending logic here using Messaging.SingleEmailMessage
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        // Create the email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{'anitahmishra@gmail.com'}); // Replace with lead owner's email
        email.setSubject('New Task Logged for Lead');
        email.setPlainTextBody('A new Task has been logged for the Lead:\n'
            + 'Lead Name: ' + leadName + '\n'
            + 'Lead Email: ' + leadEmail + '\n'
            + 'Lead Phone: ' + leadPhone + '\n'
            + 'Lead Company: ' + leadCompany + '\n'
            + '\n'
            + 'Log Call details: ' 
            + 'Call Details: ' + taskRecord.Subject + '\n'
            + 'Call Description: ' + taskRecord.Description + '\n');

        // Add the email to the list
        emails.add(email);

        // Send the emails
        Messaging.sendEmail(emails);

        // Update lead with success message and timestamp
        updateLeadWithSuccessMessage(leadId);
    }

    @AuraEnabled
    public static void updateLeadWithSuccessMessage(Id leadId) {
        // Implement logic to update Lead with success message and date/time
        try {
            Lead leadToUpdate = [SELECT Id, Log_Call_Success_Message__c, Log_Call_Date_Time__c  FROM Lead WHERE Id = :leadId];

            if (leadToUpdate != null) {
                leadToUpdate.Log_Call_Success_Message__c = 'Task logged successfully'; // Update this to your actual success message
                leadToUpdate.Log_Call_Date_Time__c = System.now(); // Update this to the appropriate field API name

                update leadToUpdate;
                
            } else {
                // Lead not found, handle accordingly
                
            }
        } catch (Exception ex) {
            // Handle exception and error
            String errorMessage = 'Error updating Lead: ' + ex.getMessage();
            System.debug(errorMessage);
        }
    }
}