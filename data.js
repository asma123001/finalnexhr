export const orgs = [
  { id: 'org1', name: 'Nimbus Retail Group', industry: 'Retail', plan: 'Growth', status: 'Active', employees: 412, activeEmployees: 388, joined: 'Jan 12, 2024', email: 'admin@nimbusretail.com', mrr: 1240, expiry: '14 Sep 2026', storageUsedGb: 4.1, storageLimitGb: 10, lastActivity: '12 min ago' },
  { id: 'org2', name: 'Fjord Logistics', industry: 'Logistics', plan: 'Enterprise', status: 'Active', employees: 1180, activeEmployees: 1140, joined: 'Mar 3, 2023', email: 'ops@fjordlogistics.com', mrr: 3600, expiry: '2 Dec 2026', storageUsedGb: 22.6, storageLimitGb: 50, lastActivity: '3 min ago' },
  { id: 'org3', name: 'Bramble & Co.', industry: 'Professional Services', plan: 'Starter', status: 'Trial', employees: 24, activeEmployees: 19, joined: 'Jul 2, 2026', email: 'hello@brambleco.com', mrr: 0, expiry: '2 Aug 2026', storageUsedGb: 0.6, storageLimitGb: 5, lastActivity: '2 hrs ago' },
  { id: 'org4', name: 'Solace Health', industry: 'Healthcare', plan: 'Growth', status: 'Active', employees: 640, activeEmployees: 601, joined: 'Sep 18, 2023', email: 'it@solacehealth.org', mrr: 1980, expiry: '20 Aug 2026', storageUsedGb: 7.8, storageLimitGb: 10, lastActivity: '48 min ago' },
  { id: 'org5', name: 'Ironwood Manufacturing', industry: 'Manufacturing', plan: 'Enterprise', status: 'Active', employees: 2210, activeEmployees: 2154, joined: 'Feb 27, 2022', email: 'admin@ironwoodmfg.com', mrr: 5400, expiry: '11 Jan 2027', storageUsedGb: 34.2, storageLimitGb: 50, lastActivity: 'Just now' },
  { id: 'org6', name: 'Lumen Studio', industry: 'Creative', plan: 'Starter', status: 'Suspended', employees: 18, activeEmployees: 0, joined: 'Nov 9, 2024', email: 'team@lumenstudio.co', mrr: 0, expiry: '9 Jul 2026', storageUsedGb: 0.9, storageLimitGb: 5, lastActivity: '9 days ago' },
  { id: 'org7', name: 'Pinehurst Financial', industry: 'Finance', plan: 'Growth', status: 'Active', employees: 305, activeEmployees: 292, joined: 'May 15, 2024', email: 'admin@pinehurstfin.com', mrr: 1240, expiry: '30 Sep 2026', storageUsedGb: 3.3, storageLimitGb: 10, lastActivity: '1 hr ago' },
  { id: 'org8', name: 'Coral Ridge Hospitality', industry: 'Hospitality', plan: 'Starter', status: 'Trial', employees: 56, activeEmployees: 41, joined: 'Jul 15, 2026', email: 'hr@coralridge.com', mrr: 0, expiry: '14 Aug 2026', storageUsedGb: 1.1, storageLimitGb: 5, lastActivity: '4 hrs ago' }
];

export const plans = [
  { name: 'Starter', price: '$29/mo', seats: 'Up to 50 employees', activeSubs: 214, features: ['Core HR', 'Attendance', 'Basic reports'] },
  { name: 'Growth', price: '$79/mo', seats: 'Up to 500 employees', activeSubs: 138, features: ['Everything in Starter', 'Payroll', 'Recruitment', 'Performance'] },
  { name: 'Enterprise', price: 'Custom', seats: 'Unlimited', activeSubs: 42, features: ['Everything in Growth', 'SSO & audit logs', 'Dedicated support'] }
];

export const saRecentActivity = [
  { id: 1, text: 'Ironwood Manufacturing upgraded to Enterprise', time: '12 min ago', type: 'billing' },
  { id: 2, text: 'Coral Ridge Hospitality submitted for approval', time: '1 hr ago', type: 'org' },
  { id: 3, text: 'Lumen Studio subscription suspended — payment failed', time: '3 hrs ago', type: 'alert' },
  { id: 4, text: 'New admin invited at Pinehurst Financial', time: 'Yesterday', type: 'user' },
  { id: 5, text: 'Bramble & Co. completed onboarding checklist', time: 'Yesterday', type: 'org' }
];

export const departments = [
  { id: 'd1', name: 'Engineering', code: 'ENG', description: 'Product engineering and platform infrastructure', head: 'Priya Nair', headId: 'e1', parentId: null, status: 'Active', count: 48 },
  { id: 'd2', name: 'Sales', code: 'SLS', description: 'New business and account management', head: 'Marcus Webb', headId: 'e2', parentId: null, status: 'Active', count: 32 },
  { id: 'd3', name: 'Customer Success', code: 'CS', description: 'Onboarding, support, and retention', head: 'Elena Ruiz', headId: 'e3', parentId: null, status: 'Active', count: 21 },
  { id: 'd4', name: 'Finance', code: 'FIN', description: 'Accounting, payroll, and financial planning', head: 'David Chen', headId: 'e4', parentId: null, status: 'Active', count: 12 },
  { id: 'd5', name: 'People Ops', code: 'PEO', description: 'HR operations, recruitment, and culture', head: 'Sara Kim', headId: 'e5', parentId: null, status: 'Active', count: 8 },
  { id: 'd6', name: 'Platform Engineering', code: 'ENG-PLT', description: 'Backend platform and infrastructure team', head: 'Owen Blake', headId: 'e6', parentId: 'd1', status: 'Active', count: 14 },
  { id: 'd7', name: 'Design', code: 'DSN', description: 'Product design and research', head: 'Nadia Farouk', headId: 'e7', parentId: 'd1', status: 'Inactive', count: 5 }
];

