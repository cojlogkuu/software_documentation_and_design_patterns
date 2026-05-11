import { Controller, Post, Get, Body } from '@nestjs/common';
import { ExportService } from '../../bll/services/export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('execute')
  async executeExport(@Body('strategyType') strategyType: string) {
    return this.exportService.executeExport(strategyType);
  }

  @Get('violations')
  async getViolations() {
    return this.exportService.getAllViolations();
  }
}
