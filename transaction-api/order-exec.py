from aptos_sdk.account import Account
from aptos_sdk.async_client import FaucetClient, RestClient, EntryFunction, TransactionPayload, Serializer, TransactionArgument
import os
import asyncio
import random
import typer
import subprocess
from rich import print as rprint
import subprocess
from dotenv import load_dotenv
import os
import cli_box

load_dotenv()

app = typer.Typer()

NODE_URL = os.getenv("APTOS_NODE_URL", "https://fullnode.devnet.aptoslabs.com/v1")
FAUCET_URL = os.getenv(
    "APTOS_FAUCET_URL",
    "https://faucet.devnet.aptoslabs.com",
)  

rest_client = RestClient(NODE_URL)

async def call_aptos_function(user ,module, function, type_args, args):
    payload = EntryFunction.natural(
            f"{contract_address}::{module}",
            function,
            type_args,
            args,
        )
    txn = await rest_client.create_bcs_signed_transaction(user, TransactionPayload(payload))
    resp = await rest_client.submit_bcs_transaction(txn)
    await rest_client.wait_for_transaction(resp)
    print(f"You can check more details of your transaction using this tx_hash: {resp}")
    return resp

contract_address = os.environ['MODULE_ADDRESS']
me = Account.load_key("0xcd1eebe9cb95b6a646f9aa56a4552fbd48003aee698a328bd0725483a523ad7f")
private_key = os.environ['PRIVATE_KEY']

async def buyLim(lvg, qty, price, private_key):
    me = Account.load_key(private_key)
    await call_aptos_function(me, "Orderbook", "buyAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def sellLim(lvg, qty, price, private_key):
    me = Account.load_key(private_key)
    await call_aptos_function(me, "Orderbook", "sellAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def buyMarket(lvg, qty, private_key):
    me = Account.load_key(private_key)
    await call_aptos_function(me, "Orderbook", "buyAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(Serializer.u64)])

async def sellMarket(lvg, qty, private_key):
    me = Account.load_key(private_key)
    await call_aptos_function(me, "Orderbook", "sellAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(Serializer.u64)])

@app.command()
def buyatlimitorder(lvg: int, qty: int, price: int, private_key: str = private_key):
    asyncio.run(buyLim(lvg, qty, price, private_key))
    print(cli_box.rounded(f"Order Details: \nLevearage: {lvg}x\nQuantity: {qty}\nLimit Price: {price}"))

@app.command()
def sellatlimitorder(lvg: int, qty: int, price: int, private_key: str = private_key):
    asyncio.run(sellLim(lvg, qty, price, private_key))
    print(cli_box.rounded(f"Order Details: \nLevearage: {lvg}x\nQuantity: {qty}\nLimit Price: {price}"))

@app.command()
def buyatmarketorder(lvg: int, qty: int, price: int, private_key: str = private_key):
    asyncio.run(buyLim(lvg, qty, price, private_key))
    print(cli_box.rounded(f"Order Details: \nLevearage: {lvg}x\nQuantity: {qty}\nLimit Price: {price}"))

@app.command()
def sellatmarketorder(lvg: int, qty: int, price: int, private_key: str = private_key):
    asyncio.run(buyLim(lvg, qty, price, private_key))
    print(cli_box.rounded(f"Order Details: \n Levearage: {lvg}x\nQuantity: {qty}\nLimit Price: {price}"))

@app.command()
def checkbalance(address: str):
    print(f"Wallet Address: {asyncio.run(rest_client.account_balance(address))/pow(10, 8)} APT")

if __name__ == '__main__':
    asyncio.run(app())
