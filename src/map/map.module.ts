import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapGateway } from './map.gateway';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pollutions } from './entities/pollutions.entity';
import { Stations } from './entities/stations.entity';
import { City } from './entities/city.entity';
import { Average } from './entities/average.entity';
import { AirPollutionService } from './airPollution.service';
import { WeatherService } from './weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pollutions, Stations, City, Average])],
  providers: [MapGateway, MapService, AirPollutionService, WeatherService],
  controllers: [MapController],
})
export class MapModule {}
