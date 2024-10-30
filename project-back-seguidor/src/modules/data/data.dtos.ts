import {
  IsDate,
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DataToExcelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  estado: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  posicion: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  acciones: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  comentarios: string;

  @IsDate()
  @Type(() => Date)
  fechaPostulacion: Date;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  empresaContacto: string;

  @IsUrl()
  @IsOptional()
  linkPostulacion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  empresa: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  rubro: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nombreReclutador: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  filtroTelefonico: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  primerEntrevista: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  segunEntrevista: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tercerEntrevista: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  entrevistaExtra: Date;
}
