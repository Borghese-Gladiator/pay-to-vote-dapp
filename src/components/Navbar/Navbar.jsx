import { useState, useContext } from "react";
import ContractAddressesContext from "../../context/ContractAddressesContext";

import Logo from "./Logo";
import { Link, Box, Flex, Text, Stack, Icon, IconButton, Image, Divider } from "@chakra-ui/react";

// Icons
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { AiFillGithub, AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Logo
        w="150px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <Icon as={AiOutlineClose} w={8} h={8} /> : <Icon as={GiHamburgerMenu} w={8} h={8} />}
    </Box>
  );
};

const MenuLinks = ({ isOpen }) => {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 2, 0, 0]}
      >
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