export const employees = [
  { id: 'e1', name: 'Priya Nair', initials: 'PN', dept: 'Engineering', title: 'VP Engineering', joined: 'Feb 2021', status: 'Active', email: 'priya.nair@nexhr.io', phone: '+1 415 555 0148' },
  { id: 'e2', name: 'Marcus Webb', initials: 'MW', dept: 'Sales', title: 'Sales Director', joined: 'Jun 2020', status: 'Active', email: 'marcus.webb@nexhr.io', phone: '+1 415 555 0122' },
  { id: 'e3', name: 'Elena Ruiz', initials: 'ER', dept: 'Customer Success', title: 'CS Lead', joined: 'Oct 2022', status: 'Active', email: 'elena.ruiz@nexhr.io', phone: '+1 415 555 0199' },
  { id: 'e4', name: 'David Chen', initials: 'DC', dept: 'Finance', title: 'Finance Manager', joined: 'Jan 2019', status: 'Active', email: 'david.chen@nexhr.io', phone: '+1 415 555 0110' },
  { id: 'e5', name: 'Sara Kim', initials: 'SK', dept: 'People Ops', title: 'HR Business Partner', joined: 'Mar 2023', status: 'On Leave', email: 'sara.kim@nexhr.io', phone: '+1 415 555 0177' },
  { id: 'e6', name: 'Owen Blake', initials: 'OB', dept: 'Engineering', title: 'Backend Engineer', joined: 'Aug 2023', status: 'Active', email: 'owen.blake@nexhr.io', phone: '+1 415 555 0163' },
  { id: 'e7', name: 'Nadia Farouk', initials: 'NF', dept: 'Engineering', title: 'Product Designer', joined: 'May 2022', status: 'Active', email: 'nadia.farouk@nexhr.io', phone: '+1 415 555 0134' },
  { id: 'e8', name: 'Tom Reilly', initials: 'TR', dept: 'Sales', title: 'Account Executive', joined: 'Nov 2023', status: 'Inactive', email: 'tom.reilly@nexhr.io', phone: '+1 415 555 0188' }
];

export const attendanceToday = [
  { id: 'e1', name: 'Priya Nair', initials: 'PN', checkIn: '08:52', checkOut: '—', status: 'Present', hours: '4h 10m' },
  { id: 'e2', name: 'Marcus Webb', initials: 'MW', checkIn: '09:14', checkOut: '—', status: 'Late', hours: '3h 48m' },
  { id: 'e3', name: 'Elena Ruiz', initials: 'ER', checkIn: '08:47', checkOut: '—', status: 'Present', hours: '4h 15m' },
  { id: 'e4', name: 'David Chen', initials: 'DC', checkIn: '—', checkOut: '—', status: 'Absent', hours: '—' },
  { id: 'e5', name: 'Sara Kim', initials: 'SK', checkIn: '—', checkOut: '—', status: 'On Leave', hours: '—' },
  { id: 'e6', name: 'Owen Blake', initials: 'OB', checkIn: '09:01', checkOut: '—', status: 'Present', hours: '4h 01m' }
];

export const leaveRequests = [
  { id: 'l1', name: 'Sara Kim', initials: 'SK', type: 'Sick Leave', from: 'Jul 15, 2026', to: 'Jul 21, 2026', days: 5, status: 'Approved', reason: 'Recovering from surgery' },
  { id: 'l2', name: 'Owen Blake', initials: 'OB', type: 'Casual Leave', from: 'Jul 24, 2026', to: 'Jul 25, 2026', days: 2, status: 'Pending', reason: 'Family event' },
  { id: 'l3', name: 'Nadia Farouk', initials: 'NF', type: 'Annual Leave', from: 'Aug 3, 2026', to: 'Aug 10, 2026', days: 6, status: 'Pending', reason: 'Family trip' },
  { id: 'l4', name: 'Tom Reilly', initials: 'TR', type: 'Sick Leave', from: 'Jul 10, 2026', to: 'Jul 11, 2026', days: 2, status: 'Rejected', reason: 'Insufficient notice' }
];

export const payroll = [
  { id: 'p1', name: 'Priya Nair', initials: 'PN', dept: 'Engineering', base: 14200, bonus: 1200, deductions: 2100, net: 13300, status: 'Paid' },
  { id: 'p2', name: 'Marcus Webb', initials: 'MW', dept: 'Sales', base: 11800, bonus: 2400, deductions: 1780, net: 12420, status: 'Paid' },
  { id: 'p3', name: 'Elena Ruiz', initials: 'ER', dept: 'Customer Success', base: 9200, bonus: 600, deductions: 1340, net: 8460, status: 'Processing' },
  { id: 'p4', name: 'David Chen', initials: 'DC', dept: 'Finance', base: 10400, bonus: 0, deductions: 1560, net: 8840, status: 'Paid' },
  { id: 'p5', name: 'Sara Kim', initials: 'SK', dept: 'People Ops', base: 8600, bonus: 300, deductions: 1180, net: 7720, status: 'Processing' }
];

export const announcements = [
  { id: 'a1', title: 'Q3 all-hands moved to Aug 5', time: '2 days ago' },
  { id: 'a2', title: 'New wellness benefit: therapy reimbursement', time: '5 days ago' },
  { id: 'a3', title: 'Office closed Aug 15 for public holiday', time: '1 week ago' }
];

