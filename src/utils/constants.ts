import { ProviderInterface, RpcProvider } from "starknet";

export const myFrontendProviders: ProviderInterface[] = [
    new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/" + process.env.NEXT_PUBLIC_PROVIDER_KEY }),
    new RpcProvider({ nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/" + process.env.NEXT_PUBLIC_PROVIDER_KEY })];

