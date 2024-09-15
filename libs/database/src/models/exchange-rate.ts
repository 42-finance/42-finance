import { CurrencyCode } from 'shared-types'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class ExchangeRate {
  @PrimaryColumn()
  date: Date = new Date()

  @PrimaryColumn({ type: 'enum', enum: CurrencyCode })
  currencyCode: CurrencyCode = CurrencyCode.CAD

  @Column({ type: 'double precision' })
  exchangeRate: number = 0
}
