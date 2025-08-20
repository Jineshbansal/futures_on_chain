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
    use std::debug;
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
        // let resource_signer_cap = resource_account::retrieve_resource_account_cap(account, @0xcd1eebe9cb95b6a646f9aa56a4552fbd48003aee698a328bd0725483a523ad7f);
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(account, @source_addr);
        
        move_to(account, Resource {
            resource_signer_cap,
            buyers:vector::empty<User>(),
            sellers:vector::empty<User>(),
            bids: vector::empty<User>(),
            asks: vector::empty<User>(),
        });
        coin::register<AptosCoin>(account);
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
            let len = vector::length(&resource.bids);
            mergeSort(&mut resource.bids, 0, len-1);
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
            let len = vector::length(&resource.bids);
            mergeSort(&mut resource.bids, 0, len-1);
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
            let len = vector::length(&resource.asks);
            mergeSorta(&mut resource.asks, 0, len-1);
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
            let len = vector::length(&resource.bids);
            mergeSorta(&mut resource.bids, 0, len-1);
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
            abort 11;
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


    public entry fun exit(account:&signer, price:u64) acquires Resource
    {
        let resource = borrow_global_mut<Resource>(@Team18);
        let resource_signer = account::create_signer_with_capability(&resource.resource_signer_cap);
        
        let i1 = vector::length(&resource.asks);
        while(i1 > 0){
            i1 = i1 - 1;
            let ask = vector::borrow_mut(&mut resource.asks, i1);
            coin::deposit(signer::address_of(account), coin::withdraw<AptosCoin>(&resource_signer, ((ask.qty*ask.stock_price)/ask.lvg)));
        };
        let i2 = vector::length(&resource.bids);
        while(i2 > 0){
            i2 = i2 - 1;
            let bid = vector::borrow_mut(&mut resource.bids, i2);
            coin::deposit(signer::address_of(account), coin::withdraw<AptosCoin>(&resource_signer, (bid.qty*bid.stock_price)/bid.lvg));
            // coin::deposit(bid.user_address, (bid.qty*bid.price)/bid.lvg);
        };
        let i3 = vector::length(&resource.buyers);
        while(i3 > 0){
            i3 = i3 - 1;
            let buy = vector::borrow_mut(&mut resource.buyers, i3);
            coin::deposit(signer::address_of(account), coin::withdraw<AptosCoin>(&resource_signer, (buy.qty*buy.stock_price)/buy.lvg+buy.qty*price-buy.qty*buy.stock_price));            
            // coin::deposit(buy.user_address, (buy.qty*buy.stock_price)/buy.lvg+buy.qty*price-buy.qty*buy.stock_price);
        };
        let i4 = vector::length(&resource.sellers);
        while(i4 > 0){
            i4 = i4 - 1;
            let sell = vector::borrow_mut(&mut resource.sellers, i4);
            coin::deposit(signer::address_of(account), coin::withdraw<AptosCoin>(&resource_signer, (sell.qty*sell.stock_price)/sell.lvg+sell.qty*sell.stock_price-sell.qty*price));
            // coin::deposit(sell.user_address, (sell.qty*sell.stock_price)/sell.lvg+sell.qty*sell.stock_price-sell.qty*price);
        };
        
    }
    public fun merge(v: &mut vector<User>, left: u64, mid: u64, right: u64) {
        let subArrayOne = mid + 1 - left;
        let subArrayTwo = right - mid;

        let lv = vector::empty<User>();
        let rv = vector::empty<User>();

        let i=0;

        while(i < subArrayOne) {
            vector::push_back(&mut lv, *vector::borrow(v, left + i));
            i = i + 1;
        };

        i=0;

        while(i < subArrayTwo) {
            vector::push_back(&mut rv, *vector::borrow(v, mid + 1 + i));
            i = i + 1;
        };

        let indexOfSubArrayOne = 0;
        let indexOfSubArrayTwo = 0;
        let indexOfMergedArray = left;

        while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {
                let a = vector::borrow(&lv, indexOfSubArrayOne);
                let compa = a.stock_price;

                let b = vector::borrow(&rv, indexOfSubArrayTwo);
                let compb = b.stock_price;

                let cur = vector::borrow_mut(v, indexOfMergedArray);

                if(compa >= compb) {
                    *cur = *a;
                    indexOfSubArrayOne = indexOfSubArrayOne + 1;
                } else {
                    *cur = *b;
                    indexOfSubArrayTwo = indexOfSubArrayTwo + 1;
                };

                indexOfMergedArray = indexOfMergedArray + 1;
        };

        while (indexOfSubArrayOne < subArrayOne) {
            let cur = vector::borrow_mut(v, indexOfMergedArray);
            let a = vector::borrow(&lv, indexOfSubArrayOne);

            *cur = *a;

            indexOfSubArrayOne = indexOfSubArrayOne + 1;
            indexOfMergedArray = indexOfMergedArray + 1;
        };

        while (indexOfSubArrayTwo < subArrayTwo) {
            let cur = vector::borrow_mut(v, indexOfMergedArray);
            let b = vector::borrow_mut(&mut rv, indexOfSubArrayTwo);
            
            *cur = *b;

            indexOfSubArrayTwo = indexOfSubArrayTwo + 1;
            indexOfMergedArray = indexOfMergedArray + 1;
        };
    }

    public fun mergeSort(v: &mut vector<User>, begin: u64, end: u64) {
        if (begin >= end) return;
        let mid = begin + (end - begin) / 2;
        mergeSort(v, begin, mid);
        mergeSort(v, mid + 1, end);
        merge(v, begin, mid, end);
    }

    public fun mergea(v: &mut vector<User>, left: u64, mid: u64, right: u64) {
        let subArrayOne = mid + 1 - left;
        let subArrayTwo = right - mid;

        let lv = vector::empty<User>();
        let rv = vector::empty<User>();

        let i=0;

        while(i < subArrayOne) {
            vector::push_back(&mut lv, *vector::borrow(v, left + i));
            i = i + 1;
        };

        i=0;

        while(i < subArrayTwo) {
            vector::push_back(&mut rv, *vector::borrow(v, mid + 1 + i));
            i = i + 1;
        };

        let indexOfSubArrayOne = 0;
        let indexOfSubArrayTwo = 0;
        let indexOfMergedArray = left;

        while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {
                let a = vector::borrow(&lv, indexOfSubArrayOne);
                let compa = a.stock_price;

                let b = vector::borrow(&rv, indexOfSubArrayTwo);
                let compb = b.stock_price;

                let cur = vector::borrow_mut(v, indexOfMergedArray);

                if(compa <= compb) {
                    *cur = *a;
                    indexOfSubArrayOne = indexOfSubArrayOne + 1;
                } else {
                    *cur = *b;
                    indexOfSubArrayTwo = indexOfSubArrayTwo + 1;
                };

                indexOfMergedArray = indexOfMergedArray + 1;
        };

        while (indexOfSubArrayOne < subArrayOne) {
            let cur = vector::borrow_mut(v, indexOfMergedArray);
            let a = vector::borrow(&lv, indexOfSubArrayOne);

            *cur = *a;

            indexOfSubArrayOne = indexOfSubArrayOne + 1;
            indexOfMergedArray = indexOfMergedArray + 1;
        };

        while (indexOfSubArrayTwo < subArrayTwo) {
            let cur = vector::borrow_mut(v, indexOfMergedArray);
            let b = vector::borrow_mut(&mut rv, indexOfSubArrayTwo);
            
            *cur = *b;

            indexOfSubArrayTwo = indexOfSubArrayTwo + 1;
            indexOfMergedArray = indexOfMergedArray + 1;
        };
    }

    public fun mergeSorta(v: &mut vector<User>, begin: u64, end: u64) {
        if (begin >= end) return;
        let mid = begin + (end - begin) / 2;
        mergeSorta(v, begin, mid);
        mergeSorta(v, mid + 1, end);
        mergea(v, begin, mid, end);
    }

    #[test_only]
    public entry fun set_up_test(origin_account: &signer, resource_account: &signer) {
        use std::vector;

        account::create_account_for_test(signer::address_of(origin_account));

        // create a resource account from the origin account, mocking the module publishing process
        resource_account::create_resource_account(origin_account, vector::empty<u8>(), vector::empty<u8>());
        init_module(resource_account);
    }

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
        buyAtlimitorder(&alice,1, 5, 10);
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


        sellAtlimitorder(&bob,1, 7, 3);
        let v=&borrow_global<Resource>(@Team18).buyers;

        debug::print(v);

        coin::destroy_mint_cap<AptosCoin>(aptos_coin_mint_cap);
        coin::destroy_burn_cap<AptosCoin>(aptos_coin_burn_cap);
    }
}