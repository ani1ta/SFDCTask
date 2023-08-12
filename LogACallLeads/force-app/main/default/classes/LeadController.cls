/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class LeadController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getTop10Leads() {
        try {
            return [SELECT Name, Email, Phone, Company from Lead  LIMIT 10];
        } catch (QueryException e) {
            throw new AuraHandledException('Error executing query: ' + e.getMessage());
        }
        // Implement logic to fetch top 10 leads
        // Example: return [SELECT Id, Name, Email, Phone FROM Lead ORDER BY CreatedDate LIMIT 10];
    }
}

