import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";


const Comment = ({ reply, lastReply }) => {
  
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex direction={"column"} gap={1} w={"full"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"sm"} >{reply.username}</Text>

          </Flex>
          <Text>{reply.text}</Text>

        </Flex>
      </Flex>
      {!lastReply ? <Divider my={4} /> : null}

    </>
  )
}

export default Comment
