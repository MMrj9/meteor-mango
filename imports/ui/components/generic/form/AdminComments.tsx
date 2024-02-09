import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import {
  Box,
  Button,
  VStack,
  HStack,
  Textarea,
  Divider,
  useToast,
  Text,
  Flex,
} from '@chakra-ui/react'
import { AdminComment } from '/imports/api/adminComment'
import moment from 'moment'
import { error, success } from '../utils'

const AdminComments: React.FC<{ collection: string; objectId: string }> = ({
  collection,
  objectId,
}) => {
  const [newComment, setNewComment] = useState('')
  const toast = useToast()

  const adminComments: AdminComment[] = useTracker(() => {
    const subscription = Meteor.subscribe('admincomment', collection, objectId)

    if (subscription.ready()) {
      return AdminComment.find({ collection, objectId }).fetch()
    }

    return []
  })

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      const comment = {
        collection,
        objectId,
        text: newComment,
      }
      Meteor.call(
        'admincomment.insertOrUpdate',
        comment,
        (err: Meteor.Error) => {
          if (err) {
            error(toast, `Failed to save comment: ${err.reason}`)
          } else {
            success(toast, 'Comment saved successfully')
          }
          setNewComment('')
        },
      )
    }
  }

  return (
    <VStack align="stretch" spacing={4} p={4}>
      {/* Comment Input */}
      <HStack mb={4}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          size="sm"
          flex="1"
        />
        <Button onClick={handleCommentSubmit} colorScheme="blue" size="sm">
          Submit
        </Button>
      </HStack>

      <Divider />

      {/* Display Comments */}
      <VStack align="stretch" spacing={2}>
        {adminComments.map((comment: AdminComment) => (
          <Box
            key={comment._id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            shadow="md"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="bold">{comment.user}</Text>
              <Text color="gray.500" fontSize="sm">
                {moment(comment.createdOn).format('DD-MM-yyyy HH:mm')}
              </Text>
            </Flex>
            <Text fontWeight={'medium'}>{comment.text}</Text>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}

export default AdminComments
