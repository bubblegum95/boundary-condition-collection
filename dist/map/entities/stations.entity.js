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
exports.Stations = void 0;
const typeorm_1 = require("typeorm");
const pollutions_entity_1 = require("./pollutions.entity");
let Stations = class Stations {
};
exports.Stations = Stations;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stations.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 50, unique: true }),
    __metadata("design:type", String)
], Stations.prototype, "stationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 100, unique: true }),
    __metadata("design:type", String)
], Stations.prototype, "addr", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: false,
    }),
    __metadata("design:type", Number)
], Stations.prototype, "dmX", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: false,
    }),
    __metadata("design:type", Number)
], Stations.prototype, "dmY", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => pollutions_entity_1.Pollutions, (pollutions) => pollutions.stations, {
        eager: true,
    }),
    __metadata("design:type", pollutions_entity_1.Pollutions)
], Stations.prototype, "pollutions", void 0);
exports.Stations = Stations = __decorate([
    (0, typeorm_1.Entity)({ name: 'stations' })
], Stations);
//# sourceMappingURL=stations.entity.js.map