/**
 * PathPort Full Demo Seed Script
 * Run: cd Server && npm run seed
 *
 * Creates: 5 students, 5 recruiters, 5 mentors,
 *          10 jobs, 20+ applications, skill nodes,
 *          evidence cards, mentor offers/sessions, OQI reviews.
 *
 * All accounts use password: Demo@1234
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────────────────────
const User         = require('./src/models/User');
const Job          = require('./src/models/Job');
const Application  = require('./src/models/Application');
const SkillNode    = require('./src/models/SkillNode');
const EvidenceCard = require('./src/models/EvidenceCard');
const JournalEntry = require('./src/models/JournalEntry');
const Review       = require('./src/models/Review');
const MentorOffer  = require('./src/models/MentorOffer');
const MentorSession = require('./src/models/MentorSession');
const MentorReview = require('./src/models/MentorReview');
const Connection   = require('./src/models/Connection');
const Notification = require('./src/models/Notification');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in Server/.env');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const future = (days) => new Date(Date.now() + days * 86400000);
const past   = (days) => new Date(Date.now() - days * 86400000);


// ── Student Data ─────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@demo.com',
    role: 'student',
    headline: 'Aspiring Frontend Developer | React & TypeScript Enthusiast',
    about: 'Final year B.Tech CSE student at RVCE Bangalore. Passionate about building beautiful, performant web UIs. Looking for frontend internships at product companies.',
    location: 'Bangalore, Karnataka',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
    resumeUrl: 'https://example.com/resume/arjun-sharma.pdf',
    careerGoal: 'Frontend Developer',
    education: [{ college: 'RV College of Engineering', degree: 'B.Tech', branch: 'Computer Science', startYear: 2021, endYear: 2025, cgpa: '8.7' }],
    experience: [
      { role: 'Frontend Developer Intern', company: 'StartupXYZ Pvt Ltd', type: 'internship', startDate: past(300), endDate: past(210), isCurrent: false, description: 'Built React dashboard components. Improved page load by 30% via code splitting.', skills: ['React', 'TypeScript', 'CSS'] },
      { role: 'Web Dev Lead', company: 'RVCE Tech Club', type: 'volunteer', startDate: past(500), endDate: past(100), isCurrent: false, description: 'Led a team of 6 to build the college fest website. 2000+ registrations.', skills: ['React', 'Node.js', 'MongoDB'] },
    ],
    skills: [
      { name: 'React', level: 'Intermediate', years: 2, verified: true, endorsements: 8 },
      { name: 'TypeScript', level: 'Intermediate', years: 1, verified: false, endorsements: 4 },
      { name: 'CSS', level: 'Advanced', years: 3, verified: true, endorsements: 6 },
      { name: 'JavaScript', level: 'Advanced', years: 3, verified: true, endorsements: 10 },
      { name: 'Git', level: 'Intermediate', years: 2, verified: true, endorsements: 5 },
      { name: 'Communication', level: 'Advanced', years: 3, verified: false, endorsements: 3 },
    ],
    socialLinks: { github: 'https://github.com/arjun-sharma-dev', linkedin: 'https://linkedin.com/in/arjun-sharma-dev', portfolioUrl: 'https://arjun-sharma.vercel.app' },
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@demo.com',
    role: 'student',
    headline: 'Full Stack Developer in the Making | MERN Stack | Open to Internships',
    about: '4th year IT student at DAIICT Gandhinagar. I love building end-to-end products. Currently exploring system design and cloud deployments.',
    location: 'Gandhinagar, Gujarat',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    resumeUrl: 'https://example.com/resume/priya-patel.pdf',
    careerGoal: 'Full-Stack Developer',
    education: [{ college: 'DAIICT Gandhinagar', degree: 'B.Tech', branch: 'Information Technology', startYear: 2020, endYear: 2024, cgpa: '9.1' }],
    experience: [
      { role: 'Full Stack Intern', company: 'Zeta Suite', type: 'internship', startDate: past(180), endDate: past(90), isCurrent: false, description: 'Developed REST APIs with Node.js and built React admin panel for internal tools.', skills: ['Node.js', 'React', 'PostgreSQL'] },
    ],
    skills: [
      { name: 'Node.js', level: 'Intermediate', years: 2, verified: true, endorsements: 7 },
      { name: 'React', level: 'Intermediate', years: 2, verified: true, endorsements: 9 },
      { name: 'MongoDB', level: 'Intermediate', years: 1, verified: false, endorsements: 4 },
      { name: 'Express.js', level: 'Intermediate', years: 2, verified: false, endorsements: 5 },
      { name: 'Docker', level: 'Beginner', years: 0, verified: false, endorsements: 1 },
      { name: 'Teamwork', level: 'Advanced', years: 4, verified: false, endorsements: 6 },
    ],
    socialLinks: { github: 'https://github.com/priya-patel-dev', linkedin: 'https://linkedin.com/in/priya-patel-dev', portfolioUrl: 'https://priya-patel.netlify.app' },
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@demo.com',
    role: 'student',
    headline: 'Data Analyst Aspirant | Python & SQL | Turning Data into Decisions',
    about: 'ECE graduate from NIT Trichy pivoting to data analytics. Strong in Python, SQL, and data visualization. Completed 3 data projects and 1 Kaggle competition.',
    location: 'Trichy, Tamil Nadu',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    resumeUrl: 'https://example.com/resume/rahul-verma.pdf',
    careerGoal: 'Data Analyst',
    education: [{ college: 'NIT Trichy', degree: 'B.Tech', branch: 'Electronics & Communication', startYear: 2020, endYear: 2024, cgpa: '7.9' }],
    experience: [
      { role: 'Data Analyst Intern', company: 'FinEdge Analytics', type: 'internship', startDate: past(240), endDate: past(150), isCurrent: false, description: 'Cleaned and analyzed 500K+ row datasets. Built Tableau dashboards for sales team.', skills: ['Python', 'SQL', 'Tableau'] },
    ],
    skills: [
      { name: 'Python', level: 'Intermediate', years: 2, verified: true, endorsements: 9 },
      { name: 'SQL', level: 'Advanced', years: 2, verified: true, endorsements: 11 },
      { name: 'Pandas', level: 'Intermediate', years: 1, verified: false, endorsements: 5 },
      { name: 'Tableau', level: 'Beginner', years: 1, verified: false, endorsements: 3 },
      { name: 'Excel', level: 'Advanced', years: 3, verified: true, endorsements: 7 },
      { name: 'Statistics', level: 'Intermediate', years: 2, verified: false, endorsements: 4 },
    ],
    socialLinks: { github: 'https://github.com/rahul-verma-data', linkedin: 'https://linkedin.com/in/rahul-verma-data', portfolioUrl: 'https://rahul-verma.github.io' },
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@demo.com',
    role: 'student',
    headline: 'Backend Engineer | Java & Spring Boot | Building Scalable Systems',
    about: 'CSE student at VIT Vellore. Passionate about backend architecture, microservices, and system design. Interned at a fintech startup and built payment APIs.',
    location: 'Vellore, Tamil Nadu',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
    resumeUrl: 'https://example.com/resume/sneha-iyer.pdf',
    careerGoal: 'Backend Developer',
    education: [{ college: 'VIT Vellore', degree: 'B.Tech', branch: 'Computer Science', startYear: 2021, endYear: 2025, cgpa: '8.4' }],
    experience: [
      { role: 'Backend Developer Intern', company: 'PayQuick Fintech', type: 'internship', startDate: past(200), endDate: past(110), isCurrent: false, description: 'Built payment gateway APIs using Spring Boot. Integrated Razorpay and handled 10K+ daily transactions.', skills: ['Java', 'Spring Boot', 'MySQL'] },
    ],
    skills: [
      { name: 'Java', level: 'Advanced', years: 3, verified: true, endorsements: 12 },
      { name: 'Spring Boot', level: 'Intermediate', years: 1, verified: true, endorsements: 7 },
      { name: 'MySQL', level: 'Intermediate', years: 2, verified: false, endorsements: 5 },
      { name: 'REST APIs', level: 'Advanced', years: 2, verified: true, endorsements: 9 },
      { name: 'Microservices', level: 'Beginner', years: 0, verified: false, endorsements: 2 },
      { name: 'Problem Solving', level: 'Advanced', years: 3, verified: false, endorsements: 8 },
    ],
    socialLinks: { github: 'https://github.com/sneha-iyer-dev', linkedin: 'https://linkedin.com/in/sneha-iyer-dev', portfolioUrl: 'https://sneha-iyer.dev' },
  },
  {
    name: 'Mohit Gupta',
    email: 'mohit.gupta@demo.com',
    role: 'student',
    headline: 'DevOps & Cloud Enthusiast | AWS | Docker | CI/CD Pipelines',
    about: 'MCA student at IGNOU Delhi. Fascinated by cloud infrastructure and automation. AWS Certified Cloud Practitioner. Built CI/CD pipelines for 3 open-source projects.',
    location: 'New Delhi',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohit',
    resumeUrl: 'https://example.com/resume/mohit-gupta.pdf',
    careerGoal: 'DevOps Engineer',
    education: [{ college: 'IGNOU', degree: 'MCA', branch: 'Computer Applications', startYear: 2022, endYear: 2024, cgpa: '7.6' }],
    experience: [
      { role: 'DevOps Intern', company: 'CloudNine Solutions', type: 'internship', startDate: past(160), endDate: past(70), isCurrent: false, description: 'Set up GitHub Actions CI/CD pipelines. Dockerized 5 microservices. Managed AWS EC2 and S3.', skills: ['Docker', 'AWS', 'GitHub Actions'] },
    ],
    skills: [
      { name: 'Docker', level: 'Intermediate', years: 1, verified: true, endorsements: 6 },
      { name: 'AWS', level: 'Intermediate', years: 1, verified: true, endorsements: 8 },
      { name: 'Linux', level: 'Advanced', years: 3, verified: true, endorsements: 10 },
      { name: 'Kubernetes', level: 'Beginner', years: 0, verified: false, endorsements: 2 },
      { name: 'CI/CD', level: 'Intermediate', years: 1, verified: false, endorsements: 5 },
      { name: 'Terraform', level: 'Beginner', years: 0, verified: false, endorsements: 1 },
    ],
    socialLinks: { github: 'https://github.com/mohit-gupta-devops', linkedin: 'https://linkedin.com/in/mohit-gupta-devops', portfolioUrl: 'https://mohit-gupta.hashnode.dev' },
  },
];


// ── Recruiter Data ────────────────────────────────────────────────────────────
const RECRUITERS = [
  {
    name: 'Kavya Nair',
    email: 'recruiter1@demo.com',
    role: 'recruiter',
    headline: 'Talent Acquisition Lead at NovaSoft Labs',
    about: 'Hiring passionate engineers for our product teams at NovaSoft Labs. We build SaaS tools for SMEs.',
    location: 'Bangalore, Karnataka',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavya',
    companyName: 'NovaSoft Labs',
  },
  {
    name: 'Rohan Mehta',
    email: 'recruiter2@demo.com',
    role: 'recruiter',
    headline: 'HR Manager at DataPulse Analytics',
    about: 'Building the data team at DataPulse. We help enterprises make sense of their data.',
    location: 'Hyderabad, Telangana',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
    companyName: 'DataPulse Analytics',
  },
  {
    name: 'Ananya Singh',
    email: 'recruiter3@demo.com',
    role: 'recruiter',
    headline: 'Campus Recruiter at CloudNine Technologies',
    about: 'Connecting top student talent with cloud-native engineering roles at CloudNine.',
    location: 'Pune, Maharashtra',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
    companyName: 'CloudNine Technologies',
  },
  {
    name: 'Vikash Kumar',
    email: 'recruiter4@demo.com',
    role: 'recruiter',
    headline: 'Engineering Recruiter at FinEdge Fintech',
    about: 'Scaling the backend and mobile teams at FinEdge. We process 1M+ transactions daily.',
    location: 'Mumbai, Maharashtra',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikash',
    companyName: 'FinEdge Fintech',
  },
  {
    name: 'Deepa Krishnan',
    email: 'recruiter5@demo.com',
    role: 'recruiter',
    headline: 'Talent Partner at GreenLeaf EdTech',
    about: 'Hiring for our product and engineering teams at GreenLeaf. We are reimagining K-12 education.',
    location: 'Chennai, Tamil Nadu',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepa',
    companyName: 'GreenLeaf EdTech',
  },
];

// ── Mentor Data ───────────────────────────────────────────────────────────────
const MENTORS = [
  {
    name: 'Vikram Nair',
    email: 'mentor1@demo.com',
    role: 'mentor',
    headline: 'Senior Software Engineer at Google | 8 Years | Full Stack & System Design',
    about: 'I help students break into top product companies. Mentored 50+ students placed at Google, Microsoft, Flipkart.',
    location: 'Hyderabad, Telangana',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    skills: [
      { name: 'React', level: 'Advanced', years: 6, verified: true, endorsements: 42 },
      { name: 'Node.js', level: 'Advanced', years: 7, verified: true, endorsements: 38 },
      { name: 'System Design', level: 'Advanced', years: 5, verified: true, endorsements: 55 },
    ],
    mentorProfile: {
      areasOfExpertise: ['Web Dev', 'System Design', 'Interview Prep', 'Career Guidance'],
      yearsOfExperience: 8,
      currentCompany: 'Google',
      currentRole: 'Senior Software Engineer',
      bio: 'I have mentored 50+ students who are now working at top companies. My approach is practical — real projects, mock interviews, and portfolio building.',
      languages: ['English', 'Hindi', 'Malayalam'],
      slotsPerWeek: 4,
      mentorType: 'both',
      isAvailable: true,
      rating: 4.9,
      totalSessions: 127,
    },
  },
  {
    name: 'Meera Joshi',
    email: 'mentor2@demo.com',
    role: 'mentor',
    headline: 'Data Scientist at Amazon | 6 Years | ML & Analytics',
    about: 'Passionate about making data science accessible to students. Specialise in ML pipelines, SQL, and Python.',
    location: 'Bangalore, Karnataka',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
    skills: [
      { name: 'Python', level: 'Advanced', years: 6, verified: true, endorsements: 50 },
      { name: 'Machine Learning', level: 'Advanced', years: 5, verified: true, endorsements: 45 },
      { name: 'SQL', level: 'Advanced', years: 6, verified: true, endorsements: 40 },
    ],
    mentorProfile: {
      areasOfExpertise: ['Data Science', 'Machine Learning', 'SQL', 'Python'],
      yearsOfExperience: 6,
      currentCompany: 'Amazon',
      currentRole: 'Data Scientist',
      bio: 'I guide students from zero to their first data role. Focus on practical projects, Kaggle competitions, and interview prep.',
      languages: ['English', 'Hindi', 'Marathi'],
      slotsPerWeek: 3,
      mentorType: '1-1',
      isAvailable: true,
      rating: 4.8,
      totalSessions: 89,
    },
  },
  {
    name: 'Suresh Babu',
    email: 'mentor3@demo.com',
    role: 'mentor',
    headline: 'DevOps Lead at Infosys | 10 Years | AWS, Kubernetes, CI/CD',
    about: 'Cloud and DevOps veteran. I help students understand real-world infrastructure and get certified.',
    location: 'Chennai, Tamil Nadu',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    skills: [
      { name: 'AWS', level: 'Advanced', years: 8, verified: true, endorsements: 60 },
      { name: 'Kubernetes', level: 'Advanced', years: 6, verified: true, endorsements: 48 },
      { name: 'Docker', level: 'Advanced', years: 7, verified: true, endorsements: 52 },
    ],
    mentorProfile: {
      areasOfExpertise: ['DevOps', 'Cloud Computing', 'AWS', 'Kubernetes'],
      yearsOfExperience: 10,
      currentCompany: 'Infosys',
      currentRole: 'DevOps Lead',
      bio: 'I have helped 30+ students get AWS certifications and land DevOps roles. Practical, hands-on approach.',
      languages: ['English', 'Tamil', 'Telugu'],
      slotsPerWeek: 2,
      mentorType: 'group',
      isAvailable: true,
      rating: 4.7,
      totalSessions: 64,
    },
  },
  {
    name: 'Pooja Agarwal',
    email: 'mentor4@demo.com',
    role: 'mentor',
    headline: 'Product Manager at Swiggy | 5 Years | Product Strategy & UX',
    about: 'I help engineering students transition into product roles. Resume reviews, mock PMs, and product case studies.',
    location: 'Bangalore, Karnataka',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pooja',
    skills: [
      { name: 'Product Management', level: 'Advanced', years: 5, verified: true, endorsements: 35 },
      { name: 'UX Research', level: 'Advanced', years: 4, verified: true, endorsements: 28 },
      { name: 'Figma', level: 'Intermediate', years: 3, verified: false, endorsements: 20 },
    ],
    mentorProfile: {
      areasOfExpertise: ['Product Management', 'UX Design', 'Career Guidance', 'Interview Prep'],
      yearsOfExperience: 5,
      currentCompany: 'Swiggy',
      currentRole: 'Product Manager',
      bio: 'From engineer to PM — I know the transition. I help students build product thinking and crack PM interviews.',
      languages: ['English', 'Hindi'],
      slotsPerWeek: 3,
      mentorType: '1-1',
      isAvailable: true,
      rating: 4.6,
      totalSessions: 52,
    },
  },
  {
    name: 'Arjun Kapoor',
    email: 'mentor5@demo.com',
    role: 'mentor',
    headline: 'Backend Architect at Razorpay | 9 Years | Java, Microservices, Kafka',
    about: 'I specialise in backend architecture and distributed systems. Helping students build production-grade skills.',
    location: 'Bangalore, Karnataka',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjunk',
    skills: [
      { name: 'Java', level: 'Advanced', years: 9, verified: true, endorsements: 65 },
      { name: 'Microservices', level: 'Advanced', years: 7, verified: true, endorsements: 55 },
      { name: 'Kafka', level: 'Advanced', years: 5, verified: true, endorsements: 40 },
    ],
    mentorProfile: {
      areasOfExpertise: ['Backend Development', 'Microservices', 'System Design', 'Java'],
      yearsOfExperience: 9,
      currentCompany: 'Razorpay',
      currentRole: 'Backend Architect',
      bio: 'I help students go deep on backend engineering — from REST APIs to distributed systems. Practical, no-fluff mentoring.',
      languages: ['English', 'Hindi', 'Punjabi'],
      slotsPerWeek: 2,
      mentorType: 'both',
      isAvailable: true,
      rating: 4.8,
      totalSessions: 98,
    },
  },
];


// ── Job Postings Data ─────────────────────────────────────────────────────────
// Built after recruiters are created — uses recruiter index to assign recruiterId
const buildJobs = (recruiters) => [
  // NovaSoft Labs (recruiters[0])
  {
    recruiterId: recruiters[0]._id,
    title: 'Frontend Developer Intern',
    companyName: 'NovaSoft Labs',
    location: 'Bangalore',
    isRemote: false,
    type: 'internship',
    description: 'Join our product team to build beautiful, responsive UIs for our SaaS platform used by 10,000+ SMEs. You will work directly with senior engineers and designers.\n\nYou will:\n- Build React components from Figma designs\n- Write clean TypeScript code with unit tests\n- Participate in daily standups and sprint reviews\n- Learn production-grade frontend practices',
    responsibilities: '- Develop and maintain React/TypeScript components\n- Collaborate with backend team on API integration\n- Write unit and integration tests\n- Optimize performance and accessibility',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git'],
    stipendMin: 15000, stipendMax: 25000,
    applicationDeadline: future(30), status: 'open',
  },
  {
    recruiterId: recruiters[0]._id,
    title: 'Full Stack Developer Intern',
    companyName: 'NovaSoft Labs',
    location: 'Remote',
    isRemote: true,
    type: 'internship',
    description: 'Work on both frontend (React) and backend (Node.js) features for our core product. Great opportunity to learn full-stack development in a real product environment.',
    responsibilities: '- Build REST APIs with Node.js and Express\n- Develop React frontend features\n- Work with MongoDB databases\n- Deploy features to staging environment',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    stipendMin: 20000, stipendMax: 30000,
    applicationDeadline: future(45), status: 'open',
  },
  // DataPulse Analytics (recruiters[1])
  {
    recruiterId: recruiters[1]._id,
    title: 'Data Analyst Intern',
    companyName: 'DataPulse Analytics',
    location: 'Hyderabad',
    isRemote: false,
    type: 'internship',
    description: 'Help our clients make data-driven decisions. You will work with large datasets, build dashboards, and present insights to stakeholders.\n\nIdeal for students with strong SQL and Python skills.',
    responsibilities: '- Clean and analyze large datasets using Python/Pandas\n- Build Tableau/Power BI dashboards\n- Write SQL queries for data extraction\n- Present findings to non-technical stakeholders',
    requiredSkills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'],
    stipendMin: 12000, stipendMax: 18000,
    applicationDeadline: future(25), status: 'open',
  },
  {
    recruiterId: recruiters[1]._id,
    title: 'ML Engineer Intern',
    companyName: 'DataPulse Analytics',
    location: 'Hyderabad',
    isRemote: false,
    type: 'internship',
    description: 'Build and deploy machine learning models for our analytics platform. Work with real-world datasets and production ML pipelines.',
    responsibilities: '- Train and evaluate ML models using scikit-learn/TensorFlow\n- Build data preprocessing pipelines\n- Deploy models to production using Flask APIs\n- Monitor model performance',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'scikit-learn', 'SQL'],
    stipendMin: 18000, stipendMax: 28000,
    applicationDeadline: future(35), status: 'open',
  },
  // CloudNine Technologies (recruiters[2])
  {
    recruiterId: recruiters[2]._id,
    title: 'DevOps Engineer Intern',
    companyName: 'CloudNine Technologies',
    location: 'Pune',
    isRemote: false,
    type: 'internship',
    description: 'Join our infrastructure team to build and maintain CI/CD pipelines, manage cloud resources, and automate deployments for our cloud-native platform.',
    responsibilities: '- Set up and maintain GitHub Actions CI/CD pipelines\n- Manage AWS EC2, S3, and RDS resources\n- Dockerize applications and manage Kubernetes clusters\n- Monitor system health and respond to incidents',
    requiredSkills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Kubernetes'],
    stipendMin: 20000, stipendMax: 30000,
    applicationDeadline: future(40), status: 'open',
  },
  {
    recruiterId: recruiters[2]._id,
    title: 'Cloud Infrastructure Intern',
    companyName: 'CloudNine Technologies',
    location: 'Remote',
    isRemote: true,
    type: 'internship',
    description: 'Work on cloud infrastructure automation using Terraform and AWS. Help migrate legacy systems to cloud-native architecture.',
    responsibilities: '- Write Terraform scripts for infrastructure provisioning\n- Manage AWS services (EC2, Lambda, RDS, S3)\n- Implement security best practices\n- Document infrastructure changes',
    requiredSkills: ['AWS', 'Terraform', 'Linux', 'Docker'],
    stipendMin: 18000, stipendMax: 25000,
    applicationDeadline: future(50), status: 'open',
  },
  // FinEdge Fintech (recruiters[3])
  {
    recruiterId: recruiters[3]._id,
    title: 'Backend Engineer Intern',
    companyName: 'FinEdge Fintech',
    location: 'Mumbai',
    isRemote: false,
    type: 'internship',
    description: 'Build payment APIs and financial services backend at one of India\'s fastest-growing fintech companies. Handle real transactions and learn production-grade backend development.',
    responsibilities: '- Build and maintain Java Spring Boot APIs\n- Integrate payment gateways (Razorpay, Paytm)\n- Write unit and integration tests\n- Optimize database queries',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    stipendMin: 25000, stipendMax: 40000,
    applicationDeadline: future(20), status: 'open',
  },
  {
    recruiterId: recruiters[3]._id,
    title: 'Mobile App Developer Intern',
    companyName: 'FinEdge Fintech',
    location: 'Mumbai',
    isRemote: false,
    type: 'internship',
    description: 'Build features for our React Native mobile app used by 500K+ users. Work on payment flows, notifications, and UX improvements.',
    responsibilities: '- Develop React Native features for iOS and Android\n- Integrate REST APIs\n- Write automated tests\n- Collaborate with UX designers',
    requiredSkills: ['React Native', 'JavaScript', 'REST APIs', 'Git'],
    stipendMin: 20000, stipendMax: 30000,
    applicationDeadline: future(30), status: 'open',
  },
  // GreenLeaf EdTech (recruiters[4])
  {
    recruiterId: recruiters[4]._id,
    title: 'Frontend Engineer Intern',
    companyName: 'GreenLeaf EdTech',
    location: 'Chennai',
    isRemote: false,
    type: 'internship',
    description: 'Build interactive learning experiences for our K-12 platform. Work on gamification features, quizzes, and student dashboards.',
    responsibilities: '- Build React components for learning modules\n- Implement animations and interactive elements\n- Optimize for mobile devices\n- A/B test UI changes',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'Figma'],
    stipendMin: 12000, stipendMax: 20000,
    applicationDeadline: future(35), status: 'open',
  },
  {
    recruiterId: recruiters[4]._id,
    title: 'Content & Tech Intern',
    companyName: 'GreenLeaf EdTech',
    location: 'Remote',
    isRemote: true,
    type: 'internship',
    description: 'Create technical content and help build our curriculum platform. Ideal for students who love both coding and teaching.',
    responsibilities: '- Create coding exercises and quizzes\n- Build content management tools\n- Write technical documentation\n- Test learning modules',
    requiredSkills: ['JavaScript', 'Python', 'Communication', 'Teamwork'],
    stipendMin: 8000, stipendMax: 12000,
    applicationDeadline: future(60), status: 'open',
  },
];


// ── Skill Nodes per Student ───────────────────────────────────────────────────
const buildSkillNodes = (students) => {
  const nodes = [];
  // Arjun — Frontend Dev
  const arjunNodes = [
    { name: 'HTML', category: 'technical', status: 'verified', level: 3, goalTag: 'frontend_dev', positionX: 100, positionY: 50 },
    { name: 'CSS', category: 'technical', status: 'verified', level: 3, goalTag: 'frontend_dev', positionX: 300, positionY: 50 },
    { name: 'JavaScript', category: 'technical', status: 'verified', level: 3, goalTag: 'frontend_dev', positionX: 200, positionY: 150 },
    { name: 'React', category: 'technical', status: 'in_progress', level: 2, goalTag: 'frontend_dev', positionX: 100, positionY: 250 },
    { name: 'TypeScript', category: 'technical', status: 'in_progress', level: 2, goalTag: 'frontend_dev', positionX: 300, positionY: 250 },
    { name: 'Git', category: 'tool', status: 'verified', level: 2, goalTag: 'frontend_dev', positionX: 500, positionY: 150 },
    { name: 'Webpack', category: 'tool', status: 'to_learn', level: 0, goalTag: 'frontend_dev', positionX: 500, positionY: 300 },
  ];
  arjunNodes.forEach(n => nodes.push({ ...n, userId: students[0]._id }));

  // Priya — Full Stack
  const priyaNodes = [
    { name: 'React', category: 'technical', status: 'verified', level: 3, goalTag: 'fullstack_dev', positionX: 100, positionY: 50 },
    { name: 'Node.js', category: 'technical', status: 'in_progress', level: 2, goalTag: 'fullstack_dev', positionX: 300, positionY: 50 },
    { name: 'MongoDB', category: 'technical', status: 'in_progress', level: 2, goalTag: 'fullstack_dev', positionX: 200, positionY: 200 },
    { name: 'Express.js', category: 'technical', status: 'in_progress', level: 2, goalTag: 'fullstack_dev', positionX: 400, positionY: 200 },
    { name: 'Docker', category: 'tool', status: 'to_learn', level: 0, goalTag: 'fullstack_dev', positionX: 100, positionY: 350 },
    { name: 'REST APIs', category: 'technical', status: 'verified', level: 3, goalTag: 'fullstack_dev', positionX: 300, positionY: 350 },
  ];
  priyaNodes.forEach(n => nodes.push({ ...n, userId: students[1]._id }));

  // Rahul — Data Analyst
  const rahulNodes = [
    { name: 'Python', category: 'technical', status: 'verified', level: 3, goalTag: 'data_analyst', positionX: 100, positionY: 50 },
    { name: 'SQL', category: 'technical', status: 'verified', level: 3, goalTag: 'data_analyst', positionX: 300, positionY: 50 },
    { name: 'Pandas', category: 'technical', status: 'in_progress', level: 2, goalTag: 'data_analyst', positionX: 100, positionY: 200 },
    { name: 'Tableau', category: 'tool', status: 'in_progress', level: 1, goalTag: 'data_analyst', positionX: 300, positionY: 200 },
    { name: 'Statistics', category: 'domain', status: 'in_progress', level: 2, goalTag: 'data_analyst', positionX: 200, positionY: 350 },
    { name: 'Machine Learning', category: 'technical', status: 'to_learn', level: 0, goalTag: 'data_analyst', positionX: 400, positionY: 350 },
  ];
  rahulNodes.forEach(n => nodes.push({ ...n, userId: students[2]._id }));

  // Sneha — Backend
  const snehaNodes = [
    { name: 'Java', category: 'technical', status: 'verified', level: 3, goalTag: 'backend_dev', positionX: 100, positionY: 50 },
    { name: 'Spring Boot', category: 'technical', status: 'verified', level: 3, goalTag: 'backend_dev', positionX: 300, positionY: 50 },
    { name: 'MySQL', category: 'technical', status: 'in_progress', level: 2, goalTag: 'backend_dev', positionX: 200, positionY: 200 },
    { name: 'REST APIs', category: 'technical', status: 'verified', level: 3, goalTag: 'backend_dev', positionX: 400, positionY: 200 },
    { name: 'Microservices', category: 'technical', status: 'to_learn', level: 0, goalTag: 'backend_dev', positionX: 100, positionY: 350 },
    { name: 'Redis', category: 'tool', status: 'to_learn', level: 0, goalTag: 'backend_dev', positionX: 300, positionY: 350 },
  ];
  snehaNodes.forEach(n => nodes.push({ ...n, userId: students[3]._id }));

  // Mohit — DevOps
  const mohitNodes = [
    { name: 'Docker', category: 'tool', status: 'verified', level: 3, goalTag: 'devops_engineer', positionX: 100, positionY: 50 },
    { name: 'AWS', category: 'tool', status: 'verified', level: 3, goalTag: 'devops_engineer', positionX: 300, positionY: 50 },
    { name: 'Linux', category: 'technical', status: 'verified', level: 3, goalTag: 'devops_engineer', positionX: 200, positionY: 200 },
    { name: 'Kubernetes', category: 'tool', status: 'in_progress', level: 1, goalTag: 'devops_engineer', positionX: 100, positionY: 350 },
    { name: 'Terraform', category: 'tool', status: 'to_learn', level: 0, goalTag: 'devops_engineer', positionX: 300, positionY: 350 },
    { name: 'CI/CD', category: 'technical', status: 'in_progress', level: 2, goalTag: 'devops_engineer', positionX: 500, positionY: 200 },
  ];
  mohitNodes.forEach(n => nodes.push({ ...n, userId: students[4]._id }));

  return nodes;
};


// ── Evidence Cards per Student ────────────────────────────────────────────────
const buildEvidenceCards = (students, mentors) => [
  // Arjun — 3 cards
  {
    userId: students[0]._id,
    title: 'E-Commerce Admin Dashboard',
    type: 'project',
    description: 'Built a full-stack e-commerce admin dashboard with React and Node.js. Features include real-time order tracking, inventory management, and sales analytics with Chart.js. Deployed on Vercel + Railway.',
    skills: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'TypeScript'],
    links: [{ label: 'GitHub', url: 'https://github.com/arjun-sharma-dev/ecommerce-dashboard' }, { label: 'Live Demo', url: 'https://ecommerce-admin-arjun.vercel.app' }],
    feedback: [{ fromUserId: mentors[0]._id, rating: 5, comment: 'Excellent project structure and clean code. The Chart.js integration is well done.' }],
  },
  {
    userId: students[0]._id,
    title: 'React Fundamentals — Udemy Course',
    type: 'course',
    description: 'Completed the "React — The Complete Guide" course by Maximilian Schwarzmüller on Udemy. Covered hooks, context, Redux, React Router, and performance optimization.',
    skills: ['React', 'JavaScript', 'Redux', 'React Router'],
    links: [{ label: 'Certificate', url: 'https://udemy.com/certificate/arjun-react-2024' }],
    feedback: [],
  },
  {
    userId: students[0]._id,
    title: 'Smart India Hackathon 2024 — Finalist',
    type: 'hackathon',
    description: 'Built a grievance management portal for government departments in 36 hours. Used React frontend, Node.js backend, and MongoDB. Reached national finals with 500+ teams.',
    skills: ['React', 'Node.js', 'MongoDB', 'Teamwork', 'Problem Solving'],
    links: [{ label: 'GitHub', url: 'https://github.com/arjun-sharma-dev/sih-2024' }, { label: 'Demo Video', url: 'https://youtube.com/watch?v=sih-arjun-demo' }],
    feedback: [{ fromUserId: mentors[0]._id, rating: 4, comment: 'Great problem-solving approach. The UI is clean and the backend is well-structured.' }],
  },
  // Priya — 3 cards
  {
    userId: students[1]._id,
    title: 'College Library Management System',
    type: 'project',
    description: 'Full-stack library management system for DAIICT. Features: book catalog, issue/return tracking, fine calculation, and student portal. Used MERN stack with JWT authentication.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    links: [{ label: 'GitHub', url: 'https://github.com/priya-patel-dev/library-mgmt' }, { label: 'Live Demo', url: 'https://library-daiict.netlify.app' }],
    feedback: [{ fromUserId: mentors[0]._id, rating: 5, comment: 'Production-quality code. The authentication flow is secure and well-implemented.' }],
  },
  {
    userId: students[1]._id,
    title: 'Zeta Suite Internship — API Development',
    type: 'internship_task',
    description: 'During my internship at Zeta Suite, I built 12 REST API endpoints for the admin panel. Implemented pagination, filtering, and role-based access control. Reduced API response time by 40% through query optimization.',
    skills: ['Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
    links: [{ label: 'Internship Certificate', url: 'https://example.com/cert/priya-zeta' }],
    feedback: [],
  },
  {
    userId: students[1]._id,
    title: 'Docker & Kubernetes Fundamentals',
    type: 'course',
    description: 'Completed "Docker and Kubernetes: The Complete Guide" on Udemy. Learned containerization, orchestration, and deploying Node.js apps to Kubernetes clusters.',
    skills: ['Docker', 'Kubernetes', 'Node.js'],
    links: [{ label: 'Certificate', url: 'https://udemy.com/certificate/priya-docker-k8s' }],
    feedback: [],
  },
  // Rahul — 3 cards
  {
    userId: students[2]._id,
    title: 'Sales Data Analysis — FinEdge Project',
    type: 'internship_task',
    description: 'Analyzed 500K+ rows of sales data for FinEdge Analytics. Cleaned data using Pandas, performed EDA, and built a Tableau dashboard showing regional sales trends. Insights led to 15% improvement in sales strategy.',
    skills: ['Python', 'Pandas', 'Tableau', 'SQL', 'Excel'],
    links: [{ label: 'GitHub', url: 'https://github.com/rahul-verma-data/finedge-analysis' }, { label: 'Dashboard', url: 'https://public.tableau.com/rahul-finedge' }],
    feedback: [{ fromUserId: mentors[1]._id, rating: 5, comment: 'Excellent data cleaning methodology. The Tableau dashboard is very insightful.' }],
  },
  {
    userId: students[2]._id,
    title: 'Kaggle — House Price Prediction',
    type: 'project',
    description: 'Participated in Kaggle House Prices competition. Used feature engineering, XGBoost, and ensemble methods. Achieved top 15% ranking. Documented the entire ML pipeline.',
    skills: ['Python', 'Machine Learning', 'Pandas', 'scikit-learn', 'Statistics'],
    links: [{ label: 'Kaggle Notebook', url: 'https://kaggle.com/rahulverma/house-prices' }, { label: 'GitHub', url: 'https://github.com/rahul-verma-data/house-prices' }],
    feedback: [],
  },
  {
    userId: students[2]._id,
    title: 'SQL for Data Analysis — Coursera',
    type: 'course',
    description: 'Completed "SQL for Data Science" on Coursera by UC Davis. Covered advanced SQL, window functions, CTEs, and query optimization. Applied skills to real-world datasets.',
    skills: ['SQL', 'Data Analysis'],
    links: [{ label: 'Certificate', url: 'https://coursera.org/verify/rahul-sql-2024' }],
    feedback: [],
  },
  // Sneha — 3 cards
  {
    userId: students[3]._id,
    title: 'Payment Gateway API — PayQuick Internship',
    type: 'internship_task',
    description: 'Built a payment gateway integration API at PayQuick Fintech using Spring Boot. Integrated Razorpay and handled 10K+ daily transactions. Implemented idempotency keys to prevent duplicate payments.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    links: [{ label: 'Internship Certificate', url: 'https://example.com/cert/sneha-payquick' }],
    feedback: [{ fromUserId: mentors[4]._id, rating: 5, comment: 'Excellent understanding of payment systems. The idempotency implementation is production-ready.' }],
  },
  {
    userId: students[3]._id,
    title: 'Student Result Management System',
    type: 'project',
    description: 'Built a result management system for VIT Vellore using Java Spring Boot and MySQL. Features: grade calculation, transcript generation, and faculty portal. Used by 200+ students.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf'],
    links: [{ label: 'GitHub', url: 'https://github.com/sneha-iyer-dev/result-mgmt' }],
    feedback: [],
  },
  {
    userId: students[3]._id,
    title: 'Microservices Architecture — Udemy',
    type: 'course',
    description: 'Completed "Microservices with Spring Boot and Spring Cloud" on Udemy. Built a sample e-commerce microservices application with service discovery, API gateway, and circuit breakers.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    links: [{ label: 'Certificate', url: 'https://udemy.com/certificate/sneha-microservices' }],
    feedback: [],
  },
  // Mohit — 3 cards
  {
    userId: students[4]._id,
    title: 'CI/CD Pipeline for Open Source Project',
    type: 'project',
    description: 'Set up a complete CI/CD pipeline for an open-source Node.js project using GitHub Actions. Includes automated testing, Docker build, and deployment to AWS EC2. Reduced deployment time from 30 min to 5 min.',
    skills: ['Docker', 'AWS', 'GitHub Actions', 'CI/CD', 'Linux'],
    links: [{ label: 'GitHub', url: 'https://github.com/mohit-gupta-devops/cicd-pipeline' }, { label: 'Blog Post', url: 'https://mohit-gupta.hashnode.dev/cicd-github-actions' }],
    feedback: [{ fromUserId: mentors[2]._id, rating: 5, comment: 'Very well-structured pipeline. The rollback mechanism is a nice touch.' }],
  },
  {
    userId: students[4]._id,
    title: 'AWS Cloud Practitioner Certification',
    type: 'course',
    description: 'Passed the AWS Certified Cloud Practitioner exam (CLF-C02). Covered core AWS services, pricing, security, and architecture best practices. Score: 847/1000.',
    skills: ['AWS', 'Cloud Computing'],
    links: [{ label: 'AWS Certificate', url: 'https://aws.amazon.com/verification/mohit-aws-cert' }],
    feedback: [],
  },
  {
    userId: students[4]._id,
    title: 'Kubernetes Cluster Setup — CloudNine Internship',
    type: 'internship_task',
    description: 'Set up a production Kubernetes cluster on AWS EKS during my internship at CloudNine Solutions. Deployed 5 microservices, configured auto-scaling, and implemented health checks.',
    skills: ['Kubernetes', 'AWS', 'Docker', 'Linux'],
    links: [{ label: 'Internship Certificate', url: 'https://example.com/cert/mohit-cloudnine' }],
    feedback: [{ fromUserId: mentors[2]._id, rating: 4, comment: 'Good understanding of Kubernetes concepts. The auto-scaling configuration is well done.' }],
  },
];


// ── Applications (20+) ────────────────────────────────────────────────────────
const buildApplications = (students, jobs) => [
  // Arjun applies to 5 jobs
  { studentId: students[0]._id, jobId: jobs[0]._id, status: 'interview', coverMessage: 'I have 2 years of React experience and built 3 production apps. Excited to contribute to NovaSoft\'s SaaS platform.', recruiterNote: 'Strong React skills. Good communication.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }, { status: 'interview' }] },
  { studentId: students[0]._id, jobId: jobs[1]._id, status: 'shortlisted', coverMessage: 'Full stack experience with MERN. Built a library management system used by 200+ students.', recruiterNote: '', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }] },
  { studentId: students[0]._id, jobId: jobs[8]._id, status: 'applied', coverMessage: 'Passionate about EdTech. Would love to build interactive learning experiences.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
  { studentId: students[0]._id, jobId: jobs[6]._id, status: 'rejected', coverMessage: 'Interested in backend development as well.', recruiterNote: 'Not a fit for backend role.', stageHistory: [{ status: 'applied' }, { status: 'rejected' }] },
  { studentId: students[0]._id, jobId: jobs[9]._id, status: 'applied', coverMessage: 'I enjoy both coding and teaching. Would love to create content.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },

  // Priya applies to 5 jobs
  { studentId: students[1]._id, jobId: jobs[1]._id, status: 'offer', coverMessage: 'MERN stack developer with internship experience at Zeta Suite. Built 12 REST APIs in production.', recruiterNote: 'Excellent candidate. Offer extended.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }, { status: 'interview' }, { status: 'offer' }] },
  { studentId: students[1]._id, jobId: jobs[0]._id, status: 'test', coverMessage: 'Strong React skills with TypeScript. Passionate about clean UI.', recruiterNote: 'Good frontend skills.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }] },
  { studentId: students[1]._id, jobId: jobs[4]._id, status: 'applied', coverMessage: 'Interested in DevOps. Have basic Docker knowledge.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
  { studentId: students[1]._id, jobId: jobs[6]._id, status: 'shortlisted', coverMessage: 'Backend experience with Node.js and Spring Boot basics.', recruiterNote: 'Decent backend skills.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }] },
  { studentId: students[1]._id, jobId: jobs[8]._id, status: 'applied', coverMessage: 'Love EdTech. Would enjoy building learning features.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },

  // Rahul applies to 4 jobs
  { studentId: students[2]._id, jobId: jobs[2]._id, status: 'interview', coverMessage: 'Data analyst with Python, SQL, and Tableau experience. Analyzed 500K+ row datasets at FinEdge.', recruiterNote: 'Strong data skills. Good Tableau experience.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }, { status: 'interview' }] },
  { studentId: students[2]._id, jobId: jobs[3]._id, status: 'shortlisted', coverMessage: 'Interested in ML. Completed Kaggle competition with top 15% ranking.', recruiterNote: 'Good ML fundamentals.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }] },
  { studentId: students[2]._id, jobId: jobs[9]._id, status: 'applied', coverMessage: 'Python skills can help with content creation tools.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
  { studentId: students[2]._id, jobId: jobs[5]._id, status: 'rejected', coverMessage: 'Interested in cloud infrastructure.', recruiterNote: 'Not enough cloud experience.', stageHistory: [{ status: 'applied' }, { status: 'rejected' }] },

  // Sneha applies to 4 jobs
  { studentId: students[3]._id, jobId: jobs[6]._id, status: 'offer', coverMessage: 'Java Spring Boot developer with payment API experience at PayQuick. Handled 10K+ daily transactions.', recruiterNote: 'Perfect fit. Offer extended.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }, { status: 'interview' }, { status: 'offer' }] },
  { studentId: students[3]._id, jobId: jobs[1]._id, status: 'shortlisted', coverMessage: 'Full stack skills with Java backend and some React frontend.', recruiterNote: 'Good backend skills.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }] },
  { studentId: students[3]._id, jobId: jobs[7]._id, status: 'applied', coverMessage: 'Interested in mobile development. Have JavaScript experience.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
  { studentId: students[3]._id, jobId: jobs[3]._id, status: 'applied', coverMessage: 'Interested in ML as a backend engineer.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },

  // Mohit applies to 4 jobs
  { studentId: students[4]._id, jobId: jobs[4]._id, status: 'interview', coverMessage: 'DevOps intern with AWS, Docker, and Kubernetes experience. Set up CI/CD pipelines for 3 projects.', recruiterNote: 'Strong DevOps skills. AWS certified.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }, { status: 'test' }, { status: 'interview' }] },
  { studentId: students[4]._id, jobId: jobs[5]._id, status: 'shortlisted', coverMessage: 'AWS certified with Terraform experience. Interested in cloud infrastructure.', recruiterNote: 'Good cloud skills.', stageHistory: [{ status: 'applied' }, { status: 'shortlisted' }] },
  { studentId: students[4]._id, jobId: jobs[1]._id, status: 'applied', coverMessage: 'Full stack interest alongside DevOps.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
  { studentId: students[4]._id, jobId: jobs[9]._id, status: 'applied', coverMessage: 'Can help with technical content on DevOps topics.', recruiterNote: '', stageHistory: [{ status: 'applied' }] },
];


// ── OQI Reviews ───────────────────────────────────────────────────────────────
const buildReviews = (students, jobs) => [
  // Job 0 (Frontend Intern NovaSoft) — high OQI
  { jobId: jobs[0]._id, studentId: students[0]._id, ratings: { learning: 5, support: 5, clarity: 4, fairness: 5 }, overallRating: 5, comment: 'Amazing learning experience. Mentors were very supportive and the work was meaningful.' },
  // Job 2 (Data Analyst DataPulse) — medium OQI
  { jobId: jobs[2]._id, studentId: students[2]._id, ratings: { learning: 3, support: 3, clarity: 4, fairness: 3 }, overallRating: 3, comment: 'Decent internship. Work was repetitive but learned SQL well. Stipend was paid on time.' },
  // Job 6 (Backend FinEdge) — high OQI
  { jobId: jobs[6]._id, studentId: students[3]._id, ratings: { learning: 5, support: 4, clarity: 5, fairness: 5 }, overallRating: 5, comment: 'Best internship experience. Real production work, great mentors, and excellent stipend.' },
  // Job 4 (DevOps CloudNine) — low OQI
  { jobId: jobs[4]._id, studentId: students[4]._id, ratings: { learning: 2, support: 1, clarity: 2, fairness: 2 }, overallRating: 2, comment: 'Disappointing. No proper mentorship. Tasks were unclear and stipend was delayed by 2 months.' },
];

// ── Mentor Offers ─────────────────────────────────────────────────────────────
const buildMentorOffers = (mentors) => [
  // Vikram — 2 offers
  { mentorId: mentors[0]._id, title: 'Full Stack Interview Prep (4 Weeks)', description: 'Intensive 4-week program covering DSA, system design, React/Node.js projects, and mock interviews. Designed for students targeting product companies like Google, Flipkart, and Swiggy.', format: 'weekly', capacity: 3, durationWeeks: 4, skillsCovered: ['React', 'Node.js', 'System Design', 'DSA', 'MongoDB'], targetAudience: 'Final year CS/IT students targeting product companies', isFree: false, price: 0, isActive: true },
  { mentorId: mentors[0]._id, title: 'Resume & Profile Review (1 Session)', description: 'One-time 60-minute session to review your resume, LinkedIn/PathPort profile, and GitHub. Get actionable feedback to stand out to recruiters.', format: 'one_time', capacity: 10, durationWeeks: 0, skillsCovered: ['Resume Writing', 'Personal Branding', 'GitHub'], targetAudience: 'Any student looking for internships or jobs', isFree: true, price: 0, isActive: true },
  // Meera — 2 offers
  { mentorId: mentors[1]._id, title: 'Data Science Bootcamp (6 Weeks)', description: 'From Python basics to ML models. Covers Pandas, SQL, visualization, and building your first ML project. Includes Kaggle competition guidance.', format: 'weekly', capacity: 4, durationWeeks: 6, skillsCovered: ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Tableau'], targetAudience: 'Students pivoting to data science from any engineering background', isFree: false, price: 0, isActive: true },
  { mentorId: mentors[1]._id, title: 'SQL Masterclass (2 Sessions)', description: 'Deep dive into advanced SQL — window functions, CTEs, query optimization, and real-world data analysis problems.', format: 'one_time', capacity: 5, durationWeeks: 0, skillsCovered: ['SQL', 'Data Analysis'], targetAudience: 'Students preparing for data analyst interviews', isFree: true, price: 0, isActive: true },
  // Suresh — 2 offers
  { mentorId: mentors[2]._id, title: 'AWS Certification Prep (4 Weeks)', description: 'Structured program to help you pass the AWS Cloud Practitioner or Solutions Architect exam. Includes hands-on labs and practice tests.', format: 'weekly', capacity: 5, durationWeeks: 4, skillsCovered: ['AWS', 'Cloud Computing', 'Linux'], targetAudience: 'Students interested in cloud and DevOps careers', isFree: false, price: 0, isActive: true },
  { mentorId: mentors[2]._id, title: 'Docker & Kubernetes Workshop', description: 'Hands-on workshop covering Docker containerization and Kubernetes orchestration. Build and deploy a real microservices application.', format: 'pod', capacity: 6, durationWeeks: 2, skillsCovered: ['Docker', 'Kubernetes', 'DevOps'], targetAudience: 'Students with basic Linux knowledge', isFree: true, price: 0, isActive: true },
  // Pooja — 2 offers
  { mentorId: mentors[3]._id, title: 'Product Management Crash Course', description: 'Learn product thinking, user research, and how to crack PM interviews. Includes mock PM interviews and product case studies.', format: 'weekly', capacity: 3, durationWeeks: 3, skillsCovered: ['Product Management', 'UX Research', 'Product Strategy'], targetAudience: 'Engineering students transitioning to product roles', isFree: false, price: 0, isActive: true },
  { mentorId: mentors[3]._id, title: 'Career Pivot Guidance (1 Session)', description: 'One-on-one session to discuss your career transition plan, identify skill gaps, and create a 90-day action plan.', format: 'one_time', capacity: 8, durationWeeks: 0, skillsCovered: ['Career Guidance', 'Personal Branding'], targetAudience: 'Any student unsure about their career direction', isFree: true, price: 0, isActive: true },
  // Arjun Kapoor — 2 offers
  { mentorId: mentors[4]._id, title: 'Backend Architecture Deep Dive (5 Weeks)', description: 'Go deep on backend engineering — REST APIs, microservices, Kafka, caching, and system design. Build a production-grade backend project.', format: 'weekly', capacity: 3, durationWeeks: 5, skillsCovered: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'System Design'], targetAudience: 'Students with basic Java/backend knowledge', isFree: false, price: 0, isActive: true },
  { mentorId: mentors[4]._id, title: 'Java Interview Prep (3 Sessions)', description: 'Focused preparation for Java backend interviews. Covers core Java, Spring Boot, design patterns, and system design questions.', format: 'one_time', capacity: 5, durationWeeks: 0, skillsCovered: ['Java', 'Spring Boot', 'Design Patterns'], targetAudience: 'Students targeting backend roles at product companies', isFree: true, price: 0, isActive: true },
];

// ── Mentor Sessions ───────────────────────────────────────────────────────────
const buildMentorSessions = (mentors, students, offers) => [
  { mentorId: mentors[0]._id, studentId: students[0]._id, offerId: offers[0]._id, topic: 'React performance optimization and interview prep', requestedTimeSlots: ['Saturday 3-4 PM IST', 'Sunday 10-11 AM IST'], acceptedTime: 'Saturday 3-4 PM IST', status: 'completed', notes: 'Covered React.memo, useMemo, useCallback. Mock interview done.', meetingLink: 'https://meet.google.com/abc-defg-hij' },
  { mentorId: mentors[0]._id, studentId: students[1]._id, offerId: offers[1]._id, topic: 'Resume review and profile optimization', requestedTimeSlots: ['Sunday 2-3 PM IST'], acceptedTime: 'Sunday 2-3 PM IST', status: 'completed', notes: 'Reviewed resume. Suggested adding quantified achievements.', meetingLink: 'https://meet.google.com/klm-nopq-rst' },
  { mentorId: mentors[1]._id, studentId: students[2]._id, offerId: offers[2]._id, topic: 'Data cleaning techniques and Pandas best practices', requestedTimeSlots: ['Saturday 11 AM-12 PM IST'], acceptedTime: 'Saturday 11 AM-12 PM IST', status: 'accepted', notes: '', meetingLink: 'https://meet.google.com/uvw-xyz-123' },
  { mentorId: mentors[2]._id, studentId: students[4]._id, offerId: offers[4]._id, topic: 'AWS certification exam strategy and practice questions', requestedTimeSlots: ['Friday 6-7 PM IST', 'Saturday 5-6 PM IST'], acceptedTime: '', status: 'requested', notes: '', meetingLink: '' },
  { mentorId: mentors[4]._id, studentId: students[3]._id, offerId: offers[8]._id, topic: 'Microservices architecture and Spring Boot best practices', requestedTimeSlots: ['Sunday 4-5 PM IST'], acceptedTime: 'Sunday 4-5 PM IST', status: 'completed', notes: 'Covered service discovery, circuit breakers, and API gateway patterns.', meetingLink: 'https://meet.google.com/456-789-abc' },
  { mentorId: mentors[3]._id, studentId: students[1]._id, offerId: offers[7]._id, topic: 'Career pivot from engineering to product management', requestedTimeSlots: ['Saturday 2-3 PM IST'], acceptedTime: '', status: 'requested', notes: '', meetingLink: '' },
];

// ── Mentor Reviews ────────────────────────────────────────────────────────────
const buildMentorReviews = (sessions, mentors, students) => [
  { sessionId: sessions[0]._id, mentorId: mentors[0]._id, studentId: students[0]._id, reviewerRole: 'student', rating: 5, comment: 'Vikram is an amazing mentor. The mock interview was very realistic and the feedback was actionable.' },
  { sessionId: sessions[0]._id, mentorId: mentors[0]._id, studentId: students[0]._id, reviewerRole: 'mentor', rating: 5, comment: 'Arjun is a dedicated student. He implemented all the feedback within a week.' },
  { sessionId: sessions[1]._id, mentorId: mentors[0]._id, studentId: students[1]._id, reviewerRole: 'student', rating: 5, comment: 'The resume review was incredibly helpful. Got 3 interview calls after implementing the suggestions.' },
  { sessionId: sessions[4]._id, mentorId: mentors[4]._id, studentId: students[3]._id, reviewerRole: 'student', rating: 5, comment: 'Arjun Kapoor explained microservices concepts very clearly. The hands-on examples were great.' },
  { sessionId: sessions[4]._id, mentorId: mentors[4]._id, studentId: students[3]._id, reviewerRole: 'mentor', rating: 4, comment: 'Sneha has strong Java fundamentals. Needs to work on distributed systems concepts.' },
];

// ── Journal Entries ───────────────────────────────────────────────────────────
const buildJournalEntries = (students) => [
  { userId: students[0]._id, title: 'First React project deployed!', content: 'Finally deployed my e-commerce dashboard to Vercel. It took 3 weeks but I learned so much about React performance, state management, and deployment. The Chart.js integration was tricky but worth it.', tags: ['React', 'milestone', 'deployment'], mood: 'great', visibility: 'public' },
  { userId: students[0]._id, title: 'Interview prep — Week 1 reflection', content: 'Started interview prep with Vikram. The mock interview was humbling — I realized I need to work on explaining my thought process clearly. Going to practice more DSA problems this week.', tags: ['interview', 'learning', 'DSA'], mood: 'good', visibility: 'private' },
  { userId: students[1]._id, title: 'Got an offer from NovaSoft!', content: 'Just received an offer letter from NovaSoft Labs for the Full Stack Intern role. Stipend is ₹25,000/month. So excited! All the hard work on the MERN stack paid off.', tags: ['offer', 'milestone', 'MERN'], mood: 'great', visibility: 'public' },
  { userId: students[2]._id, title: 'Kaggle competition — top 15%!', content: 'Finished the House Prices competition in the top 15%. The key was feature engineering — creating interaction features between neighborhood and quality scores. Learned a lot about XGBoost tuning.', tags: ['Kaggle', 'ML', 'achievement'], mood: 'great', visibility: 'public' },
  { userId: students[3]._id, title: 'Microservices session with Arjun Kapoor', content: 'Had an amazing session on microservices architecture. The circuit breaker pattern finally clicked for me. Going to implement it in my Spring Boot project this weekend.', tags: ['microservices', 'Java', 'learning'], mood: 'good', visibility: 'private' },
  { userId: students[4]._id, title: 'AWS certification passed!', content: 'Passed the AWS Cloud Practitioner exam with a score of 847/1000. The practice tests from Suresh\'s program were very helpful. Next goal: Solutions Architect Associate.', tags: ['AWS', 'certification', 'milestone'], mood: 'great', visibility: 'public' },
];

// ── Connections ───────────────────────────────────────────────────────────────
const buildConnections = (students, mentors) => [
  { requesterId: students[0]._id, recipientId: mentors[0]._id, status: 'accepted' },
  { requesterId: students[1]._id, recipientId: mentors[0]._id, status: 'accepted' },
  { requesterId: students[2]._id, recipientId: mentors[1]._id, status: 'accepted' },
  { requesterId: students[3]._id, recipientId: mentors[4]._id, status: 'accepted' },
  { requesterId: students[4]._id, recipientId: mentors[2]._id, status: 'accepted' },
  { requesterId: students[0]._id, recipientId: students[1]._id, status: 'accepted' },
  { requesterId: students[1]._id, recipientId: students[2]._id, status: 'pending' },
  { requesterId: students[3]._id, recipientId: students[0]._id, status: 'pending' },
];


// ── calculateOQI utility (inline for seed) ────────────────────────────────────
const calculateOQI = (reviews) => {
  if (!reviews || reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => {
    const avg = (r.ratings.learning + r.ratings.support + r.ratings.clarity + r.ratings.fairness) / 4;
    return sum + avg;
  }, 0);
  const avgRating = total / reviews.length;
  return Math.round(((avgRating - 1) / 4) * 100);
};

// ── Main Seed Function ────────────────────────────────────────────────────────
const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ Connected to MongoDB\n');

  // ── Clear existing demo data ──────────────────────────────────────────────
  const demoEmails = [
    'arjun.sharma@demo.com', 'priya.patel@demo.com', 'rahul.verma@demo.com',
    'sneha.iyer@demo.com', 'mohit.gupta@demo.com',
    'recruiter1@demo.com', 'recruiter2@demo.com', 'recruiter3@demo.com',
    'recruiter4@demo.com', 'recruiter5@demo.com',
    'mentor1@demo.com', 'mentor2@demo.com', 'mentor3@demo.com',
    'mentor4@demo.com', 'mentor5@demo.com',
  ];

  const existingUsers = await User.find({ email: { $in: demoEmails } });
  const existingUserIds = existingUsers.map(u => u._id);

  if (existingUserIds.length > 0) {
    await Promise.all([
      User.deleteMany({ email: { $in: demoEmails } }),
      Job.deleteMany({ recruiterId: { $in: existingUserIds } }),
      Application.deleteMany({ studentId: { $in: existingUserIds } }),
      SkillNode.deleteMany({ userId: { $in: existingUserIds } }),
      EvidenceCard.deleteMany({ userId: { $in: existingUserIds } }),
      JournalEntry.deleteMany({ userId: { $in: existingUserIds } }),
      MentorOffer.deleteMany({ mentorId: { $in: existingUserIds } }),
      MentorSession.deleteMany({ mentorId: { $in: existingUserIds } }),
      MentorReview.deleteMany({ mentorId: { $in: existingUserIds } }),
      Connection.deleteMany({ $or: [{ requesterId: { $in: existingUserIds } }, { recipientId: { $in: existingUserIds } }] }),
    ]);
    console.log('🗑️  Cleared existing demo data\n');
  }

  // ── Hash password ─────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Demo@1234', 12);

  // ── Create Students ───────────────────────────────────────────────────────
  const students = await User.insertMany(
    STUDENTS.map(s => ({ ...s, passwordHash }))
  );
  console.log(`👨‍🎓 Created ${students.length} students`);

  // ── Create Recruiters ─────────────────────────────────────────────────────
  const recruiters = await User.insertMany(
    RECRUITERS.map(r => ({ ...r, passwordHash }))
  );
  console.log(`🏢 Created ${recruiters.length} recruiters`);

  // ── Create Mentors ────────────────────────────────────────────────────────
  const mentors = await User.insertMany(
    MENTORS.map(m => ({ ...m, passwordHash }))
  );
  console.log(`🎓 Created ${mentors.length} mentors`);

  // ── Create Jobs ───────────────────────────────────────────────────────────
  const jobs = await Job.insertMany(buildJobs(recruiters));
  console.log(`💼 Created ${jobs.length} jobs`);

  // ── Create Skill Nodes ────────────────────────────────────────────────────
  const skillNodes = await SkillNode.insertMany(buildSkillNodes(students));
  console.log(`🗺️  Created ${skillNodes.length} skill nodes`);

  // ── Create Evidence Cards ─────────────────────────────────────────────────
  const evidenceCards = await EvidenceCard.insertMany(buildEvidenceCards(students, mentors));
  console.log(`📁 Created ${evidenceCards.length} evidence cards`);

  // ── Create Applications ───────────────────────────────────────────────────
  const appData = buildApplications(students, jobs);
  const applications = [];
  for (const app of appData) {
    try {
      const created = await Application.create(app);
      applications.push(created);
    } catch (e) {
      if (e.code !== 11000) throw e; // skip duplicate key errors
    }
  }
  console.log(`📝 Created ${applications.length} applications`);

  // ── Create OQI Reviews ────────────────────────────────────────────────────
  const reviewData = buildReviews(students, jobs);
  const reviews = [];
  for (const r of reviewData) {
    try {
      const created = await Review.create(r);
      reviews.push(created);
    } catch (e) {
      if (e.code !== 11000) throw e;
    }
  }
  // Update OQI scores on jobs
  const jobReviewMap = {};
  reviews.forEach(r => {
    if (!jobReviewMap[r.jobId]) jobReviewMap[r.jobId] = [];
    jobReviewMap[r.jobId].push(r);
  });
  for (const [jobId, jobReviews] of Object.entries(jobReviewMap)) {
    const oqi = calculateOQI(jobReviews);
    await Job.findByIdAndUpdate(jobId, { oqiScore: oqi });
  }
  console.log(`⭐ Created ${reviews.length} OQI reviews`);

  // ── Create Mentor Offers ──────────────────────────────────────────────────
  const offers = await MentorOffer.insertMany(buildMentorOffers(mentors));
  console.log(`🎯 Created ${offers.length} mentor offers`);

  // ── Create Mentor Sessions ────────────────────────────────────────────────
  const sessionData = buildMentorSessions(mentors, students, offers);
  const sessions = await MentorSession.insertMany(sessionData);
  console.log(`📅 Created ${sessions.length} mentor sessions`);

  // ── Create Mentor Reviews ─────────────────────────────────────────────────
  const mentorReviewData = buildMentorReviews(sessions, mentors, students);
  const mentorReviews = [];
  for (const mr of mentorReviewData) {
    try {
      const created = await MentorReview.create(mr);
      mentorReviews.push(created);
    } catch (e) {
      if (e.code !== 11000) throw e;
    }
  }
  // Update mentor ratings
  for (const mentor of mentors) {
    const studentReviews = await MentorReview.find({ mentorId: mentor._id, reviewerRole: 'student' });
    if (studentReviews.length > 0) {
      const avg = studentReviews.reduce((s, r) => s + r.rating, 0) / studentReviews.length;
      await User.findByIdAndUpdate(mentor._id, { 'mentorProfile.rating': Math.round(avg * 10) / 10 });
    }
  }
  console.log(`💬 Created ${mentorReviews.length} mentor reviews`);

  // ── Create Journal Entries ────────────────────────────────────────────────
  const journalEntries = await JournalEntry.insertMany(buildJournalEntries(students));
  console.log(`📔 Created ${journalEntries.length} journal entries`);

  // ── Create Connections ────────────────────────────────────────────────────
  const connectionData = buildConnections(students, mentors);
  const connections = [];
  for (const c of connectionData) {
    try {
      const created = await Connection.create(c);
      connections.push(created);
    } catch (e) {
      if (e.code !== 11000) throw e;
    }
  }
  console.log(`🤝 Created ${connections.length} connections`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED COMPLETE — PathPort Demo Data');
  console.log('='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Users:           ${students.length + recruiters.length + mentors.length} (${students.length} students, ${recruiters.length} recruiters, ${mentors.length} mentors)`);
  console.log(`   Jobs:            ${jobs.length}`);
  console.log(`   Applications:    ${applications.length}`);
  console.log(`   Skill Nodes:     ${skillNodes.length}`);
  console.log(`   Evidence Cards:  ${evidenceCards.length}`);
  console.log(`   OQI Reviews:     ${reviews.length}`);
  console.log(`   Mentor Offers:   ${offers.length}`);
  console.log(`   Mentor Sessions: ${sessions.length}`);
  console.log(`   Journal Entries: ${journalEntries.length}`);
  console.log(`   Connections:     ${connections.length}`);
  console.log('\n' + '='.repeat(60));
  console.log('🔑 DEMO ACCOUNTS (password for all: Demo@1234)');
  console.log('='.repeat(60));
  console.log('\n👨‍🎓 STUDENTS:');
  console.log('   arjun.sharma@demo.com  — Frontend Dev, 3rd year CSE, RVCE Bangalore');
  console.log('   priya.patel@demo.com   — Full Stack Dev, 4th year IT, DAIICT Gandhinagar');
  console.log('   rahul.verma@demo.com   — Data Analyst, ECE grad, NIT Trichy');
  console.log('   sneha.iyer@demo.com    — Backend Engineer, CSE, VIT Vellore');
  console.log('   mohit.gupta@demo.com   — DevOps/Cloud, MCA, IGNOU Delhi');
  console.log('\n🏢 RECRUITERS:');
  console.log('   recruiter1@demo.com    — Kavya Nair, NovaSoft Labs (Frontend + Full Stack roles)');
  console.log('   recruiter2@demo.com    — Rohan Mehta, DataPulse Analytics (Data + ML roles)');
  console.log('   recruiter3@demo.com    — Ananya Singh, CloudNine Technologies (DevOps + Cloud roles)');
  console.log('   recruiter4@demo.com    — Vikash Kumar, FinEdge Fintech (Backend + Mobile roles)');
  console.log('   recruiter5@demo.com    — Deepa Krishnan, GreenLeaf EdTech (Frontend + Content roles)');
  console.log('\n🎓 MENTORS:');
  console.log('   mentor1@demo.com       — Vikram Nair, Google SWE (Full Stack + System Design)');
  console.log('   mentor2@demo.com       — Meera Joshi, Amazon Data Scientist (Data Science + ML)');
  console.log('   mentor3@demo.com       — Suresh Babu, Infosys DevOps Lead (AWS + Kubernetes)');
  console.log('   mentor4@demo.com       — Pooja Agarwal, Swiggy PM (Product Management + UX)');
  console.log('   mentor5@demo.com       — Arjun Kapoor, Razorpay Backend Architect (Java + Microservices)');
  console.log('\n' + '='.repeat(60));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  if (err.message.includes('whitelist') || err.message.includes('ECONNREFUSED')) {
    console.error('\n⚠️  MongoDB connection failed. Fix:');
    console.error('   Atlas → Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)');
  }
  process.exit(1);
});
