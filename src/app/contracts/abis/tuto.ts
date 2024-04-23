export const tutoAbi = [
    {
        "type": "struct",
        "name": "core::byte_array::ByteArray",
        "members": [
            {
                "name": "data",
                "type": "core::array::Array::<core::bytes_31::bytes31>"
            },
            {
                "name": "pending_word",
                "type": "core::felt252"
            },
            {
                "name": "pending_word_len",
                "type": "core::integer::u32"
            }
        ]
    },
    {
        "type": "struct",
        "name": "core::starknet::account::Call",
        "members": [
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "selector",
                "type": "core::felt252"
            },
            {
                "name": "calldata",
                "type": "core::array::Array::<core::felt252>"
            }
        ]
    },
    {
        "type": "struct",
        "name": "PhilTest2::PhilTest2::Order",
        "members": [
            {
                "name": "p1",
                "type": "core::felt252"
            },
            {
                "name": "p2",
                "type": "core::integer::u16"
            }
        ]
    },
    {
        "type": "enum",
        "name": "PhilTest2::PhilTest2::MyEnum",
        "variants": [
            {
                "name": "Response",
                "type": "PhilTest2::PhilTest2::Order"
            },
            {
                "name": "Warning",
                "type": "core::felt252"
            },
            {
                "name": "Error",
                "type": "(core::integer::u16, core::integer::u16)"
            },
            {
                "name": "Critical",
                "type": "core::array::Array::<core::integer::u32>"
            },
            {
                "name": "Message",
                "type": "core::bytes_31::bytes31"
            },
            {
                "name": "Empty",
                "type": "()"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::option::Option::<core::integer::u8>",
        "variants": [
            {
                "name": "Some",
                "type": "core::integer::u8"
            },
            {
                "name": "None",
                "type": "()"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::option::Option::<PhilTest2::PhilTest2::Order>",
        "variants": [
            {
                "name": "Some",
                "type": "PhilTest2::PhilTest2::Order"
            },
            {
                "name": "None",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "PhilTest2::PhilTest2::OrderW",
        "members": [
            {
                "name": "p1",
                "type": "core::felt252"
            },
            {
                "name": "my_enum",
                "type": "PhilTest2::PhilTest2::MyEnum"
            },
            {
                "name": "adds",
                "type": "core::option::Option::<core::integer::u8>"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::result::Result::<core::integer::u8, core::felt252>",
        "variants": [
            {
                "name": "Ok",
                "type": "core::integer::u8"
            },
            {
                "name": "Err",
                "type": "core::felt252"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::result::Result::<PhilTest2::PhilTest2::Order, core::integer::u16>",
        "variants": [
            {
                "name": "Ok",
                "type": "PhilTest2::PhilTest2::Order"
            },
            {
                "name": "Err",
                "type": "core::integer::u16"
            }
        ]
    },
    {
        "type": "struct",
        "name": "core::integer::u256",
        "members": [
            {
                "name": "low",
                "type": "core::integer::u128"
            },
            {
                "name": "high",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "interface",
        "name": "PhilTest2::PhilTest2::ITestContract",
        "items": []
    },
    {
        "type": "struct",
        "name": "nft_amm::router::router_interface::PairSwapAny",
        "members": [
            {
                "name": "pair",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "num_items",
                "type": "core::integer::u256"
            }
        ]
    },
    {
        "type": "function",
        "name": "swap",
        "inputs": [
            {
                "name": "swap_list",
                "type": "core::array::Array::<nft_amm::router::router_interface::PairSwapAny>"
            },
            {
                "name": "input_amount",
                "type": "core::integer::u256"
            },
            {
                "name": "deadline",
                "type": "core::integer::u64"
            }
        ],
        "outputs": [
            {
                "type": "core::integer::u256"
            }
        ],
        "state_mutability": "external"
    },
    {
        "type": "struct",
        "name": "core::integer::u512",
        "members": [
            {
                "name": "limb0",
                "type": "core::integer::u128"
            },
            {
                "name": "limb1",
                "type": "core::integer::u128"
            },
            {
                "name": "limb2",
                "type": "core::integer::u128"
            },
            {
                "name": "limb3",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "function",
        "name": "echo_un_tuple",
        "inputs": [
            {
                "name": "pair",
                "type": "(core::felt252, core::integer::u16)"
            }
        ],
        "outputs": [
            {
                "type": "(core::felt252, core::option::Option::<core::integer::u8>)"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            {
                "name": "amount",
                "type": "core::integer::u256"
            },
            {
                "name": "destination",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "get_owner",
        "inputs": [],
        "outputs": [
            {
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ],
        "state_mutability": "view"
    }
]