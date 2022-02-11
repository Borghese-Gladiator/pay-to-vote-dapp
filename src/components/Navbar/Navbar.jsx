import { useState, useContext } from "react";
import ContractAddressesContext from "../../context/ContractAddressesContext";

import Logo from "./Logo";
import {
  Link,
  Box,
  Flex,
  Text,
  Stack,
  Icon,
  IconButton,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/react";

import { aboutText } from "../../utils";

// Icons
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { AiFillGithub, AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

const NavBar = (props) => {
  const [open, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!open);

  return (
    <NavBarContainer {...props}>
      <Logo
        w="230px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} open={open} />
      <MenuLinks open={open} />
    </NavBarContainer>
  );
};

const MenuToggle = ({ toggle, open }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {open ? <Icon as={AiOutlineClose} w={8} h={8} /> : <Icon as={GiHamburgerMenu} w={8} h={8} />}
    </Box>
  );
};

const MenuLinks = ({ open }) => {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box
      display={{ base: open ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 2, 0, 0]}
      >
        <IconButton
          onClick={onOpen}
          aria-label='Open about modal'
          size='md'
          icon={<Icon as={AiOutlineInfoCircle} w={6} h={6} />}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>About App</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize='lg'>{aboutText}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Link
          href={`https://etherscan.io/address/${customVotingAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          isExternal
        >
          <Flex alignItems="center">
            <Text fontSize='sm'>View Deployed Contract</Text>
            <ExternalLinkIcon w={6} h={6} p={1} />
          </Flex>
        </Link>
        <Divider orientation='vertical' variant="solid" h="50px" />
        <Link
          href='https://github.com/Borghese-Gladiator/pay-to-vote-dapp'
          target="_blank"
          rel="noopener noreferrer"
          isExternal
        >
          <IconButton
            aria-label='Go to GitHub link'
            size='md'
            icon={<Icon as={AiFillGithub} w={6} h={6} />}
          />
        </Link>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={6}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;