export const platformUsers = [
  { id: 'u1', name: 'Priya Nair', initials: 'PN', org: 'Ironwood Manufacturing', role: 'Org Admin', status: 'Active', lastActive: '2 min ago' },
  { id: 'u2', name: 'Marcus Webb', initials: 'MW', org: 'Nimbus Retail Group', role: 'Employee', status: 'Active', lastActive: '18 min ago' },
  { id: 'u3', name: 'Elena Ruiz', initials: 'ER', org: 'Fjord Logistics', role: 'Org Admin', status: 'Active', lastActive: '1 hr ago' },
  { id: 'u4', name: 'David Chen', initials: 'DC', org: 'Solace Health', role: 'Employee', status: 'Active', lastActive: '3 hrs ago' },
  { id: 'u5', name: 'Sara Kim', initials: 'SK', org: 'Pinehurst Financial', role: 'Employee', status: 'Suspended', lastActive: '2 days ago' },
  { id: 'u6', name: 'Owen Blake', initials: 'OB', org: 'Ironwood Manufacturing', role: 'Employee', status: 'Active', lastActive: '30 min ago' },
  { id: 'u7', name: 'Nadia Farouk', initials: 'NF', org: 'Ironwood Manufacturing', role: 'Employee', status: 'Active', lastActive: '5 min ago' },
  { id: 'u8', name: 'Tom Reilly', initials: 'TR', org: 'Nimbus Retail Group', role: 'Employee', status: 'Inactive', lastActive: '2 weeks ago' },
  { id: 'u9', name: 'Alex Kade', initials: 'AK', org: 'NexHR Platform', role: 'Super Admin', status: 'Active', lastActive: 'Now' }
];

export const expiredSubscriptions = [
  { id: 'x1', org: 'Lumen Studio', plan: 'Starter', expired: 'Jul 9, 2026', reason: 'Payment failed' },
  { id: 'x2', org: 'Harborview Consulting', plan: 'Growth', expired: 'Jun 28, 2026', reason: 'Cancelled by customer' },
  { id: 'x3', org: 'Cedar Peak Retail', plan: 'Starter', expired: 'Jun 14, 2026', reason: 'Trial ended' }
];

export const auditLogs = [
  { id: 'al1', actor: 'Alex Kade', role: 'Super Admin', action: 'Created a new organization', org: 'Coral Ridge Hospitality', time: 'Jul 19, 2026 · 09:14 AM', ip: '203.0.113.44' },
  { id: 'al2', actor: 'Priya Nair', role: 'Org Admin', action: 'Changed subscription plan to Enterprise', org: 'Ironwood Manufacturing', time: 'Jul 18, 2026 · 04:52 PM', ip: '198.51.100.12' },
  { id: 'al3', actor: 'Alex Kade', role: 'Super Admin', action: 'Added a biometric device (Main Office Device)', org: 'Ironwood Manufacturing', time: 'Jul 18, 2026 · 11:03 AM', ip: '203.0.113.44' },
  { id: 'al4', actor: 'Elena Ruiz', role: 'Org Admin', action: 'Suspended user account (Tom Reilly)', org: 'Nimbus Retail Group', time: 'Jul 17, 2026 · 02:37 PM', ip: '192.0.2.77' },
  { id: 'al5', actor: 'Alex Kade', role: 'Super Admin', action: 'Enabled Payroll module', org: 'Solace Health', time: 'Jul 17, 2026 · 10:20 AM', ip: '203.0.113.44' },
  { id: 'al6', actor: 'Marcus Webb', role: 'Org Admin', action: 'Approved leave request', org: 'Nimbus Retail Group', time: 'Jul 16, 2026 · 05:41 PM', ip: '192.0.2.77' },
  { id: 'al7', actor: 'Alex Kade', role: 'Super Admin', action: 'Suspended organization (Lumen Studio)', org: 'Lumen Studio', time: 'Jul 15, 2026 · 08:12 AM', ip: '203.0.113.44' },
  { id: 'al8', actor: 'David Chen', role: 'Org Admin', action: 'Ran payroll for June 2026', org: 'Solace Health', time: 'Jul 14, 2026 · 06:05 PM', ip: '198.51.100.90' }
];

export const supportTickets = [
  { id: 't1', subject: 'Biometric device is not syncing', org: 'Ironwood Manufacturing', priority: 'High', status: 'Open', createdBy: 'Priya Nair', created: 'Jul 19, 2026 · 08:40 AM', lastUpdate: '2 hrs ago' },
  { id: 't2', subject: 'Unable to add employee', org: 'Nimbus Retail Group', priority: 'Medium', status: 'Pending', createdBy: 'Marcus Webb', created: 'Jul 18, 2026 · 03:15 PM', lastUpdate: '1 day ago' },
  { id: 't3', subject: 'Payroll export missing bonus column', org: 'Solace Health', priority: 'Medium', status: 'Open', createdBy: 'David Chen', created: 'Jul 17, 2026 · 11:02 AM', lastUpdate: '3 hrs ago' },
  { id: 't4', subject: 'Cannot reset employee password', org: 'Fjord Logistics', priority: 'High', status: 'Pending', createdBy: 'Elena Ruiz', created: 'Jul 16, 2026 · 09:27 AM', lastUpdate: '5 hrs ago' },
  { id: 't5', subject: 'Leave balance shows incorrect days', org: 'Pinehurst Financial', priority: 'Low', status: 'Resolved', createdBy: 'Admin User', created: 'Jul 12, 2026 · 02:50 PM', lastUpdate: '4 days ago' },
  { id: 't6', subject: 'Request to increase storage quota', org: 'Ironwood Manufacturing', priority: 'Low', status: 'Resolved', createdBy: 'Priya Nair', created: 'Jul 9, 2026 · 10:10 AM', lastUpdate: '1 week ago' }
];

export const platformAnnouncements = [
  { id: 'pa1', message: 'System maintenance scheduled for Sunday at 2:00 AM.', target: 'All organizations', sentBy: 'Alex Kade', time: 'Jul 17, 2026 · 06:00 PM' },
  { id: 'pa2', message: 'New payroll export format rolling out next week — no action needed.', target: 'Organization Admins', sentBy: 'Alex Kade', time: 'Jul 12, 2026 · 11:20 AM' },
  { id: 'pa3', message: 'Your Enterprise plan renewal is coming up — review your billing details.', target: 'Ironwood Manufacturing, Fjord Logistics', sentBy: 'Alex Kade', time: 'Jul 5, 2026 · 09:45 AM' }
];

