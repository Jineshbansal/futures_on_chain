module Team18::Orderbook {
    use std::signer;
    use aptos_std::table::{Self,Table};
    use std::string::{Self};
    use std::vector;
    use aptos_framework::resource_account;
    use aptos_framework::account;
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::aptos_coin::{AptosCoin};
    use aptos_framework::event;
    use aptos_framework::timestamp;
    struct Resource has key {
        resource_signer_cap: account::SignerCapability,
        bids: vector<User>,
        asks: vector<User>,
        buyers:vector<User>,
        sellers:vector<User>, 
        
    }
    struct User has store ,copy,drop{
        lvg:u64,
        stock_price:u64,
        qty:u64,
        user_address: address,
    }

    fun init_module(account : &signer) {
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(account, @source_addr);
        
        move_to(account, Resource {
            resource_signer_cap,
            buyers:vector::empty<User>(),
            sellers:vector::empty<User>(),
            bids: vector::empty<User>(),
            asks: vector::empty<User>(),

        });

       
    }

    public entry fun buyAtlimitorder(account:&signer,lvg:u64,qty:u64,stock_price:u64) acquires Resource
    {
        let resource = borrow_global_mut<Resource>(@Team18);
        let aptos_coin = coin::withdraw<AptosCoin>(account, (qty*stock_price)/lvg);
        coin::deposit(@Team18, aptos_coin);

        //Esharky bhaiya code

        let i = vector::length(&resource.asks);
        if (i == 0) {
            let usr= User{
            lvg,
            stock_price,
            qty,
            user_address: signer::address_of(account),
            };
            vector::push_back(&mut resource.bids, usr);
            //Sorting had to be done.....
            return
        };
        while (i > 0) { 
            // let ask = &mut &orderBook.asks[i];
            i = i - 1;
            let ask = vector::borrow_mut(&mut resource.asks, i);
            let ask_price = ask.stock_price;
            if (ask_price > stock_price) continue;
            if (ask.qty < qty) {
             
                qty = qty - ask.qty;
                vector::push_back(&mut resource.sellers,*ask);
                
                vector::push_back(&mut resource.buyers,User{
                    qty:ask.qty,
                    stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::remove(&mut resource.asks, i);
            } 
            else {

                ask.qty = ask.qty - qty;
                vector::push_back(&mut resource.buyers,User{
                    qty:qty,
                    stock_price,
                    user_address: signer::address_of(account),
                    lvg:lvg,
                });
                vector::push_back(&mut resource.sellers,User{
                    qty:qty,
                    stock_price:ask.stock_price,
                    user_address:ask.user_address,
                    lvg:ask.lvg,
                });
                qty = 0;
                if (ask.qty == 0) { vector::remove(&mut resource.asks, i); };
                break
            }
        };
        if(qty > 0) {
            let usr= User{
            lvg:lvg,
            stock_price,
            qty,
            user_address: signer::address_of(account),
            };
            vector::push_back(&mut resource.bids, usr);
            //sort bid
            // sortDescending(&mut resource.bids);
        };
        

    }

    public entry fun sellAtlimitorder(account:&signer,lvg:u64,qty:u64,stock_price:u64) acquires Resource
    {
        let resource = borrow_global_mut<Resource>(@Team18);
        let aptos_coin = coin::withdraw<AptosCoin>(account, (qty*stock_price)/lvg);
        coin::deposit(@Team18, aptos_coin);

        //Esharky bhaiya code

        let i = vector::length(&resource.bids);
        if (i == 0) {
            let usr= User{
            lvg,
            stock_price,
            qty,
            user_address: signer::address_of(account),
            };
            vector::push_back(&mut resource.asks, usr);
            //Sorting had to be done.....
            return
        };
        while (i > 0) { 
            // let ask = &mut &orderBook.asks[i];
            i = i - 1;
            let bid = vector::borrow_mut(&mut resource.bids, i);
            let ask_price = bid.stock_price;
            // check sort
            if (ask_price < stock_price) continue;
            if (bid.qty < qty) {

                qty = qty - bid.qty;
                vector::push_back(&mut resource.buyers,*bid);
                
                vector::push_back(&mut resource.sellers,User{
                    qty:bid.qty,
                    stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::remove(&mut resource.bids, i);
            } 
            else {

                bid.qty = bid.qty - qty;
                vector::push_back(&mut resource.sellers,User{
                    qty:qty,
                    stock_price,
                    user_address: signer::address_of(account),
                    lvg:lvg,
                });
                vector::push_back(&mut resource.buyers,User{
                    qty:qty,
                    stock_price:bid.stock_price,
                    user_address:bid.user_address,
                    lvg:bid.lvg,
                });
                qty = 0;
                if (bid.qty == 0) { vector::remove(&mut resource.bids, i); };
                break
            };
        };
        if(qty > 0) {
            let usr= User{
            lvg:lvg,
            stock_price,
            qty,
            user_address: signer::address_of(account),
            };
            vector::push_back(&mut resource.asks, usr);
            //sort bid
            // sortDescending(&mut resource.asks);
        };
        

    }

    public entry fun buyAtMarketorder(account:&signer,lvg:u64,qty:u64) acquires Resource
    {
        let resource = borrow_global_mut<Resource>(@Team18);
        //Esharky bhaiya code
        let i = vector::length(&resource.asks);
        while (i > 0) {
            // let ask = &mut &orderBook.asks[i];
            i = i - 1;
            let ask = vector::borrow_mut(&mut resource.asks, i);            
            if (ask.qty < qty) {

                qty = qty - ask.qty;
                vector::push_back(&mut resource.sellers,*ask);
                
                let aptos_coin = coin::withdraw<AptosCoin>(account, (ask.qty*ask.stock_price)/lvg);
                coin::deposit(@Team18, aptos_coin);
                vector::push_back(&mut resource.buyers,User{
                    qty:ask.qty,
                    stock_price:ask.stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::remove(&mut resource.asks, i);

            } 
            else {

                
                ask.qty = ask.qty - qty;
                let aptos_coin = coin::withdraw<AptosCoin>(account, (qty*ask.stock_price)/lvg);
                coin::deposit(@Team18, aptos_coin);
                vector::push_back(&mut resource.buyers,User{
                    qty:qty,
                    stock_price:ask.stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::push_back(&mut resource.sellers,User{
                    qty:qty,
                    stock_price:ask.stock_price,
                    user_address: ask.user_address,
                    lvg:ask.lvg,
                });
                qty=0;
                if (ask.qty == 0) { vector::remove(&mut resource.asks, i); };
                break
            };
        };
        if(qty>0)
        {
            abort 11
        };

    }

    public entry fun sellAtMarketorder(account:&signer,lvg:u64,qty:u64) acquires Resource
    {
        let resource = borrow_global_mut<Resource>(@Team18);
        //Esharky bhaiya code
        let i = vector::length(&resource.bids);
        while (i > 0) {
            // let ask = &mut &orderBook.asks[i];
            i = i - 1;
            let bid = vector::borrow_mut(&mut resource.bids, i);            
            if (bid.qty < qty) {

                qty = qty - bid.qty;
                vector::push_back(&mut resource.buyers,*bid);
                
                let aptos_coin = coin::withdraw<AptosCoin>(account, (bid.qty*bid.stock_price)/lvg);
                coin::deposit(@Team18, aptos_coin);
                vector::push_back(&mut resource.sellers,User{
                    qty:bid.qty,
                    stock_price:bid.stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::remove(&mut resource.bids, i);

            } 
            else {

                
                bid.qty = bid.qty - qty;
                let aptos_coin = coin::withdraw<AptosCoin>(account, (qty*bid.stock_price)/lvg);
                coin::deposit(@Team18, aptos_coin);
                vector::push_back(&mut resource.sellers,User{
                    qty:qty,
                    stock_price:bid.stock_price,
                    user_address: signer::address_of(account),
                    lvg,
                });
                vector::push_back(&mut resource.buyers,User{
                    qty:qty,
                    stock_price:bid.stock_price,
                    user_address: bid.user_address,
                    lvg:bid.lvg,
                });
                qty=0;
                if (bid.qty == 0) { vector::remove(&mut resource.bids, i); };
                break
            };
        };
        if(qty>0)
        {
            abort 11;
        };

    }





    #[test_only]
    public entry fun set_up_test(origin_account: &signer, resource_account: &signer) {
        use std::vector;

        account::create_account_for_test(signer::address_of(origin_account));

        // create a resource account from the origin account, mocking the module publishing process
        resource_account::create_resource_account(origin_account, vector::empty<u8>(), vector::empty<u8>());
        init_module(resource_account);
    }

    // #[test(origin_account = @0xcafe, resource_account = @0xc3bb8488ab1a5815a9d543d7e41b0e0df46a7396f89b22821f07a4362f75ddc5, framework = @aptos_framework)]
    // public entry fun test_exchange_to_and_exchange_from(origin_account: signer, resource_account: signer, framework: signer) acquires OrderBook {
    //     use aptos_framework::aptos_coin;
    //     use aptos_framework::create_signer;

    //     set_up_test(&origin_account, &resource_account);


    //     account::create_account_for_test(@0xaabbcc);
    //     let alice = account::create_signer_for_test(@0xaabbcc);
    //     aptos_framework::managed_coin::mint<AptosCoin>(&alice,100);  
        


    //     // test sorting of bids and asks
    //     let bids = vector::empty<User>();
    //     let bid1 = User {
    //         stock_price: 1,
    //         qty: 1,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let bid2 = User {
    //         stock_price: 2,
    //         qty: 2,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let bid3 = User {
    //         stock_price: 3,
    //         qty: 3,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let bid4 = User {
    //         stock_price: 4,
    //         qty: 4,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let bid5 = User {
    //         stock_price: 5,
    //         lvg:1,
    //         qty: 5,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     vector::push_back(&mut bids, bid4);
    //     vector::push_back(&mut bids, bid1);
    //     vector::push_back(&mut bids, bid2);
    //     vector::push_back(&mut bids, bid5);
    //     vector::push_back(&mut bids, bid3);

    

    //     assert!(vector::length(&bids) == 5, 1);
    //     assert!(vector::borrow(&bids, 0).stock_price == 5, 2);
    //     assert!(vector::borrow(&bids, 1).stock_price == 4, 2);
    //     assert!(vector::borrow(&bids, 2).stock_price == 3, 2);
    //     assert!(vector::borrow(&bids, 3).stock_price == 2, 2);
    //     assert!(vector::borrow(&bids, 4).stock_price == 1, 2);





    //     let asks = vector::empty<User>();
    //     let ask1 = User {
    //         stock_price: 1,
    //         qty: 1,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let ask2 = User {
    //         stock_price: 2,
    //         qty: 2,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let ask3 = User {
    //         stock_price: 3,
    //         qty: 3,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let ask4 = User {
    //         stock_price: 4,
    //         qty: 4,
    //         lvg:1,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     let ask5 = User {
    //         stock_price: 5,
    //         lvg:1,
    //         qty: 5,
    //         user_address: signer::address_of(&origin_account),
    //     };
    //     vector::push_back(&mut asks, ask4);
    //     vector::push_back(&mut asks, ask1);
    //     vector::push_back(&mut asks, ask2);
    //     vector::push_back(&mut asks, ask5);
    //     vector::push_back(&mut asks, ask3);

    //     assert!(vector::length(&asks) == 5, 1);
    //     assert!(vector::borrow(&asks, 0).stock_price == 5, 2);
    //     assert!(vector::borrow(&asks, 1).stock_price == 4, 2);
    //     assert!(vector::borrow(&asks, 2).stock_price == 3, 2);
    //     assert!(vector::borrow(&asks, 3).stock_price == 2, 2);
    //     assert!(vector::borrow(&asks, 4).stock_price == 1, 2);



    //     // exchange from 5 aptos coins to 5 chloe's coins & assert the results are expected
    //     // let five_a_coins = coin::mint(5, &aptos_coin_mint_cap);
    //     // let c_coins = exchange_to(five_a_coins);
    //     // assert!(coin::value(&c_coins) == 5, 0);
    //     // assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 5, 1);
    //     // assert!(coin::balance<ChloesCoin>(signer::address_of(&resource_account)) == 0, 2);

    //     // // exchange from 5 chloe's coins to 5 aptos coins & assert the results are expected
    //     // let a_coins = exchange_from(c_coins);
    //     // assert!(coin::value(&a_coins) == 5, 0);
    //     // assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 0, 3);
    //     // assert!(coin::balance<ChloesCoin>(signer::address_of(&resource_account)) == 0, 4);

    //     // // burn the remaining coins & destroy the capabilities since they aren't droppable
    //     // coin::burn(a_coins, &aptos_coin_burn_cap);

    // }

    #[test(origin_account = @0xcafe, resource_account = @0xc3bb8488ab1a5815a9d543d7e41b0e0df46a7396f89b22821f07a4362f75ddc5, framework = @aptos_framework)]
    public entry fun test_transaction_logic(origin_account: signer, resource_account: signer, framework: signer) acquires Resource {
        use aptos_framework::aptos_coin;
        use aptos_framework::create_signer;
        use aptos_framework::managed_coin;
        set_up_test(&origin_account, &resource_account);
        let (aptos_coin_burn_cap, aptos_coin_mint_cap) = aptos_coin::initialize_for_test(&framework);
        
        account::create_account_for_test(@0xaabbcc);
        let alice = account::create_signer_for_test(@0xaabbcc);
        coin::register<AptosCoin>(&alice);
       
        let aptos_coin = coin::mint<AptosCoin>(1000, &aptos_coin_mint_cap);
        coin::deposit(signer::address_of(&alice), aptos_coin);

        assert!(coin::balance<AptosCoin>(signer::address_of(&alice)) == 1000, 1);

        account::create_account_for_test(@0xaabbccdd);
        let bob = account::create_signer_for_test(@0xaabbccdd);
        coin::register<AptosCoin>(&bob);
       
        let aptos_coin = coin::mint<AptosCoin>(1000, &aptos_coin_mint_cap);
        coin::deposit(signer::address_of(&bob), aptos_coin);
        assert!(coin::balance<AptosCoin>(signer::address_of(&bob)) == 1000, 1);

        buyAtlimitorder(&alice,1, 3, 3);
        buyAtlimitorder(&alice,1, 1, 1);
        buyAtlimitorder(&alice,1, 10, 5);
        buyAtlimitorder(&alice,1, 2, 2);

      
        assert!(coin::balance<AptosCoin>(signer::address_of(&alice)) == 936, 1);
        assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 64,1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,0).stock_price == 10, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,0).qty == 5, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,1).stock_price == 3, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,1).qty == 3, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,2).stock_price == 2, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,2).qty == 2, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,3).stock_price == 1, 1);
        assert!(vector::borrow(&borrow_global<Resource>(@Team18).bids,3).qty == 1, 1);

        // sellAtlimitorder(&bob,1, 12, 1);
        // sellAtlimitorder(&bob,1, 11, 1);
        // sellAtlimitorder(&bob,1, 14, 1);
        // sellAtlimitorder(&bob,1, 13, 1);


        // assert!(coin::balance<AptosCoin>(signer::address_of(&bob)) == 1000, 1);
        // assert!(vector::borrow(&borrow_global<Resource>(@Team18).asks,0).stock_price == 11, 1);
        // assert!(vector::borrow(&borrow_global<Resource>(@Team18).asks,1).stock_price == 12, 1);
        // assert!(vector::borrow(&borrow_global<Resource>(@Team18).asks,2).stock_price == 13, 1);
        // assert!(vector::borrow(&borrow_global<Resource>(@Team18).asks,3).stock_price == 14, 1);

        // placeAsk(&bob, 3, 6);
        // assert!(borrow_global<OrderBook>(@dummycastdefi_addr).ltp == 10, 1);
        // let task_count = event::counter(&borrow_global<OrderBook>(@dummycastdefi_addr).set_ltp_event);
        // assert!(task_count == 1, 0);
        // assert!(coin::balance<SharkyCoin>(signer::address_of(&bob)) == 990, 1);
        // assert!(coin::balance<AptosCoin>(signer::address_of(&bob)) == 1039, 1);

        // assert!(coin::balance<SharkyCoin>(signer::address_of(&resource_account)) == 4, 1);
        // assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 25, 1);
        coin::destroy_mint_cap<AptosCoin>(aptos_coin_mint_cap);
        coin::destroy_burn_cap<AptosCoin>(aptos_coin_burn_cap);

    }
}
