import os
import sys
import uuid
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy import text

# Add current directory to path to resolve 'app'
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import engine, SessionLocal
from app.security import get_password_hash

# Import all SQLAlchemy models
from app.models.role import Role
from app.models.department import DepartmentORM
from app.models.user import UserORM
from app.models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal
from app.models.social import CSRActivity, EmployeeParticipation
from app.models.governance import Policy, PolicyAcknowledgement, Audit, ComplianceIssue
from app.models.gamification import Challenge, ChallengeParticipation, Badge, EmployeeBadge, Reward, RewardRedemption

def clean_database(db):
    """Clean all transactional tables to prevent unique constraint failures and ensure a pristine seed state."""
    dialect_name = db.bind.dialect.name
    print(f"Cleaning existing records ({dialect_name})...")
    
    # Reverse foreign key dependency order
    tables = [
        "reward_redemptions",
        "employee_badges",
        "challenge_participation",
        "compliance_issues",
        "audits",
        "policy_acknowledgements",
        "employee_participation",
        "carbon_transactions",
        "rewards",
        "badges",
        "challenges",
        "policies",
        "csr_activities",
        "environmental_goals",
        "emission_factors",
        "users",
        "departments"
    ]
    
    for table in tables:
        try:
            if dialect_name == "postgresql":
                db.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;"))
            else:
                db.execute(text(f"DELETE FROM {table};"))
                db.execute(text(f"DELETE FROM sqlite_sequence WHERE name = '{table}';"))
        except Exception as e:
            # Table might not exist yet if migrations haven't run
            pass
    db.commit()

