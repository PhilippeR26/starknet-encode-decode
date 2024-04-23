"use client";

import { RadioGroup, Stack, Radio, Center, Button, FormControl, FormErrorMessage, FormLabel, Input, Box, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useFrontendProvider } from "../provider/providerContext";
import { useStoreAbi } from "./abiContext";
import { RpcProvider, json, type ProviderInterface } from "starknet";
import { myFrontendProviders } from "@/utils/constants";

interface FormValues {
  hash: string
}

type Props = {
  networkType: string,
};

export default function GetHash({ networkType }: Props) {
  const [abiSourceType, setAbiSourceType] = useState<string>("");
  const abi = useStoreAbi(state => state.abi)
  const setAbi = useStoreAbi(state => state.setAbi)
  const abiSource = useStoreAbi(state => state.abiSource)
  const setAbiSource = useStoreAbi(state => state.setAbiSource)
  const myNodeUrl = useFrontendProvider(state => state.nodeUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit: handleSubmitHash,
    register: registerHash,
    formState: { errors: errorsHash, isSubmitting: isSubmittingHash }
  } = useForm<FormValues>();

  async function onSubmitHashOrAddr(values: FormValues) {
    setAbiSource(values.hash);

    let myProvider: ProviderInterface;
    switch (networkType) {
      case "1": {
        // mainnet
        myProvider = myFrontendProviders[0];
        break;
      }
      case "2": {
        // Sepolia testnet
        myProvider = myFrontendProviders[1];
        break;
      }
      default: {
        // 3 : custom network
        myProvider = new RpcProvider({ nodeUrl: myNodeUrl });;
        break;
      }
    }

    if (abiSourceType == "1") {
      // contract address
      try {
        const compiledSierra = await myProvider.getClassAt(values.hash);
        setAbi(compiledSierra.abi);
      } catch {
        console.log("Error getclass");
        onOpen();
      }
    } else {
      // class hash
      const compiledSierra = await myProvider.getClassByHash(values.hash);
      setAbi(compiledSierra.abi);
    }
    // console.log(abi);
  }


  return (
    <>
      <RadioGroup defaultValue='1' onChange={setAbiSourceType} value={abiSourceType}>
        <Stack spacing={5} direction="column">
          <Radio colorScheme='blue' value="1">
            Abi from contract address
          </Radio>
          <Radio colorScheme='blue' value="2">
            Abi from class hash
          </Radio>
        </Stack>
      </RadioGroup>
      {!!abiSourceType &&
        <Box px="60px" mt={5}>
          <form onSubmit={handleSubmitHash(onSubmitHashOrAddr)}>
            <FormControl isInvalid={errorsHash.hash as any}>
              <FormLabel htmlFor="hash">{abiSourceType == "1" ? <>Contract address</> : <>Class Hash</>} :</FormLabel>
              <Input width={400}
                defaultValue={abiSource}
                id="hash"
                placeholder={abiSourceType == "1" ? "Contract address" : "Class Hash"}
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
      }
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader fontSize='lg' fontWeight='bold'>
            Network error.
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Error to read the Abi.<br></br>
            Verify your parameters.
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
