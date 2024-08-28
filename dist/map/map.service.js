"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pollutions_entity_1 = require("./entities/pollutions.entity");
const config_1 = require("@nestjs/config");
const stations_entity_1 = require("./entities/stations.entity");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const cron = __importStar(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const average_entity_1 = require("./entities/average.entity");
const grade_thresholds_type_1 = require("./type/grade-thresholds.type");
const sido_name_type_1 = require("./type/sido-name.type");
const city_entity_1 = require("./entities/city.entity");
let MapService = class MapService {
    constructor(pollutionsRepository, stationsRepository, averageRepository, cityRepository, configService) {
        this.pollutionsRepository = pollutionsRepository;
        this.stationsRepository = stationsRepository;
        this.averageRepository = averageRepository;
        this.cityRepository = cityRepository;
        this.configService = configService;
        cron.schedule('*/1 * * * *', () => {
            this.savePollutionInformation();
        });
    }
    hasNullValues(obj) {
        for (const key in obj) {
            console.log('key', key);
            if (obj[key] === null ||
                obj[key] === undefined ||
                obj[key] === '' ||
                obj[key] === '-' ||
                obj[key] === '통신장애') {
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
                for (const item of data.response.body.items) {
                    const { dataTime, sidoName, stationName, pm10Value, pm25Value, no2Value, o3Value, so2Value, coValue, } = item;
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
                    if (this.hasNullValues(checkList))
                        continue;
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
            }
            else {
                throw new Error('Failed to fetch pollution data');
            }
        }
        catch (e) {
            throw e;
        }
    }
    async savePollutionData(data) {
        try {
            const foundStation = await this.stationsRepository.findOne({
                where: { stationName: data.stationName },
                select: { id: true },
                relations: {
                    pollutions: true,
                },
            });
            if (!foundStation) {
                console.log(`등록된 ${data.stationName} 측정소가 없습니다.`);
                console.log('found station: ', foundStation);
                return;
            }
            else if (foundStation) {
                if (!foundStation.pollutions) {
                    this.pollutionsRepository.save({
                        ...data,
                        stationId: foundStation.id,
                    });
                    console.log(`새로운 ${data.stationName} 측정소의 측정값을 업로드합니다.`);
                }
                else {
                    this.pollutionsRepository.update({ id: foundStation.pollutions.id }, { ...data });
                    console.log(`${foundStation.id} 측정소의 측정값을 업데이트 합니다.`);
                }
            }
            return 'save air pollution data';
        }
        catch (e) {
            throw e;
        }
    }
    async saveDataToFile(data) {
        const fileName = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        const filePath = path.join(process.cwd(), 'air_condition', `${fileName}.json`);
        const jsonData = JSON.stringify(data, null, 2);
        await fs_1.promises.writeFile(filePath, jsonData, 'utf8');
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
                    }
                    else {
                        console.log(`${item.stationName}이 이미 존재합니다.`);
                        return;
                    }
                }
            }
            else {
                throw new common_1.BadRequestException('응답 없음');
            }
        }
        catch (e) {
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
            for (let i = 0; i < sido_name_type_1.sidoName.length; i++) {
                const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${sido_name_type_1.sidoName[i]}&searchCondition=${searchCondition}&pageNo=${pageNo}&numOfRows=${numOfRows}&returnType=${returnType}&serviceKey=${serviceKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    console.log(response);
                    console.log(`${i} 지역 측정소를 업데이트합니다.`);
                    const data = await response.json();
                    for (const item of data.response.body.items) {
                        const { dataTime, sidoName, cityName, pm10Value, pm25Value, no2Value, o3Value, so2Value, coValue, } = item;
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
                        if (hasNull)
                            continue;
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
                            console.log(`해당 ${sidoName} ${cityName}를 데이터베이스에서 찾을 수 없습니다.`);
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
                }
                else {
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
    async saveGrade(type, value) {
        const thresholds = grade_thresholds_type_1.gradeThresholds[type];
        for (const grade in thresholds) {
            const { min, max } = thresholds[grade];
            if (value >= min && value <= max) {
                return grade;
            }
        }
        return '등급 없음';
    }
    async getPollutionInformation(dto) {
        const { minLat, maxLat, minLng, maxLng } = dto;
        try {
            const data = await this.pollutionsRepository
                .createQueryBuilder('pollutions')
                .innerJoinAndSelect('pollutions.station', 'stations')
                .addSelect(['stations.dm_y', 'stations.dm_x'])
                .where('stations.dm_x BETWEEN :minLat AND :maxLat', {
                minLat,
                maxLat,
            })
                .andWhere('stations.dm_y BETWEEN :minLng AND :maxLng', {
                minLng,
                maxLng,
            })
                .getMany();
            return data;
        }
        catch (e) {
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
        }
        catch (e) {
            throw e;
        }
    }
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pollutions_entity_1.Pollutions)),
    __param(1, (0, typeorm_1.InjectRepository)(stations_entity_1.Stations)),
    __param(2, (0, typeorm_1.InjectRepository)(average_entity_1.Average)),
    __param(3, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], MapService);
//# sourceMappingURL=map.service.js.map