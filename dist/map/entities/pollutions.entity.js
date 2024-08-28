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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pollutions = void 0;
const typeorm_1 = require("typeorm");
const stations_entity_1 = require("./stations.entity");
let Pollutions = class Pollutions {
};
exports.Pollutions = Pollutions;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pollutions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pollutions.prototype, "stationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], Pollutions.prototype, "stationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "dataTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "sidoName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "pm10Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "pm10Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "pm25Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "pm25Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "no2Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "no2Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "o3Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "o3Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "so2Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "so2Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "coValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 20 }),
    __metadata("design:type", String)
], Pollutions.prototype, "coGrade", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pollutions.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stations_entity_1.Stations, (stations) => stations.pollutions),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", stations_entity_1.Stations)
], Pollutions.prototype, "stations", void 0);
exports.Pollutions = Pollutions = __decorate([
    (0, typeorm_1.Entity)({ name: 'pollutions' })
], Pollutions);
//# sourceMappingURL=pollutions.entity.js.map