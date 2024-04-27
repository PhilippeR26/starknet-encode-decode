"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, Code } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import GetHash from "./GetHash";
import { useStoreAbi } from "./abiContext";
import { json, type Abi } from "starknet";
import styles from '../../../page.module.css'
import { tutoAbi } from "@/app/contracts/abis/tuto";


interface FormValues {
  url: string
}

export default function GetAbi() {
  const [abiSource, setAbiSource] = useState<string>("");
  const abi = useStoreAbi(state => state.abi)
  const setAbi = useStoreAbi(state => state.setAbi)
  const [networkType, setNetworkType] = useState<string>("");
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
  function handleTutoAbi(): void {
    setAbi(tutoAbi);
  }


  return (
    <>
      <Stack
        spacing={5}
        direction="column"
        mt={4}
      >
        <Center>
          <RadioGroup defaultValue='1' onChange={setAbiSource} value={abiSource}>
            <Stack spacing={5} direction="column">
              <Radio colorScheme='blue' value="1">
                Abi from a network
              </Radio>
              {abiSource == "1" && <>

                <Box px="40px">
                  <RadioGroup defaultValue='1' onChange={setNetworkType} value={networkType}>
                    <Stack spacing={5} direction="column">
                      <Radio colorScheme='blue' value="1">
                        Mainnet
                      </Radio>
                      {networkType == "1" &&
                        <Box px="40px">
                          <GetHash networkType={networkType}></GetHash>
                        </Box>
                      }
                      <Radio colorScheme='blue' value="2">
                        Sepolia Testnet
                      </Radio>
                      {networkType == "2" &&
                        <Box px="40px">
                          <GetHash networkType={networkType}></GetHash>
                        </Box>
                      }
                      <Radio colorScheme='blue' value="3">
                        Custom network
                      </Radio>
                      {networkType == "3" &&
                        <Box px="40px">
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

                          <GetHash networkType={networkType}></GetHash>
                        </Box>
                      }
                    </Stack>
                  </RadioGroup>
                </Box>
              </>}
              <Radio colorScheme='blue' value="2">
                Pasted Abi
              </Radio>
              {abiSource == "2" && <>
                <Box px="30px">
                  <Button colorScheme='blue' onClick={handlePaste} maxW="180px">Paste Abi</Button>
                </Box>
              </>
              }
              <Radio colorScheme='blue' value="3">
                Tutorial abi
              </Radio>
              {abiSource == "3" && <>
                <Box px="30px">
                  <Button colorScheme='blue' onClick={handleTutoAbi} maxW="180px">Get Tuto Abi</Button>
                </Box>
              </>
              }
            </Stack>
          </RadioGroup>
        </Center>

        <Center>
          <Box hidden={abi.length == 0}
            bg="darkgreen"
            textColor="white"
            p={2}
            border='4px'
            borderRadius='lg'
            borderColor="black"
            maxH="500px"
            width="80%"
            overflowY="scroll"
            overflowX="auto"
          >
            <pre>
              {json.stringify(abi, undefined, 2)}
            </pre>
          </Box>
        </Center>
      </Stack>





    </>
  )
}
