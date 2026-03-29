import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nuevo@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ContraseñaSegura1', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ example: 'Nombre Apellido' })
  @IsString()
  @MinLength(1)
  name: string;
}
