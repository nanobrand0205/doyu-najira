import type {
  PlanStatus,
  EventStatus,
  CandidateStatus,
  TaskStatus,
  TaskPriority,
  FileType,
  LinePostStatus,
  EmailStatus,
  EventType,
} from "@prisma/client";
import type { BadgeProps } from "@/components/ui/badge";

type Variant = NonNullable<BadgeProps["variant"]>;

export const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  DRAFT: "下書き",
  TEAM_MEETING_DONE: "チームMTG済み",
  WAITING_FOR_NAJIRA: "なじら会上程待ち",
  UNDER_DISCUSSION: "なじら会協議中",
  REVISION_REQUIRED: "修正依頼中",
  APPROVED: "承認済み",
  EDOYU_REGISTERED: "e-doyu登録済み",
  ANNOUNCING: "告知中",
  COMPLETED: "本番実施済み",
  REVIEW_DONE: "振り返り完了",
};

export const PLAN_STATUS_ORDER: PlanStatus[] = [
  "DRAFT",
  "TEAM_MEETING_DONE",
  "WAITING_FOR_NAJIRA",
  "UNDER_DISCUSSION",
  "REVISION_REQUIRED",
  "APPROVED",
  "EDOYU_REGISTERED",
  "ANNOUNCING",
  "COMPLETED",
  "REVIEW_DONE",
];

export const PLAN_STATUS_VARIANT: Record<PlanStatus, Variant> = {
  DRAFT: "neutral",
  TEAM_MEETING_DONE: "outline",
  WAITING_FOR_NAJIRA: "warning",
  UNDER_DISCUSSION: "warning",
  REVISION_REQUIRED: "danger",
  APPROVED: "success",
  EDOYU_REGISTERED: "success",
  ANNOUNCING: "default",
  COMPLETED: "success",
  REVIEW_DONE: "success",
};

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  SCHEDULED: "予定",
  ANNOUNCING: "告知中",
  COMPLETED: "実施済み",
  CANCELLED: "中止",
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  REGULAR_MEETING: "例会",
  NAJIRA: "なじら会",
  TEAM_MEETING: "チームMTG",
  FORUM: "フォーラム",
  GENERAL_MEETING: "総会",
  OTHER: "その他",
};

export const CANDIDATE_STATUS_LABEL: Record<CandidateStatus, string> = {
  NOT_CONTACTED: "未連絡",
  CONTACTED: "声がけ済み",
  INVITED: "例会案内済み",
  WILL_ATTEND: "参加予定",
  ATTENDED: "参加済み",
  THANKS_SENT: "お礼送信済み",
  ORIENTATION_DONE: "入会説明済み",
  CONSIDERING: "入会検討中",
  WAITING_APPLICATION: "入会届提出待ち",
  JOINED: "入会済み",
  HOLD: "保留",
  DECLINED: "見送り",
};

export const CANDIDATE_STATUS_ORDER: CandidateStatus[] = [
  "NOT_CONTACTED",
  "CONTACTED",
  "INVITED",
  "WILL_ATTEND",
  "ATTENDED",
  "THANKS_SENT",
  "ORIENTATION_DONE",
  "CONSIDERING",
  "WAITING_APPLICATION",
  "JOINED",
  "HOLD",
  "DECLINED",
];

export const CANDIDATE_STATUS_VARIANT: Record<CandidateStatus, Variant> = {
  NOT_CONTACTED: "neutral",
  CONTACTED: "outline",
  INVITED: "default",
  WILL_ATTEND: "default",
  ATTENDED: "success",
  THANKS_SENT: "success",
  ORIENTATION_DONE: "success",
  CONSIDERING: "warning",
  WAITING_APPLICATION: "warning",
  JOINED: "success",
  HOLD: "neutral",
  DECLINED: "danger",
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "未着手",
  DOING: "進行中",
  DONE: "完了",
  CANCELLED: "中止",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
};

export const TASK_PRIORITY_VARIANT: Record<TaskPriority, Variant> = {
  LOW: "neutral",
  MEDIUM: "outline",
  HIGH: "danger",
};

export const FILE_TYPE_LABEL: Record<FileType, string> = {
  NAJIRA_MATERIAL: "なじら会資料",
  PLAN: "例会企画書",
  FLYER: "チラシ",
  MINUTES: "議事録",
  PHOTO: "写真",
  GENERAL_MEETING: "総会資料",
  ORGANIZATION: "組織図",
  GUEST_LIST: "ゲスト管理表",
  OTHER: "その他",
};

export const LINE_POST_STATUS_LABEL: Record<LinePostStatus, string> = {
  DRAFT: "下書き",
  SCHEDULED: "投稿予定",
  POSTED: "投稿済み",
};

export const EMAIL_STATUS_LABEL: Record<EmailStatus, string> = {
  DRAFT: "下書き",
  SENT: "送信済み",
  FAILED: "送信失敗",
};
