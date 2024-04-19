"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { useStoreAbi } from "./abiContext";
import { RpcProvider, json } from "starknet";

interface FormValues {
  hash: string
}

export default function GetHash() {
  const [abiHashType, setAbiHashType] = useState<string>("1");
  const abi = useStoreAbi(state => state.abi)
  const setAbi = useStoreAbi(state => state.setAbi)
  const abiSource = useStoreAbi(state => state.abiSource)
  const setAbiSource = useStoreAbi(state => state.setAbiSource)
  const myNodeUrl = useFrontendProvider(state => state.nodeUrl);

  const {
    handleSubmit: handleSubmitHash,
    register: registerHash,
    formState: { errors: errorsHash, isSubmitting: isSubmittingHash }
  } = useForm<FormValues>();

  async function onSubmitHash(values: FormValues) {
    setAbiSource(values.hash);
    if (abiHashType == "1") {
      // contract address
      const myProvider = new RpcProvider({ nodeUrl: myNodeUrl });
      const compiledSierra = await myProvider.getClassAt(values.hash);
      setAbi(compiledSierra.abi);
    } else {
      // class hash
      const myProvider = new RpcProvider({ nodeUrl: myNodeUrl });
      const compiledSierra = await myProvider.getClassByHash(values.hash);
      setAbi(compiledSierra.abi);
    }
    // console.log(abi);
  }


  return (
    <>
      <RadioGroup defaultValue='1' onChange={setAbiHashType} value={abiHashType}>
        <Stack spacing={5} direction="column">
          <Radio colorScheme='blue' value="1">
            Abi from contract address
          </Radio>
          <Radio colorScheme='blue' value="2">
            Abi from class hash
          </Radio>
        </Stack>
      </RadioGroup>
      <Box px="60px" mt={5}>
        <form onSubmit={handleSubmitHash(onSubmitHash)}>
          <FormControl isInvalid={errorsHash.hash as any}>
            <FormLabel htmlFor="hash">{abiHashType == "1" ? <>Contract address</> : <>Class Hash</>} :</FormLabel>
            <Input width={400}
              defaultValue={abiSource}
              id="hash"
              placeholder={abiHashType == "1" ? "Contract address" : "Class Hash"}
              {...registerHash("hash", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errorsHash.hash && errorsHash.hash.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme="blue" isLoading={isSubmittingHash} type="submit">
            Read Abi
          </Button>
        </form>
      </Box>
      {/*abiHashType={abiHashType}<br />
       abi={json.stringify(abi, undefined, 2)}<br /> 
      abiSource={abiSource}*/}
    </>
  )
}
