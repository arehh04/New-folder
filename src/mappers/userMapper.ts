import { UserDTO, UserModel, UserRole } from '../types';

/**
 * Maps a User DTO to a normalized UserModel
 */
export function mapUserDtoToModel(dto?: UserDTO | null): UserModel | null {
  if (!dto) return null;

  const role: UserRole = dto.role === 'admin' ? 'admin' : 'patron';

  return {
    id: Number(dto.id),
    username: dto.username || '',
    email: dto.email || `${dto.username || 'patron'}@maison-luxe.com`,
    role,
    fullName: dto.fullName || dto.username || 'Noble Patron',
    avatar: dto.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.username || 'P')}&background=2A173B&color=D4AF37`
  };
}
