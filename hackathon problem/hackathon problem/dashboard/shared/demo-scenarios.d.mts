export type DemoScenario={id:string;name:string;seed:number;description:string};
export const demoScenarios:DemoScenario[];
export function scenarioReplay(scenario:string,round:number,variant:string):{variant:string;scenario:string};
export function scenarioPolicy(scenario:string):{adaptiveAt30?:boolean;retainTraffic?:boolean};
export function nextDemoScenario():DemoScenario;
export function selectDemoScenario(search?:string):DemoScenario;
