# GameRank

*A pairwise voting app for ranking party games.*

Choose between two games at a time and build a ranked list for your next LAN party or games night.

**Live demo:** <https://gamerank.moverperfect.com>

## Overview

Party Game Voting is a small web app for groups who want a faster, less messy way to decide what to play together. Instead of asking people to rank a long list all at once, the app presents two games at a time and records a winner (or a draw). Those pairwise votes update each game's rating and produce a live leaderboard.

This makes the decision process lightweight for users while still producing a useful overall ranking for the group.

## Why this exists

Voting on party games sounds simple until the list gets long. Group chats turn into noise, spreadsheet rankings are tedious, and "just shout out your favourite" usually favours the loudest person in the room.

This project explores a better interaction pattern:

- show one head-to-head matchup at a time
- keep each decision quick
- accumulate enough votes to build a meaningful ranking
- let people see the leaderboard update as they go

## How it works

### User flow

1. A visitor opens the app and sees two games.
2. They pick the better option or mark the matchup as a draw.
3. The app stores that matchup locally so the same browser does not keep repeating identical comparisons.
4. Ratings are updated on the server.
5. The leaderboard refreshes and the next matchup appears.

### Ranking model

The app currently uses a **fixed rating adjustment** per vote:

- winner: `+30`
- loser: `-30`
- draw: no rating change

### Vote limiting

The browser tracks:

- `evaluatedMatchups` in `localStorage`, to avoid repeating the same local matchup history
- `matchCounter` in `localStorage`, capped at 50 votes per browser session

This keeps individual sessions short and helps prevent a single client from voting indefinitely.

## Features

- Pairwise game voting instead of full-list ranking
- Live leaderboard ordered by rating
- Draw support for close matchups
- Per-browser vote cap
- Simple admin page for viewing rankings
- Backed by a MySQL database and Next.js API routes

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Bootstrap, React Bootstrap
- **Backend:** Next.js API routes
- **Database:** MySQL via `mysql2`
- **Deployment/analytics:** Vercel analytics package is included in the project

## Running locally

### Prerequisites

- Node.js
- npm
- A MySQL database with a `games` table
- A `DATABASE_URL` environment variable pointing to that database

### Install dependencies

```bash
npm install
```

### Configure environment

Create an environment file with your database connection string:

```bash
DATABASE_URL=<your-mysql-connection-string>
```

### Start the development server

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Type checking

```bash
npm run type-check
```
