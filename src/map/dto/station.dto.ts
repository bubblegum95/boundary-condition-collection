import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StationDto {
  @IsString()
  @ApiProperty({
    example: '서울',
    description: '측정소 주소',
  })
  addr: string | null;

  @IsString()
  @ApiProperty({
    example: '측정소명',
    description: '종로구',
  })
  stationName: string | null;

  @IsString()
  @ApiProperty({
    example: 1,
    description: '페이지',
  })
  pageNo: number | null;

  @IsString()
  @ApiProperty({
    example: 661,
    description: '페이지당 측정소 목록 개수',
  })
  numOfRows: number | null;
}
