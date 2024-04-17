"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CallData, RpcProvider, json, type AbiEntry, type BigNumberish } from "starknet";
import { parseCalldataField } from "@/app/core/requestParser"

import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import { evalJS } from "@/app/server/virtualMachine";


interface FormValues {
  toEncode: string
}



export default function EncodeType() {
  // TODO : to put in context, to reload next time
  const [isEncoded, setIsEncoded] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<string>("");
  const encodeTypeParam = useStoreDecEnc(state => state.encodeTypeParam);
  const setEncodeTypeParam = useStoreDecEnc(state => state.setEncodeTypeParam);
  const abi = useStoreAbi(state => state.abi);
  const selectedType = useStoreType(state => state.selectedType);
  // const setAbiSource = useStoreAbi(state => state.setAbiSource)
  // const myNodeUrl = useFrontendProvider(state => state.nodeUrl);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setEncodeTypeParam(values.toEncode);
    //const myCallData = new CallData(abi);
    const initialize = "type Order = {p1: BigNumberish,p2: BigNumberish};const myOrder: Order = { p1: 4, p2: 5 };";
    
    const inputObject=await evalJS(initialize, values.toEncode);
    console.log("inputObject =", inputObject);
    const param = [inputObject];
    console.log("param =", param);
    const iter = param[Symbol.iterator]();
    const inputAbi: AbiEntry = {
      type: "nft_amm::router::router_interface::PairSwapAny",
      name: "struct"
    };
    const structs = CallData.getAbiStruct(abi);
    const enums = CallData.getAbiEnum(abi);
    const res = parseCalldataField(iter, inputAbi, structs, enums);
    console.log("res =", res);


    setEncoded(json.stringify(res, undefined, 2));
    setIsEncoded(true);
    console.log("selectedType", selectedType, res);
  }

  useEffect(() => { setIsEncoded(false); }, [selectedType])


  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(onSubmitResponse)}>
          <FormControl isInvalid={errors.toEncode as any}>
            <FormLabel htmlFor="toEncode"> content coded in JS/TS :</FormLabel>
            <Textarea w="100%" minH={150} maxH={400}

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
                TBD <br></br>
                const myCallData = new CallData(abi);<br></br>
                const encodedArray = [{encodeTypeParam}]; <br></br>
                const res = myCallData.decodeParameters("{selectedType}", encodedArray);
              </pre>
            </Box>
          </Box>
        </Stack>
      </Center>
    </>
  )
}

