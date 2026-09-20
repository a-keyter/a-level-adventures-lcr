# Use a cheaper model for quest generation

Switch the idea generation from `openai/gpt-6-astra` to `openai/gpt-5.6-terra` everywhere, cutting the cost of each new subject combination while keeping the same four-project output and the same British English tone.

## What changes for users

- Nothing visible: the same four challenge briefs, the same structure, generated a bit faster.
- Only combinations that have never been generated before hit the model; cached ones are unaffected.

## Technical detail

In `src/lib/adventure.functions.ts`:

- Replace the Responses-API provider (`createOpenAI(...).responses("openai/gpt-6-astra")`) with the chat-completions provider for `openai/gpt-5.6-terra`, built with `createOpenAICompatible` (name `lovable`, base URL `https://ai.gateway.lovable.dev/v1`, `Lovable-API-Key` + `X-Lovable-AIG-SDK` headers, existing run-id fetch wrapper) and `supportsStructuredOutputs: true` so the strict `json_schema` for the four projects is enforced.
- Replace the current `reasoningOptions` (`providerOptions.openai` with `forceReasoning`, `store`, `include`) with `providerOptions: { lovable: { reasoningEffort: "none" } }`, as required for GPT-5.6 chat calls.
- Keep `streamText` + `Output.object({ schema: ideaSchema })` and `await result.output` so the call streams and cannot be severed by the two-minute platform timeout.
- Keep the existing zod schema, caching by combo key, and error handling untouched.
- Add `createLovableAiGatewayProvider` to `src/lib/ai-gateway.server.ts` if it is not already exported there, reusing the run-id helper already in that file.

## Verification

Generate one uncached subject combination end to end and confirm four valid projects come back, then check the gateway request log shows `openai/gpt-5.6-terra` and a lower credit cost.