export const systemServices = [
  { name: 'API', status: 'Operational' },
  { name: 'Database', status: 'Operational' },
  { name: 'Biometric Sync', status: 'Degraded' },
  { name: 'Email Service', status: 'Operational' },
  { name: 'Storage', status: 'Operational' }
];

export const systemErrors = [
  { id: 'se1', message: 'Biometric sync timeout — Retail Floor Terminal (Nimbus Retail Group)', time: '18 min ago', severity: 'Warning' },
  { id: 'se2', message: 'Email delivery delayed for payslip notifications', time: '2 hrs ago', severity: 'Warning' },
  { id: 'se3', message: 'Scheduled database backup completed', time: '6 hrs ago', severity: 'Info' },
  { id: 'se4', message: 'API rate limit reached for Fjord Logistics integration', time: 'Yesterday', severity: 'Error' }
];

export const biometricDevices = [
  { id: 'bd1', name: 'Main Office Device', org: 'Ironwood Manufacturing', type: 'Fingerprint', model: 'ZKTeco', serial: 'ZK-4521-XT', ip: '192.168.1.100', port: 4370, location: 'Head Office', status: 'Online', lastSync: '2 min ago', enabled: true },
  { id: 'bd2', name: 'Warehouse Scanner', org: 'Fjord Logistics', type: 'Fingerprint', model: 'ZKTeco SpeedFace', serial: 'ZK-7710-SF', ip: '192.168.2.44', port: 4370, location: 'Warehouse B', status: 'Online', lastSync: '14 min ago', enabled: true },
  { id: 'bd3', name: 'Retail Floor Terminal', org: 'Nimbus Retail Group', type: 'Face Recognition', model: 'Hikvision DS-K1T', serial: 'HK-3390-K1', ip: '192.168.5.12', port: 4370, location: 'Store Front', status: 'Offline', lastSync: '3 days ago', enabled: false },
  { id: 'bd4', name: 'Clinic Entry Reader', org: 'Solace Health', type: 'Fingerprint', model: 'Suprema BioStation', serial: 'SP-1182-BS', ip: '192.168.9.8', port: 4370, location: 'Reception', status: 'Online', lastSync: '1 hr ago', enabled: true },
  { id: 'bd5', name: 'Loading Dock Reader', org: 'Ironwood Manufacturing', type: 'Card Reader', model: 'ZKTeco C3-200', serial: 'ZK-9012-C3', ip: '192.168.1.140', port: 4370, location: 'Loading Dock', status: 'Online', lastSync: '6 min ago', enabled: true }
];

export const biometricSyncLogs = [
  { id: 'sl1', device: 'Main Office Device', time: 'Jul 19, 2026 · 09:12 AM', records: 118, status: 'Success' },
  { id: 'sl2', device: 'Loading Dock Reader', time: 'Jul 19, 2026 · 09:06 AM', records: 42, status: 'Success' },
  { id: 'sl3', device: 'Main Office Device', time: 'Jul 18, 2026 · 09:15 AM', records: 0, status: 'Failed' },
  { id: 'sl4', device: 'Loading Dock Reader', time: 'Jul 18, 2026 · 09:05 AM', records: 39, status: 'Success' }
];

export const employeeBiometricMap = [
  { employeeId: 'e1', name: 'Priya Nair', initials: 'PN', device: 'Main Office Device', biometricId: 'BIO-0001', enrolled: 'Feb 2021' },
  { employeeId: 'e2', name: 'Marcus Webb', initials: 'MW', device: 'Main Office Device', biometricId: 'BIO-0002', enrolled: 'Jun 2020' },
  { employeeId: 'e3', name: 'Elena Ruiz', initials: 'ER', device: 'Main Office Device', biometricId: 'BIO-0003', enrolled: 'Oct 2022' },
  { employeeId: 'e6', name: 'Owen Blake', initials: 'OB', device: 'Loading Dock Reader', biometricId: 'BIO-0006', enrolled: 'Aug 2023' },
  { employeeId: 'e7', name: 'Nadia Farouk', initials: 'NF', device: 'Loading Dock Reader', biometricId: 'BIO-0007', enrolled: 'May 2022' }
];

export const shifts = [
  { id: 'sh1', name: 'Morning Shift', start: '08:00', end: '17:00', days: 'Mon–Fri', employeeCount: 62 },
  { id: 'sh2', name: 'Evening Shift', start: '14:00', end: '23:00', days: 'Mon–Fri', employeeCount: 28 },
  { id: 'sh3', name: 'Night Shift', start: '23:00', end: '08:00', days: 'Mon–Sat', employeeCount: 15 },
  { id: 'sh4', name: 'Weekend Rotation', start: '09:00', end: '18:00', days: 'Sat–Sun', employeeCount: 9 }
];

export const rosterEntries = [
  { id: 'ro1', name: 'Priya Nair', initials: 'PN', shift: 'Morning Shift', mon: 'M', tue: 'M', wed: 'M', thu: 'M', fri: 'M', sat: 'Off', sun: 'Off' },
  { id: 'ro2', name: 'Owen Blake', initials: 'OB', shift: 'Morning Shift', mon: 'M', tue: 'M', wed: 'M', thu: 'M', fri: 'M', sat: 'Off', sun: 'Off' },
  { id: 'ro3', name: 'Marcus Webb', initials: 'MW', shift: 'Evening Shift', mon: 'E', tue: 'E', wed: 'E', thu: 'E', fri: 'E', sat: 'Off', sun: 'Off' },
  { id: 'ro4', name: 'Elena Ruiz', initials: 'ER', shift: 'Evening Shift', mon: 'E', tue: 'E', wed: 'Off', thu: 'E', fri: 'E', sat: 'E', sun: 'Off' },
  { id: 'ro5', name: 'Nadia Farouk', initials: 'NF', shift: 'Weekend Rotation', mon: 'Off', tue: 'Off', wed: 'M', thu: 'M', fri: 'M', sat: 'M', sun: 'M' }
];

