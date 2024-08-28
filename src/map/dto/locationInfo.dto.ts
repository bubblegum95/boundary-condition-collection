import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocationInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '최대 위도(y좌표)',
    example: 37.53,
  })
  @Transform(({ value }) => parseFloat(value))
  maxLat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '최대 경도(x좌표)',
    example: 127.08,
  })
  @Transform(({ value }) => parseFloat(value))
  maxLng: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '최소 위도(y좌표)',
    example: 37.49,
  })
  @Transform(({ value }) => parseFloat(value))
  minLat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '최소 경도(x좌표)',
    example: 127.03,
  })
  @Transform(({ value }) => parseFloat(value))
  minLng: number;
}
