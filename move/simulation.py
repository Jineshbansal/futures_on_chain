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

contract_address = "0x1daa32d80efdfed99a137ec5bb2ee62a59fd6aa922d186fb5d00ae58281ae264"
me = Account.load_key("0xcd1eebe9cb95b6a646f9aa56a4552fbd48003aee698a328bd0725483a523ad7f")
alice = Account.load_key("0x01b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6")
bob = Account.load_key("0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0")

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
    await call_aptos_function(alice, "Orderbook", "sellAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def sellMB(lvg, qty, price):
    await call_aptos_function(bob, "Orderbook", "sellAtMarketorder", [], [TransactionArgument(lvg, Serializer.u64),TransactionArgument(qty, Serializer.u64), TransactionArgument(price, Serializer.u64)])

async def transfer():
    print("\n=== Transferring the token to Bob ===")
    txn_hash = await rest_client.transfer(alice, "0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0", 1_000)  
    await rest_client.wait_for_transaction(txn_hash)   
# async def main(): 
#     await fund()
#     await check_balance()
    # for i in range(1, 1000):
    #     bid = random.randint(0, 3)
    #     lvg = random.randint(1, 10)
    #     price = random.randint(1, 100)
    #     qty = random.randint(1, 10) 
    #     if bid == 1:
    #         await buyMA(lvg, qty, price)
    #     elif bid == 2:
    #         await buyMB(lvg, qty, price)
    #     elif bid == 3:
    #         await sellMA(lvg, qty, price)
    #     else:
    #         await sellMB(lvg, qty, price)
        
asyncio.run(transfer())