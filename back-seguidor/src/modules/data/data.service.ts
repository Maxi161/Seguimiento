import { Injectable } from '@nestjs/common';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

@Injectable()
export class DataService {
  async converToExcel(data) {
    // Crea una hoja de trabajo de Excel a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet([data]);

    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `seguimiento Data`);

    // Crea el directorio si no existe
    const exportDir = path.join(__dirname, '..', 'exports');

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Genera el archivo Excel en la ruta específica
    const filePath = path.join(
      exportDir,
      `${data.userId}_seguimiento_data.xlsx`,
    );
    XLSX.writeFile(workbook, filePath);
  }

  async updateExcel(data) {
    console.log(data);
    return data;
  }
}
