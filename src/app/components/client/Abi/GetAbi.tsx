"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Code } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import GetHash from "./GetHash";
import { useStoreAbi } from "./abiContext";
import { json, type Abi } from "starknet";
import styles from '../../../page.module.css'


interface FormValues {
  url: string
}

export default function GetAbi() {
  const [abiSource, setAbiSource] = useState<string>("1");
  const abi = useStoreAbi(state => state.abi)
  const setAbi = useStoreAbi(state => state.setAbi)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  const myNodeUrl = useFrontendProvider(state => state.nodeUrl);
  const setMyNodeUrl = useFrontendProvider(state => state.setNodeUrl);

  function onSubmitUrl(values: FormValues) {
    setMyNodeUrl(values.url);
  }
  function handlePaste(): void {
    let text: string = "";
    navigator.clipboard.readText().then((res: string) => {
      text = res;
     // console.log("text=", text);
      setAbi(json.parse(text));
    });
  }


  return (
    <>
      <Stack spacing={5} direction="column">
        <RadioGroup defaultValue='1' onChange={setAbiSource} value={abiSource}>
          <Stack spacing={5} direction="column">
            <Radio colorScheme='blue' value="1">
              Abi from Network
            </Radio>
            {abiSource == "1" && <>
              <Box px="30px">
                <form onSubmit={handleSubmit(onSubmitUrl)}>
                  <FormControl isInvalid={errors.url as any}>
                    <FormLabel htmlFor="name">Network url :</FormLabel>
                    <Input width={400}
                      id="url"
                      placeholder="url"
                      {...register("url", {
                        required: "This is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.url && errors.url.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit">
                    Next
                  </Button>
                </form>
                {!!myNodeUrl && <>

                  <GetHash></GetHash>
                </>
                }
              </Box>
            </>}
            <Radio colorScheme='blue' value="2">
              Pasted Abi
            </Radio>
            {abiSource == "2" && <>
              <Box px="30px">
                <Button onClick={handlePaste} maxW="180px">Paste Abi</Button>
              </Box>
            </>
            }


          </Stack>
        </RadioGroup>

        {/* AbiSource={abiSource} <br /> */}
        <Box hidden={abi.length == 0}
          bg="darkgreen"
          textColor="white"
          p={2}
          border='4px'
          borderRadius='lg'
          borderColor="black"
          maxH="400px"
          overflowY="scroll"
        >
          <pre>
            {json.stringify(abi, undefined, 2)}
          </pre>
        </Box>

      </Stack>





    </>
  )
}
