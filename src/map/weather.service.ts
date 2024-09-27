import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as iconv from 'iconv-lite';
import Weather from './entities/weather.entity';
import { Observatory } from './entities/observatory.entity';
import { Repository } from 'typeorm';
import ObservatoryToCreateDto from './dto/observatory-to-create.dto';
import WeatherToCreateDto from './dto/weather-to-create.dto';
import WeatherToUpdateDto from './dto/weather-to-update.dto';
import ObservatoryToUpdateDto from './dto/observatory-to-update.dto';
import * as cron from 'node-cron';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
    @InjectRepository(Observatory)
    private readonly observatoryRepository: Repository<Observatory>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  @Cron('0 3 * * *')
  handleFetchObservatory() {
    this.fetchObservatory();
  }

  @Cron('0/10 * * * *')
  handleFetchWeather() {
    this.fetchWeather();
  }

  async saveObservatory(dto: ObservatoryToCreateDto) {
    try {
      this.logger.debug('start save observatories');
      const { num, name, lat, lng } = dto;
      const data = await this.observatoryRepository.save({
        num,
        name,
        lat,
        lng,
      });
      this.logger.debug('finish save observatories');
    } catch (error) {
      throw error;
    }
  }

  async updateObservatory(dto: ObservatoryToUpdateDto) {
    try {
      const { id, num, name, lat, lng } = dto;
      const data = await this.observatoryRepository.update(id, {
        num,
        name,
        lat,
        lng,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findObservatory(num: number) {
    const data = await this.observatoryRepository.findOne({
      where: { num },
      select: { id: true },
      relations: { weather: true },
    });

    return data;
  }

  async saveWeather(dto: WeatherToCreateDto) {
    try {
      this.logger.debug('start to save weather information');
      const { observatoryId, tamperature, humidity, measuredAt } = dto;
      this.logger.debug(
        `observatory id: ${observatoryId}, tamperature: ${tamperature}, humidity: ${humidity}, measured at: ${measuredAt}`
      );
      const data = await this.weatherRepository.save({
        observatoryId,
        tamperature,
        humidity,
        measuredAt,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateWeather(dto: WeatherToUpdateDto) {
    try {
      this.logger.debug('start to update weather information');
      const { observatoryId, tamperature, humidity, measuredAt } = dto;
      this.logger.debug(
        `observatory id: ${observatoryId}, tamperature: ${tamperature}, humidity: ${humidity}, measured at: ${measuredAt}`
      );
      const data = await this.weatherRepository.update(observatoryId, {
        tamperature,
        humidity,
        measuredAt,
      });
      return data;
    } catch (error) {
      this.logger.error('couldnt update weather data');
      this.logger.error(error.message);
      throw error;
    }
  }

  async fetchWeather() {
    this.logger.debug('start to fetch and update weather information data');
    try {
      const AUTH_KEY = this.configService.get('AUTH_KEY');
      const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?authKey=${AUTH_KEY}`;

      const response = await fetch(url);

      if (response.ok) {
        const txtdata = await response.text();
        const data = txtdata.split('\n').slice(4, -2);

        for (const row of data) {
          const fields = row.split(/\s+/);
          const num = Number(fields[1]);
          const foundOb = await this.findObservatory(num);

          if (foundOb) {
            if (!foundOb.weather) {
              const item = {
                measuredAt: fields[0],
                observatoryId: foundOb.id,
                tamperature: Number(fields[11]),
                humidity: Number(fields[13]),
              };
              await this.saveWeather(item);
            } else {
              const item = {
                observatoryId: foundOb.id,
                num,
                tamperature: Number(fields[11]),
                humidity: Number(fields[13]),
                measuredAt: fields[0],
              };
              await this.updateWeather(item);
              this.logger.debug('successfully update weather data');
            }
          } else {
            this.logger.debug('등록된 관측소가 없습니다.');
            continue;
          }
        }
      } else {
        throw new Error('응답없음');
      }
    } catch (error) {
      this.logger.error('couldnt fetch weather information data');
      this.logger.error(error.message);
    }
  }

  async fetchObservatory() {
    this.logger.debug('start to fetch and update observatories');

    try {
      const AUTH_KEY = this.configService.get('AUTH_KEY');
      const url = `https://apihub.kma.go.kr/api/typ01/url/stn_inf.php?inf=SFC&authKey=${AUTH_KEY}`;
      const response = await fetch(url);

      if (response.ok) {
        const ArrBuf = await response.arrayBuffer();
        const data = Buffer.from(ArrBuf);
        const decoded = iconv.decode(data, 'EUC-KR').split('\n').slice(4, -2);

        for (const row of decoded) {
          const fields = row.replace(/\'/g, '').trim().split(/\s+/);
          const num = Number(fields[0]);
          const foundOb = await this.findObservatory(num);

          if (!foundOb) {
            const dto = {
              num,
              name: fields[10],
              lat: Number(fields[2]),
              lng: Number(fields[1]),
            };

            await this.saveObservatory(dto);
          } else {
            const dto = {
              id: foundOb.id,
              num,
              name: fields[10],
              lat: Number(fields[2]),
              lng: Number(fields[1]),
            };
            await this.updateObservatory(dto);
            this.logger.debug('successfully update observatories');
          }
        }
      } else {
        throw new Error('응답없음');
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
