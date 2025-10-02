from aptos_sdk.account import Account
from aptos_sdk.async_client import FaucetClient, RestClient, EntryFunction, TransactionPayload, Serializer, TransactionArgument
import os
import asyncio
import random

NODE_URL = os.getenv("APTOS_NODE_URL", "https://fullnode.devnet.aptoslabs.com/v1")
FAUCET_URL = os.getenv(
    "APTOS_FAUCET_URL",
    "https://faucet.devnet.aptoslabs.com",
)  

rest_client = RestClient(NODE_URL)
faucet_client = FaucetClient(FAUCET_URL, rest_client)  

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
    return resp

contract_address = "0xe15eb2a61d29dcd658e3d4b4cbd8f6c2d19f9442b8ede6c0cd75373d474682a0"
me = Account.load_key("0xcd1eebe9cb95b6a646f9aa56a4552fbd48003aee698a328bd0725483a523ad7f")
alice = Account.load_key("0x01b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6")
bob = Account.load_key("0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0")

async def fund():
    await faucet_client.fund_account(me.address(), 100_000_000)
    await faucet_client.fund_account(alice.address(), 100_000_000)
    await faucet_client.fund_account(bob.address(), 100_000_000)

async def check_balance():
    alice_balance, bob_balance = await asyncio.gather(
        rest_client.account_balance(alice.address()),
        rest_client.account_balance(bob.address())
    )
    print(f"Alice: {alice.address}")
    print(f"Bob: {bob.address}")


async def buyMA(lvg, qty, price, stop_loss):
    await call_aptos_function(alice, "Orderbook", "buyAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64), TransactionArgument(stop_loss, Serializer.u64)])

async def buyMB(lvg, qty, stop_loss):
    await call_aptos_function(bob, "Orderbook", "buyAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(stop_loss, Serializer.u64)])

async def sellMA(lvg, qty, stop_loss):
    await call_aptos_function(alice, "Orderbook", "sellAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(stop_loss, Serializer.u64)])

async def sellMB(lvg, qty, price, stop_loss):
    await call_aptos_function(bob, "Orderbook", "sellAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64), TransactionArgument(stop_loss, Serializer.u64)])

async def transfer():
    print("\n=== Transferring the token to Bob ===")
    await fund()
    txn_hash = await rest_client.transfer(alice, bob.address(), 1)  
    await rest_client.wait_for_transaction(txn_hash)   
async def main(): 
    # await fund()
    # await check_balance()
    for i in range(1, 10):
        print(f"Iteration {i}")
        bid = random.randint(0, 3)
        lvg = random.randint(1, 10)
        price = random.randint(1, 100)
        qty = random.randint(1, 10)
        stop_loss = price - 10 if price > 10 else price
        print(f"bid: {bid}, lvg: {lvg}, price: {price}, qty: {qty}, stop_loss: {stop_loss}")
        if bid == 0:
            await buyMA(lvg, qty,price, stop_loss)
        elif bid == 1:
            await buyMB(lvg, qty, stop_loss)
        elif bid == 2:
            await sellMA(lvg, qty, stop_loss)
        else:
            await sellMB(lvg, qty,price, stop_loss)
        
asyncio.run(main())