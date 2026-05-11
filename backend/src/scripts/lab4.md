## 🧪 Lab 4: Strategy Pattern

This laboratory work demonstrates the **Strategy Design Pattern**. The application fetches real-time data from the NYC Open Data API and exports it to different destinations (Console, Redis, or Kafka) based on a simple configuration change.

### 1. Start Infrastructure
Ensure your Docker containers (Redis and Kafka) are running:
```bash
docker-compose up -d
```

### 2. Select Export Strategy
Open `backend/src/config.ts` and set the `EXPORT_STRATEGY` to one of the following: `'CONSOLE'`, `'REDIS'`, or `'KAFKA'`.
```typescript
export const config = {
  EXPORT_STRATEGY: 'REDIS', // Change this to test different strategies
};
```

### 3. Run the Script
Execute the strategy script from the `backend` directory:
```bash
npx ts-node src/scripts/lab4-strategy.ts
```

---

### 4. How to Verify Results

#### **A. Console Strategy**
* **Action:** Set `EXPORT_STRATEGY: 'CONSOLE'` in `config.ts` and run the script.
* **Verification:** Check your terminal output. You should see a formatted JSON preview of the first few records fetched from the NYC API.

#### **B. Redis Strategy**
* **Action:** Set `EXPORT_STRATEGY: 'REDIS'` in `config.ts` and run the script.
* **Verification:** Connect to the Redis container to check the stored key:
  ```bash
  docker-compose exec redis redis-cli
  ```
  Inside the Redis prompt (`127.0.0.1:6379>`), run:
  ```bash
  get nyc_violations_data
  ```
  *(You will see a long string containing the JSON data. Type `exit` to leave).*

#### **C. Kafka Strategy**
* **Action:** Set `EXPORT_STRATEGY: 'KAFKA'` in `config.ts` and run the script.
* **Verification:** Use the built-in Kafka consumer to read the messages from the topic:
  ```bash
  docker-compose exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic nyc-violations --from-beginning
  ```
  *(You should see the 100 violation records streaming into your terminal. Press `Ctrl + C` to stop).*