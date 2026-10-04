# my-website_demo｜Notion CMS 個人作品集

以 **Next.js、React、TypeScript 與 Tailwind CSS** 建立的個人作品集網站，透過 **Notion API** 管理個人簡介、作品、證照、技能與工作經歷。展示資料整理、伺服器端串接、元件拆分及互動介面的實作。

本 repository 是程式碼展示副本，使用獨立提交歷史，未附原站的環境變數、Notion 資料庫內容或憑證。程式與靜態素材保留來源版本；要在本機呈現內容，需設定自己的 Notion 資料。

[線上作品集](https://harveyli-portfolio.vercel.app/)

## 功能

- **個人簡介**：從 Notion 讀取姓名、英文名、大頭照、GitHub 網址與簡介區塊。
- **作品列表**：作品卡片、技術標籤、圖片切換與放大、詳細內容及 Demo／GitHub 連結。
- **證照展示**：證照列表、具名圖片頁籤、詳細說明與全螢幕圖片。
- **技能與經歷**：技能標籤、核心優勢及依排序呈現的經歷時間軸。
- **CMS 串接**：統一封裝 Notion 查詢；頁面區塊分批讀取，每批最多並行 2 個請求。
- **分享資訊**：網站 metadata 與動態 Open Graph 圖片。

## 技術與架構

主要使用 Next.js App Router、React、TypeScript、Tailwind CSS 4 與 lucide-react。套件版本以 `package.json`、`package-lock.json` 為準。

| 路徑 | 用途 |
| --- | --- |
| `app/page.tsx` | 首頁組裝，包含各內容區塊 |
| `app/layout.tsx` | 全域 metadata、字體與背景 |
| `app/opengraph-image.tsx` | 社群分享預覽圖 |
| `components/ProfileHeader.tsx` | 個人資訊及簡介 |
| `components/TabSection.tsx` | 作品、證照、技能與經歷頁籤 |
| `components/ProjectList*.tsx`、`ProjectCard.tsx`、`ProjectModal.tsx` | 作品資料讀取、卡片與互動彈窗 |
| `components/Certifications*.tsx` | 證照資料與互動檢視 |
| `components/SkillsList.tsx`、`ExperienceList.tsx` | 技能及經歷 |
| `components/NotionBlock.tsx`、`NotionText.tsx` | 部分 Notion 區塊及文字格式渲染 |
| `lib/notion.ts` | Notion API 呼叫、快取設定及並行處理工具 |
| `public/`、`app/favicon.ico` | 靜態背景、圖示等素材 |
| `.env.example` | 不含真實值的環境變數範本 |

Notion 查詢由伺服器端元件執行，作品與證照的互動由 Client Components 處理。API 版本保留為 `2022-06-28`，查詢使用 `revalidate: 60`；首頁執行時間設定為 `maxDuration = 60`。部署平台與 Notion 服務仍有各自限制，這些設定不代表內容一定每 60 秒立即更新。

## 本機啟動

準備 Node.js 與 npm，使用符合本專案 Next.js 版本要求的 Node.js 版本。

```bash
git clone https://github.com/Harvey-L6/my-website_demo.git
cd my-website_demo
npm ci
```

將 `.env.example` 複製為 `.env.local`。macOS／Linux 可執行：

```bash
cp .env.example .env.local
```

Windows PowerShell 可執行：

```powershell
Copy-Item .env.example .env.local
```

依下一節填入自己的設定後啟動：

```bash
npm run dev
```

開啟 `http://localhost:3000`。範本預設空值；未設定 Notion 時，部分區塊會空白或顯示提示，並非已附帶展示資料。

其他指令：

| 指令 | 用途 |
| --- | --- |
| `npm run lint` | ESLint 檢查 |
| `npm run build` | 建置 |
| `npm run start` | 啟動已建置版本 |
| `npm run pack` | 以 Repomix 產生本機原始碼打包檔 |

`repomix-output.xml` 已加入忽略規則，產生後請留在本機。套件與打包工具可能受各自設定影響，分享任何輸出前仍需檢查內容。

## Notion 設定

建立自己的 Notion integration，並將用於展示的資料庫授權給該 integration。只需準備讀取展示內容所需的權限；此專案沒有寫入 Notion 的功能。

在 `.env.local` 填入：

| 變數 | 用途 |
| --- | --- |
| `NOTION_TOKEN` | 自己的 Notion integration token |
| `NOTION_PROFILE_DB_ID` | 個人簡介資料庫 |
| `NOTION_PROJECTS_DB_ID` | 作品資料庫 |
| `NOTION_CERTIFICATIONS_DB_ID` | 證照資料庫 |
| `NOTION_SKILLS_DB_ID` | 技能資料庫 |
| `NOTION_EXPERIENCE_DB_ID` | 經歷資料庫 |

`VERCEL_PROJECT_PRODUCTION_URL` 為可選設定，Vercel 通常提供此值；程式用它組合 metadata 的網址基準。若手動填寫，使用不含 `https://` 的網域。

### 資料庫欄位

欄位名稱須與程式一致。每筆資料的頁面內文可放說明區塊，供網站渲染。

| 資料庫 | 欄位及 Notion 類型 |
| --- | --- |
| 個人簡介 | `名稱`（Title）、`En_name`（Text）、`GitHub`（URL）、`大頭照`（Files） |
| 作品 | `名稱`（Title）、`簡介`（Text）、`標籤`（Multi-select）、`Demo`（URL）、`GitHub`（URL）、`排序`（Number）、`展示圖片`（Files） |
| 證照 | `名稱`（Title）、`副標題`（Text）、`順序`（Number）、`圖片名稱1`～`圖片名稱4`（Text）、`圖片1`～`圖片4`（Files） |
| 技能 | `技能標籤`（Multi-select）；另保留 Notion 資料庫必備的 Title 欄位 |
| 經歷 | `職稱`（Title）、`組織單位`（Text）、`期間`（Date，可含結束日期）、`關聯技能`（Multi-select）、`排序`（Number） |

- 個人簡介與技能讀取查詢結果的第一筆，建議各放一筆資料。
- 作品、證照、經歷依數字排序。作品的第一張展示圖片作為封面。
- 證照圖以 Notion 上傳檔案讀取，每筆最多四組圖片名稱／檔案。
- 區塊渲染支援部分標題、段落、清單、引言、分隔線與圖片，不是完整 Notion 頁面轉換器。
- 此版本未處理資料庫與區塊的後續分頁，也沒有草稿／公開狀態篩選。連接的資料庫只應放準備公開的資料。

## 部署

如要部署自己的副本，可連接 Vercel 或其他支援此 Next.js 專案的環境，並在部署平台設定上述變數。請使用自己的展示資料庫，完成設定後再建置／部署。

此 repository 的建立不包含另行部署網站，也不包含原站的 Vercel 專案或環境變數。

## 展示資料與隱私範圍

`.env.local` 等實際設定檔已被忽略，只有空值範本 `.env.example` 允許提交。不要將 `NOTION_TOKEN` 改為 `NEXT_PUBLIC_` 變數，也不要把真實憑證寫入程式碼。

repo 未附實際 Notion 頁面、證照或員工資料；但**執行網站時，連接資料庫的展示內容與附件網址會提供給訪客**。目前作品與證照仍將完整 Notion 區塊傳給前端，可能包含額外 metadata 或畫面未呈現的區塊。請使用專供公開展示的資料庫，並清理證照圖片中的生日、證號等非必要資料。

本副本保留來源程式的行為，未另外修改資料篩選或前端傳輸邏輯。公開程式碼與審核實際網站內容是兩個需要分別確認的範圍；本 repository 不宣稱已完成正式部署環境的全面驗證。
