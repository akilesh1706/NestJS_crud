import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { UserEntity } from 'src/db/entities/user-entity';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    private manager: EntityManager
    constructor(
        @Inject('DataSource')
        private dataSource: DataSource
    ){
        this.manager = this.dataSource.manager;
    }
    //create user
    async createUser(data: createUserDto) {
        try {
            const user = await this.manager.findOneBy(UserEntity, {email: data.email})
            if(user) {
                throw new Error('User already exists, go to login')
            }
            const createUser = await this.manager.create(UserEntity, {
                email: data.email, 
                name: data.name, 
                password: data.password,
                mobile: data.mobile,
                gender: data.gender,
                date_of_birth: data.date_of_birth
            })
            await this.manager.save(UserEntity, createUser)
            return {message: 'User created successfully', createUser}
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    //update user
    async updateUser(id: string, data: updateUserDto) {
        try {
            const user = await this.manager.findOneBy(UserEntity, {id})
            if(user) {
                throw new Error('User not found')
            }
            user.date_of_birth = data.date_of_birth,
            user.email = data.email,
            user.gender = data.gender,
            user.mobile = data.mobile,
            user.name = data.name,
            user.password = data.password
            await this.manager.update(UserEntity, id, user)
            return {message: "User update successful"}
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
        
    }

    //delete user
    async deleteUser(id: string) {
        try {
            const user = await this.manager.findOneBy(UserEntity, {id})
            if(!user) {
                throw new Error('User is not found');
            }
            await this.manager.delete(UserEntity, id)
            return "Delete user successfully"
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    //getAll user
    async getAllUser() {
        try {
            const user = await this.manager.find(UserEntity)
            if(user.length == 0) {
                throw new Error('Data is not found')
            }
            return {message: 'Get data successfully', data: user}
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    //getUser by id
    async getUserById(id: string) {
        try {
            const user = await this.manager.findOneBy(UserEntity, {id})
            if(!user) {
                throw new Error('Data is not found')
            }
            return {message: 'Get data successfully', data: user}
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }
}
