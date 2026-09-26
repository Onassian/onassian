#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Timezone gate — GitHub cron is UTC-only. 06:00 Asia/Singapore = 22:00 UTC the
// previous day, and Singapore observes NO daylight saving, so a single cron
// entry is exact all year. This gate stays as a cheap sanity check that the
// runner fired at the right wall-clock moment (guards manual dispatches too).
// ---------------------------------------------------------------------------

const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-SG', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date()).map((p) => [p.type, p.value]),
)

const isSixAMinSingapore = parts.hour === '06'

if (isSixAMinSingapore) {
  console.log(`✓ It is ${parts.hour}:${parts.minute} in Singapore — building today's edition.`)
  process.exit(0)
}

console.log(` SKIP — it is ${parts.hour}:${parts.minute} in Singapore, not the 06:00 slot.`)
console.log('::set-output name=skipped::true')
