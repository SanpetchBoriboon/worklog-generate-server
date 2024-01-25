import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as dateFns from 'date-fns';
import * as tmp from 'tmp';
import * as fs from 'fs';
import { Workbook } from 'exceljs';

@Injectable()
export class WorklogFileService {

  logger: Logger

  constructor(){
    this.logger = new Logger('WorklogFileService')
  }

  async generateWorklog(file: Express.Multer.File) {
    try {
      const filePath = file.path;
      const fileName = file.originalname;
      const workbookExcel = XLSX.readFile(filePath);
      const sheetName = workbookExcel.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(
        workbookExcel.Sheets[sheetName],
      );

      const yaerMonth = fileName.split('_')[1].split('-');
      const prefixName = `Report JiraWorkLog - ${yaerMonth[0]}_${yaerMonth[1]}`;

      const worklogSheet = sheetData
        .sort((a, b) => {
          return (
            new Date(a['Started at']).valueOf() -
            new Date(b['Started at']).valueOf()
          );
        })
        .map((col) => {
          let timeSpent = col['Time Spent (seconds)'] / 3600;
          const worklogCol = {};
          worklogCol['Name'] = col['Author'];
          worklogCol['ISSUEKEY'] = col['Issue Key'];
          worklogCol['Subtask Name'] = col['Issue Summary'];
          worklogCol['Description'] = col['Comment'];
          worklogCol['Date'] = dateFns.format(
            new Date(col['Started at']),
            'dd/MM/yyyy',
          );
          worklogCol['Time Spent'] = timeSpent.toFixed(1) + 'h';
          return worklogCol;
        });

      let rows = [];

      for (const doc of worklogSheet) {
        rows.push(Object.values(doc));
      }

      let book = new Workbook();
      let sheet = book.addWorksheet(`sheet1`);
      rows.unshift(Object.keys(worklogSheet[0]));
      sheet.addRows(rows);

      let File = await new Promise((resolve, reject) => {
        tmp.file(
          { discardDescriptor: true, prefix: prefixName, postfix: '.xlsx' },
          async (err, file) => {
            if (err) {
              throw new BadRequestException(err);
            }

            book.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          },
        );
      });

      // Asynchronously delete a file
      fs.unlink(filePath, (err) => {
        if (err) {
          // Handle specific error if any
          if (err.code === 'ENOENT') {
            this.logger.error('File does not exist.');
          } else {
            throw err;
          }
        } else {
          this.logger.log(`${fileName} is deleted!`);
        }
      });

      return File;
    } catch (error) {
      this.logger.error('Error tranform data :', error);
    }
  }
}
