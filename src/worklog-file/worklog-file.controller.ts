import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Res,
  Header,
  Logger,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorklogFileService } from './worklog-file.service';
import { Response } from 'express';

@Controller('worklogFile')
export class WorklogFileController {
  logger: Logger;

  constructor(private readonly worklogFileService: WorklogFileService) {
    this.logger = new Logger('WorklogFileController');
  }

  @Post('generateFile')
  @Header('Content-Type', 'text/xlsx')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploadFile',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  public async uploadFile(
    @Res() res: Response,
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    let result = await this.worklogFileService.generateWorklog(file);
    this.logger.log('Download Successful')
    res.download(`${result}`);
  }
}
