# Number Garden — Learning Is Easy

Twelve-stage iPad math practice adventure with Apple Pencil tracing, handwriting pad, guided concrete–pictorial–abstract teaching, ten-frames, number bonds, spaced review, local progress and stage unlocks.

## Learning structure

Every stage contains eight problems, with up to three drawn from previously introduced concepts. A stage unlocks after six answers are checked as correct. Missed concepts receive greater review weight on subsequent stages.

## Publishing

Deploy the repository root to Netlify; no build command or backend needed.

## Important limitations

Handwriting is not automatically recognized: the child or adult verifies the answer after revealing it. Stencil completion checks that drawing occurred, not stroke accuracy. Bundled Bella recordings now provide instructions, hints, answers, and encouragement. They match Operation Wild Explorer: Kokoro af_bella, speed 0.9, −2 dB. Number phrases are assembled from recorded segments. The game does not switch to the device voice; if playback is blocked, tap Hear again. Physical iPad playback still needs a target-device check. Progress stays in localStorage on the device.

## Practice controls

Previous stage returns to the preceding stage; Retry this stage starts a fresh eight-question round. Earned stars, completed-answer counts, best scores, and unlocked stages are retained.

After tracing, learners see an example answer beside the writing pad and can copy it before trying independently. Copy practice does not award stars or count as a checked answer. They can skip copying or reopen the example before checking. Bella narrates the copy step.

## Complete narration recordings

The Bella pack preserves pauses inside sentences. No silence-removal filter is used. Run `node scripts/check-narration.cjs` to validate all 209 embedded recordings and the full-length sentence regression checks.

## Pencil-only writing

The writing pad defaults to Apple Pencil only. Finger and palm contacts do not add ink or interrupt an active pen stroke. Select **Pencil, finger or mouse** above the pad for other input. This preference is saved on the current browser separately from learning progress. Buttons remain touch-operated.

Run `node scripts/check-pencil-mode.cjs` for the pen/touch interleaving and preference checks. A physical Apple Pencil/iPad check is still required.

## Named players and saved games

Use the Player list to switch between named saves. **Add player** creates a separate game; **Rename player** changes a name without resetting progress. The existing single-player save is retained under **Player 1** and the original legacy save is left in browser storage.

**Save game** saves explicitly, and the game also saves automatically after writing, lesson steps, hints, checked answers, switching players, and leaving the page. It resumes the current question, copy/independent step, handwriting, hints, and answer-check screen. Each player keeps their own stars, unlocked stages, and best scores.

Names and saved games stay on the current iPad and browser. They do not sync across devices or browsers. A visible message reports if browser storage cannot save. No accounts or passwords are required.

Run `node scripts/check-players.cjs` to verify migration, separate profiles, saved checkpoints, duplicate-name validation, and storage failures.
