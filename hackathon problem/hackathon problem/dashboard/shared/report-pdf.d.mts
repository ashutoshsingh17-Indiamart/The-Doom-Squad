import type {AuditRun} from './decision-audit.mjs';
import type {RolloutOptions} from './domain.mjs';
export type ReportRun=AuditRun&{id:string;name:string;status:string;maximum:number;automatic:boolean;scenario?:string;seed:number;rollout?:RolloutOptions;promptA:string;promptB:string;startedAt?:string;source?:string};
export function experimentPDF(exp:ReportRun):Uint8Array<ArrayBuffer>;
