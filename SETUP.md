# TOA Engineers Hub: upgrade guide (free, no card needed)

Your design is unchanged. Everything below is new behaviour.

## 1. Put the files on GitHub (10 minutes)
1. Unzip `toa-hub-upgrade.zip` on your phone or computer.
2. Open your GitHub project. Tap **Add file > Upload files**.
3. Drag in EVERYTHING from the unzipped folder, including the folders `api`, `scripts` and `files`.
4. **Do not upload** your own `config.js`, `resources.json`, `sw.js`, `manifest.json` or icons again. They stay as they are.
5. Tap **Commit changes**. Vercel redeploys in about a minute.

## 2A. Upload whole folders (the easy way)
Open `yoursite/admin-upload.html` on a computer.
1. **Once:** make an upload key on GitHub: your picture > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token. Name "Hub upload", expiry 30 days, Repository access: **Only select repositories** (your Hub project), Permissions > Contents: **Read and write**. Copy the key. Delete it on GitHub when you are done. It is never stored in your site.
2. On the page, type `username/project`, paste the key, tap **Check connection**.
3. Tap **Choose folder** and pick your folder (the one that holds your programme folders, or a single programme folder).
4. Tap **Preview**. It shows how many files go to each programme and year, which names it tidied (for example `&` becomes `and`, `%` becomes `percent`, accents and odd symbols are removed), and what it skipped (system files, unsupported types, files over 95 MB).
5. Tap **Upload now** and keep the page open. It sends files in batches, pauses by itself if GitHub asks it to slow down, and publishes the site once at the end.
- **If it stops** (network, sleep, limits): open it again, choose the same folder, upload. Files already on GitHub are skipped.
- **Missing programme or year in your folder names:** use the two boxes under the folder picker to send those files to a programme or year.
- **Limits:** GitHub refuses files over 100 MB. Those are skipped; put a Google Drive link in `resources.json` for them instead. GitHub also allows only a limited number of new files per hour, so a very large first upload (several hundred files) can pause and need a second run later.
- **Phones** cannot pick folders. Use "choose several files" with the programme and year boxes, or use a computer.

## 2. How your folders become the resource library (no forms)
Arrange PDFs inside the `files` folder like this:

`files / Programme / Year / Semester / Course / Type / file.pdf`

Only **Programme** and **Year** are needed. Examples:
- `files/Civil/Year 2/Semester 1/CVE 251 Structures/Past Questions/CVE251 2023.pdf`
- `files/Common/Year 1/Semester 1/EMA 151 Engineering Mathematics/Lecture Notes/Chapter 1.pdf`
- `files/Mechanical/Year 4/Timetable.pdf`

The site reads names like Year 1, Y1, Level 100, Semester 2, Sem 2, and keywords like Past Questions, Notes, Solutions, Timetable. Exam years such as 2023 are picked from the folder or file name. Use the folder name **Common** for first-year courses everyone shares. Add `(important)` or `(verified)` to a file name to mark it.
Upload folders by dragging them into GitHub's upload page. Each deploy rebuilds the list automatically.
Check it worked: open `yoursite/resources.auto.json`. If the file is empty, open Vercel, then Deployments, then the latest one, then Build Logs, and look for "Hub build: N files".
Honest limits: the NEW label uses GitHub's history. If Vercel does not provide it, files simply have no NEW label. Misnamed folders are listed in the build log.

## 2B. You already uploaded files another way (command prompt)? Do not delete anything
- Look at the `files` folder on GitHub. If your files are in `files/Programme/Year/...` the site already shows them.
- Run the uploader on your whole folder. It compares the **contents** of each file with what is on GitHub. A file that is already there is skipped, even if it sits under a different name or folder (the tick box "Skip a file if the exact same file is already..." is on by default). So you will not get duplicates.
- Try a small folder first and watch the log lines "Already there" and "Same file already on GitHub at...".
- Old files with odd symbols in their names are left alone. If you ever want them renamed, tell me which ones.
- Files that are **not** inside the `files` folder are not shown by the site. Move them into `files` on GitHub.

## 2C. Files over 95 MB (no Google Drive needed)
GitHub refuses single files over 100 MB, so the uploader skips them and tells you. Options, all free:
1. **Shrink the PDF** with any PDF compressor (most scanned PDFs drop to a fraction of their size).
2. **Split it** into two or three PDFs (for example "Part 1" and "Part 2") with any PDF splitter, then upload the parts.
3. **GitHub Releases** accept files up to 2 GB. On your project: Releases > Draft a new release > attach the file > Publish. Then copy the file's link into `resources.json` as the `link`. These open as a download, without in-site preview.

