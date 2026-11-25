# Jasmine AI Assistant - Project Roadmap

## v4.3.1 (NOT compile-tested, needs a build)
- Chat, agent not installed (`AntigravityAgentStatus.kt` only), made to look like AntiGem's setup prompt:
  - each agent has its own round mark (Antigravity rocket, Claude `✻`, OpenCode `</>`, Codex `>_`) with a small status dot (amber = not installed, green = installed, grey = checking);
  - text under the title: "<Agent> is not installed yet. The app can install it for you." (Codex adds "(pkg install codex)");
  - the button now says just "Install" (12.dp corners, agent colour);
  - new "Server logs" text button under it, opens the output of the last install try.
- Nothing else changed (the Settings > Server pages are untouched in this build).

## v4.3.0 (NOT compile-tested, needs a build)
- Onboarding: agent choice is now the real on/off switch (same store as Settings > Server > Agents); nothing ticked by default.
- Onboarding: new Terminal App Setup step (separate terminal icon on/off + style) after agent choice, before the Jasmine wizard.
- Environment setup screen and onboarding screens UI changes.

## Build & Automated Test Verification (Current Build)
- **Debug APK Build**: Compiled cleanly (`:app:assembleDebug` and `:terminal-companion:assembleDebug` succeeded).
- **Compile & Test Fixes Applied**:
  - `JasmineGyan.kt`: removed trailing extra quote on the Molk-Verse line.
  - `LicenseManager.kt`: removed duplicate `getRemainingDailySeconds()` overload.
  - `AgentEngine.kt`: fixed `ProofGuard.sanitizeClaimedCompletion(...)` reference.
  - `ServerGroup2a.kt`: added Material icon imports and preserved `Notes`, `Memory`, `Forum`, `Security` icons.
  - `ServerGroup2d.kt`: added missing `Modifier` import.
  - `ServerSettingsScreen.kt`: added missing `rememberSaveable` import.
  - `ServerMiniApps.kt`: replaced invalid `&` operator with `.intersect(...)`.
  - `AntigravityChatScreen.kt`: added `@file:OptIn(...)` and `ServerHeaderIcons` import.
  - `AgentPlusTest.kt`: annotated with `@RunWith(RobolectricTestRunner::class)` and `@Config(sdk = [36])` so `org.json.JSONObject` works in local JVM tests.
  - Launcher icons: kept the original custom `ic_launcher.png` / `ic_launcher_round.png` assets and removed template `.webp` duplicates.
- **Automated JVM & Robolectric Tests**: All 13 standalone test suites passed (`79/79` tests: `AgentPlusTest`, `AutonomousCapabilitiesTest`, `CodingTeamTests`, `ConnectorManagerTest`, `ExampleRobolectricTest`, `ExampleUnitTest`, `HabitToolsTest`, `LevelAndFeelTest`, `ModelConfigTest`, `SwarmPlanTest`, `TerminalSafetyTest`, `ToolCatalogTest`, `ZeroTouchTests`).
- **Still Needs Device / Emulator Testing**: On-device hardware/OS flows (wake word, live voice call, Accessibility screen control, camera/Nigehbaan, Termux/companion APK install) and `FirebaseBackendRepositoryRuleTest` (requires running Firebase Auth & Firestore emulators).

## v4.2.104 (built-in terminal; not compile-tested)
- The terminal is now part of Jasmine. No Termux app, no second app (`terminal-companion` module removed, its code ported to `EmbeddedPaths`, `EmbeddedBootstrap`, `EmbeddedRunner` in `com.example.terminal`).
- Package is now `ai.jasmine` (same length as `com.termux`, so Termux packages are rewritten byte for byte) and `targetSdk` is 28 (Android 10+ blocks running programs from the app folder for apps targeting 29+). `BrandConfig.APPLICATION_ID` updated. This is a NEW app to Android: uninstall the old `com.debatk.jasmine`, then install.
- `app/google-services.json` still lists only `com.debatk.jasmine`. Register an Android app `ai.jasmine` (with the signing SHA-1) in Firebase and replace the file, otherwise Firebase features will not start (`missingGoogleServicesStrategy = WARN` lets the build pass).
- Terminal screen (`TerminalWorkspaceScreen.kt`, old console + "Jasmine Agent" tab removed): real bash in a real terminal view (Termux `terminal-view:v0.118.1` via JitPack, added to `settings.gradle.kts`), tabs (sessions live in `TerminalTabs`), pinch zoom, ESC/TAB/CTRL/ALT/arrows/^C/^D and symbol keys, copy/paste, restart a finished session. First use shows a set-up card (download base files, unpack, python/git/nodejs, verify).
- `TerminalEngine`: commands from the voice assistant and the agents now run through `EmbeddedRunner` (no Intents to Termux). `isCompanionInstalled()` now means "the built-in environment is unpacked".
- `EnvironmentInstaller`: `orchestrateEmbedded` replaces the companion/Termux flows (the old Termux functions are unused).
- Not done: setup keeps running only while the app process lives (no foreground service yet); tmux-style sessions; Termux:API / X11 integration.

