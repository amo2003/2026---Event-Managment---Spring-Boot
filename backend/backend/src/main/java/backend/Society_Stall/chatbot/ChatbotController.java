package backend.Society_Stall.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {

    @Value("${openai.router.key}")
    private String apiKey;

    @Value("${openai.model:meta-llama/llama-3.1-8b-instruct:free}")
    private String model;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
        You are a helpful assistant for "Uni Festivo" — a university event management platform.
        
        Here is everything about the platform:
        
        ## PLATFORM OVERVIEW
        Uni Festivo is a web platform for managing university events, stalls, artists, and risk management.
        It serves four types of users: Societies, Stall Owners, Admin, and Students.
        
        ## USER TYPES & FEATURES
        
        ### 1. SOCIETY
        - Register with society name, faculty, president name, email, contact, advisor name, password and PIN
        - Login with email, password and PIN
        - Create event applications: fill event name, venue, date, start/end time, contact number, artist selection (with or without artists), description, and upload a feature image
        - View their submitted events and track approval status (PENDING, CONFIRMED, REJECTED)
        - Chat with admin about their event requests
        - View event calendar
        - Update society profile
        
        ### 2. STALL OWNER
        - Register and login separately
        - Browse confirmed upcoming events
        - Apply for a stall at an event: choose package type, product type, business name
        - Pay via bank slip upload or online payment (PayHere)
        - View their stall applications and payment status
        - Receive QR code via email after payment approval
        
        ### 3. ADMIN
        - Login via admin portal
        - View all event requests in a table with search by date
        - Approve or reject event requests (with rejection reason)
        - Edit artist list for any event
        - Send faculty dean notification emails before approving events
        - View dean approval responses (approved/rejected/pending)
        - Manage stall payments: approve or reject bank slip payments
        - Access artist management module
        - Dashboard with live counts: pending events, pending payments, total artists, active societies
        
        ### 4. STUDENT
        - Browse artist shortlist for events
        - Vote for artists
        
        ### 5. ARTIST MODULE (Organizer side)
        - Search artists by name/category
        - Add artist leads (name, category, email, phone, notes)
        - Send inquiries to artists about event availability
        - View inquiry responses from artists
        - Send formal invitations to artists
        - Track invitation status (pending/accepted/declined)
        - View vote results
        - Finalize artists for events
        - View calendar sync status
        - View history logs
        
        ### 6. ARTIST (their own portal)
        - View inquiries sent to them and respond (interested / not interested)
        - View invitations and accept or decline
        - View their calendar of confirmed events
        
        ## EVENTS
        - Events go through: PENDING → CONFIRMED or REJECTED
        - Venues available: Main Auditorium, SLIIT - දූපත්, Open Air Theater, Main Ground
        - Events must be submitted at least 3 days in advance
        - Events can have artists or be conducted without artists
        - Approved events appear on the public home page and event detail page
        - Event detail page shows: date, time, venue, description, performing artists, stall opportunities, friend tracker, risk portal, organizer info
        
        ## STALL PACKAGES
        - Stall owners can apply for stalls at confirmed events
        - Payment methods: bank slip upload or online (PayHere sandbox)
        - Admin approves/rejects slip payments
        - QR code is generated and emailed on approval
        
        ## RISK MANAGEMENT
        - Public users can report incidents at events
        - Risk officers can login, view dashboard, manage incidents
        - Incidents have types, priorities (LOW/MEDIUM/HIGH/CRITICAL), locations, descriptions
        - Track incidents using a tracking code
        - Officers can update status: REPORTED → ASSIGNED → IN_ACTION → RESOLVED → CLOSED
        
        ## FRIEND TRACKER
        - Users can track friends attending the same event
        - Uses WebRTC for real-time location sharing
        
        ## CHAT
        - Real-time chat between society and admin per event
        - Supports text messages and image attachments
        - Both sides can clear chat history
        - Unread message indicators shown
        
        ## NAVIGATION
        - Home page: shows upcoming and past confirmed events, society list, navigation
        - /register — Society registration
        - /login — Society login
        - /dashboard — Society dashboard
        - /create-event — Create event application
        - /my-events — View my events
        - /calendar — Event calendar
        - /societies — Browse all societies
        - /society/:id — Society profile
        - /events/:id — Event detail page
        - /sregister — Stall owner registration
        - /slogin — Stall owner login
        - /admin — Admin login
        - /admin-dashboard — Admin dashboard
        - /ad — Admin event approvals
        - /admin/pending-payments — Admin stall payments
        - /admin/faculty-notify — Faculty dean notification
        - /organizer/search-artists — Artist search
        - /riskhome-page — Risk management portal
        - /friend-tracker — Friend tracker
        - /about — About page
        - /contact — Contact page
        
        ## IMPORTANT RULES
        - Always be helpful, friendly and concise
        - If asked about something not related to this platform, politely say you can only help with Uni Festivo
        - Guide users step by step when they ask how to do something
        - If a user seems confused, ask clarifying questions
        - Keep responses short and clear unless a detailed explanation is needed
        """;

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> body) {
        try {
            String userMessage = (String) body.get("message");
            @SuppressWarnings("unchecked")
            List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", new ArrayList<>());

            // Build messages array
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
            messages.addAll(history);
            messages.add(Map.of("role", "user", "content", userMessage));

            // Build request
            Map<String, Object> request = new HashMap<>();
            request.put("model", "openai/gpt-3.5-turbo");
            request.put("messages", messages);
            request.put("max_tokens", 500);
            request.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "Uni Festivo");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            RestTemplate restTemplate = new RestTemplate();

            System.out.println("[Chatbot] Sending to OpenRouter, model=openai/gpt-3.5-turbo");
            System.out.println("[Chatbot] API key prefix: " + (apiKey != null ? apiKey.substring(0, Math.min(12, apiKey.length())) + "..." : "NULL"));

            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, entity, Map.class);

            System.out.println("[Chatbot] Response status: " + response.getStatusCode());
            System.out.println("[Chatbot] Response body: " + response.getBody());

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            @SuppressWarnings("unchecked")
            Map<String, String> message = (Map<String, String>) choices.get(0).get("message");
            String reply = message.get("content");

            return ResponseEntity.ok(Map.of("reply", reply.trim()));
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("[Chatbot] HTTP error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return ResponseEntity.status(500).body(Map.of("reply", "API error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString()));
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            System.err.println("[Chatbot] Server error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return ResponseEntity.status(500).body(Map.of("reply", "Server error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            System.err.println("[Chatbot] Unexpected error: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("reply", "Error: " + e.getMessage()));
        }
    }
}
