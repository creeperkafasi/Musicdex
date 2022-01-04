import {
  useDisclosure,
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Flex,
  ChakraProps,
} from "@chakra-ui/react";
import { ReactNode, useMemo, useState } from "react";
import { FiHome, FiHeart, FiClock, FiServer, FiSettings } from "react-icons/fi";
import Footer from "./Footer";
import { Player } from "../player/Player";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
import { NavBar } from "../nav/NavBar";
import { LinkItemProps, SidebarContent } from "../nav/Sidebar";
import { YoutubePlayer } from "../player/YoutubePlayer";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState } from "../../store";
import { CommonContextMenu } from "../common/CommonContext";

const POSITIONS: { [key: string]: ChakraProps } = {
  background: {
    position: "absolute",
    h: "100%",
    w: "100%",
    zIndex: -1,
  },
  sidebar: {
    position: "absolute",
    zIndex: 1,
    bottom: "0px",
    ml: -60,
    w: 60,
  },
  "hover-top": {
    width: "400px",
    maxWidth: "100%",
    height: "225px",
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
  },
  "hover-bottom": {
    width: "400px",
    maxWidth: "100%",
    height: "225px",
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 10,
  },
  hidden: {
    visibility: "hidden",
    zIndex: -4,
    position: "absolute",
  },
};

export default function Frame({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const colorMode = useColorModeValue("applight", "appdark");

  const pos = useStoreState((state) => state.player.position);

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  const props = useMemo(() => POSITIONS[pos], [pos]);

  return (
    <Box
      h="100vh"
      w="100vw"
      className={colorMode}
      bg={useColorModeValue("bg.100", "bg.900")}
      overflow="hidden"
    >
      <Flex direction="column" h="100vh" overflow="hidden">
        {/* Generic Display: always present */}
        <NavBar
          onOpen={onOpen}
          zIndex={6}
          bg={useColorModeValue("bg.100", "bg.900")}
        />

        {/* Mobile Display: (provide close method) */}
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <Flex
          flexGrow={1}
          flexFlow="row nowrap"
          alignItems="stretch"
          overflow="hidden"
        >
          <SidebarContent
            onClose={onClose}
            display={{ base: "none", lg: "block" }}
            paddingTop="4"
          />

          <Flex
            // ml={{ base: 0, md: 60 }}
            direction="column"
            alignItems="stretch"
            h="100%"
            position="relative"
            flexGrow={1}
            flexShrink={1}
            zIndex={0}
          >
            <Flex overflowY="scroll" flex="1" direction="column">
              {children}
              <Footer></Footer>
            </Flex>
            <Box
              {...props}
              // visibility={
              //   pos === "hidden" || currentSong === undefined
              //     ? "hidden"
              //     : "visible"
              // }
            >
              <Box
                visibility={pos === "background" ? "visible" : "hidden"}
                width="100%"
                height="100%"
                position="absolute"
                float="initial"
                opacity={0.6}
                bgColor="bg.900"
              ></Box>
              {YoutubePlayer(onReady)}
            </Box>
          </Flex>
        </Flex>
        <Player player={player} />
        <AddToPlaylistModal />
        <CommonContextMenu />
      </Flex>
    </Box>
  );
}
