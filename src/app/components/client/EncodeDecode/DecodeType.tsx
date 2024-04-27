"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData, RpcProvider, json, num } from "starknet";
import { useStoreDecEnc } from "./encDecContext";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";

interface FormValues {
  encoded: string
}

export default function DecodeType() {
  // TODO : to put in context, to reload next time
  const [isDecoded, setIsDecoded] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<string>("");
  const decodeTypeParam = useStoreDecEnc(state => state.decodeTypeParam)
  const setDecodeTypeParam = useStoreDecEnc(state => state.setDecodeTypeParam)
  const abi = useStoreAbi(state => state.abi)
  const selectedType = useStoreType(state => state.selectedType)
  // const setAbiSource = useStoreAbi(state => state.setAbiSource)
  // const myNodeUrl = useFrontendProvider(state => state.nodeUrl);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setDecodeTypeParam(values.encoded);
    const myCallData = new CallData(abi);
    const params = values.encoded.split(",").map(str => str.trim());
    console.log("params=", params);
    const formattedParams = params.map(e => num.toHex(e.replaceAll(/"|'/g, ""))); //remove ' and " and convert to Hex.
    console.log("formatted=", formattedParams);
    const res = myCallData.decodeParameters(selectedType, formattedParams);
    setDecoded(json.stringify(res, undefined, 2));
    setIsDecoded(true);
    console.log("selectedType", selectedType, formattedParams, res);
  }

  useEffect(() => { setIsDecoded(false); }, [selectedType])


  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(onSubmitResponse)}>
          <FormControl isInvalid={errors.encoded as any}>
            <FormLabel htmlFor="encoded"> Encoded response :</FormLabel>
            <Textarea w="100%" minH={150} maxH={400}
              bg="gray.800"
              textColor="blue.200"
              defaultValue={decodeTypeParam}
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
            Decode custom type
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
                const encodedArray = [{decodeTypeParam}]; <br></br>
                const res = myCallData.decodeParameters("{selectedType}", encodedArray);
              </pre>
            </Box>
          </Box>
        </Stack>
      </Center>
    </>
  )
}
