import { EntityManager, Repository } from 'typeorm';
import { Pollutions } from './entities/pollutions.entity';
import { ConfigService } from '@nestjs/config';
import { Stations } from './entities/stations.entity';
import { LocationInfoDto } from './dto/locationInfo.dto';
import { Average } from './entities/average.entity';
import GradeThresholds from './type/grade-thresholds.interface';
import { City } from './entities/city.entity';
import { Logger } from 'winston';
export declare class MapService {
    private readonly pollutionsRepository;
    private readonly stationsRepository;
    private readonly averageRepository;
    private readonly cityRepository;
    private readonly entityManager;
    private readonly configService;
    private readonly logger;
    constructor(pollutionsRepository: Repository<Pollutions>, stationsRepository: Repository<Stations>, averageRepository: Repository<Average>, cityRepository: Repository<City>, entityManager: EntityManager, configService: ConfigService, logger: Logger);
    hasNullValues(obj: Record<string, any>): boolean;
    savePollutionInformation(): Promise<void>;
    savePollutionData(data: any): Promise<void>;
    saveDataToFile(data: any): Promise<void>;
    saveStations(): Promise<void>;
    saveAverage(): Promise<void>;
    saveGrade(type: keyof GradeThresholds, value: number): Promise<string>;
    getPollutionInformation(dto: LocationInfoDto): Promise<any>;
    getAverage(): Promise<any[]>;
}
