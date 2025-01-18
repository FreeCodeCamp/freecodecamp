import { flatten } from 'lodash';

// TODO: keeping curriculum in memory is handy if we want to field requests that
// need to 'query' the curriculum, but if we force the client to handle
// redirectToCurrentChallenge and, instead, only report the current challenge id
// via the user object, then we should *not* store this so it can be garbage
// collected.

// eslint-disable-next-line import/no-unresolved
import curriculum from '../../../../shared/config/curriculum.json';

const blockToChallengeIdMap = getBlockToChallengeIdMap();

export function getChallenges() {
  return Object.keys(curriculum)
    .map(key => curriculum[key].blocks)
    .reduce((challengeArray, superBlock) => {
      const challengesForBlock = Object.keys(superBlock).map(
        key => superBlock[key].challenges
      );
      return [...challengeArray, ...flatten(challengesForBlock)];
    }, []);
}

function getBlockToChallengeIdMap() {
  let blockToChallengeIdMap = {};

  Object.values(curriculum).forEach(superBlock => {
    if (superBlock.blocks) {
      Object.entries(superBlock.blocks).forEach(([dashedName, block]) => {
        if (block.challenges) {
          blockToChallengeIdMap[dashedName] = block.challenges.map(
            challenge => challenge.id
          );
        }
      });
    }
  });

  return blockToChallengeIdMap;
}

export function getChallengeIdsForBlock(dashedName) {
  const challengeIds = blockToChallengeIdMap[dashedName] || [];
  if (challengeIds.length === 0) {
    return undefined;
  }
  return challengeIds;
}
