import { useEffect, useState } from "react";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";
import { resizeArtwork } from "./utils";

export interface Channel {
  name: string;
  english_name: string;
  photo: string;
}

export interface Song {
  frequency: string;
  channel_id: string;
  video_id: string;
  name: string;
  start: number;
  end: number;
  itunesid: number;
  art: string;
  amUrl: string;
  available_at: string;
  original_artist: string;
  channel: Channel;
}

function enlargeArtworks(music: Song): Song {
  music.art = resizeArtwork(music.art);
  return music;
}

export function useTop20({ org, type }: { org: string; type: "w" | "m" }) {
  const { fetchJSON } = useClient();

  const [res, setRes] = useState<Song[] | null>(null);

  useEffect(() => {
    (async () => {
      setRes(null);
      const endpoint = encodeUrl("/api/v2/songs/top20", { org, type });
      const res = (await fetchJSON<Song[]>(endpoint)).map(enlargeArtworks);
      setRes(res);
    })();
  }, [org, type, fetchJSON]);

  return [res];
}