## v4.2.103 (AntiGem-style new chat; not compile-tested)
- New `AntigravityAgentPicker.kt`: `NewChatAgentPicker` (pill, 20.dp corners, 1.dp outline alpha .3, 3.dp padding/gaps, segments 17.dp, 14x7.dp padding, selected = agent colour alpha .16 + SemiBold, 13.sp; agent colours Antigravity #3B82F6, Claude #D97757, OpenCode #10B981, Codex #8B5CF6) and `NewChatWelcome` (picker above with 20.dp gap, then "How can I help you today?" 22.sp SemiBold and "Ask a question, brainstorm ideas, or start coding" 14.sp alpha .55).
- `AntigravityChatScreen`: empty chat now shows only that (robot icon and token line removed). Only agents switched on in Settings > Agents are offered (top menu and picker); the picker is hidden when fewer than two are on. `AgentStatusPanel` shows the same welcome for Claude Code / OpenCode / Codex when their chat is empty.
- Still different from AntiGem (see AntiGem-Strict-Prompt.txt): top bar (project name + status menu, header shortcut icons), composer (model pill, "Reply to <model>...", mic/dictation/voice-call buttons), per-agent control chips, history drawer, onboarding, Jarvis welcome, terminal that needs Termux.

## Last working version
v4.2.5 (built and tested on a phone by the owner: works well).
Chat-path tools (create_document, create_website, open_in_chrome, run_routine) and Termux `pkg install` in the agent were added after that and are now compiled and unit/Robolectric-tested, awaiting real-phone verification.

## v4.2.74 (NOT compile-tested, needs a build)
- Fixed a real compile error found by reading: `ConsoleTab` and `AgentTab` in `TerminalWorkspaceScreen.kt` used `context` without defining it (added `val context = LocalContext.current`). Expect more errors like this until the first build.
- Terminal console: pinch to zoom (font 9-22 sp, saved to `term_font`), key row with Ctrl-C (stops the running command), Tab (two spaces) and symbols / - _ ~ | & > $ " ' * . ..
- Not done: a real PTY (full-screen programs such as vim/htop), tmux-style session tabs (the engine is one session).

## v4.2.73 (NOT compile-tested, needs a build)
- Mini Apps (`ServerMiniApps.kt` rewritten): manifest `permissions` (internet, camera, microphone, location) are approved per app; internet is blocked per app unless granted; camera/mic/location only if granted. SHA-256 of the app's files is stored on approval, a changed app asks again. Developer mode (console panel), install from .zip (zip-slip safe), export to <workspace>/exports/<name>.zip, app info, delete with confirm. Not done: home-screen icon, publisher key signing.
- MCP per-tool permissions: in each server's tool list (Claude Code, OpenCode) a tool can be switched off; Jasmine writes `permissions.deny` (`mcp__<server>__<tool>`) into ~/.claude/settings.json or `tools` {"<server>_<tool>": false} into opencode.json, and removes only its own earlier rules. Antigravity and Codex: not supported (no such file known).
- Checked: chat already has thinking, tool cards, approval for denied tools, questionnaire (AskUserQuestion), plan card (ExitPlanMode) and queued messages in `AgentCliChat.kt` / `AntigravityAgentStatus.kt`; so those are not open.
- Still open: Browser/Terminal/Android MCP bridges, REA tool groups (need rea-mcp), real PTY terminal + tabs, Mini App home icon and publisher keys.

## v4.2.72 (NOT compile-tested, needs a build)
- Sandbox check in `TerminalSafety.confirmationReason` now also uses the project's own preset (new `cwd` parameter, `ServerPolicy.presetFor` is public). `TerminalEngine.execute` passes `_cwd.value`.
- MCP Marketplace: new `ServerMcpCatalog.kt` (11 real, one-command servers: filesystem, memory, sequential-thinking, context7, playwright, github, brave-search, fetch, git, sqlite, time) with search, shown in every agent's MCP page above "Configured servers". Add gives a normal Stdio row that syncs like any other. Needs npx or uvx where the agents run.
- File Explorer (new `ServerExplorer.kt`, Settings > Server > File Explorer): breadcrumbs, search (folder + sub-folders), sort, hidden files, multi-select by long press, new file/folder, rename, copy/move/paste, tar.gz zip and unzip, delete, properties, "open in editor" (`ServerNav.pendingFile`).
- Browser (new `ServerBrowser.kt`, Settings > Server > Browser): tabs, address/search bar, back/forward/reload, Speed Dial (saved in `browser_dial`), desktop mode, DevTools (Eruda loaded from jsdelivr when asked), find in page, error card with Retry.
- Code Editor (`ServerEditorPlus.kt` + `ServerCodeEditor.kt`): find and replace-all, Diff of the open file, Run (py, js, ts, sh, rb, php, go, lua, pl, java, kts), Git source-control panel (branch chips, create branch, per-file stage/unstage/diff, commit, pull, push, log, git init).
- Still open: per-tool MCP permissions, Browser/Terminal/Android MCP bridges (need real MCP servers), REA tool groups (need rea-mcp to enforce), full Mini Apps (signing, per-app permissions, home icon, developer key), real PTY terminal + tmux-style tabs (needs a terminal-emulator library and a build), chat plan-mode and questionnaire cards.

## v4.2.70 (NOT compile-tested, needs a build)
Commands & Permissions: a project's own preset (Settings > Server > Commands & Permissions > Projects) now also applies to terminal commands, not only to files. `ServerPolicy.command(ctx, cmd, cwd)` takes the terminal's current folder; inside `~/projects/<name>` the project's override is used, else the global preset. `TerminalEngine.execute` passes `_cwd.value`. The sandbox check in `TerminalSafety` still uses the global preset.
- Checked in code: Sandbox, Approval Scope (This Chat / Workspace / Always) and Artifact Review already work from earlier versions.

## v4.2.69 (NOT compile-tested, needs a build)
MCP Servers (inside Antigravity, Claude Code, OpenCode and Codex pages) now really reach the agents. Before, servers were only saved in Jasmine and no agent read them.
- New `ui/screens/server/ServerMcp.kt` (`McpSync`, new `McpPage`; the old `McpPage` was removed from `ServerGroup2b.kt`).
- Sync (runs where agents run: phone terminal or server over SSH; needs python3 for OpenCode/Codex/Antigravity): Claude Code = `claude mcp add-json -s user` / `remove`; OpenCode = `~/.config/opencode/opencode.json` key `mcp`; Codex = marked block in `~/.codex/config.toml` (`[mcp_servers.<name>]`); Antigravity = `~/.gemini/config/mcp_config.json` and `~/.gemini/antigravity/mcp_config.json` (`mcpServers`).
- Safety: only servers Jasmine wrote are removed (tracked in `mcp_synced_<agent>`); your own entries stay; a config file that is not valid JSON is not touched; a Codex table that already exists outside the block is skipped and reported.
- Add/Edit dialog like AntiGem: Stdio (command, args, working dir, env), SSE/URL (url, headers), Raw JSON import (`mcpServers` format). Names: A-Z 0-9 _ - only. Remove asks first. Tool names list after Test/Refresh. `env` and `headers` are stored encrypted.
- Presets: Stitch (remote URL, add API key header) and REA (`rea-mcp`) are real; the other presets are labels only (Jasmine has no bridge for them) and say so on screen.
- Not done: MCP marketplace catalog (1-click), per-tool permissions, Jarvis/Browser/Terminal/Android bridges as real MCP servers.

## v4.2.61 (NOT compile-tested, needs a build)
Settings > Server > Commands & Permissions now really works (before it was only saved, nothing read it).
- New `terminal/ServerPolicy.kt`: reads `perm_preset`, `custom_term`, `custom_outside`, `perm_rules`, `review_edits`, `perm_projects`.
- Terminal commands (`TerminalEngine.execute`): Deny rule stops the command; Ask rule or Custom + "Ask" asks first; Allow rule, Turbo, or Custom + "Auto-Run" skips Jasmine's own mode question. Dangerous commands (rm -rf, mkfs, reboot...) always ask, whatever is set. Default Mode and Full Machine Mode keep Jasmine's own terminal permission mode.
- File tools (`readFileContent`, `writeFileContent`, `deletePath`, used by the agent and chat tools): Read/Write File rules; files outside the workspace ask in Default Mode, are allowed in Full Machine / Turbo, follow "Files outside the project" in Custom; "Review File Edits & Writes" asks before every write.
- Rule patterns: `*` matches anything (`git*`, `npm*`); without `*` the pattern matches the whole command or its first word. Deny beats Ask beats Allow.
- Later versions made Terminal Sandbox Isolation (`TerminalSafety.confirmationReason`), Artifact Review Policy (`ServerPolicy.file`, writes ask) and Default Approval Scope (`TerminalSafety.applyApprovalScope`) real, so "only saved" is out of date. Terminal commands got the per-project override in v4.2.70.
- Terminal look (font, palette, buffer) was already applied; no change.

## v4.2.53 (NOT compile-tested, needs a build)
"What to install" choice on the environment screen (only when Jasmine Terminal is bundled), like AntiGem's source picker but with Jasmine's own options:
- **Full environment** (recommended): base files, then python, git, nodejs. Shows "Base files from: GitHub" with an "Open page" link.
- **Minimal**: base files only (core tools + package manager), checked with `bash --version` / `apt --version`.
- **From a ZIP file**: pick a Termux base zip on the phone (Android file picker, handed to Jasmine Terminal as a read-only link); python, git, nodejs are still installed after it.
- A line with the phone's CPU and Android version. Button says "Choose a ZIP file" until one is picked, otherwise "Continue".
- After a failure: "Change source" (back to the choice) and "Download page" with the tip to install from a ZIP.
- Companion `SetupService` takes `mode` (full / minimal / zip) + the zip link; it remembers what was installed (`.setup_done` holds "full" or "minimal"), so choosing Full after Minimal only adds the packages.
- No Hugging Face: the official Termux base files are only on GitHub. AntiGem's Hugging Face copy is its own file for its own app. A second site needs a zip that Jasmine hosts itself; then it is one more entry in the list.
- Not taken over: "Ubuntu chroot (root)".

## v4.2.52 (NOT compile-tested, needs a build)
Checked against AntiGem's source (read for how things work, nothing copied; AntiGem is GPL v3).
- Package rewriting hardened with what AntiGem's own relocator showed: zip-like files (apk, jar, zip, aar, whl, dex, jmod) are never rewritten (their checksums would break), "com.termux.termuxam" is kept (termux-am's Java class name), the package checksum list (md5sums) is rebuilt, maintainer scripts get 0755, only files that contain the old name are touched. apt now runs it through the `DPkg::Pre-Install-Pkgs` hook (`libexec/jasmine/relocate-debs`, `apt.conf.d/99jasmine-relocate`) instead of a dpkg replacement. The base files skip zip-like files and keep ".termuxam" too.
- Paths always use `/data/data/ai.jasmine/files/...` (not `/data/user/0/...`): the package database and the programs know their files by that name (`Paths.root`).
- Environment screen follows AntiGem's states: title Download your environment / Installing / Setup didn't finish / You're all set, "This takes a few minutes. You can keep using the app meanwhile.", "Show details" with the live lines.
- Not taken over: AntiGem's terminal icon step (separate launcher icon), source choice (full / minimal / zip), mirrors. Ask if wanted.

