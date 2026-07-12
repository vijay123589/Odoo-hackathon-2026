# ESG Sustainability Tracker - Environmental Module (Member 2)

This repository contains the implementation plan and codebase for the **Environmental Module (Member 2)** of the Enterprise ESG & Sustainability Tracker.

---

## 📋 Role & Responsibilities
As **Member 2**, you are responsible for tracking, calculating, and reporting environmental impact metrics, specifically:
* **Emission Factors**: Reference values representing greenhouse gas emissions per unit of activity.
* **Carbon Transactions**: Logs of activities mapped to emission factors to calculate carbon footprints.
* **Sustainability Goals**: Targets set to reduce environmental footprint, tracked over time.
* **ESG Score Calculation**: Dynamic deduction/reward system indicating environmental performance.
* **Dashboard & Reports**: Consolidated metrics serving the frontend and reporting tools.

---

## 🛠️ Proposed File Structure
To seamlessly integrate with Member 1 (Kumaran)'s backend framework, all files are structured inside `backend/app/` using relative imports:

```text
backend/app/
├── models/
│   └── environment.py       # SQLAlchemy database models
├── schemas/
│   └── environment.py       # Pydantic validation schemas
├── routers/
│   └── environment.py       # FastAPI CRUD and dashboard router
└── utils/
    └── calculator.py        # ESG Score calculation logic
```

---

## 💾 Database Schema (`backend/app/models/environment.py`)

### 1. `EmissionFactors`
Stores conversion rates for various categories of activities (e.g., electricity, fuel consumption, logistics).
* `id` (Integer, Primary Key)
* `category` (String, Unique Index) — e.g., `"Electricity"`, `"Diesel"`, `"Flight"`
* `factor` (Float) — conversion rate in kg CO2 per unit
* `unit` (String) — e.g., `"kWh"`, `"liters"`, `"km"`
* `description` (String)
* `created_at` (DateTime, Default: current time)

### 2. `CarbonTransactions`
Records carbon-emitting events associated with departments.
* `id` (Integer, Primary Key)
* `department_id` (String) — identifier of the emitting department
* `emission_factor_id` (Integer, Foreign Key referencing `EmissionFactors.id`)
* `activity_name` (String) — e.g., `"Logistics delivery run"`, `"HQ AC Electricity usage"`
* `quantity` (Float) — number of units consumed
* `emission_value` (Float) — auto-calculated as `quantity * EmissionFactors.factor`
* `date` (DateTime, Default: current time)
* `created_by` (String) — user who logged the transaction

### 3. `EnvironmentalGoals`
Tracks reduction goals and progress deadlines.
* `id` (Integer, Primary Key)
* `title` (String) — e.g., `"Reduce logistics emissions by 20%"`
* `target_value` (Float) — target emission limit in kg CO2
* `current_value` (Float) — current cumulative emissions (defaults to 0.0)
* `deadline` (DateTime)
* `status` (String) — `"Active"`, `"Achieved"`, or `"Failed"`

---

## 🔌 API Endpoints (`backend/app/routers/environment.py`)

### **Emission Factors**
* `GET /environment/factors` — List all conversion factors.
* `POST /environment/factors` — Create a new factor.
* `PUT /environment/factors/{id}` — Update a factor.
* `DELETE /environment/factors/{id}` — Delete a factor.

### **Carbon Transactions**
* `GET /environment/transactions` — Fetch all transactions.
* `POST /environment/transactions` — Add a transaction. Computes `emission_value` automatically.
* `PUT /environment/transactions/{id}` — Edit transaction quantities. Recalculates emissions.
* `DELETE /environment/transactions/{id}` — Remove a transaction.

### **Sustainability Goals**
* `GET /environment/goals` — Fetch goals.
* `POST /environment/goals` — Define a new goal.
* `PATCH /environment/goals/{id}` — Adjust current progress value or goal status.
* `DELETE /environment/goals/{id}` — Remove a goal.

### **Dashboard & Reporting**
* `GET /environment/dashboard` — Unified dashboard endpoint returning:
  * `total_emission`: Sum of all `emission_value` from transactions.
  * `goal_progress`: Progress indicator (percentage of achieved goals).
  * `monthly_emission`: Chronological breakdown of emissions.
  * `top_department`: Department with the highest carbon footprint.
* `GET /environment/report` — Deeper breakdown of trends, department summaries, and active goals.

---

## 📈 ESG score Calculation (`backend/app/utils/calculator.py`)
Computes a dynamic environmental performance score using the function `calculate_environment_score(db: Session) -> float`:
1. Starts at a baseline of **100**.
2. **Deductions**:
   * **-5 points** for every overdue goal (current date is past deadline and status is `"Active"`).
   * **-3 points** for every 100 kg CO2 exceeded on active goals (where `current_value > target_value`).
3. **Bonuses**:
   * **+5 points** for each achieved goal (status is `"Achieved"`).
4. **Constraints**:
   * Score is bounded between **0** and **100**.