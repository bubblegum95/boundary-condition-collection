import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async fetchWeather() {
    const AUTH_KEY = this.configService.get<'AUTH_KEY'>;
    const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?authKey=${AUTH_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = response.json();
    } else {
      throw new Error('응답없음');
    }
  }

  async fetchObservatory() {
    const AUTH_KEY = this.configService.get<'AUTH_KEY2'>;
    const url = `https://apihub.kma.go.kr/api/typ01/url/stn_inf.php?inf=SFC&authKey=${AUTH_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = response.json();
    } else {
      throw new Error('응답없음');
    }
  }
}