## v4.2.51 (NOT compile-tested, needs a build)
Environment screen with Jasmine Terminal shows the 4 steps the owner described: 1 Download, 2 Unpack, 3 Configure, 4 Verify, then "You're all set" with Get started. Nothing to open by hand: the Android installer opens by itself. Android always asks for one tap on Install for a new app, that cannot be skipped. Step titles depend on the flow (`EnvironmentInstaller.stepTitles`), the old Termux flow keeps Download / Install / Configure / Verify. Environment screen texts are English.

## v4.2.50 (NOT compile-tested, needs a build)
Jasmine Terminal: a small companion app inside this project (new Gradle module `:terminal-companion`, package `ai.jasmine`, targetSdk 28). Jasmine keeps targetSdk 36 and its package `com.debatk.jasmine`.
- Why: Android 10+ stops apps with targetSdk 29+ from running programs stored in their own folder. A targetSdk 28 app may. `ai.jasmine` has the same length as `com.termux`, so Termux base files and packages are rewritten byte for byte.
- Companion: `Bootstrap` (downloads the newest Termux bootstrap zip, unpacks, rewrites names, links), `assets/dpkg-jasmine.sh` (apt runs it instead of dpkg; it rewrites every package first), `SetupService` (foreground service: base files, apt update, python + git + nodejs, progress sent to Jasmine), `RunCommandService` (runs one command, sends output + exit code back), `MainActivity` (plain console, not a full PTY terminal).
- Trust: both services need the signature permission `ai.jasmine.permission.RUN_COMMAND`, so only an app signed with the same key (Jasmine) can use them. Companion uses the same signing keys as the app.
- Jasmine: `TerminalEngine` uses the companion whenever it is installed (same code path as Termux, other package and service). `EnvironmentInstaller.orchestrateCompanion` installs the bundled APK (one Android install tap), starts the companion setup, shows its progress, then verifies with real commands. The old Termux flow stays and is used when the APK is not bundled.
- CI: `android-build.yml` builds `:terminal-companion` first and copies its APK to `app/src/main/assets/jasmine-terminal.apk`. Local builds without that file use the old Termux flow.
- Not done / unknown: nothing here was compiled or run. The package rewriting (dpkg wrapper) is the riskiest part and needs a real phone test. Only user 0 (the main user) works because paths are fixed to /data/data/ai.jasmine. No full interactive PTY yet. Removing the old Termux code comes only after this works on a phone.

## v4.2.49 (NOT compile-tested, needs a build)
Environment screen wording, as the owner described it: "Welcome to Jasmine" > "Download your environment" > button **Continue** (starts the download) > while it runs, button **Continue with background** moves on to the next screen and the work keeps going. All new onboarding texts (agent screen, banner, notification) are now in English.

## v4.2.48 (NOT compile-tested, needs a build)
Background install for the environment step (AntiGem has this too). Flow is unchanged: Login, environment, agents, Jasmine wizard, Home.
- New `terminal/EnvironmentInstallService.kt`: foreground service (dataSync) with a progress notification; started by `EnvironmentInstaller.start()`, stops itself when the installer is idle, done or failed. Declared in the manifest.
- Environment screen: new button "Background mein chalne do, aage badho" while download / configure / verify run (`onContinueInBackground`, no reset). Not shown when the person has to act (Termux install tap, Termux paste line).
- Agent screen: banner at the top with live status of the environment work (progress, "Installer kholo" when the Android installer needs a tap, retry on failure, pointer to Settings > Terminal when the Termux paste step is pending).
- Limits: the install tap and the Termux paste step still need the person, so those cannot finish on their own. A phone that kills the app can still stop the work; the notification only lowers that risk.

## v4.2.47 (NOT compile-tested, needs a build)
First-launch order is now: 1) Login (untouched), 2) Download your environment (untouched), 3) **Choose your agents**, 4) Jasmine wizard (untouched), 5) Home. The terminal intro screen from 4.2.46 was removed on the owner's request.
- `ui/screens/OnboardingAgentScreens.kt`: `AgentSelectScreen` only (Antigravity, Claude Code, Codex, OpenCode; ON/OFF cards, at least one must stay on). UI only.
- Wiring: `ActiveScreen.AGENT_SELECT`, prefs `agent_setup_done`, `selected_agents` (`UserPreferencesRepository`), observer in `JasmineViewModel` (combine of 3 flags), `finishAgentSelection()`, case in `MainActivity`.
- Existing installs (setup already done) are not forced through the new step.
- Only Antigravity has a backend. Claude Code / Codex / OpenCode are saved as choices but do nothing yet.

