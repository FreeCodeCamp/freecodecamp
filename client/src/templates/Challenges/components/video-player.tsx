import React from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import store from 'store';

import Loader from '../../../components/helpers/loader';
import envData from '../../../../config/env.json';
import type { BilibiliIds, VideoLocaleIds } from '../../../redux/prop-types';

// TODO: pull these types from all-langs
const { clientLocale } = envData as {
  clientLocale:
    | 'english'
    | 'chinese'
    | 'chinese-traditional'
    | 'espanol'
    | 'italian'
    | 'portuguese';
};

interface VideoPlayerProps {
  videoId: string;
  videoLocaleIds?: VideoLocaleIds;
  onVideoLoad: (e: YouTubeEvent) => void;
  videoIsLoaded: boolean;
  bilibiliIds?: BilibiliIds;
  title: string;
}

function setPlaybackRate(e: YouTubeEvent<number>) {
  store.set('fcc-yt-playback-rate', e.data);
}

function VideoPlayer({
  videoId,
  videoLocaleIds,
  onVideoLoad,
  videoIsLoaded,
  bilibiliIds,
  title
}: VideoPlayerProps): JSX.Element {
  let bilibiliSrc = null;

  if (
    bilibiliIds &&
    ['chinese', 'chinese-traditional'].includes(clientLocale)
  ) {
    const { aid, bvid, cid } = bilibiliIds;
    bilibiliSrc = `//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}`;
  }

  if (videoLocaleIds) {
    const localeId = videoLocaleIds[clientLocale as keyof VideoLocaleIds];
    videoId = localeId || videoId;
  }

  return (
    <div className='video-wrapper'>
      {!videoIsLoaded ? (
        <div className='video-placeholder-loader'>
          <Loader />
        </div>
      ) : null}

      {bilibiliSrc ? (
        <iframe
          frameBorder='no'
          scrolling='no'
          src={bilibiliSrc}
          title={title}
        />
      ) : (
        <YouTube
          className={
            videoIsLoaded ? 'display-youtube-video' : 'hide-youtube-video'
          }
          onReady={onVideoLoad}
          onPlaybackRateChange={setPlaybackRate}
          opts={{
            playerVars: {
              rel: 0
            },
            width: 'auto',
            height: 'auto'
          }}
          videoId={videoId}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
