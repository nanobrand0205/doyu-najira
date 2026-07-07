import { formatTimeRange } from "@/lib/format";
import type { Event } from "@prisma/client";

export function lineInvitationTemplate(event: Event, branchName: string) {
  return `【${event.title}のご案内】
${branchName}${event.title}を開催します。
日時:${formatTimeRange(event.startAt, event.endAt)}
会場:${event.venue ?? "調整中"}
テーマ:${event.theme ?? "-"}
報告者:${event.speakerName ?? "-"}
詳細・出欠はこちら:
${event.edoyuUrl ?? "(e-doyu URLを登録してください)"}
ぜひご参加ください!`;
}

export function lineReminderTemplate(event: Event) {
  return `【明日開催】${event.title}
明日${formatTimeRange(event.startAt, event.endAt)}、${event.venue ?? "会場未定"}にて開催します。
お忘れなくご参加ください!懇親会もぜひ。`;
}

export function lineThanksTemplate(event: Event, branchName: string) {
  return `【御礼】${event.title}へのご参加ありがとうございました
先日は${branchName}の例会にご参加いただき誠にありがとうございました。
次回もぜひご参加ください。`;
}

export function najiraLineTemplate(event: Event, agendaTitles: string[]) {
  const agenda = agendaTitles.length
    ? agendaTitles.map((t) => `・${t}`).join("\n")
    : "・議題調整中";
  return `【${event.title}のご案内】
日時:${formatTimeRange(event.startAt, event.endAt)}
会場:${event.venue ?? "調整中"}
議題:
${agenda}`;
}

export function gmailInvitationTemplate(event: Event, recipientName: string, signatureName: string) {
  return {
    subject: `【ご案内】${signatureName}${event.title}のご案内`,
    body: `${recipientName}様

以前、${signatureName}の例会にご参加いただきありがとうございました。
今回は、${event.theme ?? event.title}をテーマにした例会を開催いたします。
${recipientName}様にも関心を持っていただけそうな内容かと思い、ご案内いたしました。

【例会概要】
日時:${formatTimeRange(event.startAt, event.endAt)}
会場:${event.venue ?? "調整中"}
テーマ:${event.theme ?? "-"}
報告者:${event.speakerName ?? "-"}

ご都合が合いましたら、ぜひご参加ください。

${signatureName}`,
  };
}

export function gmailThanksTemplate(event: Event, recipientName: string, signatureName: string) {
  return {
    subject: `【御礼】${event.title}へのご参加ありがとうございました`,
    body: `${recipientName}様

本日は${signatureName}${event.title}にご参加いただき、誠にありがとうございました。
またお会いできることを楽しみにしております。

${signatureName}`,
  };
}
