🚀 API Endpoints
POST /offer
Receives Flipkart offers payload

Stores new offers

GET /highest-discount
Calculates highest discount for a given bank/payment method

🧠 Assumptions
offerId is unique

Flipkart API response is structured and consistent

Supports only CREDIT/EMI_OPTIONS for now

📐 Design Decisions
Used MongoDB for flexibility with dynamic offer payloads

Express.js for rapid development and simplicity

📈 Scaling Notes
Use Redis caching for frequently queried highest-discount requests

Add pagination & indexing on bankName, paymentInstruments

Horizontally scale using load balancer (e.g., NGINX)

🔄 Improvements
Add JWT auth for admin-only POST /offer

Add full-text search on offerTitle

Validate Flipkart payload schema (Zod or Joi)

---

## 🛠️ Project Setup Steps

### 1. **Clone the Repository**
```sh
<code_block_to_apply_changes_from>
git clone <your-repo-url>
cd piepay-react-dashboard
```

---

### 2. **Backend Setup**

```sh
cd backend
```

- **Install dependencies:**
  ```sh
  npm install
  ```

- **Configure Environment (if needed):**
  - If your backend requires environment variables (e.g., MongoDB URI), create a `.env` file in the `backend` directory and add the necessary variables.

- **Start the backend server:**
  ```sh
  npm start
  ```
  - By default, the backend should run on `http://localhost:5000/`.

---

### 3. **Frontend Setup**

```sh
cd ../frontend
```

- **Install dependencies:**
  ```sh
  npm install
  ```

- **Start the frontend development server:**
  ```sh
  npm start
  ```
  - The frontend should run on `http://localhost:3000/` by default.

---

### 4. **Access the App**

- Open your browser and go to: [http://localhost:3000/](http://localhost:3000/)
- The frontend will communicate with the backend at [http://localhost:5000/](http://localhost:5000/).

---

### 5. **(Optional) Seed Offers Data**

- Use the `POST /offer` endpoint to add offers to your backend.
- You can use tools like Postman or cURL to send the Flipkart offers payload.

---

### 6. **(Optional) MongoDB Setup**

- Make sure MongoDB is running locally or update the connection string in your backend config to point to your MongoDB instance.

---

## 📓 Notes

- The backend supports endpoints like `POST /offer` and `GET /highest-discount`.
