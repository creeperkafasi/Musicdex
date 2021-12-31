import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import React, { Suspense, useMemo, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import {
  SearchParams,
  useSongSearch,
} from "../modules/services/search.service";
import { useTrendingSongs } from "../modules/services/songs.service";

export function Search() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<Song>> = Object.fromEntries(
    search.entries()
  );
  const { data: searchResult, ...rest } = useSongSearch<Song>({
    q: "",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, title",
    ...qObj,
  });

  function doSearch(queryNew: Partial<SearchParams<Song>> = {}) {
    navigate({
      pathname: "/search",
      search: `?${createSearchParams({
        q: qObj.q,
        ...qObj,
        ...queryNew,
      } as any)}`,
    });
  }

  const songs = useMemo(() => {
    console.log(searchResult);

    return searchResult?.hits?.map((doc) => {
      return doc.document;
    });
  }, [searchResult]);

  return (
    <PageContainer>
      {/* <VStack spacing={5}> */}
      <QueryStatus queryStatus={rest} />
      <Suspense fallback={<div></div>}>
        <HStack align="end">
          <Heading size="lg">Search: "{qObj.q || ""}"</Heading>
          <Spacer></Spacer>
          <Text size="small">
            {(searchResult?.page || 0) * 10 - 10 + (songs?.length || 0)} out of{" "}
            {searchResult?.found}
          </Text>
        </HStack>
        {songs && <SongTable songs={songs} />}
        <HStack spacing={3} my={3}>
          <Button
            disabled={(searchResult?.page || 1) <= 1}
            onClick={() =>
              (searchResult?.page || 0) > 1 &&
              doSearch({ page: (searchResult?.page || 1) - 1 })
            }
          >
            Prev
          </Button>
          <Button
            disabled={
              (searchResult?.page || 1) * 10 + (songs?.length || 0) - 10 >=
              (searchResult?.found || 0)
            }
            onClick={() =>
              (searchResult?.page || 1) >= 1 &&
              doSearch({ page: (searchResult?.page || 1) + 1 })
            }
          >
            Next
          </Button>
        </HStack>
      </Suspense>
      {/* </VStack> */}
    </PageContainer>
  );
}
