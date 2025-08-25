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

contract_address = "0xc694f211d4385c16fee79540d3276d6b6f407e252f4814c4596831c2405395eb"
me = Account.load_key("0xcd1eebe9cb95b6a646f9aa56a4552fbd48003aee698a328bd0725483a523ad7f")
alice = Account.load_key("0xdedce79fb8bb6170f3e3cebfda16b6af361347bb232cf24ef05b1df63cb898f2")
bob = Account.load_key("0x8a7ed58d321f4a185c8e0e21e44fd766679a53e55c9321a0cc64c5af6f867396")

async def fund():
    await faucet_client.fund_account("0x01b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6", 100_000_000)
    await faucet_client.fund_account("0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0", 100_000_000)

async def check_balance():
    alice_balance, bob_balance = await asyncio.gather(
        rest_client.account_balance(alice.address()),
        rest_client.account_balance(bob.address())
    )
    print(f"Alice: {alice.address}")
    print(f"Bob: {bob.address}")


async def buyMA(lvg, qty, price):
    await call_aptos_function(alice, "Orderbook", "buyAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def buyMB(lvg, qty, price):
    await call_aptos_function(bob, "Orderbook", "buyAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def sellMA(lvg, qty, price):
    await call_aptos_function(alice, "Orderbook", "sellAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def sellMB(lvg, qty, price):
    await call_aptos_function(bob, "Orderbook", "sellAtlimitorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

# async def transfer():
    # print("\n=== Transferring the token to Bob ===")
    # txn_hash = await rest_client.transfer(alice, "0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0", 1_000)  
    # await rest_client.wait_for_transaction(txn_hash)   
async def main(): 
    await fund()
    # await check_balance()
    for i in range(1, 30):
        bid = random.randint(0, 3)
        lvg = random.randint(1, 10)
        price = random.randint(1, 100)
        qty = random.randint(1, 10) 
        if bid == 1:
            await buyMA(lvg, qty, price)
        elif bid == 2:
            await buyMB(lvg, qty, price)
        elif bid == 3:
            await sellMA(lvg, qty, price)
        else:
            await sellMB(lvg, qty, price)
        
asyncio.run(main())