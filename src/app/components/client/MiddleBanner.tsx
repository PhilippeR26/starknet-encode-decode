"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link } from "@chakra-ui/react"

export default function MiddleBanner() {
  return (
    <Box

      width="100%"
      marginTop="1"
      borderColor="black"
      borderWidth="0px"
      borderRadius="0"
      bg='lightgray'
      opacity="95%"
      p="2"
      textAlign={'center'}
      fontSize="16"
      fontWeight="extrabold"
      color="grey.800"
      textColor="black"
    >

      <Center>
        <>
        <Link color="blue.700" href='https://github.com/PhilippeR26/starknet-encode-decode' isExternal> Repo<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link> 
        -{"  "}
        <Link color="blue.700" href='https://github.com/PhilippeR26/starknet-encode-decode/blob/main/tuto.md' isExternal> Tuto<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
      </>
      </Center>
    </Box>
  )
}