## v4.2.45 (NOT compile-tested, needs a build)
First-launch order is now: 1) Login (Google / Email), 2) **Download your environment**, 3) Jasmine wizard (key, permissions, special, background), 4) Home. The AntiGem-style agent-choice step, terminal-icon step and mascot popup are NOT part of this.
- New `terminal/EnvironmentInstaller.kt` + `ui/screens/EnvironmentSetupScreen.kt`. Four real steps: **Download** (asks github.com/termux/termux-app for the latest stable release, picks the APK for this CPU, downloads with size/speed; falls back to v0.118.3), **Install** (Android installer, waits until Termux is really installed), **Configure** (person opens Termux once, pastes one line, allows the RUN_COMMAND permission; then `pkg install python git nodejs` runs in Termux), **Verify** (runs `python --version`, `git --version`, `node --version`; only passes if all exit 0 and shows the real output).
- Why Termux and not a Linux inside Jasmine: Jasmine targets API 36; Android 10+ blocks running downloaded programs from an app's own folder.
- Termux from GitHub is a debug build signed with a shared test key (Termux's own warning); F-Droid builds are signed differently. If Termux is already installed the download/install steps are skipped. Do not mix sources.
- Wiring: `ActiveScreen.ENVIRONMENT_SETUP`, pref `env_setup_done` (`UserPreferencesRepository`), observer in `JasmineViewModel` (combine of setup_done + env_setup_done), `finishEnvironmentSetup()`, `TerminalEngine.runSetupCommand` (fixed setup commands, no per-command card). Existing installs are not forced through it; Settings > Terminal has "Environment setup chalao".
- Still NOT built: real PTY terminal inside Jasmine, agent backends (Claude Code / Codex / OpenCode), the other AntiGem features chosen later.

## v4.2.44 (NOT compile-tested, needs a build)
Built on top of v4.2.43 (which already had the v4.2.41 observe-act loop and the v4.2.42 chat/safety work).
- **Browser agent** (`BrowserAgent`): headless WebView the agent controls: `browser_open_tab`, `browser_read_page` (text + numbered clickable elements), `browser_click`, `browser_type`, `browser_scroll`, `browser_screenshot`. Specialist `BROWSER` in `AgentEngine` and tools in the device catalog (voice). Offscreen WebView screenshot can come out blank on some phones; then the tool says so.
- **Vision** (`look_at_screen`, `look_at_browser`): real screenshot (Android 11+, `canTakeScreenshot` added to the accessibility config; the user must switch the Accessibility service OFF and ON once after updating) sent to Gemini for a description. Specialist `VISION`.
- **Artifacts** (`AgentArtifacts`): live task list per task, plan cards (`plan_create`, `plan_update`, `task_list_show`), screenshot cards. Shown in Agent Hub (`AgentArtifactsSection`). The user can comment under a card; the running agent reads the comment at its next step.
- **Knowledge** (`AgentKnowledge`): after a successful task a short lesson (what worked / what to avoid) is saved; before a similar task the best 3 are recalled. Used by `AgentEngine` and `JasmineComputerAgent`.
- **Builder / Git** (`GitBuilder`): `git_commit` / `git_push` (uploads a workspace folder as commits on a branch via the GitHub API, max 80 files, 900 KB each), `open_pull_request`, `build_apk_start` + `build_apk_finish` (runs `android-build.yml`, waits, downloads the APK, opens the installer; the user still taps Install). Needs the GitHub token + repo saved in the Antigravity setup.
- **Swarm**: every non-Builder agent (research agents too) first works with real tools (needs Pro licence, falls back to the old research answer); up to 3 swarms at the same time (ids prefixed per swarm); only an operator-style agent of a lone swarm may use SCREEN tools, and screen actions are serialized by a lock.
- Tools in the catalog: about 720 (481 written one by one + about 240 made by loops) + 95 Live voice tools; the old "400+" comment is only the test minimum.
- Still NOT built: ADB self-connect, real PTY terminal, thinking level selector, Claude Code/Codex backends, file-level checkpoints, video/recording artifacts.

## v4.2.41 (not compile-tested, needs a build)
- `AgentEngine.executeGoal`: no more fixed 6-step plan. Observe-act loop: model picks ONE next step, real result goes into history, next step is chosen from it (max 30 steps). Fake "alag tareeka" retry removed.
- Honest results: screen tools (`click_text`, `click_element_id`, `type_text`, `scroll_page`, `open_app`, `go_back`, `go_home`) return `Failed: ...` when they did not work; new `read_screen` and `click_text`. A tool result counts as failed only when it STARTS with an error word.
- "Done" gate: success is rejected if the last step failed, if a screen action was not re-read with `read_screen`, or if no step succeeded. Model must say success=true/false honestly.
- `JasmineComputerAgent`: new `edit_file` (old/new, must match once), optional `JASMINE.md` project rules in the workspace, history window 8 -> 14, "done" blocked only when the LAST step failed.
- Still NOT built: browser control (click/type inside web pages), artifacts (plan/screenshot/recording cards), screenshot vision in the agent loop, richer knowledge memory, Builder agent GitHub push.

## v4.2.42 (NOT compile-tested, needs a build)
Added to the Antigravity chat and terminal safety (all new code, no external dependencies):
- Token footer: in / out / think / cached / time / cost / model. Cost stays hidden until `AntigravityPricing.setRate(...)` is called with real rates. Cached/thought key names for the Interactions API are guesses, check with a real response.
- Message queue: messages typed while a reply runs are queued and sent one by one. Stop clears the queue.
- Chat backup and restore (History sheet: Export backup / Import backup). Import only adds chats whose id is not already saved.
- "Show thinking" under a reply, only when the stream carries thought text (key is a guess).
- Status line shows the last prompt size as "Context".
- Rewind: long-press a message > "Rewind to here". Drops later messages and resends the kept history on the next message. It does NOT undo commands already run or app changes already applied.
- Always allow: the permission card has "Hamesha allow" for one exact command. Dangerous commands and commands from untrusted data are never remembered.
- @mention: type "@" in the chat input to pick a file from Jasmine's workspace; its text is attached when sent (max 5 files, 40k chars each, workspace only).

Still NOT built: thinking level selector (the Interactions API field is unknown), real PTY terminal (needs native terminal library), mini apps, browser extension runtime, ADB self-connect, PC connect, other agent backends (Claude Code / Codex / OpenCode), file-level checkpoints, plus the v4.2.41 list below.

## Features
- Home Screen & Neural Voice Pipeline: Working
- Loudspeaker Media Output Routing (USAGE_MEDIA, no Assistant/DND muting): Working
- Gemini Multi-Turn Autonomous Tool Loop (5 turns): Working
- Chat Screen with Real Camera, Gallery & Document Attachments: Working
- Chat History Session Browser & Gemini Vision Multimodal AI: Working
- Termux-Style Developer Terminal Console: Working
- System Knowledge (JasmineGyan): Working
- Live Task Progress HUD: Working
- Endless Advisor Engine (JasmineAdvisorEngine): Working
- License & Security Paywall (₹399 HMAC Device-Lock): Working
- Multi-Agent Swarm Orchestrator (Single Unified Hub): Working
- Voice Guard Engine (6 Devanagari Hindi lines enrollment, Keystore encryption, Cosine acoustic match): Working
- Real Military Air-Raid Oscillating Warble Siren (AudioTrack raw PCM 700Hz-1850Hz): Working
- Nigehbaan Security Guard & Duress Lock: Working
- Global Skills Store (Concurrent async loading, <1s latency): Working
- Gesture Navigation Guard (No accidental drawer opening on fast scroll): Working
- Sub-Screen Pop Navigation (Zero back button infinite loop): Working
- App Biometric Lock in MainActivity & Advanced Settings: Working (`BiometricPrompt`)
- Smart Home / IoT Link & Custom Devices: Working (Synced via `JasmineFeatures`, supports Home Assistant/ESP32 webhook URL)
- AI Calls & Caller Announcer (`JasmineCallScreeningService` + `PhoneStateAutoAnswerReceiver`): Working (Requires Android Call Screening role / phone permissions)
- Global Connectors Hub & MCP Client (`ConnectorManager` + `ToolsConnectors`): Working (Encrypted tokens, Website redirect login, MCP JSON-RPC tools)
- Custom Jasmine Outfit Artwork & SideMenu Sync (`JasmineOutfits`): Working (Bundled drawables 0..6 + theme sync)

## Known problems
1. **Accidental Drawer Opening on Fast Vertical Scroll**:
   - *Root cause*: `MainActivity.kt:204` `ModalNavigationDrawer` had default `gesturesEnabled = true`. Fast fling/scroll was captured as horizontal edge swipe.
   - *Status*: Closed (Fixed by setting `gesturesEnabled = false`).
2. **Back Button Infinite Loop on Sub-Screens**:
   - *Root cause*: Sub-screens called `onBack = { viewModel.navigateTo(...) }`, pushing duplicate screens onto navigation stack.
   - *Status*: Closed (Fixed with `viewModel.popDestination()` popping clean stack).
3. **Global Skills Screen Infinite Loading Freeze**:
   - *Root cause*: `SkillRegistryClient.kt:66-84` performed sequential 50-second blocking network loops without coroutine concurrency.
   - *Status*: Closed (Fixed with `coroutineScope async awaitAll` + 2.5s timeout + instant fallback).
4. **Terminal Workspace Personal Name & Fake Docker Tabs**:
   - *Root cause*: `TerminalModels.kt` had hardcoded "Yakraj's Computer" and dummy Docker tabs.
   - *Status*: Closed (Cleaned to "Termux Terminal" & native Android Linux sandbox).
5. **Drawer Menu Duplicate Hubs & Dummy Reports**:
   - *Root cause*: `SideMenuDrawer.kt` contained duplicate "Sub-Agents Swarm Hub / Groups & Reports Hub".
   - *Status*: Closed (Merged into single clean "Agent Hub (Live)").
6. **Chat Screen Lacked Attachments & History Sessions**:
   - *Root cause*: `ChatScreen.kt` had only basic text input and no image attachment or history sheet.
   - *Status*: Closed (Redesigned with Camera photo capture, Gallery picker, Document picker, Chat History session bottom sheet, and Gemini Vision).
7. **Voice Guardian Fake RMS Formula & Fake Toasts**:
   - *Root cause*: `VoiceGuardianManager.kt` used dummy `100f - (diff * 4.2f)` and hardcoded toast `(Match: 98.4%)`.
   - *Status*: Closed (Rebuilt Voice Guard with 6 Devanagari lines enrollment, 8-dimensional normalized acoustic feature vector, Keystore AES-256 encryption, and cosine similarity matching).
8. **Siren Alarm Playing Phone Clock Ringtone**:
   - *Root cause*: `DeviceController.kt` played `RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)`.
   - *Status*: Closed (Replaced with real military air-raid dual-frequency oscillating PCM AudioTrack siren at maximum volume).

## Not real yet
1. Real trading -> `ProductivityHubScreens.kt` (Paper BUY/SELL) + `MarketService.kt` (live prices only). No exchange order / signature code. Needs owner decision (exchange) and a testnet trial first.
2. Intruder alert: siren + silent front-camera selfie work; photos are shown in Settings > Advanced > Nigehbaan (`IntruderPhotoLog.kt`) with date/time, open and delete. Not yet tested on a phone; photo orientation not checked.
3. Wake word (v4.2.7): offline "Hey/Hello/Wake up Jasmine" now built in (no key). Needs a phone test, see the v4.2.7 section below.
4. "Intense (18+)" level has self-declared age + licence + two confirmations; public store release needs a policy check.
5. Tool catalog: about 720 tools in `service/tools`, all connected to Live voice through `search_device_tools`, `list_device_tools`, `device_tool`.

## Photo generation
- Real now: `ImageGenerator.kt` (Gemini image model `gemini-3.1-flash-image`, fallback `gemini-3.1-flash-lite-image`). Voice tool `generate_image`; saves to Pictures/Jasmine and opens on screen. Needs a Gemini key whose project allows image generation (may need billing). Not yet tested on a phone.
- Old behaviour (opening a Google Images search and saying it generated the picture) is removed.

## Done in v4.2.3 (untested, needs a build)
- Speed meter: time from the moment you stop talking to Jasmine's first sound. Measured in `GeminiLiveAudioService.kt` (3 loud 20 ms frames = speech; first played chunk = reply), stored in `VoiceDiagnosticManager.kt`, shown as a "Speed Meter" card (last / average / best, Reset) in Settings > Voice > Voice Diagnostic Test and in the copied report.
- Habit tracker: background voice tools in `service/tools/ToolsHabits.kt` (`habit_add`, `habit_done`, `habit_undo`, `habit_status`, `habit_pending_today`, `habit_list`, `habit_remove`). No new screen. Streak stays alive until today ends.
- New tests: `HabitToolsTest`, `TerminalSafetyTest` (dangerous-command list, limits, approve/deny), `SwarmPlanTest` (planner JSON, 6-agent cap, hub summary). For these the swarm planner and hub summary were moved into testable companion functions (`parsePlan`, `buildHubSummary`); behaviour is the same.
- Rule noted: voice-related features go inside the Voice Engine.

## Done in v4.2.2 (untested, needs a build)
- Talk button (Live voice) can now start the parallel swarm: tools `run_parallel_agents` and `agent_hub_status` in `LiveToolRegistry.kt`. When the swarm finishes, Jasmine speaks the result (`launchSwarmTask`).
- Swarm agents now treat an empty search or a too-short AI answer as a failure and move to the next approach; an answer from AI knowledge only is labelled as such.
- Documents by voice already existed (`create_document`: docx, xlsx, md, txt); no change needed.

## Done in v4.2.1 (untested, needs a build)
- Swarm (`MultiAgentSwarmOrchestrator.kt`): planner picks 2-6 agents, agents run in parallel (`async`), each agent tries up to 4 approaches (web+AI, Wikipedia+other model, AI only, short prompt), 90s limit per agent, answers up to 1024 tokens. Fake "100% complete" / "verify kar diya" messages removed; failures show as ERROR with the reason. Only one swarm runs at a time.
- Terminal setup (`LinuxEnvironmentManager.setupComputer`): used to download a text manifest, create empty folders and say "Kali installed and verified". Now it only creates workspace folders and says so. Fake package list and fake SHA256 claim removed. Real Linux tools only via the Termux button.
- Computer agent: step limit 12 -> 30; hitting the limit now marks the task FAILED (before it stayed RUNNING); "Auto-fix applied successfully" now only when the fix command really exited 0.
- Removed placeholder `tools/tts_trainer/output/jasmine_tts.onnx` (4.5 KB, not a real model).

## Done in v4.2.0
- License keys are ECDSA P-256 signatures (`LicenseSignature.kt`); only the public key is in the app, the private key is the GitHub secret `JASMINE_LICENSE_PRIVATE_KEY`.
- Fake `.onnx` models removed; TTS fallback list now real TTS models (`gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts`); text default stays `gemini-2.5-flash` (fast with thinkingBudget=0).
- Release signing variable names match `.github/workflows/android-build.yml`.
- Default voice Leda plus a soft/sweet VOICE STYLE line in the Live prompt.

## Current task
- [x] 1. Deep-clean all dummy data, fake battery (82%), fake storage (48.5GB), and dummy initial chat messages from `JasmineViewModel.kt`.
- [x] 2. Fix silence bug after granting full permissions: route `GeminiTtsService.kt` to `AudioAttributes.USAGE_MEDIA` loudspeaker output, fix `MainActivity.kt` audio permission callback, and update `ModelConfig.kt` to valid Gemini models.
- [x] 3. Replace all `Math.random()` fake buffers in Voice Guard with real `AudioRecord` 16kHz PCM hardware microphone recording in `VoiceGuardianManager.kt` and `AdvancedSettingsScreens.kt`.
- [x] 4. Fix Agent Screen 400/404 error in `AntigravityApiClient.kt` with standard Gemini generateContent fallback.
- [x] 5. Fix Skills Hub loading by pre-populating verified offline catalogs into `SkillRegistryClient.kt` memory cache.
- [x] 6. Remove "Voice Tester" from Settings while keeping "Run setup wizard" intact, and persist Advanced Settings in `SharedPreferences`.
- [x] 7. Verify compilation with `compile_applet`, update version to `v4.0.5`, commit and push to repo.

## Suggested ideas
1. **On-Device Voiceprint Visualizer Canvas**:
   - *What*: Real-time frequency spectrum visualizer wave rendering owner's vocal formants during the 6-line enrollment.
   - *Why*: Gives Boss visual proof that their acoustic spectrum is being captured and Keystore-encrypted on-device.
   - *How*: Canvas draw block inside `VoiceEngineSettingsScreen` rendering the 8 feature vector bars.
   - *Settings section*: Settings > Voice Engine > Voice Guard.
2. **Offline Photo OCR Card Scanner in Chat**:
   - *What*: Direct ML Kit on-device text recognition for captured documents before sending to Gemini.
   - *Why*: Reduces token usage and works instantly even when offline.
   - *How*: Bundled Google ML Kit Text Recognition client in `ChatScreen.kt`.
   - *Settings section*: Chat Screen attachment popover.
3. **Secret Panic Knock Sequence on Screen Lock**:
   - *What*: Boss taps a custom rhythm on the locked screen to trigger silent Nigehbaan alert or emergency PIN unlock.
   - *Why*: Faster than voice unlock in hostile or crowded environments.
   - *How*: SensorEventListener detecting screen tap intervals in `VoiceGuardianManager.kt`.
   - *Settings section*: Settings > Voice Engine > Voice Guard > Nigehbaan.

## Naye raaste
1. **Sherpa-ONNX Speaker Diarization & Embedding Model**:
   - *What*: Downloadable 12MB ONNX embedding model (Cam++ or ResNet34) running directly on NPU.
   - *Why*: Upgrades acoustic matching to bank-grade 99.2% accuracy.
   - *How*: Loaded via existing `UnifiedModelRuntimeEngine.kt`.
   - *Risk*: Uses ~12MB device storage.
2. **CameraX Silent Front-Camera Lens Controller**:
   - *What*: Headless CameraX image capture provider for Nigehbaan that snaps photos without opening the camera activity.
   - *Why*: Complete covert intruder documentation.
   - *How*: CameraX `ImageCapture.Builder` running in background service.
   - *Risk*: Requires Android Camera permission.
3. **Termux Native PTY Bridge (libpseudoterminal)**:
   - *What*: Native Unix pseudo-terminal binding to execute real interactive bash, htop, and nano.
   - *Why*: Makes Jasmine's terminal indistinguishable from a full Linux computer.
   - *How*: Pre-compiled JNI library bundled into `jniLibs/arm64-v8a`.
   - *Risk*: Platform-dependent architecture binaries.

## Done in v4.2.7 (untested, needs a build)
- Porcupine removed (no Picovoice key, no .ppn file). New offline wake word: `service/WakeWordService.kt` listens with the open-source Vosk model (`vosk-model-small-en-in-0.4`, about 36 MB, downloaded once from Settings > Voice Engine by `service/WakeModelManager.kt`). Phrases: "Hey Jasmine", "Hello Jasmine", "Wake up Jasmine" (plus close spellings of the name).
- Voice Engine card: ON/OFF switch, model download with progress, last heard text, buttons for battery restriction, overlay and lock-screen alert.
- Notification says what she is doing: "Jasmine so rahi hai", "Jasmine sun rahi hai", "Jasmine active hai" (`JasmineStatusText`). Same text in `VoiceForegroundService`.
- Opening the app starts the listener when the switch is ON (`MainActivity.onStart`).
- New voice tool `end_session` ("ab tum ja sakti ho"): she says goodbye, the call closes, the app goes Home (and to the background if she was woken by voice), the listener takes over again.
- Wake -> call: screen turns on, app opens directly (overlay permission) with a full-screen notification as backup; MainActivity shows over the lock screen and starts the live call.
- Partial WakeLock while the listener runs; energy gate so the model only works while someone is talking.
- Restart: Android does not allow a microphone service to start by itself after boot, so `BootReceiver` posts a "tap to arm" notification instead.
- `tools/wakeword_trainer` makes a placeholder file, not a real ONNX model (see NOTE.md there). The app does not use it.
- Known risks to test: accuracy with Indian accent and noise, battery use over a full day, which phones block the direct open from the background.


## Coding Team fix loop (added after v4.2.34)
- `CodingTeam.kt`: when the Tester answers FAIL, the coders get the Tester's feedback (and the Bug Finder report) and fix the files, then the Tester checks again. Up to 3 fix rounds; it stops early if the same failure repeats.
- The Tester must start its final summary with PASS or FAIL. Only a real PASS counts as success.
- The team now posts an honest final result (PASS / FAIL / UNVERIFIED), saves `team_result.txt` in the project folder, shows it in `getStatusSummary()` and as `CodingTeam.verdict`. Agents are marked Error when the final result is FAIL.
- Connectors: plain website login is shown as "Website khula (login unverified)", not as a verified login.
- Not built yet: Android APK build, install and open from the Builder agent (needs GitHub push + Actions build + download + install screen).
- `CodingTeam.start()` refuses to restart while the team is running (returns false); the Jasmine tool tells the model not to call it again. The UI Start button restarts with `force = true`.
- A Tester PASS only counts if at least one non-mock command ran (echo/print-only python is ignored); otherwise the result is UNVERIFIED.

## Vibe Coding, VIP Jury, Molk-Verse, Scheduled Tasks (added after the fix loop; not yet compile-tested)
- Website & Coding is now "Vibe Coding": `VibeCodingScreen.kt` + `VibeAgent.kt`. Opens into an empty chat; bottom has mode selector (Planner / Auto Agent / Copilot), attach, Send; Preview / Files / VIP Balcony / Molk-Verse sheets. The old 4-tab screen and the 8-agent Team tab are removed. The CodingTeam still builds in the background and its progress and honest PASS/FAIL/UNVERIFIED result are mirrored into the chat.
- `VipJury.kt`: 10 VIP roast jury, one Gemini call per finished round, score + round banner. Needs an AI key; without it the jury says it is unavailable.
- `MolkVerse.kt` + `MolkForegroundService.kt` + `ui/screens/MolkVerseHub.kt`: Molk-Verse is now 8 real AI agents (Bhairav Daku, Nagin Rani, Kaalu Pehalwan, Seth Lakhpatiram, Pandit Chaalbaaz, Munna Hacker, Inspector Daroga Singh, Chhotu Chor) with jail break, mela event, thief, healer, trust meter, rumors, marriage and feuds, bounties, Jasmine's court and a weekly Raja, with territories, a weapon shop, police/arrest/bribe, day-night, betrayal, secret goals, saved world, Jasmine voice and briefing, and owner commands, each with its own photo (`res/drawable/molk_agent_*.png`), one AI call per turn (one at a time), memory, mood, friends/enemies. Fight/trade/threat results are decided by code; a loser is OUT for a while. Jasmine Overlord interjects every few turns. Live in Agent Hub (Molk-Verse Live); runs while the Hub is open or 24x7 via the Background switch (foreground service, manifest entry added). 429/quota pauses with backoff. Camera icon added to the Vibe Coding chat bar. Not compile-tested.
- `ScheduledTasks.kt` + `ScheduledTasksScreen.kt`: side-menu hub (Pending / Running / Completed History), WorkManager runs the CodingTeam. Tools: `schedule_task`, `list_scheduled_tasks`.
- Not built: camera/screenshot button in the chat bar (only the file/photo attachment picker exists).

- `util/ChatTextCleaner.kt`: shared `cleanChatText()` removes raw Markdown symbols (#, *, `, |, [](), >) from AI replies; applied in ChatScreen, VibeCodingScreen, AntigravityChatScreen and the Molk-Verse feed. Not compile-tested.

## 4.2.58 (Settings > Server)
- Commands & Permissions: per-project cards from `~/projects` (Inherits Global / Custom Override with Default, Machine, Turbo). Stored in `perm_projects`; `ProjectPolicy.presetFor(ctx, project)` gives the preset that applies. Not compile-tested.
- Known gap: the preset, rules, approval scope, sandbox and review toggles are saved but no agent reads them yet.

## 4.2.59 (Settings > Server)
- Plugins: per-plugin "Download as ZIP" and "Update ZIP" (the ZIP must carry the same manifest id).
- Terminal look page: "Use Terminal via SSH" switch (uses the Servers SSH login; `AgentCli.terminalOnServer`), Test SSH, and an Embedded Linux Rootfs card (Ubuntu install/remove/re-check plus Factory reset).
- Backups: Linux environment backup/restore, pick which projects to back up, git-aware mode (skips node_modules, build, .gradle and respects .gitignore). Projects restore now keeps a copy of the current folder.
- Diagnostics: Streams filter, search box, and a Floating HUD (draggable in-app panel, toggle in Diagnostics). Not compile-tested.
