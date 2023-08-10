const { getAuditedSuperBlocks } = require('../config/superblocks');

function isAuditedCert(
  language,
  superblock,
  { showNewCurriculum, showUpcomingChanges }
) {
  if (!language || !superblock)
    throw Error('Both arguments must be provided for auditing');

  const auditedSuperBlocks = getAuditedSuperBlocks({
    showNewCurriculum: showNewCurriculum.toString(),
    showUpcomingChanges: showUpcomingChanges.toString(),
    language
  });
  return auditedSuperBlocks.includes(superblock);
}

exports.isAuditedCert = isAuditedCert;
