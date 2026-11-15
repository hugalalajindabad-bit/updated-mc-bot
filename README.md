# Majdur Union Minecraft Bot

Modular Mineflayer bot with an EJS chat/status dashboard.

## Setup
1. Use Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MC_HOST`, `MC_USERNAME`, `MC_AUTH`, and (if needed) `MC_PASSWORD`.
4. Run `npm start`.
5. Open `http://localhost:3000` (or your Render service URL).

## In-game commands
All commands use `!`. Add usernames only once in `commands/ingame/handler.js`:

```js
const ALLOWED_PLAYERS = ['SUJOY8534', 'max_vc_22'];
```

Each command sets `allowList: true` (only those players) or `allowList: false` (everyone).

- `!ping` — allowlist only
- `!come` — allowlist only; sends `COME_COMMAND`, default `/tp {player}`. The server must permit the bot to use that teleport command.
- `!tpaccept` — allowlist only; accepts an incoming request using `TPACCEPT_COMMAND`.
- `!help` — public

## Dashboard commands
Enter these in the dashboard message box:

- `!join` — connect/reconnect the bot
- `!leave` — disconnect and pause automatic reconnect
- `!reconnect` — force a reconnect
- `!status` — connection status
- `!say <message>` — send a Minecraft chat message
- `!sit true|false` — toggle sneak (kept for compatibility with the old dashboard)
- `!pass` — manually send the configured password command

Ordinary text is sent to Minecraft chat. Dashboard `!` commands are not sent to the Minecraft server.

## Password login
Set `MC_PASSWORD` and optionally `MC_PASSWORD_COMMAND`. The default is `/password {password}`. The bot detects common password/login prompts and sends the command once per spawn. Never commit `.env` or share your password.

## Reconnect behavior
`AUTO_RECONNECT=true` reconnects after an unexpected disconnect, using a growing delay up to `MAX_RECONNECT_DELAY_MS`. A deliberate dashboard `!leave` pauses reconnect. `!join` resumes it.

## Notes
- `!come` is server-plugin dependent. The default `/tp {player}` assumes the bot has permission and that this command teleports the bot to that player. Change `COME_COMMAND` if your server uses another command.
- Dashboard API is unauthenticated by default, matching the original project. Put it behind trusted access or add authentication before exposing it publicly.
- Discord status updates are optional; set `DISCORD_WEBHOOK_URL` and `DISCORD_MESSAGE_ID` to enable them.
