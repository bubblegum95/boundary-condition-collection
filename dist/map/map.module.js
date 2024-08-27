"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapModule = void 0;
const common_1 = require("@nestjs/common");
const map_service_1 = require("./map.service");
const map_gateway_1 = require("./map.gateway");
const map_controller_1 = require("./map.controller");
const typeorm_1 = require("@nestjs/typeorm");
const pollutions_entity_1 = require("./entities/pollutions.entity");
const stations_entity_1 = require("./entities/stations.entity");
const city_entity_1 = require("./entities/city.entity");
const average_entity_1 = require("./entities/average.entity");
let MapModule = class MapModule {
};
exports.MapModule = MapModule;
exports.MapModule = MapModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pollutions_entity_1.Pollutions, stations_entity_1.Stations, city_entity_1.City, average_entity_1.Average])],
        providers: [map_gateway_1.MapGateway, map_service_1.MapService],
        controllers: [map_controller_1.MapController],
    })
], MapModule);
//# sourceMappingURL=map.module.js.map