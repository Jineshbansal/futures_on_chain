### Transaction API
- Create `.env` file in this directory and store `PRIVATE_KEY` and `MODULE_ADDRESS`
- For details `python3 order-exec.py --help`

## Check Balance
```
python3 order-exec.py checkbalance
```
prints out the available Aptos Coin available in your account

## Sell Order (Market Price)
```
python3 order-exec.py sellatmarketorder
```
Places a sell order at the market price from your account

## Buy Order (Market Price)
```
python3 order-exec.py buyatmarketorder
```
Places a buy order at the market price from your account 


