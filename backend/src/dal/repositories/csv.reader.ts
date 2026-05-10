import { Injectable } from '@nestjs/common';
import { ICsvReader } from '../interfaces/i-csv.reader';
import * as fs from 'fs';
import * as stream from 'stream';
const csvParser = require('csv-parser');

@Injectable()
export class CsvReader implements ICsvReader {
  readCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
