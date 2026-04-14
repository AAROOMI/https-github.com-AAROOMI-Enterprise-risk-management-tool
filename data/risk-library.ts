
import { Risk, RiskLevel } from '../types';

export const digitalRisks: Omit<Risk, 'id'>[] = [
  { RiskID: "DR1", RiskTitle: "System Downtime", Type: "IT Infrastructure", Description: "Unplanned outages of critical systems halt operations.", MitigatingActions: "Redundant servers, backup systems, 24/7 monitoring", RiskOwner: "IT Operations Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR2", RiskTitle: "Cybersecurity Breach", Type: "Cyber Risk", Description: "Unauthorized access to sensitive systems and data.", MitigatingActions: "Firewalls, encryption, regular security audits, training", RiskOwner: "CISO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR3", RiskTitle: "Ransomware Attack", Type: "Cyber Threat", Description: "Malicious software locks access to data or systems.", MitigatingActions: "Endpoint protection, regular backups, response plans", RiskOwner: "IT Security Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR4", RiskTitle: "Legacy System Failure", Type: "IT Obsolescence", Description: "Outdated systems crash or do not integrate with new tools.", MitigatingActions: "System modernization roadmap, legacy risk register", RiskOwner: "IT Strategy Head", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR5", RiskTitle: "Data Privacy Violation", Type: "Regulatory Compliance", Description: "Breach of GDPR or data protection laws due to mishandling of PII.", MitigatingActions: "Data governance policies, anonymization, compliance audits", RiskOwner: "Data Protection Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR6", RiskTitle: "Cloud Service Disruption", Type: "Third-Party Risk", Description: "Downtime or issues in external cloud platforms halt services.", MitigatingActions: "Multi-cloud strategy, SLA reviews, failover systems", RiskOwner: "Cloud Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR7", RiskTitle: "Unauthorized Access", Type: "Identity Management", Description: "Weak access controls enable internal or external breaches.", MitigatingActions: "Multi-factor authentication, RBAC, user access reviews", RiskOwner: "IT Security Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR8", RiskTitle: "Inadequate Cyber Awareness", Type: "Human Factor", Description: "Staff untrained on cybersecurity pose phishing/social engineering risk.", MitigatingActions: "Security awareness programs, mock phishing tests", RiskOwner: "HR & IT Security", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR9", RiskTitle: "Incomplete System Integration", Type: "Digital Transformation", Description: "Fragmented systems cause data silos, duplication, and delays.", MitigatingActions: "Use of APIs, integration testing, ERP alignment", RiskOwner: "Digital Transformation Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR10", RiskTitle: "Third-Party Software Vulnerabilities", Type: "Vendor Risk", Description: "Bugs in vendor tools expose the enterprise to cyber threats.", MitigatingActions: "Software vetting, patch management, contractual clauses", RiskOwner: "Procurement & IT", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR11", RiskTitle: "Poor Data Quality", Type: "Data Governance", Description: "Inaccurate or inconsistent data undermines decisions and automation.", MitigatingActions: "Data validation rules, master data governance, audits", RiskOwner: "Data Governance Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR12", RiskTitle: "AI/ML Bias or Misuse", Type: "Emerging Tech Risk", Description: "Unchecked AI algorithms produce discriminatory or flawed outcomes.", MitigatingActions: "AI ethics review, algorithm validation, governance board", RiskOwner: "AI Product Owner", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR13", RiskTitle: "Inadequate IT Budgeting", Type: "Strategic & Financial", Description: "Underfunded IT roadmap delays transformation and increases risk exposure.", MitigatingActions: "Multi-year IT planning, ROI evaluation, stakeholder buy-in", RiskOwner: "CIO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR14", RiskTitle: "Shadow IT", Type: "Operational", Description: "Unapproved tools or systems used without IT oversight create hidden risks.", MitigatingActions: "IT policy enforcement, software inventory audits, training", RiskOwner: "IT Governance", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR15", RiskTitle: "Phishing Attacks", Type: "Cyber Risk", Description: "Deceptive emails targeting staff to steal credentials or data.", MitigatingActions: "Anti-phishing tools, email filters, user training campaigns", RiskOwner: "CISO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR16", RiskTitle: "Insider Threats", Type: "Cyber Risk", Description: "Malicious or negligent actions by internal employees compromise security.", MitigatingActions: "Access controls, activity monitoring, whistleblower systems", RiskOwner: "CISO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR17", RiskTitle: "Ineffective Change Management", Type: "Operational", Description: "Poorly managed system updates lead to errors or disruptions.", MitigatingActions: "Change control board, rollback plans, user testing", RiskOwner: "IT Change Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR18", RiskTitle: "API Security Risks", Type: "Integration & DevOps", Description: "Exposed or unprotected APIs create backdoor vulnerabilities.", MitigatingActions: "API gateway security, rate limiting, authentication protocols", RiskOwner: "DevSecOps", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR19", RiskTitle: "IoT Device Exploits", Type: "Technology Risk", Description: "Connected devices can be entry points for cyberattacks.", MitigatingActions: "Network segmentation, firmware updates, secure configurations", RiskOwner: "IoT Security Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR20", RiskTitle: "Inadequate Backup & Recovery", Type: "Business Continuity", Description: "Incomplete backups or long recovery times cause prolonged outages.", MitigatingActions: "Disaster recovery testing, backup automation, cloud recovery", RiskOwner: "IT Infrastructure", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR21", RiskTitle: "Lack of Digital Literacy", Type: "Workforce Capability", Description: "Staff unable to use or adapt to digital tools reduces efficiency and creates risk.", MitigatingActions: "Digital training programs, onboarding guides, tech champions", RiskOwner: "L&D Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR22", RiskTitle: "Mobile Device Vulnerabilities", Type: "Endpoint Security", Description: "Weakly secured mobile phones and tablets become threat vectors.", MitigatingActions: "MDM tools, remote wipe capability, device usage policies", RiskOwner: "IT Security Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR23", RiskTitle: "AI Explainability Failure", Type: "Ethical AI", Description: "Complex models that can't be interpreted lead to trust and compliance issues.", MitigatingActions: "Model transparency protocols, explainable AI tools", RiskOwner: "AI Governance Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR24", RiskTitle: "Denial-of-Service (DoS) Attacks", Type: "Cyber Threat", Description: "Systems are intentionally overwhelmed, disrupting access and operations.", MitigatingActions: "DoS protection, bandwidth throttling, firewall rules", RiskOwner: "Network Admin", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR25", RiskTitle: "Software License Violations", Type: "Legal & Compliance", Description: "Use of unlicensed or expired software may result in legal penalties.", MitigatingActions: "Software asset management, vendor audits, legal checks", RiskOwner: "IT Compliance", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR26", RiskTitle: "Inadequate Digital Roadmap", Type: "Strategic Planning", Description: "Lack of a clear digital vision delays innovation and increases redundancy.", MitigatingActions: "Develop digital strategy, stakeholder alignment, reviews", RiskOwner: "CIO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR27", RiskTitle: "Cloud Cost Overruns", Type: "Financial", Description: "Unmonitored consumption of cloud services causes budget overspending.", MitigatingActions: "Cost control policies, usage dashboards, cloud financial ops (FinOps)", RiskOwner: "Cloud Architect", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR28", RiskTitle: "Poor User Experience (UX)", Type: "Product & Innovation", Description: "Bad interfaces or laggy systems reduce engagement and increase errors.", MitigatingActions: "Usability testing, feedback loops, continuous UI improvement", RiskOwner: "Product Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR29", RiskTitle: "Software Patch Delays", Type: "IT Operations", Description: "Failure to apply updates leads to known vulnerabilities remaining unpatched.", MitigatingActions: "Patch management schedules, vulnerability scanning", RiskOwner: "IT Ops Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR30", RiskTitle: "AI Model Drift", Type: "AI & Analytics", Description: "Degraded AI performance over time due to changes in data patterns.", MitigatingActions: "Model monitoring, regular retraining, performance metrics", RiskOwner: "Data Science Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR31", RiskTitle: "Misconfigured Cloud Settings", Type: "Cloud Security", Description: "Incorrect configurations expose sensitive data or services to public access.", MitigatingActions: "Cloud security reviews, auto-scanning tools, team training", RiskOwner: "Cloud Security Engineer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR32", RiskTitle: "Weak Vendor SLA Enforcement", Type: "Third-Party Management", Description: "Service providers failing SLA terms affect uptime or performance.", MitigatingActions: "Regular reviews, penalty clauses, SLA dashboards", RiskOwner: "Procurement & IT", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR33", RiskTitle: "Digital Project Overruns", Type: "Project Risk", Description: "Poor scope, time, or budget control leads to delays and cost blowouts.", MitigatingActions: "Agile practices, PM dashboards, milestone reviews", RiskOwner: "Digital PMO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR34", RiskTitle: "IT & Business Misalignment", Type: "Strategic Alignment", Description: "Lack of coordination between IT and business goals leads to wasted resources.", MitigatingActions: "Joint planning sessions, IT-business liaisons", RiskOwner: "CIO / Business Heads", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR35", RiskTitle: "Shadow AI Initiatives", Type: "Innovation Governance", Description: "Unofficial AI projects running without oversight create compliance issues.", MitigatingActions: "AI use policy, project registry, risk reviews", RiskOwner: "AI Program Office", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR36", RiskTitle: "Data Loss via Remote Work", Type: "Operational", Description: "Laptops or mobile access without controls lead to data leakage.", MitigatingActions: "Endpoint protection, secure VPNs, user training", RiskOwner: "IT Security Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR37", RiskTitle: "Social Engineering Attacks", Type: "Cybersecurity", Description: "Exploitation of human psychology to manipulate employees into breaching security.", MitigatingActions: "Security drills, awareness campaigns, escalation SOPs", RiskOwner: "CISO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR38", RiskTitle: "Inadequate Digital KPIs", Type: "Performance Risk", Description: "Absence of digital metrics limits performance monitoring and optimization.", MitigatingActions: "Define KPIs, dashboards, digital analytics reviews", RiskOwner: "Digital Strategy Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR39", RiskTitle: "Poor Software Testing Practices", Type: "Quality Assurance", Description: "Bugs slip into production due to weak or skipped testing phases.", MitigatingActions: "Automated testing, QA standards, test coverage metrics", RiskOwner: "QA Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR40", RiskTitle: "Data Migration Failures", Type: "Transformation on Risk", Description: "Data loss or corruption occurs during cloud/system migrations.", MitigatingActions: "Data validation, test runs, rollback procedures", RiskOwner: "Migration Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR41", RiskTitle: "BYOD Risks", Type: "Device Management", Description: "Personal devices used for work without controls increase exposure.", MitigatingActions: "BYOD policy, containerization, endpoint protection", RiskOwner: "IT Governance", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR42", RiskTitle: "Dark Web Data Exposure", Type: "External Threat", Description: "Leaked credentials or data circulating on dark web increases breach risk.", MitigatingActions: "Dark web monitoring tools, password resets, incident alerts", RiskOwner: "SOC Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR43", RiskTitle: "Delayed Vulnerability Remediation", Type: "IT Risk", Description: "Known vulnerabilities remain unpatched beyond acceptable timelines.", MitigatingActions: "Vulnerability management system, SLA tracking", RiskOwner: "IT Security Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR44", RiskTitle: "Inadequate RBAC", Type: "Access Control", Description: "Over-privileged users create unnecessary access risk.", MitigatingActions: "RBAC policy enforcement, least privilege principle", RiskOwner: "IT Admin", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR45", RiskTitle: "Lack of Disaster Recovery Drills", Type: "Business Continuity", Description: "Teams are unprepared for major disruptions due to untested recovery plans.", MitigatingActions: "Periodic simulations, BCP/DR testing calendar", RiskOwner: "BCM Coordinator", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR46", RiskTitle: "Lack of Real-Time Monitoring", Type: "Infrastructure & Ops", Description: "Inability to detect issues promptly causes delays in response and recovery.", MitigatingActions: "Implement SIEM, log management, automated alerts", RiskOwner: "IT Ops Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR47", RiskTitle: "Inadequate Incident Response Plan", Type: "Cybersecurity", Description: "Lack of structured response process worsens the impact of breaches.", MitigatingActions: "Develop IR plan, tabletop exercises, escalation workflow", RiskOwner: "CISO", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR48", RiskTitle: "Over-Dependency on Single Tech Vendor", Type: "Strategic", Description: "Heavy reliance on one vendor limits flexibility and increases vendor risk.", MitigatingActions: "Diversify vendors, review exit strategies, periodic risk reviews", RiskOwner: "Procurement", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR49", RiskTitle: "AI Ethics Violations", Type: "Governance & Compliance", Description: "AI systems making decisions without ethical oversight may cause reputational harm.", MitigatingActions: "Establish AI ethics committee, bias audits, fairness KPIs", RiskOwner: "AI Program Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR50", RiskTitle: "SaaS Subscription Sprawl", Type: "Financial & Operational", Description: "Proliferation of unused or redundant SaaS tools leads to cost inefficiency and risk.", MitigatingActions: "SaaS inventory tracking, usage audits, central procurement policy", RiskOwner: "IT Finance Controller", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR51", RiskTitle: "Poor Data Retention Practices", Type: "Compliance", Description: "Failure to follow retention schedules may result in regulatory penalties or data loss.", MitigatingActions: "Retention policy, archive strategy, automated clean-up", RiskOwner: "Data Governance", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR52", RiskTitle: "AI Hallucinations", Type: "AI & Analytics", Description: "Generative AI tools provide false information that leads to bad decisions.", MitigatingActions: "Human-in-the-loop reviews, source verification, prompt controls", RiskOwner: "AI Application Owner", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR53", RiskTitle: "Insufficient Encryption Standards", Type: "Information Security", Description: "Weak or missing encryption protocols expose sensitive data to theft.", MitigatingActions: "End-to-end encryption, encryption audits, key management systems", RiskOwner: "InfoSec Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR54", RiskTitle: "Lack of Interoperability", Type: "Technology Integration", Description: "Systems unable to communicate effectively, creating delays and inefficiencies.", MitigatingActions: "Middleware solutions, open standards, integration architecture", RiskOwner: "Enterprise Architect", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR55", RiskTitle: "Delayed Threat Intelligence Response", Type: "Cyber Risk", Description: "Slow adaptation to new threat intel results in increased exposure.", MitigatingActions: "Subscribe to threat intel feeds, automate rule updates", RiskOwner: "Security Operations Center", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR56", RiskTitle: "Uncontrolled Open-Source Usage", Type: "Development", Description: "Open-source components used without vetting may contain vulnerabilities.", MitigatingActions: "SBOM (Software Bill of Materials), vulnerability scanning", RiskOwner: "DevSecOps", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR57", RiskTitle: "Ineffective Privileged Access Management", Type: "Identity & Access", Description: "Admin-level accounts are not properly tracked or restricted.", MitigatingActions: "PAM tools, vaulting, session logging, access reviews", RiskOwner: "IAM Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR58", RiskTitle: "Inefficient Ticketing & ITSM Processes", Type: "Service Management", Description: "Delayed issue resolution due to poor service workflows and bottlenecks.", MitigatingActions: "ITSM tool optimization, KPI tracking, SLA management", RiskOwner: "Service Desk Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR59", RiskTitle: "Misuse of Collaboration Platforms", Type: "Digital Workplace", Description: "Sensitive data shared carelessly across chat or file-sharing apps.", MitigatingActions: "User training, access permissions, data classification policy", RiskOwner: "IT Governance", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR60", RiskTitle: "AI Regulation Non-Compliance", Type: "Regulatory Risk", Description: "Use of AI systems not aligned with new AI governance laws (e.g., EU AI Act).", MitigatingActions: "Legal review, AI compliance checklist, documentation of AI models", RiskOwner: "Compliance Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR61", RiskTitle: "Data Sovereignty Violation", Type: "Compliance & Legal", Description: "Data stored or processed outside jurisdictional boundaries, violating regional laws.", MitigatingActions: "Geo-restriction policies, regional data centers, legal oversight", RiskOwner: "Data Privacy Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR62", RiskTitle: "Poor API Governance", Type: "Integration & Security", Description: "Untracked, unmanaged APIs introduce vulnerabilities and data exposure.", MitigatingActions: "API catalog, API gateway controls, documentation standards", RiskOwner: "API Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR63", RiskTitle: "Lack of DevSecOps Integration", Type: "Software Development", Description: "Security is not integrated into the development lifecycle, causing vulnerabilities.", MitigatingActions: "Secure SDLC, integrated scanning tools, DevSecOps policy", RiskOwner: "DevOps Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR64", RiskTitle: "AI Drift in Production", Type: "AI & Analytics", Description: "AI models become inaccurate due to environmental changes or data evolution.", MitigatingActions: "Continuous monitoring, model retraining, drift alerts", RiskOwner: "AI Operations Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR65", RiskTitle: "Inadequate Mobile App Security", Type: "Cybersecurity", Description: "Mobile applications vulnerable to injection, MITM attacks, or unauthorized access.", MitigatingActions: "Code obfuscation, secure coding practices, security testing", RiskOwner: "App Security Engineer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR66", RiskTitle: "Lack of Digital Innovation Pipeline", Type: "Strategic", Description: "No structured innovation funnel for testing or scaling digital ideas.", MitigatingActions: "Innovation lab, PoC process, cross-functional idea management", RiskOwner: "Digital Innovation Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR67", RiskTitle: "Unclear Ownership of Digital Assets", Type: "Governance", Description: "Ambiguity in asset responsibilities causes oversight or duplication.", MitigatingActions: "Digital asset registry, RACI charts, governance council", RiskOwner: "Digital Asset Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR68", RiskTitle: "Insecure Dev/Test Environments", Type: "Development & Security", Description: "Non-production environments lack security, leading to backdoor threats.", MitigatingActions: "Environment segregation, access controls, encryption", RiskOwner: "DevSecOps", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR69", RiskTitle: "Incomplete Security Logging", Type: "Cybersecurity", Description: "Lack of visibility due to poor or inconsistent security logging practices.", MitigatingActions: "Centralized logging (SIEM), log retention policy, alerting", RiskOwner: "Security Operations", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR70", RiskTitle: "Absence of Digital Skills Benchmarking", Type: "Workforce", Description: "Skills not assessed regularly, leading to digital capability gaps.", MitigatingActions: "Skill assessments, digital maturity tools, L&D programs", RiskOwner: "HR & IT", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR71", RiskTitle: "Overlooked Bot Traffic", Type: "Digital Operations", Description: "Bots skew analytics, consume resources, or simulate attacks.", MitigatingActions: "Bot filters, CAPTCHA, behavioral detection", RiskOwner: "Web Security Analyst", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR72", RiskTitle: "Intellectual Property Theft", Type: "Legal & Security", Description: "Loss or theft of proprietary code, designs, or trade secrets.", MitigatingActions: "NDAs, DLP tools, access control, legal escalation process", RiskOwner: "IP Compliance Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR73", RiskTitle: "Tech Debt Accumulation", Type: "Engineering", Description: "Unaddressed shortcuts in code or architecture limit scalability and performance.", MitigatingActions: "Refactoring cycles, technical debt KPIs, engineering sprints", RiskOwner: "Engineering Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR74", RiskTitle: "Over-automation Without Governance", Type: "Operations", Description: "Excessive or unmanaged automation causes systemic errors and inefficiencies.", MitigatingActions: "Automation inventory, process validation, exception handling", RiskOwner: "RPA/Automation Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR75", RiskTitle: "Inconsistent Digital Brand Experience", Type: "Marketing & UX", Description: "Fragmented customer experiences across digital channels damage trust.", MitigatingActions: "UX/UI guidelines, brand governance, omnichannel design", RiskOwner: "Marketing & Product Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR76", RiskTitle: "Digital Identity Fraud", Type: "Cybersecurity", Description: "Fake digital identities or credentials used to access systems or services.", MitigatingActions: "MFA, identity verification tools, fraud analytics", RiskOwner: "IAM Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR77", RiskTitle: "Over-customization of Platforms", Type: "Technology", Description: "Excessive modifications reduce upgrade compatibility and increase maintenance.", MitigatingActions: "Adopt standard configurations, version control policies", RiskOwner: "IT Systems Architect", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR78", RiskTitle: "Legacy System Risks", Type: "IT Infrastructure", Description: "Outdated systems create performance, security, and integration risks.", MitigatingActions: "Modernization roadmap, isolation strategies, migration plans", RiskOwner: "Infrastructure Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR79", RiskTitle: "Lack of Cyber Insurance", Type: "Financial Risk", Description: "Absence of coverage leads to heavy losses from cyber incidents.", MitigatingActions: "Risk assessments, cyber insurance policy, legal advisory", RiskOwner: "CFO / Risk Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR80", RiskTitle: "Incomplete Asset Discovery", Type: "IT Operations", Description: "Digital or physical assets remain undocumented, exposing blind spots.", MitigatingActions: "Automated asset discovery tools, regular audits", RiskOwner: "ITAM Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR81", RiskTitle: "Rogue IT Purchases", Type: "Shadow IT", Description: "Unapproved tools and services bypass security and budget oversight.", MitigatingActions: "Procurement controls, IT policy training, discovery scans", RiskOwner: "IT Governance Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR82", RiskTitle: "Algorithmic Bias", Type: "Ethical AI", Description: "AI/ML models produce unfair or discriminatory results.", MitigatingActions: "Bias detection tools, diverse data sets, AI ethics reviews", RiskOwner: "AI Ethics Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR83", RiskTitle: "Cross-border Data Transfer Risks", Type: "Regulatory", Description: "Transferring data between jurisdictions may violate international data laws.", MitigatingActions: "DPA agreements, encryption-in-transit, regional data storage", RiskOwner: "Data Privacy Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR84", RiskTitle: "Phishing-as-a-Service Threats", Type: "Cybercrime", Description: "Emerging dark web services make sophisticated phishing attacks accessible.", MitigatingActions: "Threat intelligence, user awareness, advanced email filtering", RiskOwner: "SOC Analyst", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR85", RiskTitle: "SaaS Contract Expiry", Type: "Vendor Risk", Description: "SaaS subscriptions lapse unnoticed, leading to loss of service or access.", MitigatingActions: "Contract calendar, renewal alerts, backup/export options", RiskOwner: "IT Vendor Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR86", RiskTitle: "Over-reliance on Generative AI", Type: "Operational", Description: "Dependence on AI-generated content reduces human critical thinking and quality.", MitigatingActions: "AI policy, manual review layers, skill development", RiskOwner: "Digital Content Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR87", RiskTitle: "Digital Vendor Lock-in", Type: "Strategic Risk", Description: "Inability to switch platforms due to proprietary systems or costs.", MitigatingActions: "Exit clauses, interoperability standards, contract flexibility", RiskOwner: "IT Strategy Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR88", RiskTitle: "Lack of Quantum-readiness", Type: "Emerging Technology", Description: "Cryptographic systems may become obsolete with advances in quantum computing.", MitigatingActions: "Research planning, algorithm diversification, vendor engagement", RiskOwner: "CTO / Innovation Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR89", RiskTitle: "Content Moderation Failure", Type: "Platform Governance", Description: "User-generated content violates laws or ethics, impacting reputation.", MitigatingActions: "Moderation policies, AI moderation tools, escalation workflows", RiskOwner: "Community Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR90", RiskTitle: "Lack of Digital Twin Integrity", Type: "Digital Engineering", Description: "Inaccurate virtual replicas lead to flawed simulations or decisions.", MitigatingActions: "Calibration routines, validation checkpoints, audit trails", RiskOwner: "Digital Engineering Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR91", RiskTitle: "Inadequate System Scalability", Type: "Architecture", Description: "Digital platforms can't handle growing user/data volume.", MitigatingActions: "Load testing, scalable design, cloud elasticity", RiskOwner: "Systems Architect", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR92", RiskTitle: "Poor Stakeholder Communication", Type: "Project Risk", Description: "Misalignment on goals or progress results in digital project delays.", MitigatingActions: "Stakeholder matrix, communication plans, feedback loops", RiskOwner: "Project Manager", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR93", RiskTitle: "Lack of Data Literacy", Type: "Workforce & Analytics", Description: "Teams misinterpret or misuse data, affecting decisions and insights.", MitigatingActions: "Data education programs, self-service BI, mentoring", RiskOwner: "L&D + Data Lead", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR94", RiskTitle: "Smart Contract Vulnerabilities", Type: "Blockchain", Description: "Flaws in smart contract logic lead to financial or legal exposure.", MitigatingActions: "Auditing tools, peer review, formal verification methods", RiskOwner: "Blockchain Dev Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR95", RiskTitle: "Delays in Technology Adoption", Type: "Innovation", Description: "Resistance or slow rollout hinders competitiveness and digital ROI.", MitigatingActions: "Change champions, pilot programs, adoption metrics", RiskOwner: "Digital Transformation Office", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR96", RiskTitle: "Overdependence on Key Tech Personnel", Type: "HR & Continuity", Description: "Loss of specialized staff disrupts continuity of critical tech systems.", MitigatingActions: "Knowledge management, cross-training, succession plans", RiskOwner: "HRBP / IT Director", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR97", RiskTitle: "Poor Multi-Cloud Governance", Type: "Infrastructure", Description: "Uncoordinated cloud usage leads to duplication, costs, or security gaps.", MitigatingActions: "Unified cloud strategy, tagging policies, central governance", RiskOwner: "Cloud Ops Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR98", RiskTitle: "AI Prompt Injection Attacks", Type: "AI Security", Description: "Malicious inputs manipulate generative AI behavior to produce harmful outputs.", MitigatingActions: "Input validation, prompt filters, red teaming", RiskOwner: "AI Security Team", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR99", RiskTitle: "Inconsistent Digital Asset Valuation", Type: "Financial & Strategy", Description: "Poor understanding of digital asset worth leads to flawed investment decisions.", MitigatingActions: "Asset classification model, financial tagging, audit", RiskOwner: "Digital Finance Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" },
  { RiskID: "DR100", RiskTitle: "Misalignment Between IT & ESG", Type: "Sustainability", Description: "Digital operations not supporting environmental or social targets.", MitigatingActions: "Green IT metrics, ESG dashboards, sustainable tech planning", RiskOwner: "ESG Officer", Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: "" }
];

export const grcRisks: Omit<Risk, 'id'>[] = [
  {
    RiskID: "GRC1",
    RiskTitle: "Absence of IT Strategy",
    Type: "Strategic",
    Description: "Risk: Absence of a comprehensive IT Strategy in line with business objectives. Cause: Unclear governance of the IT function within the company.",
    MitigatingActions: "Develop the IT Strategy including the initiatives roadmap.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC2",
    RiskTitle: "Absence of Periodic Reviews of IT Policies",
    Type: "Strategic",
    Description: "Risk: Policies and procedures do not reflect current practices. Cause: Absence of periodic reviews of IT policies and procedures.",
    MitigatingActions: "Review and update IT Policies and Procedures periodically as per best practices.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC3",
    RiskTitle: "Absence of IT Steering Committee",
    Type: "Strategic",
    Description: "Risk: Failure to provide a roadmap that defines core vision and direction. Cause: The absence of the IT steering committee and charter.",
    MitigatingActions: "Establish IT Steering Committee and Charter. Hold meetings as per frequency defined in the charter.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC4",
    RiskTitle: "Absence of Job Descriptions",
    Type: "Strategic",
    Description: "Risk: Employees not having a clear understanding of roles and responsibilities. Cause: Absence of Job Descriptions.",
    MitigatingActions: "Define and document job descriptions for all IT employees.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC5",
    RiskTitle: "Absence of Centralized IT Asset Management",
    Type: "Operational",
    Description: "Risk: Lack of real-time visibility into the asset landscape and operational inefficiencies. Cause: Manual asset management and absence of a centralized tool.",
    MitigatingActions: "Implement a tool for assets discovery, tracking, and life-cycle management.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC6",
    RiskTitle: "Absence of IT Asset Classification",
    Type: "Operational",
    Description: "Risk: Management may not have actual visibility of critical assets. Cause: Absence of information asset classification.",
    MitigatingActions: "Classify all information assets according to their criticality and sensitivity.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC7",
    RiskTitle: "Presence of EOL and EOS IT Assets",
    Type: "Operational",
    Description: "Risk: Assets no longer receive security updates, leaving them susceptible to vulnerabilities. Cause: Presence of End-of-Life (EOL) and End-of-Service (EOS) assets.",
    MitigatingActions: "Maintain proper records of EOS and EOL systems and plan for their replacement or isolation.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC8",
    RiskTitle: "Absence of IT Asset Disposal Process",
    Type: "Operational",
    Description: "Risk: Potential data breaches and unauthorized access to sensitive information. Cause: Lack of proper documentation and process for asset disposal.",
    MitigatingActions: "Maintain proper records and documentation of disposed assets; implement secure disposal procedures.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC9",
    RiskTitle: "Absence of Technical Evaluation for IT Assets",
    Type: "Operational",
    Description: "Risk: Compatibility issues, performance problems, and security vulnerabilities. Cause: Failing to perform a technical evaluation when procuring IT assets.",
    MitigatingActions: "Perform formal technical evaluation prior to procuring any IT Asset.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC10",
    RiskTitle: "Lack of Automated Change Management",
    Type: "Operational",
    Description: "Risk: Approval delays, human errors, and lack of traceability. Cause: Lack of an automated change management system.",
    MitigatingActions: "Implement an automated change management tool/solution to streamline the process.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC11",
    RiskTitle: "Absence of Change Testing",
    Type: "Operational",
    Description: "Risk: Undetected errors, system failures, and compromised data integrity. Cause: Absence of formal change testing procedures.",
    MitigatingActions: "Maintain proper documentation related to the testing of changes before implementation.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC12",
    RiskTitle: "Absence of Post Implementation Review",
    Type: "Operational",
    Description: "Risk: Missed opportunities for improvement and unresolved issues. Cause: No systematic evaluation of changes post-implementation.",
    MitigatingActions: "Perform formal review of implemented changes.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC14",
    RiskTitle: "Absence of Change Advisory Board",
    Type: "Operational",
    Description: "Risk: Insufficient oversight and strategic decision-making for significant changes. Cause: Absence of a Change Advisory Board (CAB).",
    MitigatingActions: "Establish a Change Advisory Board (CAB) to oversee and approve significant changes.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC15",
    RiskTitle: "Prolonged Vulnerability Exposure",
    Type: "Operational",
    Description: "Risk: Prolonged exposure to security vulnerabilities. Cause: Infrequent patching schedule (e.g., bi-annual).",
    MitigatingActions: "Increase patching frequency and ensure timely updates to minimize exposure.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC16",
    RiskTitle: "Absence of Patch Testing",
    Type: "Operational",
    Description: "Risk: System instability and unexpected downtime. Cause: Lack of patch testing before deploying to business critical systems.",
    MitigatingActions: "Maintain proper documentation/reports regarding the testing of patches before deployment.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC17",
    RiskTitle: "Absence of Backup and Restoration Plan",
    Type: "Operational",
    Description: "Risk: Permanent loss of critical business data. Cause: Absence of a documented Backup and Restoration Plan.",
    MitigatingActions: "Develop and implement a comprehensive backup and restoration plan.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC18",
    RiskTitle: "Absence of Backup Restoration Testing",
    Type: "Operational",
    Description: "Risk: Data may not be restored effectively during an adverse event. Cause: Absence of backup restoration testing.",
    MitigatingActions: "Perform backup restoration testing periodically as per the backup plan.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC19",
    RiskTitle: "Lack of Business Impact Analysis",
    Type: "Operational",
    Description: "Risk: Inadequate prioritization of recovery efforts. Cause: Lack of conducting Business Impact Analysis (BIA).",
    MitigatingActions: "Conduct a Business Impact Analysis (BIA) for all services within the organization.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC20",
    RiskTitle: "Absence of Off-Site Backup",
    Type: "Operational",
    Description: "Risk: Significant data loss from physical disasters. Cause: Absence of off-site backups.",
    MitigatingActions: "Store backup tapes/data in a different geographical location to mitigate disaster risks.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC21",
    RiskTitle: "Absence of Defined Backup Retention Period",
    Type: "Operational",
    Description: "Risk: Data loss if backups are overwritten too soon. Cause: Failing to define the backup retention period.",
    MitigatingActions: "Document and obtain approval for retention periods from system owners.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC22",
    RiskTitle: "Absence of Backup Encryption",
    Type: "Operational",
    Description: "Risk: Sensitive data exposure to unauthorized access. Cause: Absence of backup encryption.",
    MitigatingActions: "Implement encryption for all backup data.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC23",
    RiskTitle: "Absence of Root Cause Analysis (RCA)",
    Type: "Operational",
    Description: "Risk: Unresolved recurring issues. Cause: Absence of RCA practice for incidents.",
    MitigatingActions: "Perform Root Cause Analysis (RCA) of identified incidents to resolve underlying issues.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC24",
    RiskTitle: "Absence of Incident Repository",
    Type: "Operational",
    Description: "Risk: Poor incident tracking and lack of historical data. Cause: Absence of an incident repository.",
    MitigatingActions: "Establish an incident repository to document and track all IT incidents.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC25",
    RiskTitle: "Absence of Incident Prioritization",
    Type: "Operational",
    Description: "Risk: Delayed resolutions for critical incidents. Cause: Lack of criteria for prioritizing incidents.",
    MitigatingActions: "Develop criteria for incident prioritization and categorization.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC26",
    RiskTitle: "Absence of Remote Access Reviews",
    Type: "Operational",
    Description: "Risk: Unauthorized access and potential security breaches. Cause: Periodic user access reviews for remote users are not conducted.",
    MitigatingActions: "Conduct periodic user access reviews for VPN/remote users.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC27",
    RiskTitle: "Absence of Multi-Factor Authentication (MFA)",
    Type: "Operational",
    Description: "Risk: Unauthorized entry via brute force attacks. Cause: Lack of MFA on applications and VPN access.",
    MitigatingActions: "Implement MFA for all remote access and critical applications.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC28",
    RiskTitle: "Absence of Network Monitoring",
    Type: "Operational",
    Description: "Risk: Security breaches and performance issues go undetected. Cause: Lack of network monitoring tools.",
    MitigatingActions: "Implement network monitoring solutions (e.g., SolarWinds) to detect issues.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC29",
    RiskTitle: "Absence of Data Protection Controls",
    Type: "Operational",
    Description: "Risk: Exposure or tampering of sensitive data. Cause: Failure to protect sensitive data at rest, in motion, and during processing.",
    MitigatingActions: "Implement encryption standards and data protection controls.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC30",
    RiskTitle: "Absence of Secure Asset Disposal Procedures",
    Type: "Operational",
    Description: "Risk: Data retrieval and exploitation from discarded assets. Cause: Critical hardware disposed of without proper sanitization.",
    MitigatingActions: "Develop and enforce policies for secure disposal and destruction of assets.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC31",
    RiskTitle: "Absence of Automated Log Management",
    Type: "Operational",
    Description: "Risk: Reduced visibility into suspicious activities. Cause: Logs are not consistently collected or reviewed.",
    MitigatingActions: "Deploy a SIEM solution to centrally manage and analyze security event data.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC32",
    RiskTitle: "Absence of Automated User Access Management",
    Type: "Operational",
    Description: "Risk: Errors and orphaned accounts. Cause: User access provisioning is handled manually.",
    MitigatingActions: "Implement automated Identity and Access Management (IAM) processes.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC33",
    RiskTitle: "Absence of Document Approval Workflow",
    Type: "Operational",
    Description: "Risk: Use of incorrect or outdated versions of documents. Cause: Documents used without formal review or approval.",
    MitigatingActions: "Establish formal document approval workflows.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC34",
    RiskTitle: "Absence of Automated Configuration Management",
    Type: "Operational",
    Description: "Risk: Configuration drift and vulnerabilities. Cause: IT systems configured manually or inconsistently.",
    MitigatingActions: "Implement automated configuration management tools.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC35",
    RiskTitle: "Absence of Segregation of Duties (SoD)",
    Type: "Operational",
    Description: "Risk: Potential for fraud or errors. Cause: One individual has end-to-end control over critical processes.",
    MitigatingActions: "Enforce Segregation of Duties (SoD) in critical processes.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC36",
    RiskTitle: "Absence of RACI Matrix",
    Type: "Operational",
    Description: "Risk: Confusion and inefficiencies. Cause: Roles and responsibilities are undefined or overlapping.",
    MitigatingActions: "Develop and publish a RACI matrix for key IT and security tasks.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC37",
    RiskTitle: "Absence of Centralized Process Asset Repository",
    Type: "Operational",
    Description: "Risk: Organizational knowledge is scattered or inaccessible. Cause: Lack of a centralized repository.",
    MitigatingActions: "Create a centralized repository for process assets and templates.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC38",
    RiskTitle: "Unauthorized System Access",
    Type: "Operational",
    Description: "Risk: External attackers exploiting weak access controls. Cause: Accessing company systems without prior approval.",
    MitigatingActions: "Strengthen access controls and approval workflows.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC39",
    RiskTitle: "Threat to Applications and Data",
    Type: "Operational",
    Description: "Risk: Exposure to hacking, malware, or ransomware. Cause: Lack of protection for business-critical applications.",
    MitigatingActions: "Implement comprehensive application security measures.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC40",
    RiskTitle: "Disruption in Device Utilization",
    Type: "Operational",
    Description: "Risk: Employees unable to use devices due to technical failure. Cause: Malware, misconfiguration, or lack of maintenance.",
    MitigatingActions: "Implement robust endpoint management and maintenance procedures.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC41",
    RiskTitle: "Network Interruption",
    Type: "Operational",
    Description: "Risk: Prevents access to internal systems and internet. Cause: Unexpected disruption in network connectivity.",
    MitigatingActions: "Implement network redundancy and failover mechanisms.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC42",
    RiskTitle: "Absence of Dedicated Cybersecurity Function",
    Type: "Strategic",
    Description: "Risk: Inconsistent security policies and measures. Cause: Lack of a dedicated cybersecurity function and steering committee.",
    MitigatingActions: "Establish a dedicated cybersecurity function and steering committee.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC43",
    RiskTitle: "Absence of Cybersecurity Policies",
    Type: "Operational",
    Description: "Risk: Inconsistencies in performing security tasks. Cause: Lack of Cybersecurity policies and procedures.",
    MitigatingActions: "Develop, approve, and implement comprehensive Cybersecurity policies.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC44",
    RiskTitle: "Lack of Cybersecurity in HR",
    Type: "Operational",
    Description: "Risk: Insider threats and data breaches. Cause: Failure to implement cybersecurity requirements for human resources.",
    MitigatingActions: "Define and document cybersecurity requirements for HR (onboarding/offboarding).",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC45",
    RiskTitle: "Lack of Cybersecurity Awareness",
    Type: "Operational",
    Description: "Risk: Employees vulnerable to social engineering. Cause: Absence of a security training and awareness program.",
    MitigatingActions: "Conduct regular security awareness training sessions.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC46",
    RiskTitle: "Absence of IAM Process",
    Type: "Operational",
    Description: "Risk: Unauthorized access to sensitive data. Cause: Inadequate identity and access management processes.",
    MitigatingActions: "Formalize Identity and Access Management processes.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC47",
    RiskTitle: "Inadequate Malware Protection",
    Type: "Operational",
    Description: "Risk: Vulnerability to infections and data loss. Cause: Failure to implement up-to-date malware protection.",
    MitigatingActions: "Deploy advanced anti-virus/anti-malware solutions on all endpoints.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC48",
    RiskTitle: "Absence of Centralized Clock Synchronization",
    Type: "Operational",
    Description: "Risk: Inconsistencies in logging and auditing. Cause: Timestamps across systems may differ.",
    MitigatingActions: "Implement centralized clock synchronization (NTP).",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC49",
    RiskTitle: "Lack of Email Security",
    Type: "Operational",
    Description: "Risk: Vulnerability to phishing and social engineering. Cause: Absence of email security measures.",
    MitigatingActions: "Implement email security gateways and anti-phishing controls.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC50",
    RiskTitle: "Inadequate Network Security",
    Type: "Operational",
    Description: "Risk: Unauthorized access to sensitive data. Cause: Inadequate network security measures.",
    MitigatingActions: "Implement NAC and restrict network services/ports.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC51",
    RiskTitle: "Absence of Encryption",
    Type: "Operational",
    Description: "Risk: Data breaches and privacy violations. Cause: Sensitive data transmitted or stored without encryption.",
    MitigatingActions: "Define cryptographic standards and encrypt sensitive data.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC52",
    RiskTitle: "Absence of Vulnerability Management",
    Type: "Operational",
    Description: "Risk: Unpatched vulnerabilities remain undetected. Cause: Lack of an effective vulnerability management process.",
    MitigatingActions: "Define vulnerability management policy and conduct regular scans.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC53",
    RiskTitle: "Absence of Penetration Testing",
    Type: "Operational",
    Description: "Risk: Critical security flaws go unnoticed. Cause: Absence of penetration testing.",
    MitigatingActions: "Define penetration testing policy and conduct regular tests.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC54",
    RiskTitle: "Absence of SIEM Solution",
    Type: "Operational",
    Description: "Risk: Difficulty in correlating and analyzing security events. Cause: Absence of Security Information and Event Management (SIEM).",
    MitigatingActions: "Deploy a SIEM solution for real-time threat detection.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC55",
    RiskTitle: "Lack of Incident Management",
    Type: "Operational",
    Description: "Risk: Delays in detecting and responding to incidents. Cause: Lack of cybersecurity incident management process.",
    MitigatingActions: "Develop and implement an incident management process.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC56",
    RiskTitle: "Absence of Threat Management",
    Type: "Operational",
    Description: "Risk: Inefficient allocation of resources to threats. Cause: Absence of a threat management process.",
    MitigatingActions: "Develop and deploy a threat management process.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC57",
    RiskTitle: "Absence of Secure Asset Disposal",
    Type: "Operational",
    Description: "Risk: Data retrieval and exploitation. Cause: Failure to securely dispose of assets.",
    MitigatingActions: "Enforce policies for secure disposal of sensitive assets.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC58",
    RiskTitle: "Absence of Web Application Firewall (WAF)",
    Type: "Operational",
    Description: "Risk: Susceptibility to SQL injection and XSS. Cause: Absence of WAF.",
    MitigatingActions: "Implement WAF to protect web applications.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC59",
    RiskTitle: "Lack of OT/ICS Segmentation",
    Type: "Operational",
    Description: "Risk: Increased attack surface for critical systems. Cause: Lack of Physical and Virtual Segmentation of OT/ICS.",
    MitigatingActions: "Implement strict segmentation for industrial networks.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC60",
    RiskTitle: "Absence of Data Classification",
    Type: "Operational",
    Description: "Risk: Challenge in identifying sensitive data for protection. Cause: Without data classification.",
    MitigatingActions: "Define and implement a data classification framework.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  },
  {
    RiskID: "GRC61",
    RiskTitle: "Absence of SLAs and NDAs",
    Type: "Operational",
    Description: "Risk: Potential service disruptions and unmet business needs. Cause: Absence of SLAs and NDAs with Third-Party Vendors.",
    MitigatingActions: "Define and sign SLAs and NDAs with all third-party vendors.",
    RiskOwner: "IT Department",
    Status: "Open", Likelihood: "", Impact: "", RiskLevel: RiskLevel.Low, RiskRating: ""
  }
];
