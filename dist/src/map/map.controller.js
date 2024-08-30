"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapController = void 0;
const common_1 = require("@nestjs/common");
const map_service_1 = require("./map.service");
const locationInfo_dto_1 = require("./dto/locationInfo.dto");
const swagger_1 = require("@nestjs/swagger");
let MapController = class MapController {
    constructor(mapService) {
        this.mapService = mapService;
    }
    async getPollutionInfo(res, dto) {
        try {
            console.log('dto: ', dto);
            const data = await this.mapService.getPollutionInformation(dto);
            return res.status(common_1.HttpStatus.OK).json({
                message: '대기질 정보를 조회합니다.',
                data: data,
            });
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: e.message });
        }
    }
    async getAverage(res) {
        try {
            const data = await this.mapService.getAverage();
            return res.status(common_1.HttpStatus.OK).json({
                message: '시군구별 대기질 측정 평균값을 조회합니다.',
                data: data,
            });
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: e.message,
            });
        }
    }
    async getStation() {
        const dto = {
            addr: null,
            stationName: null,
            pageNo: 1,
            numOfRows: 661,
        };
        console.log('hi');
        await this.mapService.saveStations();
        console.log('bye');
    }
};
exports.MapController = MapController;
__decorate([
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({
        summary: '대기질 측정 정보 조회',
        description: '측정소별 대기질 측정 정보 조회',
    }),
    (0, common_1.Get)('pollution'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, locationInfo_dto_1.LocationInfoDto]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getPollutionInfo", null);
__decorate([
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({
        summary: '대기질 측정 정보 조회',
        description: '시군구별 대기질 측정 평균값 정보 조회',
    }),
    (0, common_1.Get)('average'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getAverage", null);
__decorate([
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({
        summary: '대기질 측정소',
        description: '대기질 측정소',
    }),
    (0, common_1.Get)('station'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getStation", null);
exports.MapController = MapController = __decorate([
    (0, swagger_1.ApiTags)('Map'),
    (0, common_1.Controller)('map'),
    __metadata("design:paramtypes", [map_service_1.MapService])
], MapController);
//# sourceMappingURL=map.controller.js.map