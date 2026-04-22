# Uni Festivo — University Event Management Platform

A full-stack web application for managing university events, stall registrations, artist bookings, risk management, and more.

---

## Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19.2.4 |
| React Router DOM | 7.13.0 |
| Axios | 1.13.5 |
| STOMP.js (WebSocket) | 7.0.0 |
| SockJS Client | 1.6.1 |
| React Leaflet | 5.0.0 |
| Leaflet | 1.9.4 |
| QRCode React | 4.2.0 |
| jsPDF | 4.2.0 |

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.2 |
| Spring Data JPA | - |
| Spring Security | - |
| Spring WebSocket | - |
| Spring Mail | - |
| MySQL Connector | - |
| JWT (jjwt) | 0.11.5 |
| ZXing QR Code | 3.5.2 |
| ModelMapper | 3.2.6 |
| Lombok | 1.18.42 |

### Database
- MySQL 8.x

---

## Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8.x
- Maven 3.8+

---

## Project Structure

```
project-root/
├── frontend/          # React application
│   ├── src/
│   │   ├── SocietyPages/      # All society, admin, stall pages
│   │   ├── ArtistPages/       # Artist module pages
│   │   ├── RiskManagePages/   # Risk management pages
│   │   ├── components/        # Shared components (ChatPanel, etc.)
│   │   ├── context/           # Auth context
│   │   ├── services/          # API service files
│   │   └── assets/            # Images and static files
│   └── package.json
│
└── backend/
    └── backend/
        ├── src/main/java/backend/
        │   ├── Society_Stall/     # Main event/society/stall module
        │   │   ├── chatbot/       # AI chatbot controller
        │   │   ├── config/        # CORS, WebSocket, PayHere config
        │   │   ├── controller/    # REST controllers
        │   │   ├── dto/           # Data transfer objects
        │   │   ├── enums/         # Status enums
        │   │   ├── exception/     # Custom exceptions
        │   │   ├── model/         # JPA entities
        │   │   ├── repository/    # Spring Data repositories
        │   │   ├── security/      # JWT utility
        │   │   └── Service/       # Business logic services
        │   ├── Artist/            # Artist management module
        │   └── riskmanagement/    # Risk management module
        ├── src/main/resources/
        │   └── application.properties
        └── pom.xml
```

---

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE eventMane;
```

2. The tables are auto-created by Spring Boot JPA (`ddl-auto=update`).

---

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend/backend
```

2. Open `src/main/resources/application.properties` and update:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/eventMane
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Gmail SMTP (for OTP and notification emails)
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

# PayHere (Sandbox)
payhere.merchant.id=YOUR_MERCHANT_ID
payhere.merchant.secret=YOUR_MERCHANT_SECRET

# JWT
app.jwt.secret=YOUR_JWT_SECRET_KEY

# OpenRouter AI (Chatbot)
openai.router.key=YOUR_OPENROUTER_API_KEY
openai.model=openai/gpt-3.5-turbo
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

3. Run the backend:

```bash
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

---

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Key Features

### Society Module
- Register / Login with email, password and PIN code
- Create event applications with venue, date, time, artists, description, image
- Track event approval status (PENDING / CONFIRMED / REJECTED)
- Real-time chat with admin per event (supports text + image)
- View event calendar
- Forgot password with OTP email verification

### Admin Module
- Admin dashboard with live stats (pending events, payments, artists, societies)
- Review and approve / reject event requests
- Edit artist list for any event
- Send faculty dean notification emails before approving
- Track dean approval responses (APPROVED / REJECTED / PENDING)
- Manage stall payments (approve / reject bank slip uploads)
- View all registered societies and stall owners with search
- Access artist management module

### Stall Owner Module
- Register / Login separately
- Browse confirmed upcoming events
- Apply for stalls at events (package, product, business details)
- Pay via bank slip upload or PayHere online payment
- Receive QR code via email after payment approval
- View stall application history
- Forgot password with OTP email verification

### Artist Module
- Organizer: search artists, add leads, send inquiries and invitations
- Track invitation status (PENDING / ACCEPTED / DECLINED)
- Student voting for artists
- Artist portal: view inquiries, invitations, calendar

### Risk Management Module
- Public incident reporting with tracking code
- Risk officer dashboard: manage incidents by priority and status
- Status flow: REPORTED → ASSIGNED → IN_ACTION → RESOLVED → CLOSED
- Alert management

### Friend Tracker
- Real-time location sharing using WebRTC
- Find friends attending the same event

### AI Chatbot
- Floating chat widget on all pages
- Powered by OpenRouter API
- Trained on full platform knowledge

---

## API Endpoints Summary

### Society
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/society/register | Register society |
| POST | /api/society/login | Login |
| GET | /api/society/all | Get all societies |
| POST | /api/society/send-otp | Send OTP for password reset |
| POST | /api/society/verify-otp-reset | Verify OTP and reset password |

### Events
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/society/events/create | Create event |
| GET | /api/society/events/my/{societyId} | Get society events |
| GET | /api/admin/events | Get all events |
| GET | /api/admin/events/pending | Get pending events |
| PUT | /api/admin/events/approve/{id} | Approve event |
| PUT | /api/admin/events/reject/{id} | Reject event |
| PUT | /api/admin/events/{id}/artists | Update artists |
| POST | /api/admin/events/{id}/notify-faculty | Send dean notification |
| POST | /api/admin/events/dean-respond/{token} | Dean responds |
| GET | /api/admin/events/dean-approvals | Get all dean responses |
| DELETE | /api/admin/events/dean-approvals/{id} | Delete dean response |

### Stall Owner
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/stall-owner/register | Register |
| POST | /api/stall-owner/login | Login |
| POST | /api/stall-owner/send-otp | Send OTP |
| POST | /api/stall-owner/verify-otp-reset | Reset password |
| POST | /api/stall-owner/{id}/stalls | Create stall application |
| POST | /api/stall-owner/{id}/upload-slip | Upload payment slip |
| POST | /api/stall-owner/{id}/pay-card | Card payment |

### Admin Stall
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/pending-payments | Get pending slip payments |
| PUT | /api/admin/approve-payment/{id} | Approve payment |
| PUT | /api/admin/reject-payment/{id} | Reject payment |
| GET | /api/admin/stall-owners | Get all stall owners |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/chat/{eventId} | Get chat history |
| PUT | /api/chat/{eventId}/mark-read | Mark as read |
| DELETE | /api/chat/{eventId}/clear | Clear chat |
| POST | /api/chat/upload-image | Upload image |
| WS | /ws-chat | WebSocket endpoint |

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/public/events/upcoming | Upcoming events |
| GET | /api/public/events/past | Past events |
| GET | /api/public/events/{id} | Event detail |

### Chatbot
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/chatbot/message | Send message to AI |

---

## Frontend Routes

| Route | Page |
|---|---|
| / | Home |
| /register | Society Register |
| /login | Society Login |
| /forgot-password | Society Forgot Password |
| /dashboard | Society Dashboard |
| /create-event | Create Event |
| /my-events | My Events |
| /calendar | Event Calendar |
| /societies | Society List |
| /society/:id | Society Profile |
| /events/:id | Event Detail |
| /sregister | Stall Owner Register |
| /slogin | Stall Owner Login |
| /sforgot-password | Stall Owner Forgot Password |
| /owner-profile/:id | Stall Owner Profile |
| /stall-application/:ownerId/:eventId | Stall Application |
| /admin | Admin Login |
| /admin-dashboard | Admin Dashboard |
| /ad | Admin Event Approvals |
| /admin/pending-payments | Admin Stall Payments |
| /admin/faculty-notify | Faculty Dean Notification |
| /admin/users | Registered Users |
| /dean/respond/:token | Dean Approval Page |
| /organizer/search-artists | Search Artists |
| /artist/inquiries | Artist Inquiries |
| /artist/invitations | Artist Invitations |
| /artist/calendar | Artist Calendar |
| /student/vote-artist | Vote Artist |
| /riskhome-page | Risk Management |
| /friend-tracker | Friend Tracker |
| /about | About |
| /contact | Contact |

---

## Environment Notes

- Backend uploads are stored in `backend/backend/uploads/` (events, slips, qrcodes, chat images)
- Static files served at `/images/events/**`, `/uploads/slips/**`, `/uploads/qrcodes/**`, `/uploads/chat/**`
- WebSocket uses STOMP over SockJS at `/ws-chat`
- OTP codes expire after 10 minutes and are stored in-memory
- PayHere is configured in sandbox mode by default

---

## Default Admin Login

Configure admin credentials directly in the database or via the admin login page at `/admin`.

---

## Contributors

| Name | Module |
|---|---|
| | Society & Event Management |
| | Stall Owner & Payments |
| | Artist Management |
| | Risk Management |
| | Friend Tracker |

---

## License

This project is developed for academic purposes at SLIIT University.
