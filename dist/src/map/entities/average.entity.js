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
exports.Average = void 0;
const typeorm_1 = require("typeorm");
let Average = class Average {
};
exports.Average = Average;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Average.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', array: true, nullable: false }),
    __metadata("design:type", Array)
], Average.prototype, "cityCodes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 6 }),
    __metadata("design:type", String)
], Average.prototype, "cityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 6 }),
    __metadata("design:type", String)
], Average.prototype, "sidoName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "dataTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 10 }),
    __metadata("design:type", String)
], Average.prototype, "pm10Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 5 }),
    __metadata("design:type", String)
], Average.prototype, "pm10Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 10 }),
    __metadata("design:type", String)
], Average.prototype, "pm25Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 5 }),
    __metadata("design:type", String)
], Average.prototype, "pm25Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 5 }),
    __metadata("design:type", String)
], Average.prototype, "no2Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 5 }),
    __metadata("design:type", String)
], Average.prototype, "no2Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 5 }),
    __metadata("design:type", String)
], Average.prototype, "o3Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "o3Grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "coValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "coGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "so2Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 30 }),
    __metadata("design:type", String)
], Average.prototype, "so2Grade", void 0);
exports.Average = Average = __decorate([
    (0, typeorm_1.Entity)({ name: 'average' })
], Average);
//# sourceMappingURL=average.entity.js.map