import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Pollutions } from './entities/pollutions.entity';
import { ConfigService } from '@nestjs/config';
import { Stations } from './entities/stations.entity';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as cron from 'node-cron';
import { LocationInfoDto } from './dto/locationInfo.dto';
import moment from 'moment';
import { Average } from './entities/average.entity';
import GradeThresholds from './type/grade-thresholds.interface';
import { gradeThresholds } from './type/grade-thresholds.type';
import { sidoName } from './type/sido-name.type';
import { City } from './entities/city.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Pollutions)
    private readonly pollutionsRepository: Repository<Pollutions>,
    @InjectRepository(Stations)
    private readonly stationsRepository: Repository<Stations>,
    @InjectRepository(Average)
    private readonly averageRepository: Repository<Average>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService
  ) {
    cron.schedule('*/5 * * * *', () => {
      this.saveAverage();
    });
    cron.schedule('*/3 * * * *', () => {
      this.savePollutionInformation();
    });
    cron.schedule('0 2 * * *', () => {
      this.saveStations();
    });
  }

  hasNullValues(obj: Record<string, any>): boolean {
    for (const key in obj) {
      console.log('key', key);
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === '' ||
        obj[key] === '-' ||
        obj[key] === '통신장애'
      ) {
        return true;
      }
    }
    return false;
  }

  async savePollutionInformation() {
    try {
      const serviceKey = this.configService.get('SERVICE_KEY');
      const returnType = 'json';
      const numOfRows = 661;
      const pageNo = 1;
      const sidoName = '전국';
      const ver = '1.0';
      const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=${sidoName}&pageNo=${pageNo}&numOfRows=${numOfRows}&returnType=${returnType}&serviceKey=${serviceKey}&ver=${ver}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        // this.saveDataToFile(data.response.body.items);

        for (const item of data.response.body.items) {
          const {
            dataTime,
            sidoName,
            stationName,
            pm10Value,
            pm25Value,
            no2Value,
            o3Value,
            so2Value,
            coValue,
          } = item;
          const checkList = {
            dataTime,
            sidoName,
            stationName,
            pm10Value,
            pm25Value,
            no2Value,
            o3Value,
            so2Value,
            coValue,
          };
          if (this.hasNullValues(checkList)) continue;

          const pm10Grade = await this.saveGrade('pm10', pm10Value);
          const pm25Grade = await this.saveGrade('pm25', pm25Value);
          const no2Grade = await this.saveGrade('no2', no2Value);
          const o3Grade = await this.saveGrade('o3', o3Value);
          const coGrade = await this.saveGrade('co', coValue);
          const so2Grade = await this.saveGrade('so2', so2Value);

          const data = {
            dataTime,
            sidoName,
            stationName,
            pm10Value,
            pm10Grade,
            pm25Value,
            pm25Grade,
            no2Value,
            no2Grade,
            o3Value,
            o3Grade,
            so2Value,
            so2Grade,
            coValue,
            coGrade,
          };
          await this.savePollutionData(data);
        }
      } else {
        throw new Error('Failed to fetch pollution data');
      }
    } catch (e) {
      throw e;
    }
  }

  async savePollutionData(data) {
    try {
      const {
        dataTime,
        sidoName,
        stationName,
        pm10Value,
        pm10Grade,
        pm25Value,
        pm25Grade,
        no2Value,
        no2Grade,
        o3Value,
        o3Grade,
        so2Value,
        so2Grade,
        coValue,
        coGrade,
      } = data;
      const foundStation = await this.stationsRepository.findOne({
        where: { stationName },
        relations: {
          pollution: true,
        },
      });

      console.log(foundStation);

      if (!foundStation) {
        console.log(`등록된 ${stationName} 측정소가 없습니다.`);
        console.log('found station: ', foundStation);
        return;
      } else if (foundStation) {
        if (!foundStation.pollution) {
          console.log(
            `새로운 ${foundStation.stationName} 측정소의 측정값을 업로드합니다.`
          );
          await this.pollutionsRepository.save({
            stationId: foundStation.id,
            dataTime,
            sidoName,
            stationName,
            pm10Value,
            pm10Grade,
            pm25Value,
            pm25Grade,
            no2Value,
            no2Grade,
            o3Value,
            o3Grade,
            so2Value,
            so2Grade,
            coValue,
            coGrade,
          });
        } else {
          console.log(
            `${foundStation.stationName} 측정소의 측정값을 업데이트 합니다.`
          );
          console.log(data);
          await this.pollutionsRepository.update(foundStation.pollution.id, {
            dataTime,
            pm10Value,
            pm10Grade,
            pm25Value,
            pm25Grade,
            no2Value,
            no2Grade,
            o3Value,
            o3Grade,
            so2Value,
            so2Grade,
            coValue,
            coGrade,
          });
        }
      }
      return 'save air pollution data';
    } catch (e) {
      throw e;
    }
  }

  async saveDataToFile(data) {
    const fileName = moment().format('YYYY-MM-DD HH:mm:ss');
    const filePath = path.join(
      process.cwd(),
      'air_condition',
      `${fileName}.json`
    );
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
  }

  async saveStations() {
    try {
      const pageNo = 1;
      const numOfRows = 1000;
      const returnType = 'json';
      const serviceKey = this.configService.get('SERVICE_KEY');
      const url = `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList?&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}&returnType=${returnType}`;
      const response = await fetch(url);

      if (response.ok) {
        console.log('response ok');
        const data = await response.json();
        console.log(data);

        for (const item of data.response.body.items) {
          console.log('station info: ', item);
          const foundStation = await this.stationsRepository.findOne({
            where: { stationName: item.stationName },
            select: ['id', 'stationName'],
          });

          if (!foundStation) {
            console.log(`${item.stationName}을 업로드합니다.`);
            await this.stationsRepository.save({ ...item });
          } else {
            console.log(`${item.stationName}이 이미 존재합니다.`);
            return;
          }
        }
      } else {
        throw new BadRequestException('응답 없음');
      }
    } catch (e) {
      throw e;
    }
  }

  async saveAverage() {
    try {
      const serviceKey = this.configService.get('SERVICE_KEY2');
      const searchCondition = 'HOUR';
      const pageNo = 1;
      const numOfRows = 30;
      const returnType = 'json';

      for (let i = 0; i < sidoName.length; i++) {
        const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${sidoName[i]}&searchCondition=${searchCondition}&pageNo=${pageNo}&numOfRows=${numOfRows}&returnType=${returnType}&serviceKey=${serviceKey}`;
        const response = await fetch(url);

        if (response.ok) {
          console.log(response);
          console.log(`${i} 지역 측정소를 업데이트합니다.`);
          const data = await response.json();

          for (const item of data.response.body.items) {
            const {
              dataTime,
              sidoName,
              cityName,
              pm10Value,
              pm25Value,
              no2Value,
              o3Value,
              so2Value,
              coValue,
            } = item;
            const checkList = {
              dataTime,
              sidoName,
              cityName,
              pm10Value,
              pm25Value,
              no2Value,
              o3Value,
              so2Value,
              coValue,
            };
            const hasNull = this.hasNullValues(checkList);
            console.log('has null value: ', hasNull);
            if (hasNull) continue;

            const pm10Grade = await this.saveGrade('pm10', item.pm10Value);
            const pm25Grade = await this.saveGrade('pm25', item.pm25Value);
            const no2Grade = await this.saveGrade('no2', item.no2Value);
            const o3Grade = await this.saveGrade('o3', item.o3Value);
            const coGrade = await this.saveGrade('co', item.coValue);
            const so2Grade = await this.saveGrade('so2', item.so2Value);
            let cities = await this.cityRepository.find({
              where: [{ sidoName, guName: cityName }],
              select: { code: true },
            });

            if (!cities[0]) {
              cities = await this.cityRepository.find({
                where: [{ sidoName, gunName: cityName }],
              });
            }

            if (!cities[0]) {
              console.log(
                `해당 ${sidoName} ${cityName}를 데이터베이스에서 찾을 수 없습니다.`
              );
              continue;
            }
            const codes = cities.map((city) => Number(city.code));

            await this.averageRepository.save({
              ...item,
              cityCodes: codes,
              pm10Grade,
              pm25Grade,
              no2Grade,
              o3Grade,
              coGrade,
              so2Grade,
            });
          }
        } else {
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async saveGrade(type: keyof GradeThresholds, value: number) {
    const thresholds = gradeThresholds[type];

    for (const grade in thresholds) {
      const { min, max } = thresholds[grade];
      if (value >= min && value <= max) {
        return grade;
      }
    }

    return '등급 없음';
  }

  async getPollutionInformation(dto: LocationInfoDto) {
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

      return data;
    } catch (e) {
      throw e;
    }
  }

  async getAverage() {
    try {
      const cityAverages = await this.averageRepository.find();
      console.log('get average: ', cityAverages);

      let data = [];
      for (const cityAverage of cityAverages) {
        for (const cityCode of cityAverage.cityCodes) {
          data.push({
            cityCode: cityCode,
            cityName: cityAverage.cityName,
            sidoName: cityAverage.sidoName,
            dataTime: cityAverage.dataTime,
            pm10Grade: cityAverage.pm10Grade,
            pm25Grade: cityAverage.pm25Grade,
            no2Grade: cityAverage.no2Grade,
            o3Grade: cityAverage.o3Grade,
            coGrade: cityAverage.coGrade,
            so2Grade: cityAverage.so2Grade,
          });
        }
      }
      console.log('city average data: ', data);
      return data;
    } catch (e) {
      throw e;
    }
  }
}
