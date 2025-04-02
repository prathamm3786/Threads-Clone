import { Box, Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import SuggestedUsers from '../components/SuggestedUsers'

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)
  const showToast = useShowToast()

  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true)
      setPosts([])
      try {
        const res = await fetch("/api/posts/feed", {
          method: "GET",
        })
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setPosts(data)
      } catch (error) {
        showToast("Error", error, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPost()
  }, [setPosts, showToast])

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {
          !loading && posts.length === 0 && <h1>Follow some Users to see the feed</h1>
        }
        {loading && (
          <Flex justify="center">
            <Spinner size={"xl"} />

          </Flex>
        )}
        {
          posts.map((posts) => (
            <Post key={posts._id} post={posts} postedBy={posts.postedBy} />
          ))
        }
      </Box>
      <Box flex={30} display={{
        base: "none",
        md: "block"
      }} >
        <SuggestedUsers />
      </Box>


    </Flex>
  )
}

export default HomePage
