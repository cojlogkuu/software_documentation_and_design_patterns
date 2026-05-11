import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { IEstablishmentRepositoryToken } from '../../dal/interfaces/i-establishment.repository';
import type { IEstablishmentRepository } from '../../dal/interfaces/i-establishment.repository';
import { Establishment, Hotel, Restaurant } from '../../dal/entities/establishment.entity';

@Injectable()
export class EstablishmentService {
  constructor(
    @Inject(IEstablishmentRepositoryToken)
    private readonly establishmentRepo: IEstablishmentRepository,
  ) {}

  async getAll(): Promise<Establishment[]> {
    return this.establishmentRepo.getAllEstablishments();
  }

  async getById(id: number): Promise<Establishment> {
    const establishment = await this.establishmentRepo.getById(id);
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return establishment;
  }

  async create(data: any): Promise<Establishment> {
    this.validate(data);
    
    const existing = await this.establishmentRepo.getByName(data.name);
    if (existing) {
      throw new ConflictException('Establishment with this name already exists');
    }

    let entity: Establishment;
    if (data.type === 'Hotel') {
      const hotel = new Hotel();
      hotel.stars = data.stars;
      entity = hotel;
    } else {
      const restaurant = new Restaurant();
      restaurant.cuisineType = data.cuisineType;
      entity = restaurant;
    }
    entity.name = data.name;
    entity.address = data.address;
    entity.averageRating = data.averageRating || 0;

    // Use saveEstablishments directly to bypass repo.create() which strips class instance metadata
    const saved = await this.establishmentRepo.saveEstablishments([entity]);
    return saved[0];
  }

  async update(id: number, data: any): Promise<Establishment> {
    const existingEntity = await this.getById(id); // Ensure it exists
    if (data.name !== undefined || data.type !== undefined || data.stars !== undefined) {
       this.validate(data, true);
    }
    
    if (data.name) {
       const existing = await this.establishmentRepo.getByName(data.name);
       if (existing && existing.placeId !== id) {
         throw new ConflictException('Establishment with this name already exists');
       }
    }

    let updatedEntity = existingEntity;

    if (data.type === 'Hotel') {
      if (!(updatedEntity instanceof Hotel)) {
        const hotel = new Hotel();
        Object.assign(hotel, existingEntity);
        hotel.stars = data.stars;
        updatedEntity = hotel;
      } else {
        (updatedEntity as Hotel).stars = data.stars;
      }
    } else if (data.type === 'Restaurant') {
      if (!(updatedEntity instanceof Restaurant)) {
        const restaurant = new Restaurant();
        Object.assign(restaurant, existingEntity);
        restaurant.cuisineType = data.cuisineType;
        updatedEntity = restaurant;
      } else {
        (updatedEntity as Restaurant).cuisineType = data.cuisineType;
      }
    }

    if (data.name) updatedEntity.name = data.name;
    if (data.address) updatedEntity.address = data.address;

    const saved = await this.establishmentRepo.saveEstablishments([updatedEntity]);
    return saved[0];
  }

  async delete(id: number): Promise<void> {
    await this.getById(id); // Ensure it exists
    return this.establishmentRepo.delete(id);
  }

  private validate(data: any, isUpdate = false) {
    if (!isUpdate && !data.name) {
      throw new BadRequestException('Establishment name is required');
    }
    if (data.name && data.name.trim() === '') {
      throw new BadRequestException('Establishment name cannot be empty');
    }

    const type = data.type;
    
    if (!isUpdate && !type) {
      throw new BadRequestException('Establishment type (Hotel or Restaurant) is required');
    }

    if (type === 'Hotel' || data.stars !== undefined) {
      if (data.stars !== undefined && (data.stars < 1 || data.stars > 5)) {
        throw new BadRequestException('Hotel stars must be between 1 and 5');
      }
    }
    
    if (type === 'Restaurant') {
      if (!isUpdate && !data.cuisineType) {
         throw new BadRequestException('Restaurant must have a cuisineType');
      }
    }
  }
}
