# cat-bot

The public repository for the "Cat" bot on Discord, made by [Jay](https://jayxtq.xyz).

## Features

Daily cat images and facts, as well as a few other commands to give you information on your favourite feline friends :3

## Dependencies

- discord.js
- axios
- drizzle
- cron
- pg (postgres)
- typescript

## Setup

1. Clone the repository
2. Run `npm install`
3. Rename `.env.example` to `.env` and fill in the required fields, you will reqiure a postgres database which works with the `pg` package if you wish to contribute towards the database side of things.
4. Run `npm run dev` to start the bot in development mode, or `npm run dev:watch` to start the bot in development mode with file watching
5. Enjoy!