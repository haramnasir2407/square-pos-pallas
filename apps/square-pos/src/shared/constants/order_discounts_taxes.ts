import { v4 as uuidv4 } from 'uuid'

export const ORDER_LEVEL_DISCOUNTS: OrderDiscount[] = [
  {
    type: 'FIXED_PERCENTAGE',
    name: 'Summer Sale: 10% off',
    percentage: '10',
    scope: 'ORDER',
    uid: uuidv4(),
  },
]

export const ORDER_LEVEL_TAXES: OrderTax[] = [
  {
    type: 'ADDITIVE',
    name: 'Trade Tax',
    percentage: '11',
    scope: 'ORDER',
    uid: uuidv4(),
  },
]