export const shiftSwapRequests = [
  { id: 'sw1', name: 'Owen Blake', initials: 'OB', from: 'Morning Shift', to: 'Evening Shift', date: 'Jul 24, 2026', status: 'Pending' },
  { id: 'sw2', name: 'Elena Ruiz', initials: 'ER', from: 'Evening Shift', to: 'Morning Shift', date: 'Jul 22, 2026', status: 'Approved' }
];

export const jobOpenings = [
  { id: 'jo1', title: 'Backend Engineer', dept: 'Engineering', type: 'Full-time', location: 'Remote', applicants: 14, status: 'Open', posted: 'Jul 5, 2026' },
  { id: 'jo2', title: 'Account Executive', dept: 'Sales', type: 'Full-time', location: 'San Francisco, CA', applicants: 9, status: 'Open', posted: 'Jul 10, 2026' },
  { id: 'jo3', title: 'HR Coordinator', dept: 'People Ops', type: 'Full-time', location: 'San Francisco, CA', applicants: 6, status: 'On Hold', posted: 'Jun 28, 2026' },
  { id: 'jo4', title: 'Support Specialist', dept: 'Customer Success', type: 'Contract', location: 'Remote', applicants: 11, status: 'Open', posted: 'Jul 14, 2026' }
];

export const applicants = [
  { id: 'ap1', name: 'Jordan Lee', initials: 'JL', role: 'Backend Engineer', stage: 'Applied', appliedOn: 'Jul 15, 2026', email: 'jordan.lee@mail.com', phone: '+1 415 555 0201' },
  { id: 'ap2', name: 'Mia Torres', initials: 'MT', role: 'Backend Engineer', stage: 'Shortlisted', appliedOn: 'Jul 12, 2026', email: 'mia.torres@mail.com', phone: '+1 415 555 0202' },
  { id: 'ap3', name: 'Sam Patel', initials: 'SP', role: 'Backend Engineer', stage: 'Interview', appliedOn: 'Jul 9, 2026', email: 'sam.patel@mail.com', phone: '+1 415 555 0203', interviewDate: 'Jul 22, 2026 · 2:00 PM' },
  { id: 'ap4', name: 'Casey Morgan', initials: 'CM', role: 'Account Executive', stage: 'Interview', appliedOn: 'Jul 8, 2026', email: 'casey.morgan@mail.com', phone: '+1 415 555 0204', interviewDate: 'Jul 21, 2026 · 11:00 AM' },
  { id: 'ap5', name: 'Riley Chen', initials: 'RC', role: 'Account Executive', stage: 'Selected', appliedOn: 'Jul 3, 2026', email: 'riley.chen@mail.com', phone: '+1 415 555 0205' },
  { id: 'ap6', name: 'Avery Brooks', initials: 'AB', role: 'Support Specialist', stage: 'Applied', appliedOn: 'Jul 16, 2026', email: 'avery.brooks@mail.com', phone: '+1 415 555 0206' },
  { id: 'ap7', name: 'Taylor Reyes', initials: 'TR', role: 'Support Specialist', stage: 'Rejected', appliedOn: 'Jul 6, 2026', email: 'taylor.reyes@mail.com', phone: '+1 415 555 0207' }
];

export const employeeGoals = [
  { id: 'g1', employee: 'Nadia Farouk', initials: 'NF', goal: 'Ship redesigned onboarding flow', dueDate: 'Aug 15, 2026', progress: 70, status: 'On Track' },
  { id: 'g2', employee: 'Owen Blake', initials: 'OB', goal: 'Reduce API p95 latency by 20%', dueDate: 'Sep 1, 2026', progress: 40, status: 'At Risk' },
  { id: 'g3', employee: 'Marcus Webb', initials: 'MW', goal: 'Close $500K in new ARR this quarter', dueDate: 'Sep 30, 2026', progress: 85, status: 'On Track' },
  { id: 'g4', employee: 'Elena Ruiz', initials: 'ER', goal: 'Improve CSAT score to 92%', dueDate: 'Aug 31, 2026', progress: 55, status: 'On Track' }
];

export const performanceReviews = [
  { id: 'pr1', employee: 'Nadia Farouk', initials: 'NF', cycle: 'H1 2026', reviewer: 'Priya Nair', rating: 4.5, status: 'Completed', date: 'Jul 1, 2026' },
  { id: 'pr2', employee: 'Owen Blake', initials: 'OB', cycle: 'H1 2026', reviewer: 'Priya Nair', rating: 3.8, status: 'Completed', date: 'Jul 1, 2026' },
  { id: 'pr3', employee: 'Marcus Webb', initials: 'MW', cycle: 'H1 2026', reviewer: 'Admin User', rating: 4.7, status: 'Completed', date: 'Jun 28, 2026' },
  { id: 'pr4', employee: 'Elena Ruiz', initials: 'ER', cycle: 'H2 2026', reviewer: 'Admin User', rating: null, status: 'Pending Self-Evaluation', date: '—' },
  { id: 'pr5', employee: 'David Chen', initials: 'DC', cycle: 'H2 2026', reviewer: 'Admin User', rating: null, status: 'Pending Manager Review', date: '—' }
];

export const promotionHistory = [
  { id: 'ph1', employee: 'Priya Nair', initials: 'PN', change: 'Promoted to VP Engineering', date: 'Jan 2024', note: '+18% salary adjustment' },
  { id: 'ph2', employee: 'Marcus Webb', initials: 'MW', change: 'Promoted to Sales Director', date: 'Jun 2023', note: '+12% salary adjustment' },
  { id: 'ph3', employee: 'Elena Ruiz', initials: 'ER', change: 'Appraisal — merit increase', date: 'Jan 2026', note: '+6% salary adjustment' }
];

