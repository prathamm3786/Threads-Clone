import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversations from '../components/Conversations'
import MessageContainer from '../components/MessageContainer'
import useShowToast from "../hooks/useShowToast"
import { GiConversation } from "react-icons/gi"
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
const ChatPage = () => {
    const showToast = useShowToast()
    const [loadingConversations, setLoadingConversations] = useState(true)
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState("")
    const [searchingUser, setSearchingUser] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const { socket, onlineUsers } = useSocket()

    useEffect(()=>{
        socket?.on("messagesSeen",({conversationId})=>{
            setConversations((prev) => {
                const updatedConvo  = prev.map(convo =>{
                    if(convo?._id === conversationId){
                        return{
                            ...convo,
                            lastMessage:{
                                ...convo.lastMessage,
                                seen:true
                            }
                        }
                    }
                    return convo
                })
                return updatedConvo
            })
        })
    },[socket, setConversations])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch('/api/messages/conversations')
                const data = await res.json()
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return
                }

                setConversations(data)
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoadingConversations(false)
            }
        }
        getConversations()
    }, [showToast, setConversations])
    const handleConversationSearch = async (e) => {
        e.preventDefault()
        setSearchingUser(true)
        try {
            const res = await fetch(`/api/users/profile/${searchText}`)
            const data = await res.json()
            if (data.error) {
                showToast("Error", data.error, "error")
                return
            }
            const messagingYourself = data._id === currentUser._id
            if (messagingYourself) {
                showToast("Error", "You can't message yourself", "error")
                return
            }
            if (data._id === currentUser._id) {
                showToast("Error", "You can't search for yourself", "error")
                return
            }
            const conversaionAlreadyExists = conversations.find((conversation) => conversation.participants[0]?._id === data?._id)
            if (conversaionAlreadyExists) {
                setSelectedConversation({
                    _id: conversaionAlreadyExists?._id,
                    userId: data?._id,
                    userProfilePic: data.profilePic,
                    username: data.username
                })
                return
            }
            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: data._id,
                        username: data.username,
                        profilePic: data.profilePic

                    }
                ]
            }
            setConversations((prev) => [...prev, mockConversation])
        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setSearchingUser(false)
        }
    }
    return <Box position={"absolute"} left={"50%"} w={{
        base: "100%",
        md: "80%",
        lg: "750px",

    }}
        p={4}
        transform={"translateX(-50%)"} >

        <Flex gap={4}
            flexDirection={{
                base: "column",
                md: "row",
            }}
            maxW={{
                sm: "400px",
                md: "full",
            }}
            mx={"auto"}
        >
            <Flex flex={30} gap={2} flexDirection={"column"} maxW={{
                sm: "250px",
                md: "full",
            }}
                mx={"auto"}>
                <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
                    Your Conversations
                </Text>
                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2} >
                        <Input placeholder='Search for a User' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                        <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                            <SearchIcon />
                        </Button>
                    </Flex>
                </form>
                {loadingConversations && (
                    [0, 1, 2, 3, 4].map((_, i) => (
                        <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                            <Box>
                                <SkeletonCircle size={10} />
                            </Box>
                            <Flex w={"full"} flexDirection={"column"} gap={3}>
                                <Skeleton h={"10px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90%"} />
                            </Flex>
                        </Flex>
                    ))

                )}
                {!loadingConversations && (
                    conversations.map(convo => (
                        <Conversations key={convo._id} isOnline={onlineUsers.includes(convo.participants[0]?._id)} conversation={convo} />
                    ))
                )}
            </Flex>
            {!selectedConversation._id && (

                <Flex
                    flex={70}
                    borderRadius={"md"}
                    p={2}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={"400px"}
                >
                    <GiConversation size={100} />
                    <Text >Select a conversation to start messaging</Text>
                </Flex>
            )}
            {selectedConversation._id && <MessageContainer />}
        </Flex>
    </Box>
}

export default ChatPage
