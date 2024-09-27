import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Pollutions } from './entities/pollutions.entity';
import { Stations } from './entities/stations.entity';
import { Average } from './entities/average.entity';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cron from 'node-cron';
import { Logger } from 'winston';
import moment from 'moment';
import path from 'path';
import { promises as fs } from 'fs';
import { sidoName } from './type/sido-name.type';
import GradeThresholds from './type/grade-thresholds.interface';
import { gradeThresholds } from './type/grade-thresholds.type';
import { SavePollutionDto } from './dto/save-pollution.dto';
import { SaveAverageDto } from './dto/save-average.dto';

@Injectable()
export class AirPollutionService {
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
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {
    cron.schedule('*/30 * * * *', () => {
      this.saveAverage();
    });
    cron.schedule('*/10 * * * *', () => {
      this.checkPollutionInformation();
    });
    cron.schedule('0 2 * * *', () => {
      this.saveStations();
    });
    cron.schedule('0 1 1 * *', () => {
      this.saveDataToFile();
    });
  }

  hasNullValues(obj: Record<string, any>): boolean {
    try {
      for (const key in obj) {
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
    } catch (error) {
      throw error;
    }
  }

  async fetchPollutionData() {
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
        return data;
      } else {
        throw new Error('Failed to fetch pollution data. api was not working.');
      }
    } catch (error) {
      throw error;
    }
  }

  async findStationWithPollution(stationName: string) {
    return await this.stationsRepository.findOne({
      where: { stationName },
      relations: {
        pollution: true,
      },
    });
  }

  async findStation(stationName: string) {
    return await this.stationsRepository.findOne({
      where: { stationName: stationName },
      select: ['id', 'stationName'],
    });
  }

  async fixData(value: string) {
    try {
      const fixedData = Number.parseFloat(value).toFixed(2);
      return fixedData.toString();
    } catch (error) {
      throw error;
    }
  }

  async savePollutionData(data: SavePollutionDto) {
    this.logger.debug('start save pollution data.');
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

      const foundStation = await this.findStationWithPollution(stationName);

      if (!foundStation) {
        this.logger.debug(`등록된 ${stationName} 측정소가 없습니다.`);
        return;
      } else if (foundStation) {
        if (!foundStation.pollution) {
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

      return;
    } catch (e) {
      this.logger.error('failed to save pollution data');
      this.logger.error(e.message);
      throw e;
    }
  }

  async checkPollutionInformation() {
    this.logger.debug('start check pollution information data');
    try {
      const data = await this.fetchPollutionData();
      for (const item of data.response.body.items) {
        let {
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

        pm10Value = await this.fixData(pm10Value);
        pm25Value = await this.fixData(pm25Value);
        no2Value = await this.fixData(no2Value);
        o3Value = await this.fixData(o3Value);
        coValue = await this.fixData(coValue);
        so2Value = await this.fixData(so2Value);

        const pm10Grade = await this.saveGrade('pm10', pm10Value);
        const pm25Grade = await this.saveGrade('pm25', pm25Value);
        const no2Grade = await this.saveGrade('no2', no2Value);
        const o3Grade = await this.saveGrade('o3', o3Value);
        const coGrade = await this.saveGrade('co', coValue);
        const so2Grade = await this.saveGrade('so2', so2Value);
        const newData = {
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
        await this.savePollutionData(newData);
        this.logger.debug('fetch and save pollution informations successfully');
      }
    } catch (e) {
      this.logger.error(`Faild to fetch pollution data`);
      this.logger.error(e.message);
    }
  }

  async saveDataToFile() {
    this.logger.debug('start to fetch air pollution data');
    try {
      const data = await this.fetchPollutionData();
      const fileName = moment().format('YYYY-MM-DD HH:mm:ss');
      const filePath = path.join(
        process.cwd(),
        'air_condition',
        `${fileName}.json`
      );
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
      this.logger.debug('save air condition data to file');
    } catch (error) {
      this.logger.error('failed to save air pollution datas to file', error);
    }
  }

  async fetchStationData() {
    try {
      this.logger.debug('start to fetch station informations');
      const pageNo = 1;
      const numOfRows = 1000;
      const returnType = 'json';
      const serviceKey = this.configService.get('SERVICE_KEY');
      const url = `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList?&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}&returnType=${returnType}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new BadRequestException('응답 없음');
      }
    } catch (error) {
      throw error;
    }
  }

  async saveStations() {
    this.logger.debug('start to save station informations');
    try {
      const data = await this.fetchStationData();
      for (const item of data.response.body.items) {
        const foundStation = await this.findStation(item.stationName);

        if (!foundStation) {
          await this.stationsRepository.save({ ...item });
        } else {
          return;
        }
      }
    } catch (e) {
      this.logger.error('측정소 정보를 업데이트 할 수 없습니다.');
      throw e;
    }
  }

  async fetchAverage(sidoName: string) {
    try {
      this.logger.debug(`sido name: ${sidoName}`);
      const serviceKey = this.configService.get('SERVICE_KEY');
      const returnType = 'json';
      const url = `https://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?serviceKey=${serviceKey}&returnType=${returnType}&numOfRows=100&pageNo=1&sidoName=${sidoName}&searchCondition=HOUR`;
      const response = await fetch(url);

      if (response.ok) {
        const data = response.json();
        return data;
      } else {
        this.logger.debug('응답 없음');
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async findCityInGuName(
    sidoName: string,
    guName: string
  ): Promise<City[] | null> {
    try {
      const data = await this.cityRepository.find({
        where: [{ sidoName, guName }],
        select: { code: true },
      });

      if (data.length !== 0) {
        return data;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async findCityInGunName(
    sidoName: string,
    gunName: string
  ): Promise<City[] | null> {
    try {
      const data = await this.cityRepository.find({
        where: [{ sidoName, gunName }],
      });

      if (data[0]) {
        return data;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async saveNewAverageInfo(dto: SaveAverageDto) {
    const {
      item,
      cityCodes,
      pm10Grade,
      pm25Grade,
      no2Grade,
      o3Grade,
      coGrade,
      so2Grade,
    } = dto;
    try {
      const data = await this.averageRepository.save({
        ...item,
        cityCodes,
        pm10Grade,
        pm25Grade,
        no2Grade,
        o3Grade,
        coGrade,
        so2Grade,
      });

      if (data) {
        return data;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async findAverageData(sidoName: string, cityName: string) {
    try {
      return await this.averageRepository.findOne({
        where: { sidoName, cityName },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAverageInfo(
    id: number,
    dataTime: string,
    sidoName: string,
    cityName: string,
    cityCodes: number[],
    pm10Value: string,
    pm25Value: string,
    no2Value: string,
    o3Value: string,
    so2Value: string,
    coValue: string,
    pm10Grade: string,
    pm25Grade: string,
    no2Grade: string,
    o3Grade: string,
    coGrade: string,
    so2Grade: string
  ) {
    try {
      return await this.averageRepository.update(id, {
        dataTime,
        sidoName,
        cityName,
        cityCodes,
        pm10Value,
        pm25Value,
        no2Value,
        o3Value,
        so2Value,
        coValue,
        pm10Grade,
        pm25Grade,
        no2Grade,
        o3Grade,
        coGrade,
        so2Grade,
      });
    } catch (error) {
      throw error;
    }
  }

  async findCityCode(sidoName: string, cityName: string): Promise<number[]> {
    try {
      let cities = await this.findCityInGuName(sidoName, cityName);

      if (!cities || cities.length === 0) {
        cities = await this.findCityInGunName(sidoName, cityName);
      }

      if (!cities || cities.length === 0) {
        this.logger.debug(
          `해당 city ${sidoName} ${cityName}를 table 에서 찾을 수 없습니다.`
        );

        return [];
      }

      const codes = cities.map((city) => Number(city.code));

      return codes;
    } catch (error) {
      throw error;
    }
  }

  async saveAverage(): Promise<void> {
    this.logger.debug('start to save average of city air pollution');
    try {
      for (let i = 0; i < sidoName.length; i++) {
        setTimeout(async () => {
          const data = await this.fetchAverage(sidoName[i]);
          for (const item of data.response.body.items) {
            let {
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

            if (hasNull) continue;

            pm10Value = await this.fixData(pm10Value);
            pm25Value = await this.fixData(pm25Value);
            no2Value = await this.fixData(no2Value);
            o3Value = await this.fixData(o3Value);
            coValue = await this.fixData(coValue);
            so2Value = await this.fixData(so2Value);

            const pm10Grade = await this.saveGrade('pm10', item.pm10Value);
            const pm25Grade = await this.saveGrade('pm25', item.pm25Value);
            const no2Grade = await this.saveGrade('no2', item.no2Value);
            const o3Grade = await this.saveGrade('o3', item.o3Value);
            const coGrade = await this.saveGrade('co', item.coValue);
            const so2Grade = await this.saveGrade('so2', item.so2Value);
            const foundData = await this.findAverageData(sidoName, cityName);
            const codes = await this.findCityCode(sidoName, cityName);

            if (foundData) {
              await this.updateAverageInfo(
                foundData.id,
                dataTime,
                sidoName,
                cityName,
                codes,
                pm10Value,
                pm25Value,
                no2Value,
                o3Value,
                so2Value,
                coValue,
                pm10Grade,
                pm25Grade,
                no2Grade,
                o3Grade,
                coGrade,
                so2Grade
              );
            } else {
              const dto = {
                item,
                cityCodes: codes,
                pm10Grade,
                pm25Grade,
                no2Grade,
                o3Grade,
                coGrade,
                so2Grade,
              };
              await this.saveNewAverageInfo(dto);
            }
          }
        }, i * 5000); // 5초 간격으로 실행
      }
    } catch (error) {
      this.logger.error(`failed to save average of city air pollution.`);
      this.logger.error(error.message);
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
}
