"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea, Tooltip, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CallData, RpcProvider, json, type Abi, type AbiEntry, type BigNumberish } from "starknet";
import { parseCalldataField } from "@/app/core/requestParser"

import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { encodeTypeVM } from "@/app/server/virtualMachine";


interface FormValues {
  toEncode: string
}

function recoverInputs(typeName: string, abi: Abi): string[][] {
  const abiFlat = abi.flatMap((e) => {
    if (e.type === 'interface') {
      return e.items;
    }
    return e;
  });
  const abiExtract = abiFlat.find((abiItem) => abiItem.name === typeName);
  const type = abiExtract.type;
  const members = abiExtract.members;
  const variants = abiExtract.variants;
  const result = type === "struct" ?
    members.map((e: { name: string, type: string }) => [e.name, e.type])
    :
    variants.map((e: { name: string, type: string }) => [e.name, e.type]);
  return result;
}

export default function EncodeType() {
  const [isEncoded, setIsEncoded] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<string>("");
  const [initCode, setInitCode] = useState<string>("");
  const encodeTypeParam = useStoreDecEnc(state => state.encodeTypeParam);
  const setEncodeTypeParam = useStoreDecEnc(state => state.setEncodeTypeParam);
  const abi = useStoreAbi(state => state.abi);
  const selectedType = useStoreType(state => state.selectedType);
  const [parametersTable, setParametersTable] = useState<string[][]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setEncodeTypeParam(values.toEncode);
    try {
      const res = await encodeTypeVM(initCode, values.toEncode, abi, selectedType);
      console.log("res =", res);

      setEncoded(json.stringify(res, undefined, 2));
      setIsEncoded(true);
      console.log("selectedType", selectedType, res);
    } catch {
      console.log("Error encode type");
      setIsEncoded(false);

      onOpen();
    }
  }

  useEffect(() => {
    setIsEncoded(false);
    const params: string[][] = recoverInputs(selectedType, abi);
    setParametersTable(params);
  }, [selectedType])


  return (
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
                  <Tr key={param[0]}>{
                    param.map((item: string) => <Td key={item}>{item}</Td>)}
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
              defaultValue={encodeTypeParam}
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
            Encode custom type
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
                {/* const myCallData = new CallData(abi);<br></br>
                const encodedArray = [{encodeTypeParam}]; <br></br> */}
                const params = [{encodeTypeParam}]; <br></br>
                const selectedType = "{selectedType}"; <br></br>
                const iter = params[Symbol.iterator](); <br></br>
                const structs = CallData.getAbiStruct(abi);<br></br>
                const enums = CallData.getAbiEnum(abi);<br></br>
                const abiExtract = abi.find((abiItem) =&gt; abiItem.name === selectedType); <br></br>
                const inputAbi:AbiEntry = &#123;name:abiExtract.type,type: abiExtract.name&#125;;<br></br>
                const abiParser = createAbiParser(abi, hdParsingStrategy);<br></br>
                const result = parseCalldataField( &#123; argsIterator: iter, input: inputAbi, <br></br>{"   "} structs: structs, enums: enums, parser: abiParser &#125;);<br></br>
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
    </>
  )
}

