import { format, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(date: Date | string, pattern = "M月d日(E)") {
  return format(new Date(date), pattern, { locale: ja });
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "M月d日(E) HH:mm", { locale: ja });
}

export function formatTimeRange(start: Date | string, end: Date | string) {
  const s = new Date(start);
  const e = new Date(end);
  if (isSameDay(s, e)) {
    return `${formatDate(s)} ${format(s, "HH:mm")}〜${format(e, "HH:mm")}`;
  }
  return `${formatDateTime(s)} 〜 ${formatDateTime(e)}`;
}

export function relativeDayLabel(date: Date | string) {
  const target = new Date(date);
  const now = new Date();
  const diffDays = Math.round(
    (new Date(target.toDateString()).getTime() - new Date(now.toDateString()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "明日";
  if (diffDays === -1) return "昨日";
  if (diffDays > 1) return `あと${diffDays}日`;
  return `${Math.abs(diffDays)}日前`;
}