export const exitRequests = [
  { id: 'ex1', employee: 'Tom Reilly', initials: 'TR', dept: 'Sales', lastWorkingDay: 'Aug 15, 2026', stage: 'Notice Period', reason: 'Resigned — new opportunity', clearance: { it: true, finance: false, hr: false, assets: false } },
  { id: 'ex2', employee: 'Jamie Ortiz', initials: 'JO', dept: 'Engineering', lastWorkingDay: 'Jul 25, 2026', stage: 'Clearance', reason: 'Resigned — relocation', clearance: { it: true, finance: true, hr: false, assets: true } },
  { id: 'ex3', employee: 'Morgan Blake', initials: 'MB', dept: 'Customer Success', lastWorkingDay: 'Jul 5, 2026', stage: 'Exit Interview', reason: 'Resigned', clearance: { it: true, finance: true, hr: true, assets: true } },
  { id: 'ex4', employee: 'Casey Kim', initials: 'CK', dept: 'Finance', lastWorkingDay: 'Jun 20, 2026', stage: 'Exited', reason: 'End of contract', clearance: { it: true, finance: true, hr: true, assets: true } }
];

export const loanRequests = [
  { id: 'ln1', employee: 'Owen Blake', initials: 'OB', type: 'Salary Advance', amount: 300, salary: 1000, status: 'Pending', requested: 'Jul 17, 2026', installments: 1, paid: 0 },
  { id: 'ln2', employee: 'Elena Ruiz', initials: 'ER', type: 'Employee Loan', amount: 5000, salary: 9200, status: 'Approved', requested: 'Jun 1, 2026', installments: 10, monthly: 500, paid: 1500 },
  { id: 'ln3', employee: 'David Chen', initials: 'DC', type: 'Employee Loan', amount: 2400, salary: 10400, status: 'Approved', requested: 'Mar 10, 2026', installments: 6, monthly: 400, paid: 2400 },
  { id: 'ln4', employee: 'Nadia Farouk', initials: 'NF', type: 'Salary Advance', amount: 500, salary: 8180, status: 'Rejected', requested: 'Jul 5, 2026', installments: 1, paid: 0 },
  { id: 'ln5', employee: 'Marcus Webb', initials: 'MW', type: 'Employee Loan', amount: 3000, salary: 11800, status: 'Pending', requested: 'Jul 16, 2026', installments: 6 }
];

export const orgAdmins = [
  { id: 'oa1', orgId: 'org5', name: 'Ali Raza', initials: 'AR', email: 'ali.raza@ironwoodmfg.com', role: 'Organization Admin', status: 'Active', lastActive: '5 min ago' },
  { id: 'oa2', orgId: 'org5', name: 'Sara Malik', initials: 'SM', email: 'sara.malik@ironwoodmfg.com', role: 'HR Admin', status: 'Active', lastActive: '1 hr ago' },
  { id: 'oa3', orgId: 'org5', name: 'Ahmed Khan', initials: 'AK', email: 'ahmed.khan@ironwoodmfg.com', role: 'Payroll Admin', status: 'Active', lastActive: '3 hrs ago' },
  { id: 'oa4', orgId: 'org5', name: 'Usman Tariq', initials: 'UT', email: 'usman.tariq@ironwoodmfg.com', role: 'Attendance Admin', status: 'Inactive', lastActive: '2 weeks ago' },
  { id: 'oa5', orgId: 'org1', name: 'Priya Nair', initials: 'PN', email: 'priya.nair@nimbusretail.com', role: 'Organization Admin', status: 'Active', lastActive: '20 min ago' },
  { id: 'oa6', orgId: 'org2', name: 'Elena Ruiz', initials: 'ER', email: 'elena.ruiz@fjordlogistics.com', role: 'Organization Admin', status: 'Active', lastActive: '2 hrs ago' }
];

export const adminRolePermissions = {
  'Organization Admin': ['Full organization dashboard access', 'Manage employees', 'Manage HR modules', 'Manage other organization admins'],
  'HR Admin': ['Employees', 'Recruitment', 'Leave', 'Attendance', 'Performance'],
  'Payroll Admin': ['Payroll', 'Salary', 'Loans & Advances', 'Tax'],
  'Attendance Admin': ['Attendance', 'Shifts & Rosters', 'Biometric Devices'],
  'Custom Admin': ['Custom module selection']
};

export const attendanceAuditLog = [
  { id: 'aa1', actor: 'Admin User', action: 'Marked Sara Kim as On Leave for Jul 19, 2026', time: 'Jul 19, 2026 · 08:05 AM' },
  { id: 'aa2', actor: 'Admin User', action: 'Corrected Marcus Webb check-in to 09:14 (Late) with reason: Traffic delay', time: 'Jul 19, 2026 · 09:20 AM' }
];

const defaultRule = (overrides) => ({ enabled: false, conditions: '', deductionType: 'None', gracePeriod: '', triggerConditions: '', maxDeduction: '', approvalRequired: false, notify: true, customExceptions: '', ...overrides });

export const attendancePolicies = [
  { id: 'ap1', name: 'Standard Office Policy', status: 'Active', priority: 'High', effectiveDate: '2026-01-01',
    assignments: { branches: ['Head Office'], departments: ['Engineering', 'Sales'], designations: [], employees: [] },
    rules: {
      workingHours: defaultRule({ enabled: true, conditions: '09:00 – 18:00, Mon–Fri', deductionType: 'None', gracePeriod: '0', triggerConditions: 'Outside scheduled hours', notify: true }),
      graceTime: defaultRule({ enabled: true, conditions: 'Grace window before marking late', deductionType: 'None', gracePeriod: '15', triggerConditions: 'Check-in within grace window', notify: false }),
      lateArrival: defaultRule({ enabled: true, conditions: 'Check-in after grace period', deductionType: 'Fixed Amount', gracePeriod: '15', triggerConditions: 'Check-in > 09:15', maxDeduction: '100', approvalRequired: false, notify: true }),
      earlyDeparture: defaultRule({ enabled: true, conditions: 'Check-out before shift end', deductionType: 'Half Day', gracePeriod: '10', triggerConditions: '3 early departures/month', maxDeduction: '1', approvalRequired: true, notify: true }),
      overtime: defaultRule({ enabled: true, conditions: 'Work beyond scheduled hours', deductionType: 'None', gracePeriod: '30', triggerConditions: 'After 18:00', maxDeduction: '3 hrs/day', approvalRequired: true, notify: true }),
      halfDay: defaultRule({ enabled: true, conditions: 'Worked hours below 50% of shift', deductionType: 'Half Day', gracePeriod: '', triggerConditions: '< 4 hours worked', approvalRequired: true, notify: true }),
      absent: defaultRule({ enabled: true, conditions: 'No check-in recorded', deductionType: 'Full Day', gracePeriod: '', triggerConditions: 'No punches for the day', approvalRequired: false, notify: true }),
      missingPunch: defaultRule({ enabled: true, conditions: 'Check-in or check-out missing', deductionType: 'None', gracePeriod: '', triggerConditions: 'Single punch only', approvalRequired: true, notify: true }),
      weekendHoliday: defaultRule({ enabled: true, conditions: 'Saturday & Sunday off, holidays paid', deductionType: 'None', gracePeriod: '', triggerConditions: 'Weekend/holiday calendar', notify: false }),
      breakRules: defaultRule({ enabled: true, conditions: '60 min lunch break', deductionType: 'Per Minute', gracePeriod: '10', triggerConditions: 'Break > 70 min', maxDeduction: '30', notify: false })
    },
    exceptions: [{ id: 'exc1', label: 'Priya Nair', note: 'Exempt from late arrival deduction (medical accommodation)' }],
    history: [
      { id: 'h2', date: 'Mar 4, 2026', actor: 'Org Admin', change: 'Updated overtime max hours/day to 3' },
      { id: 'h1', date: 'Jan 1, 2026', actor: 'Org Admin', change: 'Policy created' }
    ] },
  { id: 'ap2', name: 'Warehouse Shift Policy', status: 'Active', priority: 'High', effectiveDate: '2026-03-01',
    assignments: { branches: ['Warehouse B', 'Assembly Plant'], departments: ['Logistics', 'Manufacturing'], designations: [], employees: [] },
    rules: {
      workingHours: defaultRule({ enabled: true, conditions: '08:00 – 17:00, Mon–Sat', deductionType: 'None', gracePeriod: '0', triggerConditions: 'Outside scheduled hours' }),
      graceTime: defaultRule({ enabled: true, conditions: 'Grace window before marking late', deductionType: 'None', gracePeriod: '10', triggerConditions: 'Check-in within grace window' }),
      lateArrival: defaultRule({ enabled: true, conditions: 'Check-in after grace period', deductionType: 'Fixed Amount', gracePeriod: '10', triggerConditions: 'Check-in > 08:10', maxDeduction: '150', notify: true }),
      earlyDeparture: defaultRule({ enabled: true, conditions: 'Check-out before shift end', deductionType: 'Full Day', gracePeriod: '5', triggerConditions: '2 early departures/month', maxDeduction: '1', approvalRequired: true, notify: true }),
      overtime: defaultRule({ enabled: true, conditions: 'Work beyond scheduled hours', deductionType: 'None', gracePeriod: '15', triggerConditions: 'After 17:00', maxDeduction: '4 hrs/day', notify: true }),
      halfDay: defaultRule({ enabled: true, conditions: 'Worked hours below 50% of shift', deductionType: 'Half Day', triggerConditions: '< 4.5 hours worked', approvalRequired: true, notify: true }),
      absent: defaultRule({ enabled: true, conditions: 'No check-in recorded', deductionType: 'Full Day', triggerConditions: 'No punches for the day', notify: true }),
      missingPunch: defaultRule({ enabled: true, conditions: 'Check-in or check-out missing', deductionType: 'Per Hour', triggerConditions: 'Single punch only', maxDeduction: '2 hrs', approvalRequired: true, notify: true }),
      weekendHoliday: defaultRule({ enabled: true, conditions: 'Sunday off, holidays unpaid', deductionType: 'None', triggerConditions: 'Weekend/holiday calendar' }),
      breakRules: defaultRule({ enabled: true, conditions: '30 min break', deductionType: 'Per Minute', gracePeriod: '5', triggerConditions: 'Break > 35 min', maxDeduction: '20' })
    },
    exceptions: [],
    history: [{ id: 'h3', date: 'Mar 1, 2026', actor: 'Org Admin', change: 'Policy created' }] },
  { id: 'ap3', name: 'Remote Contractor Policy', status: 'Inactive', priority: 'Low', effectiveDate: '',
    assignments: { branches: [], departments: [], designations: [], employees: [] },
    rules: {
      workingHours: defaultRule({ enabled: true, conditions: '10:00 – 19:00, flexible', gracePeriod: '30' }),
      graceTime: defaultRule({ enabled: true, conditions: 'Flexible grace window', gracePeriod: '30' }),
      lateArrival: defaultRule({}),
      earlyDeparture: defaultRule({}),
      overtime: defaultRule({}),
      halfDay: defaultRule({}),
      absent: defaultRule({}),
      missingPunch: defaultRule({}),
      weekendHoliday: defaultRule({ enabled: true, conditions: 'Fully flexible schedule' }),
      breakRules: defaultRule({})
    },
    exceptions: [],
    history: [{ id: 'h4', date: 'Feb 10, 2026', actor: 'Org Admin', change: 'Policy created' }] }
];

