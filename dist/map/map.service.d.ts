import { Repository } from 'typeorm';
import { Pollutions } from './entities/pollutions.entity';
import { ConfigService } from '@nestjs/config';
import { Stations } from './entities/stations.entity';
import { LocationInfoDto } from './dto/locationInfo.dto';
import { Average } from './entities/average.entity';
import GradeThresholds from './type/grade-thresholds.interface';
import { City } from './entities/city.entity';
export declare class MapService {
    private readonly pollutionsRepository;
    private readonly stationsRepository;
    private readonly averageRepository;
    private readonly cityRepository;
    private readonly configService;
    constructor(pollutionsRepository: Repository<Pollutions>, stationsRepository: Repository<Stations>, averageRepository: Repository<Average>, cityRepository: Repository<City>, configService: ConfigService);
    hasNullValues(obj: Record<string, any>): boolean;
    savePollutionInformation(): Promise<void>;
    savePollutionData(data: any): Promise<string>;
    saveDataToFile(data: any): Promise<void>;
    saveStations(): Promise<void>;
    saveAverage(): Promise<void>;
    saveGrade(type: keyof GradeThresholds, value: number): Promise<string>;
    getPollutionInformation(dto: LocationInfoDto): Promise<Pollutions[]>;
    getAverage(): Promise<any[]>;
}
