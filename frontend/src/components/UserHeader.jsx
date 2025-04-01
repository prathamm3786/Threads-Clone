import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { Link } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom"
import useShowToast from '../hooks/useShowToast';
import useFollowUnfollow from '../hooks/useFollowUnfollow';

const UserHeader = ({ user }) => {
    const [currentUser] = useRecoilState(userAtom)
    const showToast = useShowToast()
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user)



    const copyURL = () => {
        const curruntURL = window.location.href
        navigator.clipboard.writeText(curruntURL).then(() => {
            showToast("Success", "Your link is copied successfully.", "success")
        })
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                    <Flex gap={2} align={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text
                            fontSize={"xs"}
                            bg={"whiteAlpha.600"}
                            _dark={{ bg: "gray.dark", color: "gray.light" }}
                            color={"gray.dark"}
                            borderRadius={"full"}
                            p={1}
                        >
                            threads.net
                        </Text>
                    </Flex>
                </Box>

                <Box>
                    {user.profilePic && (
                        <Avatar

                            border={"1px"}
                            _dark={{ boxShadow: "0px 0px 8px 1px var(--chakra-colors-gray-400)" }}
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: 'md',
                                md: 'xl',
                            }}
                        />
                    )}
                    {!user.profilePic && (
                        <Avatar

                            _dark={{ boxShadow: "0px 0px 8px 1px  var(--chakra-colors-gray-400)" }}
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: 'md',
                                md: 'xl',
                            }}
                        />
                    )}
                </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {currentUser?._id === user._id && (
                <Link as={RouterLink} to={"/update"}>
                    <Button size={"sm"} bg={useColorModeValue("gray.200", "gray.900")}>Update Profile</Button>
                </Link>
            )}

            {currentUser?._id !== user._id &&
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating} >
                    {following ? "unfollow" : "Follow"}
                </Button>
            }
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} Follower</Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"} >

                    </Box>
                    <Link to="https://instagram.com" isExternal>
                        <Text color={"gray.light"}>instagram.com</Text>
                    </Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>

                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>

                                    <MenuItem bg={'gray.dark'} onClick={copyURL}>Copy link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={'full'}>
                <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={'1px solid gray'} color={'gray.light'} justifyContent={'center'} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader
