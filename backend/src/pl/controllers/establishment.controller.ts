import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EstablishmentService } from '../../bll/services/establishment.service';
import { Establishment } from '../../dal/entities/establishment.entity';

@Controller('establishments')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Get()
  async getAll(): Promise<Establishment[]> {
    return this.establishmentService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Establishment> {
    return this.establishmentService.getById(id);
  }

  @Post()
  async create(@Body() data: any): Promise<Establishment> {
    return this.establishmentService.create(data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<Establishment> {
    return this.establishmentService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.establishmentService.delete(id);
  }
}