## 2E. First-year past questions (its own folder)
First-year past questions come only from the folder you put them in. The site never goes through your other files to find them.
1. On GitHub, inside the `files` folder, make a folder named **First Year** (names like `First Year Past Questions`, `1st Year` and `Freshers` also work, and so does `Common`).
2. Put your first-year files in it. Course folders inside are optional, for example `files/First Year/EMA 151 Engineering Mathematics/EMA151 2022.pdf`.
3. Everything inside appears only under **1st-year past questions** (the big yellow tile on the Courses page and the card on Home). It does not appear inside any programme.
4. If you list a first-year file by hand in `resources.json`, add `"firstYear": true` to its entry.

## 2D. Timetables in chunks
There are two kinds.
- **Timetable PDFs or pictures (class timetables, exam timetable PDFs):** put them in your folders, for example `files/Civil/Year 2/Class Timetable.pdf` or `files/Civil/Year 2/Exam Timetable.pdf`, and upload with `admin-upload.html` like everything else. Any file with "timetable" in its name or folder is filed under Timetables automatically.
- **The official exam timetable (the searchable page in Planner):** use `admin-timetable.html`.
  1. Load one programme's sheet (or choose several CSV files at once; they are joined).
  2. Tap **Load the live timetable from my site**, so it knows what is already published.
  3. Tick **This is only part of the timetable**, so every other programme's exams are kept.
  4. Preview, tick the checking box, make the file, and paste it into `timetable.json` on GitHub.
  Repeat for the next programme. Each round adds or updates only the rows you loaded.

## 3. Pages you manage (open these on your site)
| Page | What it does |
|---|---|
| `admin-upload.html` | upload whole folders to GitHub in safe batches |
| `admin.html` | one-off resources, notices (now with pin and expiry) |
| `admin-timetable.html` | exam timetable: paste, check, preview, publish |
| `admin-community.html` | WhatsApp groups: add, change link, switch off, remove |
| `admin-questions.html` | Exam practice questions (one by one or from a spreadsheet) |
| `admin-challenge.html` | Weekly challenge (needs section 4) |

Each page makes a block of text. Copy it into the matching file on GitHub (`timetable.json`, `community.json`, `questions.json`). Each page has buttons that open the right GitHub page. Anyone who is not a collaborator on your GitHub project cannot publish anything. Add or remove helpers in GitHub: Settings > Collaborators.
**Only add answers and solutions you have checked.** The site never makes up answers.

## 4. Switch on the Weekly Challenge and secure points (free)
Do this once.
1. **Firebase secret:** Firebase console > your project `eng-hub-29ae8` > Project settings (gear) > Service accounts > **Database secrets** > Show. Copy it. If you cannot see Database secrets, tell me and I will switch the method.
2. **Vercel settings:** Vercel > your project > Settings > Environment Variables. Add:
   - `FIREBASE_DB_URL` = the database address in your `config.js` (starts with https and ends with firebaseio.com)
   - `FIREBASE_DB_SECRET` = the secret from step 1
   - `ADMIN_PASSWORD` = a long password only you know
   - `ADMIN_SECRET` = any long random text
   - Optional alerts to your phone: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (open Telegram, message @BotFather, send /newbot, copy the token; message your bot once, then message @userinfobot for your id)
   - Optional: `SITE_URL` = your site address
3. Vercel > Deployments > the three dots on the latest > **Redeploy**.
4. **Firebase rules:** Firebase console > Realtime Database > Rules. Paste the contents of `firebase-rules.json`, then use the Rules Playground to confirm the leaderboard still reads, then Publish. This locks everything except the old leaderboard, so only the server can write challenge points.
5. Open `yoursite/admin-challenge.html`, sign in.

**Each week:** tap "Copy the AI request", paste into any AI chat, paste the reply back and import. Read each draft, check the answer yourself, tap Approve, then Publish and give the closing time. Students answer on the Challenges page. After closing, points are added automatically about 6 hours later (so you can give explanation bonuses first), or tap "Close and score now".
Scoring is shown to students: +2 for taking part, +10 for a correct answer, up to +3 bonus for a clear explanation. Speed does not count. Ties share the win. Nothing reaches students until you approve and publish it. Answers stay on the server until the challenge closes.

## 5. Not included (and why)
- **Email alerts and phone push:** need a paid or private service. Telegram alerts to you are free and included. Students see changes through the UPDATED labels and the notice board.
- **Student accounts:** not free to run safely. Entries are tied to the leaderboard profile, so one person making many profiles is the remaining weak point.
- **The old XP leaderboard** still trusts each device. It is kept for fun. The new challenge points are the verified ones.
- **Upload a PDF from the admin page:** needs paid storage. GitHub folders are the free route.
- **Reports and activity:** switch on Vercel > Analytics (free tier).
