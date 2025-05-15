package com.ncinga.backend.services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WhatsAppService {

    private static final String API_URL = "https://api.wassenger.com/v1/messages";
    private static final String API_TOKEN = "2fa4717077323e4f83b44ff99ebc1a14b9feb0b708da5a29f60f5b3ad3ee3e6f195b66fbe710396d";
    private static final String GROUP_ID = "120363330893814530@g.us";

    public String sendUnconfirmedActivitiesMessage(List<String> unconfirmedActivityNames) {
        if (unconfirmedActivityNames.isEmpty()) return "NO OVERDUE ACTIVITIES TO NOTIFY.";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Token", API_TOKEN);

        // OVERDUE ITEM SINGLE HEADING
//        String activitiesList = "\uD83D\uDCE2 *Attention Please* \n" +
//                "The following activities are overdue or remain unconfirmed \n\n" +
//                unconfirmedActivityNames.stream()
//                                .map(activity -> "• " + activity)
//                                .collect(Collectors.joining("\n"));
//
//        System.out.println("ACTIVITY LIST : " + activitiesList);

        String heading = unconfirmedActivityNames.size() == 1
                ? "The following activity is overdue or remains unconfirmed:"
                : "The following activities are overdue or remain unconfirmed:";

        String activitiesList = "📢 *Attention Please*\n" + heading + "\n\n" +
                unconfirmedActivityNames.stream()
                        .map(activity -> "• " + activity)
                        .collect(Collectors.joining("\n"));

        System.out.println("ACTIVITY LIST : " + activitiesList);

        String requestBody = String.format(
                "{\"group\":\"%s\",\"message\":\"%s\"}",
                GROUP_ID,
                activitiesList
                        .replace("\\", "\\\\")  // Escape backslashes first
                        .replace("\"", "\\\"")  // Escape double quotes
                        .replace("\n", "\\n")   // Escape newlines
                        .replace("\t", "\\t")   // Escape tabs
                        .replace("\r", "\\r")   // Escape carriage returns
        );

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, request, String.class);
            return response.getStatusCode().is2xxSuccessful()
                    ? "Message sent successfully"
                    : "Failed to send message: " + response.getStatusCode();
        } catch (Exception e) {
            return "Error sending message: " + e.getMessage();
        }
    }


    //night 12.00 am - 06.59 am whats app message method
    public String sendMidnightOverdueRecordsMessage(List<String> overdueRecords) {
        if (overdueRecords.isEmpty()) return "NO OVERDUE ACTIVITIES TO NOTIFY.";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Token", API_TOKEN);

        String heading = overdueRecords.size() == 1
                ? "The following activity is overdue or remains unconfirmed:"
                : "The following activities are overdue or remain unconfirmed:";

        String activitiesList = "📢 *Attention Please*\n" + heading + "\n\n" +
                overdueRecords.stream()
                        .map(activity -> "• " + activity)
                        .collect(Collectors.joining("\n"));

        System.out.println("ACTIVITY LIST : " + activitiesList);

        String requestBody = String.format(
                "{\"group\":\"%s\",\"message\":\"%s\"}",
                GROUP_ID,
                activitiesList
                        .replace("\\", "\\\\")  // Escape backslashes first
                        .replace("\"", "\\\"")  // Escape double quotes
                        .replace("\n", "\\n")   // Escape newlines
                        .replace("\t", "\\t")   // Escape tabs
                        .replace("\r", "\\r")   // Escape carriage returns
        );

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, request, String.class);
            return response.getStatusCode().is2xxSuccessful()
                    ? "Message sent successfully"
                    : "Failed to send message: " + response.getStatusCode();
        } catch (Exception e) {
            return "Error sending message: " + e.getMessage();
        }
    }

}