"use client";
import { useState } from 'react';
import styles from './ProductExplorer.module.css';
const flows = {
 flex: [
  {label:'Collect', title:'Start with the evidence.', text:'Financial filings, earnings calls, patents, and job posts bring different pieces of the competitive picture.', items:['SEC filings','Earnings calls','Patents + hiring'], output:'A connected source library'},
  {label:'Connect', title:'Keep context together.', text:'Related paragraphs and tables need to stay together so retrieval does not lose the meaning behind a number.', items:['Document context','Vector retrieval','Source review'], output:'Evidence with its context intact'},
  {label:'Explore', title:'Turn questions into insight.', text:'A natural-language interface helps analysts explore competitive information and return to the underlying evidence.', items:['Analyst question','Relevant evidence','Grounded response'], output:'From reading documents to exploring answers'}
 ],
 agri: [
  {label:'Understand', title:'Begin with the farmer.', text:'The project brings agricultural risk information into a channel farmers already use.', items:['Local context','Risk information','Farmer questions'], output:'A problem framed around access'},
  {label:'Adapt', title:'Make information relevant.', text:'The concept combines risk-based advisories with location and language context.', items:['Zone','Risk context','Local language'], output:'Advice shaped around the context'},
  {label:'Deliver', title:'Meet people where they are.', text:'A WhatsApp-based experience brings advisories and questions into one familiar conversation.', items:['Advisory','WhatsApp','Follow-up question'], output:'A familiar interface for complex information'}
 ]
};
export default function ProductExplorer({kind='flex'}) {
 const [step,setStep]=useState(0);const flow=flows[kind];const item=flow[step];
 return <div className={`${styles.explorer} ${kind==='agri'?styles.agri:''}`}>
  <div className={styles.top}><span><i/> {kind==='flex'?'INTELLIGENCE WORKSPACE':'FIELD NOTES / ZAMBIA'}</span><span>INTERACTIVE CONCEPT</span></div>
  <div className={styles.tabs} role="group" aria-label="Explore the project workflow">{flow.map((s,i)=><button key={s.label} aria-pressed={step===i} onClick={()=>setStep(i)}><span>0{i+1}</span>{s.label}</button>)}</div>
  <div className={styles.canvas} aria-live="polite"><p className={styles.index}>0{step+1} / 03</p><h3>{item.title}</h3><div className={styles.pipeline}>{item.items.map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span>{s}</div>)}</div><p className={styles.output}><span aria-hidden="true">↳</span> {item.output}</p><p className={styles.description}>{item.text}</p></div>
  <div className={styles.bottom}><span>Workflow illustration, not a live product</span><button aria-label="Next workflow step" onClick={()=>setStep((step+1)%3)}>Explore next ↗</button></div>
 </div>
}
