import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LocationInfoDto } from './dto/locationInfo.dto';
import { Average } from './entities/average.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Average)
    private readonly averageRepository: Repository<Average>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}
  async getPollutionInformation(dto: LocationInfoDto) {
    this.logger.debug('start to get air pollution data');
    const { minLat, maxLat, minLng, maxLng } = dto;

    try {
      const rawQuery = `
        SELECT 
          p.*, 
          s.id as station_id,
          s.station_name,
          s.addr,
          s.dm_x,
          s.dm_y
        FROM 
          pollutions p 
        INNER JOIN 
          stations s 
        ON 
          p.station_id = s.id 
        WHERE 
          s.dm_x BETWEEN $1 AND $2 
          AND s.dm_y BETWEEN $3 AND $4
      `;
      const parameters = [minLat, maxLat, minLng, maxLng];
      const data = await this.entityManager.query(rawQuery, parameters);
      const list = [];
      const fixedAddr = data.map((d) => {
        const {
          station_name,
          sido_name,
          data_time,
          pm10_value,
          pm10_grade,
          pm25_value,
          pm25_grade,
          no2_value,
          no2_grade,
          o3_value,
          o3_grade,
          so2_value,
          so2_grade,
          co_value,
          co_grade,
          dm_x,
          dm_y,
        } = d;
        const newData = {
          location: [Number(dm_x), Number(dm_y)],
          station: station_name,
          addressTitle: sido_name,
          addressSub: d.addr.split(' ')[1],
          date: data_time,
          airData: {
            PM10: {
              data: pm10_value,
              grade: pm10_grade,
            },
            PM25: {
              data: pm25_value,
              grade: pm25_grade,
            },
            NO2: {
              data: no2_value,
              grade: no2_grade,
            },
            O3: {
              data: o3_value,
              grade: o3_grade,
            },
            SO2: {
              data: so2_value,
              grade: so2_grade,
            },
            CO: {
              data: co_value,
              grade: co_grade,
            },
          },
        };
        // console.log(typeof dm_x);
        list.push(newData);
      });
      // console.log(list);
      this.logger.debug('get air pollution data successfully');
      return list;
    } catch (e) {
      this.logger.error('failed to get air pollution data.', { e });
      throw e;
    }
  }

  async getAverage() {
    this.logger.debug('start to get average of city air pollution data');
    try {
      const cityAverages = await this.averageRepository.find();
      let data = [];

      for (const cityAverage of cityAverages) {
        for (const cityCode of cityAverage.cityCodes) {
          data.push({
            cityCode: cityCode,
            cityName: cityAverage.cityName,
            sidoName: cityAverage.sidoName,
            dataTime: cityAverage.dataTime,
            pollutantsAverage: {
              PM10: cityAverage.pm10Grade,
              PM25: cityAverage.pm25Grade,
              NO2: cityAverage.no2Grade,
              O3: cityAverage.o3Grade,
              CO: cityAverage.coGrade,
              SO2: cityAverage.so2Grade,
            },
          });
        }
      }
      this.logger.debug('get average of city air pollution data successfully');

      return data;
    } catch (e) {
      this.logger.error('failed to get average of city air pollution data');
      throw e;
    }
  }

  // Haversine Distance 계산 함수
  async haversineDistance(
    maxLat: number,
    maxLng: number,
    minLat: number,
    minLng: number
  ) {
    const R = 6371.0; // 지구 반지름 (킬로미터 단위로 사용)

    // 위도와 경도를 라디안으로 변환하는 함수
    const toRadians = (degree) => (degree * Math.PI) / 180; // 도(degree) 값을 라디안(radian) 값으로 변환

    // 두 지점의 위도를 라디안으로 변환
    const φ1 = toRadians(maxLat); // 첫 번째 지점의 위도
    const φ2 = toRadians(minLat); // 두 번째 지점의 위도

    // 두 지점의 위도 차이를 계산하여 라디안으로 변환
    const Δφ = toRadians(maxLat - minLat); // 위도의 차이

    // 두 지점의 경도 차이를 계산하여 라디안으로 변환
    const Δλ = toRadians(maxLng - minLng); // 경도의 차이

    // Haversine 공식 적용
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 거리 계산
    const distance = R * c;

    return distance; // 두 지점 사이의 거리 반환 (킬로미터 단위)
  }

  // 특정 지점이 범위 내에 있는지 확인하는 함수
  async isWithinRange(centerLat, centerLon, targetLat, targetLon, radius) {
    // 중심 좌표와 대상 좌표 사이의 거리 계산
    const distance = await this.haversineDistance(
      centerLat,
      centerLon,
      targetLat,
      targetLon
    );

    // 거리와 반경을 비교하여 범위 내에 있는지 판단
    return distance <= radius;
  }
}
