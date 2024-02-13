import React, { useEffect, useRef, useState } from 'react'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
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
import FloatingSelectionDropdown from './FloatingSelectionDropdown'

const AdminComments: React.FC<{ collection: string; objectId: string }> = ({
  collection,
  objectId,
}) => {
  const [newComment, setNewComment] = useState('')
  const [taggedUsers, setTaggedUsers] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allAdminUsers, setAllAdminUsers] = useState<string[]>([])
  const [dropDownFilter, setDropdownFilter] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const adminComments: AdminComment[] = useTracker(() => {
    const subscription = Meteor.subscribe('admincomment', collection, objectId)

    if (subscription.ready()) {
      return AdminComment.find({ collection, objectId }).fetch()
    }

    return []
  })

  useEffect(() => {
    Meteor.call(
      'user.get.admin.usernames',
      (err: Meteor.Error, res: string[]) => {
        if (!err) setAllAdminUsers(res)
      },
    )
  }, [])

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      const comment = {
        collection,
        objectId,
        text: newComment,
        taggedUsers, // Include tagged users in the comment
      }
      const filteredTaggedusers = taggedUsers.filter((username: string) =>
        newComment.includes(`@${username}`),
      )
      Meteor.call(
        'admincomment.insertOrUpdate',
        comment,
        filteredTaggedusers,
        (err: Meteor.Error) => {
          if (err) {
            error(toast, `Failed to save comment: ${err.reason}`)
          } else {
            success(toast, 'Comment saved successfully')
          }
          setNewComment('')
          setTaggedUsers([]) // Clear tagged users after submitting the comment
        },
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      // Show dropdown
      setShowDropdown(true)

      // Calculate caret position
      const textarea = textareaRef.current
      if (textarea) {
        const { selectionStart, selectionEnd } = textarea
        const { offsetTop, offsetLeft, offsetHeight } = textarea
        const { style } = dropdownRef.current!
        if (style) {
          style.top = `${offsetTop + offsetHeight}px`
          style.left = `${offsetLeft + selectionStart * 10}px` // Adjust positioning as needed
        }
      }
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showDropdown) {
      const textarea = textareaRef.current
      if (textarea) {
        const { selectionStart, value } = textarea
        const textBeforeCaret = value.substring(0, selectionStart)
        const textAfterCaret = value.substring(selectionStart)

        // Find the start index of the current word
        const startIndex = textBeforeCaret.search(/\S+$/)

        // Find the end index of the current word
        const endIndex = textAfterCaret.search(/\s/)
        const currentWord = value
          .substring(startIndex, selectionStart + endIndex)
          .replace('@', '')

        if (allAdminUsers.includes(currentWord)) {
          handleTagUser(currentWord)
        }
        setDropdownFilter(currentWord.replace('@', ''))
      }
    }
    setNewComment(e.target.value)
  }

  useEffect(() => {
    if (showDropdown) {
      const dropdown = dropdownRef.current
      if (dropdown) {
        dropdown.focus()
      }
    }
    setDropdownFilter('')
  }, [showDropdown])

  const handleTagUser = (username: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const { selectionStart, value } = textarea

      // Find the position of "@" before the current caret position
      let startIdx = selectionStart - 1
      while (startIdx >= 0 && value[startIdx] !== '@') {
        startIdx--
      }

      // If "@" is found, replace the text from "@" to the current caret position with the selected username
      if (startIdx >= 0) {
        const textBeforeAt = value.substring(0, startIdx)
        const updatedValue =
          textBeforeAt + '@' + username + value.substring(selectionStart)
        setNewComment(updatedValue)

        // Move caret to the end of the inserted username
        const newCaretPos = startIdx + username.length + 1 // +1 to account for the "@" character
        textarea.setSelectionRange(newCaretPos, newCaretPos)
      }

      // Put focus back on the text area
      textarea.focus()

      if (!taggedUsers.includes(username))
        setTaggedUsers([...taggedUsers, username])
      setShowDropdown(false)
    }
  }

  return (
    <VStack align="stretch" spacing={4} p={4}>
      {/* Comment Input */}
      <HStack mb={4}>
        <Textarea
          ref={textareaRef}
          value={newComment}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          // onBlur={handleBlur}
          placeholder="Add a comment..."
          size="sm"
          flex="1"
        />
        {showDropdown && (
          <FloatingSelectionDropdown
            options={allAdminUsers}
            onSelect={handleTagUser}
            filter={dropDownFilter}
            dropdownRef={dropdownRef}
          />
        )}
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
