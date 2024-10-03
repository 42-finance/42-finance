import { Account, BalanceHistory, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { Builder, By, Key, until } from 'selenium-webdriver'

export const handler = async () => {
  await dataSource.initialize()

  const email = process.env.EMAIL as string
  const password = process.env.PASSWORD as string
  const accountId = process.env.ACCOUNT_ID as string
  const url = process.env.URL as string

  const account = await dataSource.getRepository(Account).findOneByOrFail({ id: accountId })

  const driver = await new Builder().forBrowser('firefox').build()

  try {
    await driver.get(url)

    const usernameInput = await driver.wait(until.elementLocated(By.id('username')), 10_000)
    await usernameInput.clear()
    await usernameInput.sendKeys(email)

    const passwordInput = await driver.findElement(By.id('password'))
    await passwordInput.clear()
    await passwordInput.sendKeys(password)

    await passwordInput.sendKeys(Key.RETURN)

    const balanceLabel = await driver.wait(
      until.elementLocated(By.xpath("//dt[text()='Principal Balance Remaining']")),
      15_000
    )
    const balanceValue = await balanceLabel.findElement(By.xpath('following-sibling::dd[1]'))
    const balanceText = await balanceValue.getText()

    const numericBalanceText = balanceText.replace(/[^0-9.]/g, '')
    const balance = parseFloat(numericBalanceText)

    await dataSource.getRepository(Account).update(accountId, { currentBalance: balance })

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistory)
      .values({
        date: startOfDay(new Date()),
        currentBalance: balance,
        accountId,
        householdId: account.householdId
      })
      .orIgnore()
      .execute()
  } catch (e) {
    console.log(e)
  } finally {
    await driver.quit()
  }

  console.log(`Web scraper lambda complete`)
}
