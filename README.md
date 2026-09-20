# A Level Adventures

Make an app for helping people to think about British A level options and where they might take you in today's world which plays out like a 'Choose your own adventure' kind of tool. The user should be greeted by a screen that shows 'A Level Adventures in the LCR' in a asci style artwork and then a pokemon / gameboy / arcade menu style option which says 'Start'. The user should then be able to search for and select 4 A level subjects available at local colleges in Liverpool. After the user submits their list, an llm / agent should process the subjects and then suggest 4 multi discipline research projects which intersect the subjects they chose and the current economic needs in the liverpool city region (see LSIP attached for reference) each of these options should be presented as dialogs which open and give more detail about the project idea and include a where this could lead to section in that dialog. 

When the user selects a research project, the agent should research local organisations that might be interested in supporting that and how the user could best approach preparing to run a research project (in partnership with local stakeholders) with a group of peers alongside their studies and other commitments allowing for max 3 hours work per week  (max 2 meetings), giving them a downloadable project plan for that research. 

Finally, the user can opt in to share their email if they would like ongoing support with their research project from local partners.

Choice selection should be stored in lovable cloud database but emails kept anonymously as users and only associated to a users choice selection by uuid. Cache A level combinations where possible to save on regenerating project ideas. Apply best design practice choices but keep it friendly, LCR Combined Authority colours.

All copy in the app should use british english. organise components clearly in subfolders. Make it beatiful and mobile ready UI.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://a-level-adventures-lcr.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab28b248-9f3d-4046-b3d1-4680a083a608).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
