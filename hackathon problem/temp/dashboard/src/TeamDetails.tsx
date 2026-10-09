import {UsersRound,BadgeCheck} from 'lucide-react';
import './team-details.css';

export const team={
 name:'The Doom Squad',
 participants:[
  {name:'Prithvi Guha',id:'93421',initials:'PG'},
  {name:'Ashutosh Singh',id:'101592',initials:'AS'},
  {name:'Soumyajeet Sen',id:'93513',initials:'SS'},
 ],
};

export function TeamDetails(){
 return <div className="team-details">
  <section className="panel team-hero" aria-label="Team profile"><span className="team-mark">DS</span><div><span className="stage-kicker">TEAM NAME</span><h2>{team.name}</h2><p>IndiaMART · VoiceOps</p></div><span className="team-size"><UsersRound size={16}/>{team.participants.length} participants</span></section>
  <div className="team-section-heading"><div><span className="stage-kicker">THE PEOPLE BEHIND VOICEOPS</span><h2>Participants</h2></div></div>
  <div className="team-participants">{team.participants.map((participant,index)=><article className="panel team-participant" key={participant.id} aria-label={participant.name}><div className="team-participant-top"><span className="participant-number">PARTICIPANT {String(index+1).padStart(2,'0')}</span><span className={`team-avatar member-${index}`}>{participant.initials}</span></div><h3>{participant.name}</h3><div className="team-participant-id"><BadgeCheck size={16}/><span>Employee ID</span><strong>{participant.id}</strong></div></article>)}</div>
 </div>;
}
