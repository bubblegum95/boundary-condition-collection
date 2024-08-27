import { MapService } from './map.service';
import { LocationInfoDto } from './dto/locationInfo.dto';
import { Response } from 'express';
export declare class MapController {
    private readonly mapService;
    constructor(mapService: MapService);
    getPollutionInfo(res: Response, dto: LocationInfoDto): Promise<Response<any, Record<string, any>>>;
    getAverage(res: Response): Promise<Response<any, Record<string, any>>>;
    getStation(): Promise<void>;
}
