import { dataSource, User } from 'database'

export async function getUserByEmail(email: string) {
  return await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
    .getOne()
}
