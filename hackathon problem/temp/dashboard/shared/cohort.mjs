// Synthetic buyers; expected requirements never enter the collector's prompt.
const buyers = [
 ['Rahul Sharma','Delhi','male','ready'],['Priya Mehta','Mumbai','female','explain'],['Amit Verma','Bengaluru','male','volunteered'],['Neha Patel','Ahmedabad','female','ready'],['Vikram Singh','Jaipur','male','custom'],
 ['Suresh Reddy','Hyderabad','male','explain'],['Anjali Gupta','Pune','female','ready'],['Rohit Das','Kolkata','male','ready'],['Kavita Rao','Chennai','female','purchased'],['Deepak Jain','Indore','male','partial'],
 ['Pooja Shah','Surat','female','no_answer'],['Arjun Nair','Kochi','male','explain'],['Meera Iyer','Coimbatore','female','busy'],['Rakesh Yadav','Lucknow','male','complaint'],['Sneha Kapoor','Chandigarh','female','ready'],
 ['Manoj Kumar','Patna','male','partial'],['Divya Menon','Thiruvananthapuram','female','no_answer'],['Imran Khan','Bhopal','male','custom'],['Ritu Agarwal','Agra','female','purchased'],['Nitin Joshi','Nagpur','male','volunteered'],
 ['Ayesha Sheikh','Nashik','female','ready'],['Sanjay Gupta','Kanpur','male','wrong_number'],['Shalini Rao','Mysuru','female','explain'],['Gaurav Sinha','Ranchi','male','busy'],['Lakshmi Reddy','Vijayawada','female','partial'],
 ['Prakash Desai','Vadodara','male','no_answer'],['Sonal Jain','Udaipur','female','custom'],['Karan Malhotra','Gurugram','male','ready'],['Farah Ali','Noida','female','complaint'],['Rajesh Patil','Aurangabad','male','explain'],
 ['Nisha Bansal','Faridabad','female','purchased'],['Abhishek Roy','Durgapur','male','partial'],['Swati Mishra','Varanasi','female','no_answer'],['Harish Rao','Mangaluru','male','volunteered'],['Preeti Sethi','Ludhiana','female','busy'],
 ['Dinesh Babu','Madurai','male','ready'],['Jyoti Verma','Raipur','female','explain'],['Vivek Tiwari','Gwalior','male','wrong_number'],['Rashmi Naik','Panaji','female','partial'],['Ashok Mehta','Rajkot','male','no_answer'],
 ['Ananya Das','Bhubaneswar','female','ready'],['Mahesh Choudhary','Jodhpur','male','custom'],['Sakshi Arora','Amritsar','female','complaint'],['Vinod Pillai','Salem','male','busy'],['Kritika Sen','Siliguri','female','explain'],
 ['Ajay Singh','Meerut','male','partial'],['Rina Dutta','Guwahati','female','purchased'],['Sunil Pawar','Kolhapur','male','ready'],['Bhavna Trivedi','Gandhinagar','female','no_answer'],['Tarun Saxena','Dehradun','male','busy'],
];
const productIds=['tshirts','tshirts','chairs','bulbs','boxes','pumps','shoes','chairs','bulbs','shoes'];
const preferences={tshirts:[['Cotton','Plain'],['Polyester','Printed'],['Cotton blend','Striped']],chairs:[['Mesh','High back'],['Leatherette','Mid back'],['Fabric','Any']],bulbs:[['12 W','Warm white'],['9 W','Cool white'],['18 W','Neutral white']],boxes:[['Corrugated cardboard','Mailer'],['Kraft paper','Die-cut'],['Rigid board','Regular slotted']],pumps:[['2 HP','Submersible'],['1 HP','Self-priming'],['0.5 HP','Centrifugal']],shoes:[['Leather','Steel toe'],['Synthetic','Composite toe'],['Mesh','Any']]};
const quantities={tshirts:['50','200','500'],chairs:['6','12','25'],bulbs:['100','250','500'],boxes:['200','500','1000'],pumps:['1','2','4'],shoes:['20','40','80']};
const challenges={ready:'Clear requirement; occasional correction',explain:'Needs a plain-language explanation',volunteered:'Busy; volunteers several details together',custom:'Preference outside the listed options',partial:'Shares a few details, then leaves',busy:'Requests a callback at a specific time',no_answer:'Does not answer the call',purchased:'Already purchased; no current requirement',complaint:'Complains about repeated calls',wrong_number:'Wrong person or unrelated enquiry'};
export const personas=buyers.map(([name,city,gender,kind],i)=>{
 const productId=productIds[i%10],values=[...preferences[productId][i%3]];
 if(kind==='custom')values[1]='Custom design';
 const voice=gender==='female'?['ishita','priya','pooja'][i%3]:['ratan','rahul','amit'][i%3];
 let agentVoice=i%2?'ratan':'ishita';if(agentVoice===voice)agentVoice=agentVoice==='ratan'?'ishita':'ratan';
 return {id:`p${String(i+1).padStart(2,'0')}`,name,city,gender,kind,productId,description:challenges[kind],challenge:challenges[kind],language:'English',intent:!['no_answer','purchased','complaint','wrong_number'].includes(kind),quantity:quantities[productId][i%3],values,aSuccess:kind==='ready',voice,agentVoice};
});
