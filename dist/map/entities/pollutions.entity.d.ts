import { Stations } from './stations.entity';
export declare class Pollutions {
    id: number;
    stationName: string;
    dataTime: string;
    sidoName: string;
    pm10Value: string;
    pm10Grade: string;
    pm25Value: string;
    pm25Grade: string;
    no2Value: string;
    no2Grade: string;
    o3Value: string;
    o3Grade: string;
    so2Value: string;
    so2Grade: string;
    coValue: string;
    coGrade: string;
    updatedAt: Date;
    stations: Stations;
}
