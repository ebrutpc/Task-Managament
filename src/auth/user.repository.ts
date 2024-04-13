import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcyrpt.genSalt();
    const hashedPassword = await bcyrpt.hash(password, salt);

    const user = this.repository.create({ username, password: hashedPassword });
    try {
      await this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.', {
          cause: error.detail,
          description: error.query,
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUserName(username: string): Promise<User> {
    return this.repository.findOne({ where: { username } });
  }
}
