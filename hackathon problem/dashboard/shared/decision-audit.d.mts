import type {Call,GoalSelection,Decision} from './domain.mjs';
export type AuditCheckpoint=Decision&{calls:number;from?:number;round:number;at:string};
export type AuditRun={calls:Call[];decisions:AuditCheckpoint[];initial:number;allocation:number;goal:GoalSelection};
export type GoalComparison={id:string;label:string;A:{met:number;total:number;rate:number|null};B:{met:number;total:number;rate:number|null}};
export function checkpointCalls(calls:Call[],decisions:AuditCheckpoint[],index:number,scope?:string):Call[];
export function goalComparison(calls:Call[],selection:GoalSelection):GoalComparison[];
export function experimentRounds(exp:AuditRun):{index:number;start:number;end:number;calls:Call[];allocation:number;decision:AuditCheckpoint|null}[];
