import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useShowToast from '../hooks/useShowToast'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postsAtom from '../atoms/postsAtom'

const PostPage = () => {
  const { user, loading } = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const { pid } = useParams()
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const curruntPost = posts[0]
  useEffect(() => {
    const getPost = async () => {
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, 'error')
          return
        }
        setPosts([data])

      } catch (error) {
        showToast("Error", error.message, "error")

      }
    }
    getPost()
  }, [showToast, pid, setPosts ])
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure want to delete this post?")) return;

      const res = await fetch(`/api/posts/${curruntPost._id}`, {
        method: "DELETE",
      })
      const data = res.json()
      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }
      showToast("Post deleted successfully", "", "success")
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error.message, "error")

    }
  }
  if (!user && loading) {
    return (
      <Flex justify="center" >
        <Spinner size="xl" />
      </Flex>
    )
  }
  if (!curruntPost) return null
  return (
    <>
      <Flex >
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name='Mark Zuck' />
          <Flex>

            <Text fontSize={"sm"} fontWeight={"bold"} >{user?.username}</Text>
            <Image src='/verified.png' w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"} textAlign={"right"}>
          <Text fontSize={"sm"} width={36} color={"gray.light"}>
            {formatDistanceToNow(new Date(curruntPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />

          )}
        </Flex>
      </Flex>
      <Text my={3} >{curruntPost.text}</Text>
      {curruntPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid "} borderColor={"gray.light"}>
          <Image src={curruntPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={curruntPost} />
      </Flex>


      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {curruntPost?.replies.map((reply, index) => (
        <Comment
          key={reply._id || index} reply={reply}
          lastReply={reply._id === curruntPost.replies[curruntPost.replies.length - 1]._id}
        />
      ))}
    </>
  )
}

export default PostPage
