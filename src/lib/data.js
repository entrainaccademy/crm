export const roles = ['Super Admin','Manager','HR','Data Analytics Manager','Team Leader','Sales Executive'];
export const money = n => '₹' + Number(n).toLocaleString('en-IN');
export const shortMoney = n => '₹' + (n/100000).toFixed(1).replace('.0','') + 'L';
export const executives = [
 {id:1,name:'Mohammed Ali',short:'Mohammed',team:'Team Alpha',leader:'Rahul Menon',target:500000,sales:620000,conversions:31},
 {id:2,name:'Niyas Ahmed',short:'Niyas',team:'Team Alpha',leader:'Rahul Menon',target:500000,sales:510000,conversions:27},
 {id:3,name:'Fasil Rahman',short:'Fasil',team:'Team Bravo',leader:'Priya Nair',target:500000,sales:425000,conversions:24},
 {id:4,name:'Ameen Hassan',short:'Ameen',team:'Team Bravo',leader:'Priya Nair',target:500000,sales:380000,conversions:22},
 {id:5,name:'Shamil Khan',short:'Shamil',team:'Team Charlie',leader:'Arjun Das',target:500000,sales:320000,conversions:19},
 {id:6,name:'Anjali Nair',short:'Anjali',team:'Team Alpha',leader:'Rahul Menon',target:400000,sales:245000,conversions:16},
 {id:7,name:'Rohan Mehta',short:'Rohan',team:'Team Bravo',leader:'Priya Nair',target:400000,sales:210000,conversions:14},
 {id:8,name:'Sneha Patel',short:'Sneha',team:'Team Charlie',leader:'Arjun Das',target:400000,sales:180000,conversions:12},
];
export const rankExecutives = people => [...people].sort((a,b)=>b.sales/b.target-a.sales/a.target || b.sales-a.sales);
export const statuses = ['New','Contacted','Follow-up','Interested','Quotation','Won','Lost'];
export const sources = ['Meta Ads','Instagram','Facebook','Website','WhatsApp','Referral','Walk-in','Other'];
export const courses = [
 {name:'Professional Chef Diploma',fee:180000},
 {name:'Bakery & Patisserie Diploma',fee:150000},
 {name:'Culinary Arts Certificate',fee:85000},
 {name:'Advanced Baking Certificate',fee:65000},
 {name:'Food Production & Kitchen Management',fee:120000},
 {name:'Barista & Beverage Arts',fee:45000},
];
export const courseFees = Object.fromEntries(courses.map(course=>[course.name,course.fee]));
const legacyCourses = {'Digital Marketing':courses[0].name,'Web Development':courses[1].name,'Business Consulting':courses[2].name,'Brand Strategy':courses[3].name};
export const normalizeLead = lead => {
 const service=legacyCourses[lead.service]||lead.service||courses[0].name;
 const saleAmount=Number(lead.saleAmount??courseFees[service]??0);
 return {...lead,service,saleAmount,advanceAmount:Number(lead.advanceAmount??(lead.status==='Won'?Math.round(saleAmount*.25/1000)*1000:0))};
};
const names = ['Aditya Sharma','Fatima Ahmed','Vikram Nair','Priya Menon','Rahul Verma','Aisha Khan','Arjun Reddy','Neha Kapoor','Sanjay Kumar','Meera Iyer','Rohit Joshi','Sara Thomas','Karthik Rao','Divya Shah','Imran Ali','Pooja Desai','Nikhil Nair','Ananya Singh','Zoya Hassan','Dev Patel'];
export const initialLeads = names.map((name,i)=>normalizeLead({id:i+1,name,phone:`+91 ${98470+i*13} ${12000+i*117}`,whatsapp:`+91 ${98470+i*13} ${12000+i*117}`,email:name.toLowerCase().replace('','.').replaceAll(' ','')+'@gmail.com',location:['Kochi, Kerala','Bengaluru, Karnataka','Mumbai, Maharashtra','Chennai, Tamil Nadu'][i%4],service:courses[i%courses.length].name,source:sources[i%8],assigned:executives[i%8].name,team:executives[i%8].team,status:statuses[i%7],priority:['High','Medium','Low'][i%3],created:'2026-09-'+String(10+i%18).padStart(2,'0'),date:'2026-09-'+String(27+i%4).padStart(2,'0'),time:['10:30','11:00','14:30','16:00'][i%4],notes:[],activities:[{text:'Lead created from '+sources[i%8],time:'24 Sep 2026 · 10:00 AM'},{text:'Assigned to '+executives[i%8].name,time:'24 Sep 2026 · 10:15 AM'},{text:'Introductory call completed',time:'25 Sep 2026 · 11:30 AM'},{text:'Follow-up scheduled',time:'26 Sep 2026 · 02:00 PM'}]}));
export const initialFollowups = initialLeads.slice(0,12).map((l,i)=>({...l,leadId:l.id,purpose:['Discuss course options','Course counselling','Discuss course fees','Admission follow-up'][i%4],type:'Call',completed:false}));
export const calls = initialLeads.slice(0,15).map((l,i)=>({...l,direction:i%3?'Outgoing':'Incoming',duration:i%4?'05:14':'00:00',callStatus:i%4?'Answered':'Missed',callDate:'28 Sep 2026',callTime:`${10+i%8}:32 AM`}));
export const chartData = [1,5,10,15,20,25,28,30].map((day,i)=>({day:`${day} Sep`,sales:[8,12,10,21,18,29,33,38][i],target:[10,13,16,20,24,28,32,40][i]}));
export const notifications = ['Follow-up with Aditya Sharma due in 30 minutes','You have 5 overdue follow-ups','New lead assigned to you: Fatima Ahmed','Mohammed reached 124% of monthly target','Team Alpha reached its monthly target','Lead converted successfully: Meera Iyer'];
export const access = {
 'Super Admin':['dashboard','leads','my-leads','follow-ups','pipeline','leaderboard','targets','customers','calls','team','performance','sales-reports','lead-reports','call-reports','follow-up-reports','users','settings'],
 'Manager':['dashboard','leads','my-leads','follow-ups','pipeline','leaderboard','targets','customers','calls','team','performance','sales-reports','lead-reports','call-reports','follow-up-reports'],
 'HR':['dashboard','team','tasks','performance','leaderboard'],
 'Data Analytics Manager':['dashboard','performance','leaderboard','sales-reports','lead-reports','call-reports','follow-up-reports'],
 'Team Leader':['dashboard','leads','follow-ups','pipeline','calls','leaderboard','team','performance'],
 'Sales Executive':['dashboard','my-leads','customers','follow-ups','pipeline','calls','leaderboard','performance']
};

