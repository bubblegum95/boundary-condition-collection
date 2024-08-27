import { Pollutions } from './pollutions.entity';
export declare class Stations {
    id: number;
    stationName: string;
    addr: string;
    dmX: number;
    dmY: number;
    pollutions: Pollutions;
}
