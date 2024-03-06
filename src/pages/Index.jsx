import { Box, Flex, Heading, IconButton, Input, Stack, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Textarea, List, ListItem, ListIcon, VStack, Divider } from "@chakra-ui/react";
import { FaCalendarAlt, FaFolder, FaFolderOpen, FaPlus, FaFileAlt } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [notes, setNotes] = useState("");
  const [folders, setFolders] = useState([{ name: "2023", children: [{ name: "January", children: [{ name: "Meeting One", linkedNote: "" }] }] }]);

  const addMeeting = () => {
    const newMeeting = {
      id: meetings.length + 1,
      title: `Meeting ${meetings.length + 1}`,
      notes: "",
    };
    setMeetings([...meetings, newMeeting]);
  };

  const openMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setNotes(meeting.notes);
    onOpen();
  };

  const saveNotes = () => {
    const updatedMeetings = meetings.map((m) => (m.id === selectedMeeting.id ? { ...m, notes: notes } : m));
    setMeetings(updatedMeetings);
    onClose();
  };

  const linkNoteToDocument = (folderPath, meeting) => {
    const path = folderPath.split("/");
    let current = { children: folders };

    path.forEach((p) => {
      let next = current.children.find((child) => child.name === p);
      if (!next) {
        next = { name: p, children: [] };
        current.children.push(next);
      }
      current = next;
    });

    current.children.push({
      name: meeting.title,
      linkedNote: meeting.notes,
    });

    setFolders([...folders]);
  };

  const renderFolders = (folder, path = "") => {
    return (
      <List spacing={2}>
        {folder.children.map((child) => (
          <ListItem key={child.name}>
            <Flex align="center">
              {child.children ? (
                <>
                  <ListIcon as={FaFolder} color="yellow.500" />
                  {child.name}
                </>
              ) : (
                <>
                  <ListIcon as={FaFileAlt} color="blue.500" />
                  {child.name}
                  <Button size="xs" ml={2} onClick={() => linkNoteToDocument(`${path}/${child.name}`, selectedMeeting)}>
                    Link Note
                  </Button>
                </>
              )}
            </Flex>
            {child.children && renderFolders(child, `${path}/${child.name}`)}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Calendar Meetings App</Heading>
      <Stack spacing={8}>
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="2xl">Meetings</Text>
            <IconButton aria-label="Add meeting" icon={<FaPlus />} onClick={addMeeting} />
          </Flex>
          <List spacing={3}>
            {meetings.map((meeting) => (
              <ListItem key={meeting.id} onClick={() => openMeeting(meeting)} cursor="pointer">
                <Flex align="center">
                  <ListIcon as={FaCalendarAlt} color="green.500" />
                  {meeting.title}
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <Box>
          <Heading size="md" mb={2}>
            Folder Structure
          </Heading>
          <VStack align="stretch">{renderFolders({ children: folders })}</VStack>
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Meeting Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Meeting notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveNotes}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
