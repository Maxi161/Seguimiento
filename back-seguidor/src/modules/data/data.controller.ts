import {
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'src/entities/application.entity';
import { User } from 'src/entities/user.entity';

@Controller('/data')
export class DataController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  @Get('/:email')
  async exportarActual(@Param('email') email: string, @Res() res: Response) {
    const exportFolderPath = path.join(__dirname, '..', 'exports');
    const filePath = path.join(exportFolderPath, `${email}_data.xlsx`);

    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    res.download(filePath, `${email}_data.xlsx`, (err) => {
      if (err) {
        throw new HttpException(
          'Error downloading file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }

  @Post('add-data/:email')
  async addSeguimientoData(@Param('email') email: string) {
    const exportDir = path.join(__dirname, '..', 'exports');
    const filePath = path.join(exportDir, `${email}_data.xlsx`);

    // Crear el directorio de exportación si no existe
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Obtener el usuario y sus aplicaciones por email
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['applications'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const applicationsData = user.applications.map((app) => ({
      ID: app.id,
      estado: app.status,
      empresa: app.company,
      pisicion: app.position,
      acciones: app.actions,
      comentarios: app.comments,
      fecha_postulacion: app.applicationDate,
      nobmre_reclutador: app.recruiterName,
      contacto_empresa: app.companyContact,
      rubro: app.industry,
      link_postulacion: app.applicationLink,
      plataforma: app.platform,
      filtro_telefonico: app.phoneScreen,
      primera_entrevista: app.firstInterview,
      segunda_entrevista: app.secondInterview,
      tercer_entrevista: app.thirdInterview,
      entrevista_extra: app.extraInterview,
    }));

    // Cargar o crear el libro de Excel
    let workbook;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = XLSX.utils.book_new();
    }

    const sheetName = `${email} Data`;

    // Eliminar la hoja si ya existe
    if (workbook.Sheets[sheetName]) {
      delete workbook.Sheets[sheetName];
      const sheetIndex = workbook.SheetNames.indexOf(sheetName);
      if (sheetIndex !== -1) {
        workbook.SheetNames.splice(sheetIndex, 1);
      }
    }

    // Añadir los datos actualizados a la nueva hoja
    const worksheet = XLSX.utils.json_to_sheet(applicationsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Guardar el libro actualizado
    XLSX.writeFile(workbook, filePath);

    return {
      message: 'Data successfully added',
      fileName: `${email}_data.xlsx`,
    };
  }

  @Post('add-file-data/:email')
  @UseInterceptors(FileInterceptor('file'))
  async updateSeguimiento(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              /(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('email') email: string,
  ) {
    const exportDir = path.join(__dirname, '..', 'exports');
    const filePath = path.join(exportDir, `${email}_data.xlsx`);

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    let workbook;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = XLSX.utils.book_new();
    }

    let worksheet = workbook.Sheets[`${email} Data`];
    if (!worksheet) {
      worksheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, worksheet, `${email} Data`);
    }

    const uploadedWorkbook = XLSX.read(file.buffer, { type: 'buffer' });
    const uploadedSheet =
      uploadedWorkbook.Sheets[uploadedWorkbook.SheetNames[0]];
    const newData = XLSX.utils.sheet_to_json(uploadedSheet);

    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    jsonData.push(...newData);
    const updatedWorksheet = XLSX.utils.json_to_sheet(jsonData);

    workbook.Sheets[`${email} Data`] = updatedWorksheet;
    XLSX.writeFile(workbook, filePath);

    return {
      message: 'Archivo actualizado exitosamente',
      fileName: `${email}_data.xlsx`,
    };
  }
}