def seed_data():
    db = SessionLocal()
    clean_database(db)
    
    print("Seeding realistic ESG data...")
    try:
        # 1. ROLES
        print("Creating roles...")
        roles = ["Admin", "Manager", "Employee"]
        role_map = {}
        for r_name in roles:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(id=uuid.uuid4(), name=r_name)
                db.add(role)
                db.flush()
            role_map[r_name] = role

        # 2. DEPARTMENTS
        print("Creating departments...")
        dep_data = [
            {"name": "Information Technology", "code": "IT", "head": "Rahul Sharma"},
            {"name": "Human Resources", "code": "HR", "head": "Neha Gupta"},
            {"name": "Finance & Accounting", "code": "FIN", "head": "Ananya Das"},
            {"name": "Operations & Logistics", "code": "OPS", "head": "Mohan Raj"},
            {"name": "Sustainability & ESG", "code": "SUS", "head": "Priya Nair"}
        ]
        dep_map = {}
        for d in dep_data:
            dep = DepartmentORM(
                id=uuid.uuid4(),
                name=d["name"],
                code=d["code"],
                head=d["head"],
                status="Active"
            )
            db.add(dep)
            db.flush()
            dep_map[d["code"]] = dep

        # 3. USERS
        print("Creating users...")
        user_raw = [
            ("Alice Johnson", "alice.johnson@ecosphere.com", "Admin", "SUS", "AdminPass123"),
            ("Rahul Sharma", "rahul.sharma@ecosphere.com", "Manager", "IT", "ManagerPass123"),
            ("Priya Nair", "priya.nair@ecosphere.com", "Employee", "SUS", "EmployeePass123"),
            ("Arjun Kumar", "arjun.kumar@ecosphere.com", "Employee", "OPS", "EmployeePass123"),
            ("Sneha Iyer", "sneha.iyer@ecosphere.com", "Employee", "HR", "EmployeePass123"),
            ("Kavya Reddy", "kavya.reddy@ecosphere.com", "Employee", "FIN", "EmployeePass123"),
            ("Vivek Patel", "vivek.patel@ecosphere.com", "Employee", "IT", "EmployeePass123"),
            ("Neha Gupta", "neha.gupta@ecosphere.com", "Manager", "HR", "ManagerPass123"),
            ("Ananya Das", "ananya.das@ecosphere.com", "Manager", "FIN", "ManagerPass123"),
            ("Mohan Raj", "mohan.raj@ecosphere.com", "Manager", "OPS", "ManagerPass123"),
            ("Rajesh Patel", "rajesh.patel@ecosphere.com", "Employee", "OPS", "EmployeePass123"),
            ("Sunita Rao", "sunita.rao@ecosphere.com", "Employee", "HR", "EmployeePass123"),
            ("Amit Shah", "amit.shah@ecosphere.com", "Employee", "FIN", "EmployeePass123"),
            ("Deepak Gupta", "deepak.gupta@ecosphere.com", "Employee", "IT", "EmployeePass123"),
            ("Vikram Singh", "vikram.singh@ecosphere.com", "Employee", "SUS", "EmployeePass123")
        ]
        users = []
        for name, email, r_name, d_code, pwd in user_raw:
            user = UserORM(
                id=uuid.uuid4(),
                name=name,
                email=email,
                password_hash=get_password_hash(pwd),
                role_id=role_map[r_name].id,
                department_id=dep_map[d_code].id,
                status="Active"
            )
            db.add(user)
            users.append(user)
        db.flush()

        # 4. EMISSION FACTORS
        print("Creating emission factors...")
        factor_raw = [
            ("Grid Electricity", "Scope 2", 0.52, "kWh", "National grid electricity emission factor"),
            ("Diesel Fuel", "Scope 1", 2.68, "Liters", "Stationary and mobile diesel combustion emissions"),
            ("Petrol Fuel", "Scope 1", 2.31, "Liters", "Corporate logistics petrol consumption emissions"),
            ("Business Travel Flights", "Scope 3", 0.18, "km", "Short/medium haul airline travel footprints"),
            ("Water Supply", "Scope 3", 0.34, "m3", "Municipal water supply distribution emissions"),
            ("Landfill Solid Waste", "Scope 3", 0.42, "kg", "Non-recyclable office waste disposal footprint")
        ]
        factors = []
        for name, cat, val, unit, desc in factor_raw:
            factor = EmissionFactor(
                id=uuid.uuid4(),
                activity_name=name,
                category=cat,
                factor_value=val,
                unit=unit,
                description=desc
            )
            db.add(factor)
            factors.append(factor)
        db.flush()

        # 5. ENVIRONMENTAL GOALS
        print("Creating environmental goals...")
        goals_raw = [
            ("Reduce Electricity Consumption", "Reduce office grid electric dependencies by 15%", 50000.0, 24000.0, "kWh", "In Progress"),
            ("Reduce Diesel Usage", "Minimize stationary diesel generator backups usage", 10000.0, 4200.0, "Liters", "In Progress"),
            ("Increase Recycling Rate", "Achieve 80% recycling rate of dry office waste", 80.0, 85.0, "%", "Completed"),
            ("Reduce Water Consumption", "Audit and transition building washrooms to eco-flow systems", 2000.0, 2000.0, "m3", "Completed"),
            ("Carbon Neutral Headquarters", "Offset total corporate facility footprint via certified carbon sinks", 100.0, 35.0, "%", "In Progress")
        ]
        for title, desc, tgt, curr, unit, status in goals_raw:
            goal = EnvironmentalGoal(
                id=uuid.uuid4(),
                title=title,
                description=desc,
                target_value=tgt,
                current_value=curr,
                unit=unit,
                deadline=datetime.now(timezone.utc) + timedelta(days=random.randint(90, 365)),
                status=status
            )
            db.add(goal)
        db.flush()

        # 6. CSR ACTIVITIES
        print("Creating CSR activities...")
        csr_raw = [
            ("Tree Plantation Drive", "Volunteer to plant native trees in nearby urban forests.", "Zonal Forest Reserve", 100),
            ("Blood Donation Camp", "Annual corporate blood donor drive in partnership with Red Cross.", "Main Lobby HQ", 50),
            ("Marina Beach Cleanup", "Cleanup plastic pollution at local public shorelines.", "Marina Beach Front", 80),
            ("Food Bank Support", "Sorting and packing items for local community food shelters.", "Hope Food Bank", 40),
            ("STEM Mentorship Workshop", "Teaching computer science fundamentals to children at public schools.", "Public School 4", 120),
            ("Community Health Camp", "Volunteering with doctors to provide free health checkups.", "West Community Hall", 150)
        ]
        csr_activities = []
        for title, desc, loc, points in csr_raw:
            act = CSRActivity(
                id=uuid.uuid4(),
                title=title,
                description=desc,
                location=loc,
                activity_date=datetime.now(timezone.utc) + timedelta(days=random.randint(-180, 60)),
                max_points=points,
                status="Planned" if random.choice([True, False]) else "Completed"
            )
            db.add(act)
            csr_activities.append(act)
        db.flush()

        # 7. POLICIES
        print("Creating governance policies...")
        policies_raw = [
            ("Environmental Protection Policy", "Corporate framework committing to environmental audits and emissions targets.", "v2.1"),
            ("Employee Code of Conduct", "Professional guidelines on ethical conduct, communication, and workplace behaviour.", "v4.0"),
            ("Workplace Safety & Health", "Protocols on office emergency operations, hazard reporting, and building sanitation.", "v1.5"),
            ("Anti-Bribery and Corruption Policy", "Zero-tolerance rules regarding transaction gifts, kickbacks, and assurances.", "v3.0"),
            ("Data Privacy & Security Directive", "Data safeguarding compliance standards aligned with global regulations.", "v2.0")
        ]
        policies = []
        for title, desc, version in policies_raw:
            pol = Policy(
                id=uuid.uuid4(),
                title=title,
                description=desc,
                version=version,
                effective_date=datetime.now(timezone.utc) - timedelta(days=random.randint(100, 500))
            )
            db.add(pol)
            policies.append(pol)
        db.flush()

        # 8. CHALLENGES
        print("Creating sustainability challenges...")
        challenges_raw = [
            ("Cycle to Work Week", "Ditch combustion engine commutes. Ride a bicycle to save carbon.", 100, "Medium"),
            ("Green Office Advocate", "Reduce deskside paper usage and transition fully to digital notes.", 50, "Easy"),
            ("Zero Plastic Champion", "Avoid single-use plastic water bottles/containers during work hours.", 120, "Hard"),
            ("Energy Saving Squad", "Switch off desk monitors and office lighting during lunch breaks.", 80, "Medium"),
            ("Corporate Volunteer Day", "Participate in any public outreach or community volunteering drive.", 150, "Hard"),
            ("Paperless Accounting", "Convert all vendor billing ledgers to cloud digital envelopes.", 75, "Easy")
        ]
        challenges = []
        for title, desc, pts, diff in challenges_raw:
            chal = Challenge(
                id=uuid.uuid4(),
                title=title,
                description=desc,
                points=pts,
                difficulty=diff,
                deadline=datetime.now(timezone.utc) + timedelta(days=random.randint(30, 90)),
                status="Active"
            )
            db.add(chal)
            challenges.append(chal)
        db.flush()

        # 9. BADGES
        print("Creating gamification badges...")
        badges_raw = [
            ("Eco Warrior", "Unlocked by accumulating initial transit points in challenges.", "shield-green", 100),
            ("Green Champion", "Recognizes highly engaged participants across carbon tracking drives.", "star-gold", 200),
            ("Volunteer Star", "Awarded for volunteering at three or more corporate CSR programs.", "heart-red", 300),
            ("Energy Saver Elite", "Earned by achieving full energy compliance in office challenges.", "bolt-yellow", 150),
            ("Sustainability Leader", "The highest honor, awarded for aggregate leadership in ESG metrics.", "crown-gold", 500)
        ]
        badges = []
        for name, desc, icon, pts in badges_raw:
            badge = Badge(
                id=uuid.uuid4(),
                name=name,
                description=desc,
                icon=icon,
                required_points=pts
            )
            db.add(badge)
            badges.append(badge)
        db.flush()

        # 10. REWARDS
        print("Creating redeemable rewards...")
        rewards_raw = [
            ("Organic Coffee Shop Voucher", "Redeemable at local partner sustainable cafeterias.", 50, 15),
            ("Organic Groceries Gift Card", "Voucher to purchase zero-waste grocery packaging boxes.", 150, 8),
            ("Eco Travel Survival Kit", "Includes reusable mugs, stainless straws, and recycled canvas bags.", 200, 10),
            ("EcoSphere Branded Jacket", "Made fully from ocean-recovered recycled plastic fibers.", 300, 6),
            ("Additional Personal ESG Leave Day", "Get 1 extra paid day off work for personal volunteering projects.", 500, 3)
        ]
        rewards = []
        for name, desc, pts, stock in rewards_raw:
            reward = Reward(
                id=uuid.uuid4(),
                name=name,
                description=desc,
                points_required=pts,
                stock=stock
            )
            db.add(reward)
            rewards.append(reward)
        db.flush()

        # 11. CARBON TRANSACTIONS
        print("Logging carbon transactions...")
        for i in range(25):
            user = random.choice(users)
            factor = random.choice(factors)
            qty = round(random.uniform(50.0, 800.0), 2)
            emissions = round(qty * factor.factor_value, 2)
            
            tx = CarbonTransaction(
                id=uuid.uuid4(),
                user_id=user.id,
                department_id=user.department_id,
                emission_factor_id=factor.id,
                activity_name=f"{factor.activity_name} Consumption Log",
                quantity=qty,
                carbon_emission=emissions,
                transaction_date=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 300)),
                remarks=f"Logged automatically via ERP API integration, record seq-{i+1}."
            )
            db.add(tx)
        db.flush()

        # 12. EMPLOYEE PARTICIPATIONS
        print("Logging employee participations in CSR activities...")
        for i in range(20):
            user = random.choice([u for u in users if u.role_relation.name == "Employee"])
            act = random.choice(csr_activities)
            app_status = random.choice(["Approved", "Pending", "Rejected"])
            pts = act.max_points if app_status == "Approved" else 0
            
            part = EmployeeParticipation(
                id=uuid.uuid4(),
                employee_id=user.id,
                activity_id=act.id,
                proof_url=f"https://ecosphere-cdn.com/proofs/{user.id.hex[:6]}_{act.id.hex[:6]}.jpg" if app_status != "Pending" else None,
                approval_status=app_status,
                points_earned=pts,
                participated_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 150))
            )
            db.add(part)
        db.flush()

        # 13. POLICY ACKNOWLEDGEMENTS
        print("Logging policy acknowledgements...")
        # Most employees should acknowledge policies
        for user in users:
            # Let's say each employee acknowledges 3 to 5 policies randomly
            selected_policies = random.sample(policies, k=random.randint(3, 5))
            for pol in selected_policies:
                ack = PolicyAcknowledgement(
                    id=uuid.uuid4(),
                    policy_id=pol.id,
                    employee_id=user.id,
                    acknowledged_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 90))
                )
                db.add(ack)
        db.flush()

        # 14. AUDITS
        print("Logging corporate compliance audits...")
        audits = []
        for d_code, dep in dep_map.items():
            audit = Audit(
                id=uuid.uuid4(),
                department_id=dep.id,
                auditor_name=f"Assoc. Bureau Veritas ESG Audit Team - {d_code}",
                status=random.choice(["Completed", "Scheduled", "In Progress"]),
                remarks=f"Quarterly review of ESG compliance indices and process transparency for {dep.name}.",
                audit_date=datetime.now(timezone.utc) - timedelta(days=random.randint(-15, 120))
            )
            db.add(audit)
            audits.append(audit)
        db.flush()

        # 15. COMPLIANCE ISSUES
        print("Logging compliance issues from audits...")
        for i in range(10):
            audit = random.choice(audits)
            owner = random.choice([u for u in users if u.role_relation.name == "Employee"])
            severity = random.choice(["Low", "Medium", "High", "Critical"])
            status_val = random.choice(["Open", "In Progress", "Resolved"])
            
            issue = ComplianceIssue(
                id=uuid.uuid4(),
                audit_id=audit.id,
                severity=severity,
                description=f"Action item ref-{i+1}: Missing localized utility receipts or carbon data documentation.",
                owner_id=owner.id,
                status=status_val,
                due_date=datetime.now(timezone.utc) + timedelta(days=random.randint(5, 60))
            )
            db.add(issue)
        db.flush()

        # 16. CHALLENGE PARTICIPATION
        print("Logging challenge participations...")
        for i in range(20):
            user = random.choice([u for u in users if u.role_relation.name == "Employee"])
            challenge = random.choice(challenges)
            completed = random.choice([True, False])
            prog = 100.0 if completed else round(random.uniform(10.0, 95.0), 1)
            pts = challenge.points if completed else 0
            
            part = ChallengeParticipation(
                id=uuid.uuid4(),
                challenge_id=challenge.id,
                employee_id=user.id,
                progress=prog,
                completed=completed,
                points_awarded=pts
            )
            db.add(part)
        db.flush()

        # 17. EMPLOYEE BADGES
        print("Awarding badges to employees...")
        awarded_pairs = set()
        for i in range(15):
            user = random.choice(users)
            badge = random.choice(badges)
            
            # Prevent duplicate primary keys (employee_id, badge_id)
            if (user.id, badge.id) not in awarded_pairs:
                awarded_pairs.add((user.id, badge.id))
                emp_badge = EmployeeBadge(
                    employee_id=user.id,
                    badge_id=badge.id,
                    earned_at=datetime.now(timezone.utc) - timedelta(days=random.randint(5, 100))
                )
                db.add(emp_badge)
        db.flush()

        # 18. REWARD REDEMPTIONS
        print("Logging reward redemptions...")
        for i in range(10):
            user = random.choice([u for u in users if u.role_relation.name == "Employee"])
            reward = random.choice(rewards)
            
            redemption = RewardRedemption(
                id=uuid.uuid4(),
                employee_id=user.id,
                reward_id=reward.id,
                redeemed_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 60))
            )
            db.add(redemption)
        
        db.commit()
        print("Database seeding completed successfully with zero constraint violations!")
        
    except Exception as e:
        db.rollback()
        print(f"Error during database seeding: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