export const letterTemplates = [
  { id: 'lt1', type: 'Appointment Letter', description: 'Confirms a new hire\'s role, start date, and compensation' },
  { id: 'lt2', type: 'Confirmation Letter', description: 'Confirms successful completion of probation period' },
  { id: 'lt3', type: 'Promotion Letter', description: 'Announces a title, role, or salary change' },
  { id: 'lt4', type: 'Warning Letter', description: 'Formal notice regarding a policy or performance issue' },
  { id: 'lt5', type: 'Experience Letter', description: 'Confirms tenure and role upon request or exit' },
  { id: 'lt6', type: 'Termination Letter', description: 'Formal notice of employment termination' }
];

export const generatedLetters = [
  { id: 'gl1', employee: 'Priya Nair', type: 'Promotion Letter', generatedOn: 'Jan 15, 2024', generatedBy: 'Admin User' },
  { id: 'gl2', employee: 'Owen Blake', type: 'Confirmation Letter', generatedOn: 'Nov 8, 2023', generatedBy: 'Admin User' },
  { id: 'gl3', employee: 'Tom Reilly', type: 'Warning Letter', generatedOn: 'Jun 2, 2026', generatedBy: 'Admin User' }
];

export const orgProfile = {
  name: 'Ironwood Manufacturing', industry: 'Manufacturing', email: 'admin@ironwoodmfg.com', phone: '+1 415 555 0190',
  website: 'https://ironwoodmfg.com', address: '4820 Industrial Pkwy, Detroit, MI', currency: 'USD', timezone: 'GMT-5 Eastern',
  dateFormat: 'MM/DD/YYYY', payFrequency: 'Monthly', workWeekStart: 'Monday'
};

export const branches = [
  { id: 'br1', name: 'Head Office', location: 'Detroit, MI', employees: 1420, status: 'Active' },
  { id: 'br2', name: 'Warehouse B', location: 'Toledo, OH', employees: 540, status: 'Active' },
  { id: 'br3', name: 'Assembly Plant', location: 'Cleveland, OH', employees: 250, status: 'Active' }
];

export const holidays = [
  { id: 'hd1', name: 'Labor Day', date: 'Sep 1, 2026', type: 'Public' },
  { id: 'hd2', name: 'Thanksgiving', date: 'Nov 26, 2026', type: 'Public' },
  { id: 'hd3', name: 'Christmas Day', date: 'Dec 25, 2026', type: 'Public' },
  { id: 'hd4', name: 'Company Foundation Day', date: 'Feb 27, 2027', type: 'Company' }
];

export const availableModules = ['Employees', 'Departments', 'Attendance', 'Shift & Roster', 'Leave', 'Payroll', 'Loans & Advances', 'Exit Management', 'HR Letters', 'Reports', 'Employee Portal', 'Organization Settings'];

export const roles = [
  { id: 'r1', name: 'Organization Admin', description: 'Full organization dashboard access', permissions: [...availableModules], assignedCount: 1 },
  { id: 'r2', name: 'HR Admin', description: 'Employees, recruitment, leave, attendance, performance', permissions: ['Employees', 'Departments', 'Attendance', 'Leave', 'HR Letters', 'Reports'], assignedCount: 1 },
  { id: 'r3', name: 'Payroll Admin', description: 'Payroll, salary, loans, tax', permissions: ['Payroll', 'Loans & Advances', 'Reports'], assignedCount: 1 },
  { id: 'r4', name: 'Attendance Admin', description: 'Attendance, shifts & rosters, biometric devices', permissions: ['Attendance', 'Shift & Roster'], assignedCount: 1 },
  { id: 'r5', name: 'Employee', description: 'Self-service access to own profile, attendance, leave, and payroll', permissions: ['Employee Portal'], assignedCount: 47 }
];

export const shiftAssignments = [
  { id: 'sa1', target: 'IT Department', targetType: 'Department', shiftName: 'Morning Shift', effectiveFrom: 'Jan 1, 2026', effectiveTo: 'Ongoing', status: 'Active' },
  { id: 'sa2', target: 'Marcus Webb', targetType: 'Employee', shiftName: 'Evening Shift', effectiveFrom: 'Mar 1, 2026', effectiveTo: 'Ongoing', status: 'Active' },
  { id: 'sa3', target: 'Warehouse Team', targetType: 'Department', shiftName: 'Night Shift', effectiveFrom: 'Feb 15, 2026', effectiveTo: 'Aug 15, 2026', status: 'Active' }
];

export const currentEmployee = {
  name: 'Nadia Farouk',
  initials: 'NF',
  title: 'Product Designer',
  dept: 'Engineering',
  manager: 'Priya Nair',
  leaveBalance: { annual: 12, sick: 6, casual: 4 },
  attendanceHistory: [
    { date: 'Jul 18, 2026', checkIn: '09:02', checkOut: '18:10', status: 'Present', hours: '9h 08m' },
    { date: 'Jul 17, 2026', checkIn: '08:58', checkOut: '17:55', status: 'Present', hours: '8h 57m' },
    { date: 'Jul 16, 2026', checkIn: '—', checkOut: '—', status: 'Weekend', hours: '—' },
    { date: 'Jul 15, 2026', checkIn: '09:20', checkOut: '18:02', status: 'Late', hours: '8h 42m' },
    { date: 'Jul 14, 2026', checkIn: '08:55', checkOut: '18:00', status: 'Present', hours: '9h 05m' }
  ],
  leaveHistory: [
    { id: 'le1', type: 'Annual Leave', from: 'Aug 3, 2026', to: 'Aug 10, 2026', days: 6, status: 'Pending' },
    { id: 'le2', type: 'Sick Leave', from: 'Jun 2, 2026', to: 'Jun 3, 2026', days: 2, status: 'Approved' },
    { id: 'le3', type: 'Casual Leave', from: 'Apr 18, 2026', to: 'Apr 18, 2026', days: 1, status: 'Approved' }
  ],
  payslips: [
    { id: 'ps1', month: 'June 2026', net: 8180, status: 'Paid' },
    { id: 'ps2', month: 'May 2026', net: 8180, status: 'Paid' },
    { id: 'ps3', month: 'April 2026', net: 7960, status: 'Paid' }
  ]
};
