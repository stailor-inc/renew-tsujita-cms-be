import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { User } from '@entities/users';

@Injectable()
export class UserRepository extends BaseRepository<User> {}