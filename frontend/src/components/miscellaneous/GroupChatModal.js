import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async(query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured",
                description: "Failed to load search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleSubmit = async() => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill out all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const {data} = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New group chat created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        } catch (error) {
            toast({
                title: "Failed to create group chat",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
      });
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already in group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    };


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            bg="#212121"
            color="white"
            >
                Create group chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          bg="#212121"
          color="white"
          >
            <FormControl>
                <Input 
                placeholder="Group chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)} 
                />
            </FormControl>
            <FormControl>
                <Input 
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)} 
                />
            </FormControl>
                <Box 
                w = "100%"
                display = "flex"
                flexWrap = "wrap"
                >
                {selectedUsers.map(u => (
                    <UserBadgeItem 
                    key = {user._id} 
                    user = {u}
                    handleFunction = {() => handleDelete(u)}
                    />
                ))}
                </Box>

                {loading?<div><Spinner /></div> : (
                    searchResult?.slice(0, 4).map(user => (
                        <UserListItem key = {user._id} user = {user} handleFunction={() => handleGroup(user)} />
                    ))
                )}
          </ModalBody>

          <ModalFooter
            bg="#212121"
            color="white">
            <Button colorScheme='orange' onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
