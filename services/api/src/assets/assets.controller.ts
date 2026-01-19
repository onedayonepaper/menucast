import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Post('upload')
  @RequireRole('OWNER', 'STAFF')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const created = await this.assets.upload(req.user.storeId, file);
    return ok(created);
  }

  @Get()
  @RequireRole('OWNER', 'STAFF')
  async list(@Req() req: any) {
    const items = await this.assets.list(req.user.storeId);
    return ok(items);
  }

  @Delete(':id')
  @RequireRole('OWNER', 'STAFF')
  async remove(@Req() req: any, @Param('id') id: string) {
    const result = await this.assets.remove(req.user.storeId, id);
    return ok(result);
  }
}
