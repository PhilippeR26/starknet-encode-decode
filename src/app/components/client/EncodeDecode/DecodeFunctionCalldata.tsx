"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData, RpcProvider, json, num, type Abi, type AbiEntry, type FunctionAbi } from "starknet";
import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { useStoreFunction } from "./functionContext";
import { defineStripes, hasFnParameters, recoverInputs, type Stripe } from "./encodeUtils";
import { LinkIcon } from "@chakra-ui/icons";

interface FormValues {
  encoded: string
}

// function isFnResponding(functionName: string, abi: Abi): boolean {
//   const abiFlat = abi.flatMap((e) => {
//     if (e.type === 'interface') {
//       return e.items;
//     }
//     return e;
//   });
//   const functionDefinition = abiFlat.find((e) => e.name === functionName);
//   console.log(functionDefinition);
//   let resp: boolean;
//   if (!functionDefinition.outputs) { resp = false } else
//     if (functionDefinition.outputs.length === 0) { resp = false }
//     else { resp = true }
//   console.log(resp);
//   return resp
// }

// function recoverOutputs(functionName: string, abi: Abi): string[] {
//   const abiFlat = abi.flatMap((e) => {
//     if (e.type === 'interface') {
//       return e.items;
//     }
//     return e;
//   });
//   const functionDefinition = abiFlat.find((e) => e.name === functionName);
//   console.log("recoverParams=", functionDefinition);
//   const data: string[] = functionDefinition.outputs.map((output: { type: string }) => [output.type]);
//   return data
// }


export default function DecodeFunctionCalldata() {
  // TODO : to put in context, to reload next time
  const [isDecoded, setIsDecoded] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<string>("");
  const [formattedInput, setFormattedInput] = useState<string>("");
  const decodeFunctionParam = useStoreDecEnc(state => state.decodeFunctionParam)
  const setDecodeFunctionParam = useStoreDecEnc(state => state.setDecodeFunctionParam)
  const abi = useStoreAbi(state => state.abi)
  const selectedFunction = useStoreFunction(state => state.selectedFunction)
  const [hasParameter, setHasParameter] = useState<boolean>(false);
  const [parametersTable, setParametersTable] = useState<string[][]>([]);
  const setSelectedTypeIndex = useStoreType(state => state.setSelectedTypeIndex);
  const setSelectedLowTab = useStoreType(state => state.setSelectedLowTab);
  const setSelectedHighTab = useStoreType(state => state.setSelectedHighTab);
  const listType = useStoreType(state => state.listType);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setDecodeFunctionParam(values.encoded);
    const myCallData = new CallData(abi);
    const params = values.encoded.split(",").map(str => str.trim());
    const formattedParams = params.map(e => num.toHex(e.replaceAll(/"|'/g, ""))); //remove ' and " and convert to Hex.
    const inputToString='["'+formattedParams.reduce((acc:string,inp:string)=>acc+inp+'","',"").slice(0,-2)+"]"
    setFormattedInput(inputToString);
    const { inputs } = myCallData.parser.getLegacyFormat().find((abiItem: AbiEntry) => abiItem.name === selectedFunction) as FunctionAbi;
    const inputsTypes = inputs.map((inp: any) => { return inp.type as string });
    const res = myCallData.decodeParameters(inputsTypes, formattedParams);
    setDecoded(json.stringify(res, undefined, 2));
    setIsDecoded(true);
    console.log("selectedFunction", selectedFunction, formattedParams, res);
  }

  function goToType(typeName: string) {
    setSelectedHighTab(1);
    const posInList = listType.findIndex((typ: string) => typ === typeName);
    setSelectedTypeIndex(posInList.toString());
    setSelectedLowTab(0);
  }

  useEffect(() => {
    setIsDecoded(false);
    const res = hasFnParameters(selectedFunction, abi);
    setHasParameter(res);
    if (res) {
      const params: string[][] = recoverInputs(selectedFunction, abi);
      console.log("params recovered")
      setParametersTable(params);
    };
  }, [selectedFunction])


  return (
    <>
      {hasParameter ?
        <>
          <Box>
            <TableContainer>
              <Table variant="striped" colorScheme="purple">
                <TableCaption>needed parameters</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {parametersTable.map(
                    (param: string[]) =>
                      <Tr>{
                        param.map((item: string, idx: number) =>
                          <Td key={"idxFnDecCall" + idx.toString()}>
                            {idx === 0 && item}
                            {idx === 1 &&
                              defineStripes(listType, item).map((smallString: Stripe) =>
                                <>
                                  {smallString.message}
                                  {
                                    smallString.typeName !== "" &&
                                    <Button ml={2} onClick={() => goToType(smallString.typeName)}>
                                      <LinkIcon></LinkIcon>
                                    </Button>
                                  }
                                </>
                              )
                            }
                          </Td>)}
                      </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <form onSubmit={handleSubmit(onSubmitResponse)}>
              <FormControl isInvalid={errors.encoded as any}>
                <FormLabel htmlFor="encoded"> Encoded response :</FormLabel>
                <Textarea w="100%" minH={150} maxH={400}
                  bg="gray.800"
                  textColor="blue.200"
                  defaultValue={decodeFunctionParam}
                  id="encoded"
                  placeholder="values separated with commas"
                  {...register("encoded", {
                    required: "This is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.encoded && errors.encoded.message}
                </FormErrorMessage>
              </FormControl>
              <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit">
                Decode function
              </Button>
            </form>
          </Box>

          <Center>
            <Stack spacing={2} direction="column" pt={2}>
              <Box
                hidden={!isDecoded}
                
              >
                Decoded response :
                <Box
                  bg="lightgreen"
                  textColor="darkgreen"
                  p={2}
                  mt={1}
                  border='4px'
                  borderRadius='lg'
                  borderColor="black"
                  maxH="400px"
                  maxW="100%"
                  overflowX="auto"
                  overflowY="auto"
                >
                  <pre>
                    {decoded}
                  </pre>
                </Box>
              </Box>
              <Box mt={2} hidden={!isDecoded}>
                Obtained with this Starknet.js code :
                <Box
                  hidden={!isDecoded}
                  mt={1}
                  p={2}
                  bg="gray.800"
                  textColor="gold"
                  borderRadius='lg'
                  maxW="100%"
                  overflowX="auto"
                >
                  <pre>
                    const formattedParams = {formattedInput};<br></br>
                    const myCallData = new CallData(abi);<br></br>
                    const &#123; inputs &#125; = myCallData.parser.getLegacyFormat().find((abiItem: AbiEntry) =&gt; <br></br>abiItem.name === selectedFunction) as FunctionAbi;<br></br>
                    const inputsTypes = inputs.map((inp: any) =&gt; &#123; return inp.type as string &#125;);<br></br>
                    const res = myCallData.decodeParameters(inputsTypes, formattedParams);
                  </pre>
                </Box>
              </Box>
            </Stack>
          </Center>
        </> : <>
          <>
            <Center>
              <Box
                bg="tomato"
                textColor="white"
                borderColor="black"
                borderRadius="xl"
                border='3px'
                p={3}
                mt={1}
              >
                No output provided by this function
              </Box>
            </Center>
          </>
        </>

      }
    </>
  )
}
