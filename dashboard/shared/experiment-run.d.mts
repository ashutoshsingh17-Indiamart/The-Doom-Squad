import type {Call} from './domain.mjs';
import type {ReportRun} from './report-pdf.mjs';
export type ReplayRun=ReportRun&{scenario:string;windowHours:number;round:number;queue:Call[];cursor:number;progress:number;endsAt:string};
export function advanceExperiment<T extends ReplayRun>(e:T):T;
export function completeExperiment<T extends ReplayRun>(e:T):T;
export function preparedExperiment(scenario?:string,settings?:Partial<ReplayRun>):ReplayRun;
