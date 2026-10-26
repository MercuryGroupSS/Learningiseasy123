# Number Garden — Learning Is Easy

Twelve-stage iPad math practice adventure with Apple Pencil tracing, handwriting pad, guided concrete–pictorial–abstract teaching, ten-frames, number bonds, spaced review, local progress and stage unlocks.

## Learning structure

Every stage contains eight problems, with up to three drawn from previously introduced concepts. A stage unlocks after six answers are checked as correct. Missed concepts receive greater review weight on subsequent stages.

## Publishing

Deploy the repository root to Netlify; no build command or backend needed.

## Important limitations

Handwriting is not automatically recognized: the child or adult verifies the answer after revealing it. Stencil completion checks that drawing occurred, not stroke accuracy. The matching Bella voice profile is configured, but actual prerecorded Kokoro/Bella voice clips must still be generated and added to `assets/bella/` and mapped in `bella-manifest.json`. Until then the device voice is used. Progress stays in localStorage on the device.
