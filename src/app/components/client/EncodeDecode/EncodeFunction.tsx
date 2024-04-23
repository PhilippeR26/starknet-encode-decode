"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea, Tooltip, TableContainer, Table, TableCaption, Th, Thead, Tr, Tbody, Td, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useState, type MouseEventHandler } from "react";
import { useForm } from "react-hook-form";
import { CallData, RpcProvider, json, type Abi, type AbiEntry, type BigNumberish, type RawArgs } from "starknet";
import { parseCalldataField } from "@/app/core/requestParser"

import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { encodeFunctionVM, evalJS } from "@/app/server/virtualMachine";
import { useStoreFunction } from "./functionContext";
import { ExternalLinkIcon, LinkIcon } from "@chakra-ui/icons";


interface FormValues {
  toEncode: string
}

function hasFnParameters(functionName: string, abi: Abi): boolean {
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
  console.log(resp);
  return resp
}

function recoverInputs(functionName: string, abi: Abi): string[][] {
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


export default function EncodeFunction() {
  // TODO : to put in context, to reload next time
  const [isEncoded, setIsEncoded] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<string>("");
  const [initCode, setInitCode] = useState<string>("");
  const [preFill, setPreFill] = useState<string>("");
  //const [formContent, setFormContent] = useState<string>("");
  const [hasParameter, setHasParameter] = useState<boolean>(false);
  const [parametersTable, setParametersTable] = useState<string[][]>([]);
  const encodeFunctionParam = useStoreDecEnc(state => state.encodeFunctionParam);
  const setEncodeFunctionParam = useStoreDecEnc(state => state.setEncodeFunctionParam);
  const abi = useStoreAbi(state => state.abi);
  const selectedFunction = useStoreFunction(state => state.selectedFunction);
  const setSelectedTypeIndex = useStoreType(state => state.setSelectedTypeIndex);
  const listType = useStoreType(state => state.listType);
  const setSelectedLowTab = useStoreType(state => state.setSelectedLowTab);
  const setSelectedHighTab = useStoreType(state => state.setSelectedHighTab);
  // const setAbiSource = useStoreAbi(state => state.setAbiSource)
  // const myNodeUrl = useFrontendProvider(state => state.nodeUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setEncodeFunctionParam(values.toEncode);
    try {
      const res = await encodeFunctionVM(initCode, values.toEncode, abi, selectedFunction);
      console.log("res =", res);
      setEncoded(json.stringify(res, undefined, 2));
      setIsEncoded(true);
      console.log("selectedType", selectedFunction, res);
    } catch {
      console.log("Error encode function");
      setIsEncoded(false);
      onOpen();
    }
  }

  function goToType(typeName:string) {
    setSelectedHighTab(1);
    const posInList = listType.findIndex((typ: string) => typ ===typeName);
    setSelectedTypeIndex(posInList.toString());
    setSelectedLowTab(0);
  }

  function isInList(typName:string):boolean{
    if (typName[0]==="(") return false ; // tuple not supported for links
    if (typName.startsWith("core::result")) return false ; // Result not supported for links
    if (typName.startsWith("core::option")) return false ; // Option not supported for links
    if (typName.startsWith("core::array")) return false ; // Array & Span not supported for links
    if (!listType.includes(typName)) return false; // not a custom type
    return true
  }

  useEffect(() => {
    setIsEncoded(false);
    const res = hasFnParameters(selectedFunction, abi);
    setHasParameter(res);
    if (res) {
      const params: string[][] = recoverInputs(selectedFunction, abi);
      setParametersTable(params);
      setPreFill("{" + params.map(param => " " + param[0] + ": x") + "}");
    };
  }, [selectedFunction])


  return (
    <>
      {hasParameter ? <>
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
                        <Td>
                          {item}
                          {
                            idx == 1 && isInList(item) && <Button ml={2} onClick={()=>goToType(item)}>
                              <LinkIcon></LinkIcon>
                            </Button>
                          }
                        </Td>)}
                    </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={3}>
          <form onSubmit={handleSubmit(onSubmitResponse)}>
            <FormControl isInvalid={errors.toEncode as any}>
              <FormLabel fontWeight={800} htmlFor="toEncode"> Object containing the parameters, coded in JS/TS :</FormLabel>
              <Box
                ml={10}
                bg="yellow.200"
              >
                Template : {preFill}
              </Box>
              <Textarea w="100%" minH={150} maxH={400}
                bg="gray.800"
                textColor="blue.200"
                defaultValue={encodeFunctionParam}
                id="toEncode"
                placeholder="JS/TS code for each parameter, in an object"
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
            <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit" >
              Encode function
            </Button>
          </form>
        </Box>
        <Center>
          <Stack spacing={2} direction="column" pt={2}>
            <Box hidden={!isEncoded}>
              Encoded data :
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
                  const params = {encodeFunctionParam}; <br></br>
                  const selectedFunction = "{selectedFunction}"; <br></br>
                  const myCallData = new CallData(abi);<br></br>
                  const result = myCallData.compile(selectedFunction, params);<br></br>
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
              This function do not accept parameters
            </Box>
          </Center>
        </>
      </>
      }
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
    </>
  )
}

