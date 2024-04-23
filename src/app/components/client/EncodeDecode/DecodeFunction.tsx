"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData, RpcProvider, json, num, type Abi } from "starknet";
import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { useStoreFunction } from "./functionContext";

interface FormValues {
  encoded: string
}

function isFnResponding(functionName: string, abi: Abi): boolean {
  const abiFlat = abi.flatMap((e) => {
    if (e.type === 'interface') {
      return e.items;
    }
    return e;
  });
  const functionDefinition = abiFlat.find((e) => e.name === functionName);
  console.log(functionDefinition);
  let resp: boolean;
  if (!functionDefinition.outputs) { resp = false } else
    if (functionDefinition.outputs.length === 0) { resp = false }
    else { resp = true }
  console.log(resp);
  return resp
}

function recoverOutputs(functionName: string, abi: Abi): string[] {
  const abiFlat = abi.flatMap((e) => {
    if (e.type === 'interface') {
      return e.items;
    }
    return e;
  });
  const functionDefinition = abiFlat.find((e) => e.name === functionName);
  console.log("recoverParams=", functionDefinition);
  const data: string[] = functionDefinition.outputs.map((output: { type: string }) => [output.type]);
  return data
}


export default function DecodeFunction() {
  // TODO : to put in context, to reload next time
  const [isDecoded, setIsDecoded] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<string>("");
  const decodeFunctionParam = useStoreDecEnc(state => state.decodeFunctionParam)
  const setDecodeFunctionParam = useStoreDecEnc(state => state.setDecodeFunctionParam)
  const abi = useStoreAbi(state => state.abi)
  const selectedFunction = useStoreFunction(state => state.selectedFunction)
  const [hasParameter, setHasParameter] = useState<boolean>(false);
  const [parametersTable, setParametersTable] = useState<string[]>([]);

  // const setAbiSource = useStoreAbi(state => state.setAbiSource)
  // const myNodeUrl = useFrontendProvider(state => state.nodeUrl);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setDecodeFunctionParam(values.encoded);
    const myCallData = new CallData(abi);
    const params = values.encoded.split(",").map(str => str.trim());
    const formattedParams=params.map(e=>num.toHex(e.replaceAll(/"|'/g,""))); //remove ' and " and convert to Hex.

    const res = myCallData.parse(selectedFunction, formattedParams);
    setDecoded(json.stringify(res, undefined, 2));
    setIsDecoded(true);
    console.log("selectedFunction", selectedFunction, formattedParams, res);
  }

  useEffect(() => { 
    setIsDecoded(false);
    const res = isFnResponding(selectedFunction, abi);
    setHasParameter(res);
    if (res) { 
      const params:string[]=recoverOutputs(selectedFunction, abi);
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
              <TableCaption>output format</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {parametersTable.map(
                  (param: string) =>
                    <Tr>
                      <Td>Output</Td>
                      <Td>{param}</Td>
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
            <Box hidden={!isDecoded}>
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
                  const myCallData = new CallData(abi);<br></br>
                  const encodedArray = [{decodeFunctionParam}]; <br></br>
                  const res = myCallData.parse("{selectedFunction}", encodedArray);
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
