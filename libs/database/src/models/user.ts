import { CurrencyCode } from 'shared-types'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base-entity'
import { HouseholdUser } from './household-user'
import { NotificationSetting } from './notification-setting'
import { NotificationToken } from './notification-token'
import { Property } from './property'
import { Tenant } from './tenant'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ length: 100, unique: true, nullable: false })
  email: string = ''

  @Column({ type: String, nullable: true })
  passwordHash: string | null = null

  @Column({ length: 100, nullable: false })
  name: string = ''

  @Column({ type: String, nullable: true })
  phone: string | null = null

  @Column({ default: false })
  emailConfirmed: boolean = false

  @Column({ type: 'enum', enum: CurrencyCode, default: CurrencyCode.USD })
  currencyCode: CurrencyCode = CurrencyCode.USD

  @Column({ type: String, nullable: true })
  timezone: string | null = null

  @Column({ default: false })
  hideGettingStarted: boolean = false

  @Column({ default: false })
  hideWhatsNew: boolean = false

  @Column({ default: false })
  hideCommunity: boolean = false

  @Column({ default: false })
  hideOpenSource: boolean = false

  @Column({ default: false })
  profileUpdated: boolean = false

  @Column({ nullable: true, unique: true })
  referralCode: string = ''

  @Column({ nullable: true })
  stripeCustomerId: string = ''

  @Column({ type: Date, nullable: true })
  lastLoginTime: Date | null = null

  @OneToMany(() => HouseholdUser, (householdUser) => householdUser.user)
  householdUsers!: HouseholdUser[]

  @OneToMany(() => Property, (property) => property.landlord)
  properties!: Property[]

  @OneToMany(() => Tenant, (tenant) => tenant.user)
  tenants!: Tenant[]

  @OneToMany(() => NotificationToken, (notificationToken) => notificationToken.user)
  notificationTokens!: NotificationToken[]

  @OneToMany(() => NotificationSetting, (notificationSetting) => notificationSetting.user)
  notificationSettings!: NotificationSetting[]
}
