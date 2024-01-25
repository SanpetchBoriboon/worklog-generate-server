import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorklogFileService } from './worklog-file.service';
import { Response } from 'express';

@Controller('worklogFile')
export class WorklogFileController {
  constructor(private readonly worklogFileService: WorklogFileService) {}

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
    res.download(`${result}`);
  }
}
