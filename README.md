# Notepad 'n' Things
## Code Challenge

You work for a national chain of Notepads 'n' Things, a national chain of stationery and giftware stores. The CEO of Notepads 'n' Things is keen to know how the portfolio of stores performed in January during the 'back to school' season.

## Installation

Ensure you have the Yarn package manager.

Run:
`yarn build`

Optionally run tests:
`yarn test`

## Command Line Interface

Using the CLI and Node, Notepad 'n' Things staff can query the sales data JSON file.

Display the total sales reported by the flagship store in Chadstone:
`./query sales_data.json --centre "Chadstone"`

Display the centre which had the most sales:
`./query sales_data.json --best totalSales`

Display the total sales reported by stores in Victoria:
`./query sales_data.json --state VIC --totals`

Display the centre with the highest sales PSM:
`./query sales_data.json --best psm`
