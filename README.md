# Whisper

This is the code for my personal project, **Whisper**.

## Known Limitations

- **No production security audit:** This project is for personal use and has not undergone a professional security review. Use at your own risk.
- **No email verification:** User registration does not include email verification or password reset flows.
- **HTTPS certificate management:** You must manually provide and manage your own certificates for HTTPS.
- **No horizontal scaling:** The current Docker Compose setup is for local/single-instance use only.
- **No rate limiting:** There is no built-in rate limiting or brute-force protection.

## Getting Started

To run this project locally:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/LookAtFr3sn0/Whisper.git
   cd whisper
   ```

2. **Create the `.env` file:**
   In the `api` directory, create a file named `.env` with the following environment variables:
   
   ```env
   # OPAQUE Server Setup
   OPAQUE_SERVER_SETUP=your-opaque-server-setup-string

   # JWT Secret
   JWT_SECRET=your-jwt-secret
   ```
   - Replace `your-opaque-server-setup-string` with your OPAQUE server setup string.
   - Replace `your-jwt-secret` with a secure secret for JWT authentication.

3. **Add HTTPS certificate:**
   The backend supports HTTPS using your own certificate and key files. Place your certificate (`cert.crt`) and key (`cert.key`) in the `certs` directory.

4. **Build and frontend Code:**
   1. Open a terminal and navigate to the `Frontend` directory:
      ```sh
      cd frontend
      ```
   2. Install dependencies:
      ```sh
      npm install
      ```
   3. Build the frontend:
      ```sh
      npm run build
      ```   
   This allows Nginx to serve the frontend along with the backend API.

5. **Start the services:**
   Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed. Then run:
   ```sh
   docker-compose up --build
   ```

   This will start the PostgreSQL database, API server, and Nginx reverse proxy.

---
If you have any questions, feel free to reach out via GitHub.
