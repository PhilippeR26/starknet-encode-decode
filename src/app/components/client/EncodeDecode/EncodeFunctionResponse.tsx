"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData, RpcProvider, json, num, type Abi } from "starknet";
import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { useStoreFunction } from "./functionContext";
import { encodeFnResponseVM } from "@/app/server/virtualMachine";

interface FormValues {
  toEncode: string
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


export default function EncodeFunctionResponse() {
  // TODO : to put in context, to reload next time
  const [isDecoded, setIsDecoded] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<string>("");
  const decodeFunctionParam = useStoreDecEnc(state => state.decodeFunctionParam)
  const setDecodeFunctionParam = useStoreDecEnc(state => state.setDecodeFunctionParam)
  const abi = useStoreAbi(state => state.abi)
  const selectedFunction = useStoreFunction(state => state.selectedFunction)
  const [hasParameter, setHasParameter] = useState<boolean>(false);
  const [parametersTable, setParametersTable] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const encodeFunctionResponse = useStoreDecEnc(state => state.encodeFunctionResponse);
  const setEncodeFunctionResponse = useStoreDecEnc(state => state.setEncodeFunctionResponse);
  const [isEncoded, setIsEncoded] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<string>("");
  const [initCode, setInitCode] = useState<string>("");



  // const setAbiSource = useStoreAbi(state => state.setAbiSource)
  // const myNodeUrl = useFrontendProvider(state => state.nodeUrl);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setEncodeFunctionResponse(values.toEncode);
    try {
      console.log("parametersTable[0]=",parametersTable,parametersTable[0][0]);
      const res = await encodeFnResponseVM(initCode, values.toEncode, abi, parametersTable[0][0]);
      console.log("res =", res);

      setEncoded(json.stringify(res, undefined, 2));
      setIsEncoded(true);
      console.log("selectedType", parametersTable[0], res);
    } catch {
      console.log("Error encode type");
      setIsEncoded(false);

      onOpen();
    }
  }

  useEffect(() => {
    setIsDecoded(false);
    const res = isFnResponding(selectedFunction, abi);
    setHasParameter(res);
    if (res) {
      const params: string[] = recoverOutputs(selectedFunction, abi);
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
                    (param: string, idx: number) =>
                      <Tr key={"idxFnEncResp" + idx.toString()}>
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
              <FormControl isInvalid={errors.toEncode as any}>
                <FormLabel fontWeight={800} htmlFor="toEncode" mt={3}> content coded in JS/TS :</FormLabel>
                <Textarea w="100%" minH={150} maxH={400}
                  bg="gray.800"
                  textColor="blue.200"
                  defaultValue={encodeFunctionResponse}
                  id="toEncode"
                  placeholder="JS/TS code"
                  {...register("toEncode", {
                    required: "This is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.toEncode && errors.toEncode.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl >
                <FormLabel htmlFor="toInitialize"> optional initializations, coded in JS/TS :
                </FormLabel>
                <Textarea w="100%" minH={150} maxH={400}
                  bg="gray.300"
                  id="toInitialize"
                  placeholder="JS/TS code"
                  onChange={e => setInitCode(e.target.value)}
                />
              </FormControl>

              <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit">
                Encode function response
              </Button>
            </form>
          </Box>
          <Center>
            <Stack spacing={2} direction="column" pt={2}>
              <Box hidden={!isEncoded}>
                Encoded response :
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
                    {encoded}
                  </pre>
                </Box>
              </Box>
              <Box mt={2} hidden={!isEncoded}>
                Obtained with this Starknet.js code :
                <Box
                  mt={1}
                  p={2}
                  bg="gray.800"
                  textColor="gold"
                  borderRadius='lg'
                  maxW="100%"
                  overflowX="auto"
                  hidden={!isEncoded}
                >
                  <pre>
                    {initCode} <br></br>
                    {/* const myCallData = new CallData(abi);<br></br>
                const encodedArray = [{encodeTypeParam}]; <br></br> */}
                    const params = [{encodeFunctionResponse}]; <br></br>
                    const selectedType = "{parametersTable[0]}"; <br></br>
                    const iter = params[Symbol.iterator](); <br></br>
                    const structs = CallData.getAbiStruct(abi);<br></br>
                    const enums = CallData.getAbiEnum(abi);<br></br>
                    const abiExtract = abi.find((abiItem) =&gt; abiItem.name === selectedType); <br></br>
                    const inputAbi: AbiEntry = abiExtract ? <br></br>
                    {"   "} &#123; name: abiExtract.type, type: abiExtract.name &#125; :<br></br>
                    {"   "} &#123; name: "literal", type: responseType &#125;;<br></br>
                    
                    const result = parseCalldataField(iter, inputAbi, structs, enums);<br></br>
                  </pre>
                </Box>
              </Box>
            </Stack>
          </Center>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />

            <ModalContent>
              <ModalHeader fontSize='lg' fontWeight='bold'>
                Error.
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Center>
                  Error to encode.<br></br>
                  Verify your code.
                </Center>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='red' onClick={onClose} ml={3}>
                  OK
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
