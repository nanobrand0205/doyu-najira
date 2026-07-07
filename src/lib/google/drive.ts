import { google } from "googleapis";
import { Readable } from "node:stream";
import { getGoogleAuthForUser } from "./client";

const ROOT_FOLDER_NAME = "三条支部共有ドライブ";

// なじらボード の Drive フォルダ構成 (仕様書 6.5) を作成する。
// 実際のフォルダIDはSettings画面でDBに保存し、資料アップロード時の保存先に使う想定。
export async function ensureFolderStructure(userId: string, fiscalYear: number) {
  const auth = await getGoogleAuthForUser(userId);
  if (!auth) throw new Error("Googleアカウントが連携されていません。");
  const drive = google.drive({ version: "v3", auth });

  const rootId = await findOrCreateFolder(drive, ROOT_FOLDER_NAME, undefined);
  const yearId = await findOrCreateFolder(drive, `${fiscalYear}年度`, rootId);

  const subfolders = [
    "01_なじら会",
    "02_例会企画書",
    "03_チラシ",
    "04_チームミーティング",
    "05_ゲスト・入会候補者",
    "06_会員・組織図",
    "07_写真・広報",
    "08_総会資料",
    "99_テンプレート",
  ];
  const ids: Record<string, string> = {};
  for (const name of subfolders) {
    ids[name] = await findOrCreateFolder(drive, name, yearId);
  }

  return { rootId, yearId, subfolders: ids };
}

async function findOrCreateFolder(
  drive: ReturnType<typeof google.drive>,
  name: string,
  parentId: string | undefined
) {
  const q = [
    `name = '${name.replace(/'/g, "\\'")}'`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false",
    parentId ? `'${parentId}' in parents` : undefined,
  ]
    .filter(Boolean)
    .join(" and ");

  const existing = await drive.files.list({ q, fields: "files(id, name)" });
  if (existing.data.files && existing.data.files.length > 0) {
    return existing.data.files[0].id!;
  }

  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : undefined,
    },
    fields: "id",
  });
  return created.data.id!;
}

export async function uploadFileToDrive(
  userId: string,
  params: { name: string; mimeType: string; folderId?: string; data: Buffer }
) {
  const auth = await getGoogleAuthForUser(userId);
  if (!auth) throw new Error("Googleアカウントが連携されていません。");
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.create({
    requestBody: { name: params.name, parents: params.folderId ? [params.folderId] : undefined },
    media: { mimeType: params.mimeType, body: Readable.from(params.data) },
    fields: "id, webViewLink",
  });

  return { fileId: res.data.id!, url: res.data.webViewLink! };
}
