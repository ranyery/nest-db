import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(createUserDto);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  public async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException();

    await this.usersRepository.update({ id }, updateUserDto);
    return { ...user, ...updateUserDto };
  }

  async remove(id: number): Promise<{ message: string }> {
    const { affected } = await this.usersRepository.delete(id);
    if (!affected) throw new NotFoundException();
    await this.usersRepository.delete(id);
    return { message: `User with id ${id} has been deleted successfully` };
  }
}
