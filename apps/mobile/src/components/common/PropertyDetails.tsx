import { formatDollars } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Card, Title } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  tenants: number
  rent: number
  expenses: number
  cashFlow: number
  onExpensesClicked?: () => void
}

export const PropertyDetails: React.FC<Props> = ({ tenants, rent, expenses, cashFlow, onExpensesClicked }) => {
  const { currencyCode } = useUserTokenContext()

  return (
    <View style={{ backgroundColor: 'transparent', marginHorizontal: 5 }}>
      <Card mode="contained" style={{ marginTop: 10, flex: 1 }}>
        <Card.Title title="Tenants" right={() => <Title style={{ marginRight: 20 }}>{tenants}</Title>} />
      </Card>
      <Card mode="contained" style={{ marginTop: 10, flex: 1 }}>
        <Card.Title
          title="Rent"
          right={() => <Title style={{ marginRight: 20 }}>${formatDollars(rent, currencyCode)}</Title>}
        />
      </Card>
      <TouchableOpacity
        onPress={onExpensesClicked}
        style={{
          flex: 1,
          alignItems: 'stretch'
        }}
        disabled={onExpensesClicked == null}
      >
        <Card mode="contained" style={{ marginTop: 10 }}>
          <Card.Title
            title="Expenses"
            right={() => <Title style={{ marginRight: 20 }}>${formatDollars(expenses, currencyCode)}</Title>}
          />
        </Card>
      </TouchableOpacity>
      <Card mode="contained" style={{ marginTop: 10 }}>
        <Card.Title
          title="Cash Flow"
          right={() => (
            <Title style={{ marginRight: 20 }}>
              {cashFlow < 0 ? '-' : ''}${formatDollars(cashFlow, currencyCode)}
            </Title>
          )}
        />
      </Card>
    </View>
  )
}
