import type { Abi } from "starknet";

export type Stripe = {
    message: string,
    typeName: string
}
export function defineStripes(wordList: string[], source: string): Stripe[] {
    type HotPoint = {
        start: number,
        end: number,
    }

    const hotPointList: HotPoint[] = wordList.reduce((stack: HotPoint[], wordOfList) => {
        let accum: HotPoint[] = [];
        let pos: number = -1;
        let first: boolean = true;
        while (pos > -1 || first) {
            pos = source.indexOf(wordOfList, pos + 1);
            first = false;
            if (pos > -1) { accum.push({ start: pos, end: pos + wordOfList.length }) }
        }
        return [...stack, ...accum]
    }, []);
    console.log("hotPoints=", hotPointList);
    const sortedList: HotPoint[] = hotPointList.sort((a, b) => (a.end > b.end) ? 1 : ((b.end > a.end) ? -1 : 0))
    if (sortedList.length == 0) {
        return [{
            message: source,
            typeName: ""
        }] as Stripe[]
    } else {
        const stripes: Stripe[] = sortedList.flatMap((hotPoint: HotPoint, index, sortedList: HotPoint[]) => {
            if (index == sortedList.length - 1) return [
                {
                    message: source.slice(index !== 0 ? sortedList[index - 1].end : 0, hotPoint.end),
                    typeName: source.slice(hotPoint.start, hotPoint.end)
                },
                {
                    message: source.slice(hotPoint.end),
                    typeName: ""
                }
            ] as Stripe[];
            if (index == 0) return {
                message: source.slice(0, hotPoint.end),
                typeName: source.slice(hotPoint.start, hotPoint.end)
            } as Stripe;

            return {
                message: source.slice(sortedList[index - 1].end, hotPoint.end),
                typeName: source.slice(hotPoint.start, hotPoint.end)
            } as Stripe;
        }
        )
        return stripes
    }
}

export function recoverInputs(functionName: string, abi: Abi): string[][] {
    const abiFlat = abi.flatMap((e) => {
        if (e.type === 'interface') {
            return e.items;
        }
        return e;
    });
    const functionDefinition = abiFlat.find((e) => e.name === functionName);
    console.log("recoverParams=", functionDefinition);
    const data: string[][] = functionDefinition.inputs.map((input: { name: string, type: string }) => [input.name, input.type]);
    return data
}

export function hasFnParameters(functionName: string, abi: Abi): boolean {
    const abiFlat = abi.flatMap((e) => {
        if (e.type === 'interface') {
            return e.items;
        }
        return e;
    });
    const functionDefinition = abiFlat.find((e) => e.name === functionName);
    console.log(functionDefinition);
    let resp: boolean;
    if (!functionDefinition.inputs) { resp = false } else
        if (functionDefinition.inputs.length === 0) { resp = false }
        else { resp = true }
    console.log("hasFnParameters=", resp);
    return resp
}