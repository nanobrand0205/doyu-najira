import {
  PrismaClient,
  Role,
  TeamName,
  EventType,
  EventStatus,
  PlanStatus,
  FileType,
  TaskStatus,
  TaskPriority,
  CandidateStatus,
  EmailStatus,
  LinePostStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

function d(year: number, month: number, day: number, hour = 0, minute = 0) {
  return new Date(year, month - 1, day, hour, minute);
}

async function main() {
  console.log("Seeding なじらボード demo data...");

  // -------------------------------------------------------------------
  // 年度
  // -------------------------------------------------------------------
  await prisma.fiscalYear.deleteMany();
  const fy2026 = await prisma.fiscalYear.create({
    data: { year: 2026, isCurrent: true },
  });
  const fy2025 = await prisma.fiscalYear.create({
    data: { year: 2025, isCurrent: false },
  });

  // -------------------------------------------------------------------
  // 会員
  // -------------------------------------------------------------------
  const membersData = [
    {
      name: "小林 誠一",
      companyName: "小林建設株式会社",
      companyPosition: "代表取締役",
      industry: "建設業",
      companyAddress: "新潟県三条市本町1-2-3",
      companyDescription: "住宅リフォーム・公共工事を手がける地域密着の建設会社。",
      mainServices: "住宅リフォーム、公共工事、外構工事",
      strengths: "現場対応の速さ、地域内ネットワーク",
      consultable: "リフォーム相談、施工パートナー探し",
      joinedYear: 2016,
      reportExperience: true,
      learningGoal: "経営指針の作り方をもっと深めたい",
      currentChallenge: "若手職人の採用と定着",
      hobby: "釣り、日本酒",
      profileText: "三条支部の立ち上げ期からのメンバー。とにかく顔が広い。",
      email: "kobayashi@sanjo-doyu.jp",
    },
    {
      name: "渡辺 久美子",
      companyName: "有限会社わたなべ会計事務所",
      companyPosition: "所長",
      industry: "士業・会計",
      companyAddress: "新潟県三条市須頃1-4-5",
      companyDescription: "中小企業向けの記帳代行・税務顧問・経営相談。",
      mainServices: "税務顧問、記帳代行、事業承継相談",
      strengths: "資金繰り相談、決算対策",
      consultable: "税務・資金繰りなんでも相談ください",
      joinedYear: 2019,
      reportExperience: true,
      learningGoal: "同友会型経営指針セミナーを支部内で広めたい",
      currentChallenge: "スタッフの採用",
      hobby: "マラソン",
      profileText: "数字に強い幹事長候補。例会では鋭い質問人。",
      email: "watanabe@sanjo-doyu.jp",
    },
    {
      name: "田中 亮",
      companyName: "田中製作所",
      companyPosition: "専務取締役",
      industry: "金属加工業",
      companyAddress: "新潟県三条市西大崎2-1-1",
      companyDescription: "金属洋食器・作業工具の試作から量産まで対応。",
      mainServices: "金属プレス加工、試作開発",
      strengths: "小ロット試作、短納期対応",
      consultable: "試作品の相談、金型の相談",
      joinedYear: 2021,
      reportExperience: false,
      learningGoal: "他業種との共同開発事例を学びたい",
      currentChallenge: "後継者育成",
      hobby: "キャンプ",
      profileText: "三条の金属加工の技術を発信したい2代目。",
      email: "tanaka@sanjo-doyu.jp",
    },
    {
      name: "斎藤 陽子",
      companyName: "さいとう社会保険労務士事務所",
      companyPosition: "代表",
      industry: "士業・労務",
      companyAddress: "新潟県三条市興野1-3-2",
      companyDescription: "就業規則整備、助成金申請、労務トラブル対応。",
      mainServices: "就業規則作成、助成金申請サポート",
      strengths: "採用・労務トラブル対応",
      consultable: "採用や雇用契約に関する相談",
      joinedYear: 2022,
      reportExperience: false,
      learningGoal: "経営者目線での労務の考え方を学びたい",
      currentChallenge: "自社の広報",
      hobby: "茶道",
      profileText: "フレンドシップチームのムードメーカー。",
      email: "saito@sanjo-doyu.jp",
    },
    {
      name: "山本 拓海",
      companyName: "やまもと農園",
      companyPosition: "代表",
      industry: "農業",
      companyAddress: "新潟県三条市下田地区",
      companyDescription: "枝豆・米を中心とした農業生産法人。直売・加工品も展開。",
      mainServices: "米・枝豆の生産、農産物加工品販売",
      strengths: "六次産業化、直売企画",
      consultable: "農業×観光の企画相談",
      joinedYear: 2023,
      reportExperience: false,
      learningGoal: "新規顧客開拓の方法",
      currentChallenge: "販路拡大",
      hobby: "登山",
      profileText: "同友会で農業の仲間を増やしたいと思っている新人会員。",
      email: "yamamoto@sanjo-doyu.jp",
    },
    {
      name: "近藤 誠",
      companyName: "近藤印刷株式会社",
      companyPosition: "代表取締役",
      industry: "印刷業",
      companyAddress: "新潟県三条市四日町2-2-2",
      companyDescription: "チラシ・冊子印刷からWeb制作まで一気通貫で対応。",
      mainServices: "印刷、デザイン、Web制作",
      strengths: "チラシデザイン、短納期印刷",
      consultable: "チラシ・名刺・Webの相談全般",
      joinedYear: 2015,
      reportExperience: true,
      learningGoal: "DX時代の印刷業のあり方",
      currentChallenge: "紙媒体の需要減少への対応",
      hobby: "写真",
      profileText: "支部長。例会のチラシもいつも手伝ってくれる頼れる存在。",
      email: "kondo@sanjo-doyu.jp",
    },
    {
      name: "本間 里奈",
      companyName: "ほんまデザイン事務所",
      companyPosition: "代表",
      industry: "デザイン業",
      companyAddress: "新潟県三条市東三条1-1-1",
      companyDescription: "中小企業のブランディング・パッケージデザイン。",
      mainServices: "ブランディング、パッケージデザイン",
      strengths: "ロゴ制作、パッケージデザイン",
      consultable: "会社のブランディング全般",
      joinedYear: 2020,
      reportExperience: true,
      learningGoal: "同友会理念に基づく経営デザイン",
      currentChallenge: "スタッフのスキルアップ",
      hobby: "映画鑑賞",
      profileText: "副支部長。学びチームのまとめ役。",
      email: "homma@sanjo-doyu.jp",
    },
    {
      name: "五十嵐 大輔",
      companyName: "いからし運送株式会社",
      companyPosition: "代表取締役",
      industry: "運送業",
      companyAddress: "新潟県三条市月岡3-3-3",
      companyDescription: "地場配送から長距離輸送まで対応する運送会社。",
      mainServices: "地場配送、長距離輸送、倉庫保管",
      strengths: "緊急配送対応",
      consultable: "物流・配送の相談",
      joinedYear: 2018,
      reportExperience: true,
      learningGoal: "働き方改革と物流2024年問題への対応",
      currentChallenge: "ドライバー不足",
      hobby: "野球観戦",
      profileText: "副支部長。交流チームを引っ張るムードメーカー。",
      email: "igarashi@sanjo-doyu.jp",
    },
    {
      name: "長谷川 慎",
      companyName: "長谷川金属工業",
      companyPosition: "取締役",
      industry: "金属加工業",
      companyAddress: "新潟県三条市月岡4-4-4",
      companyDescription: "刃物・工具の製造。海外展開にも力を入れる。",
      mainServices: "刃物製造、OEM生産",
      strengths: "海外販路開拓",
      consultable: "海外展示会・輸出の相談",
      joinedYear: 2024,
      reportExperience: false,
      learningGoal: "海外展開と同友会理念の両立",
      currentChallenge: "海外販路の拡大",
      hobby: "ゴルフ",
      profileText: "幹事長。数字と段取りに強い。",
      email: "hasegawa@sanjo-doyu.jp",
    },
    {
      name: "小山 洋介",
      companyName: "こやま工務店",
      companyPosition: "代表",
      industry: "建設業",
      companyAddress: "新潟県三条市塚野目5-5-5",
      companyDescription: "新築・リフォームを手掛ける工務店。",
      mainServices: "新築住宅、店舗リフォーム",
      strengths: "デザイン住宅の提案",
      consultable: "住宅・店舗設計の相談",
      joinedYear: 2023,
      reportExperience: false,
      learningGoal: "経営指針づくり",
      currentChallenge: "見積り力の強化",
      hobby: "サウナ",
      profileText: "学びチーム所属。まだ2年目だが積極的。",
      email: "koyama@sanjo-doyu.jp",
    },
    {
      name: "内山 沙耶",
      companyName: "うちやま美容室",
      companyPosition: "オーナー",
      industry: "美容業",
      companyAddress: "新潟県三条市興野2-2-2",
      companyDescription: "地域密着型の美容室2店舗を経営。",
      mainServices: "カット、カラー、ヘッドスパ",
      strengths: "顧客リピート施策",
      consultable: "サービス業の集客相談",
      joinedYear: 2024,
      reportExperience: false,
      learningGoal: "同友会の他業種との繋がり方",
      currentChallenge: "スタッフ採用",
      hobby: "カフェ巡り",
      profileText: "フレンドシップチームの若手会員。",
      email: "uchiyama@sanjo-doyu.jp",
    },
    {
      name: "事務局 みどり",
      companyName: "三条支部事務局",
      companyPosition: "事務局員",
      industry: "同友会事務局",
      companyDescription: "三条支部の事務局業務全般を担当。",
      mainServices: "事務局運営",
      strengths: "スケジュール調整、資料作成",
      consultable: "支部運営全般の相談",
      joinedYear: 2017,
      reportExperience: false,
      learningGoal: "-",
      currentChallenge: "-",
      hobby: "読書",
      profileText: "支部運営の縁の下の力持ち。",
      email: "office@sanjo-doyu.jp",
    },
  ];

  const members = [];
  for (const m of membersData) {
    members.push(await prisma.member.create({ data: m }));
  }
  const [
    kobayashi,
    watanabe,
    tanaka,
    saito,
    yamamoto,
    kondo,
    homma,
    igarashi,
    hasegawa,
    koyama,
    uchiyama,
    office,
  ] = members;

  // -------------------------------------------------------------------
  // ユーザー(ログイン用) - 役割ごとのデモアカウント
  // -------------------------------------------------------------------
  await prisma.user.createMany({
    data: [
      { name: kondo.name, email: kondo.email!, role: Role.MANAGER, memberId: kondo.id },
      { name: hasegawa.name, email: hasegawa.email!, role: Role.MANAGER, memberId: hasegawa.id },
      { name: watanabe.name, email: watanabe.email!, role: Role.SECRETARY, memberId: watanabe.id },
      { name: office.name, email: office.email!, role: Role.ADMIN, memberId: office.id },
      { name: tanaka.name, email: tanaka.email!, role: Role.MEMBER, memberId: tanaka.id },
    ],
  });

  // -------------------------------------------------------------------
  // チーム (2026年度)
  // -------------------------------------------------------------------
  const teamManabi = await prisma.team.create({
    data: {
      fiscalYearId: fy2026.id,
      name: TeamName.MANABI,
      displayName: "学びチーム",
      description: "経営指針・経営者としての学びをテーマにした例会を担当。",
      najiraTheme: "経営指針の実践と共有",
    },
  });
  const teamKouryu = await prisma.team.create({
    data: {
      fiscalYearId: fy2026.id,
      name: TeamName.KOURYU,
      displayName: "交流チーム",
      description: "会員同士・地域との交流を深める例会を担当。",
      najiraTheme: "業種を超えた繋がりづくり",
    },
  });
  const teamFriendship = await prisma.team.create({
    data: {
      fiscalYearId: fy2026.id,
      name: TeamName.FRIENDSHIP,
      displayName: "フレンドシップチーム",
      description: "新入会員・ゲストのフォローと増強を担当。",
      najiraTheme: "入会候補者フォローの強化",
    },
  });

  async function addMembers(teamId: string, memberIds: { id: string; leader?: boolean }[]) {
    for (const m of memberIds) {
      await prisma.teamMembership.create({
        data: { teamId, memberId: m.id, isLeader: !!m.leader },
      });
    }
  }

  await addMembers(teamManabi.id, [
    { id: homma.id, leader: true },
    { id: koyama.id },
    { id: kobayashi.id },
  ]);
  await addMembers(teamKouryu.id, [
    { id: igarashi.id, leader: true },
    { id: tanaka.id },
    { id: yamamoto.id },
  ]);
  await addMembers(teamFriendship.id, [
    { id: saito.id, leader: true },
    { id: uchiyama.id },
    { id: watanabe.id },
  ]);

  // -------------------------------------------------------------------
  // 組織図 (2026年度)
  // -------------------------------------------------------------------
  const positions: { title: string; category: string; memberId: string; sortOrder: number }[] = [
    { title: "支部長", category: "役員", memberId: kondo.id, sortOrder: 0 },
    { title: "副支部長", category: "役員", memberId: homma.id, sortOrder: 1 },
    { title: "副支部長", category: "役員", memberId: igarashi.id, sortOrder: 2 },
    { title: "幹事長", category: "役員", memberId: hasegawa.id, sortOrder: 3 },
    { title: "幹事", category: "役員", memberId: watanabe.id, sortOrder: 4 },
    { title: "幹事", category: "役員", memberId: saito.id, sortOrder: 5 },
    { title: "学びチームリーダー", category: "委員会・部会", memberId: homma.id, sortOrder: 6 },
    { title: "交流チームリーダー", category: "委員会・部会", memberId: igarashi.id, sortOrder: 7 },
    { title: "フレンドシップチームリーダー", category: "委員会・部会", memberId: saito.id, sortOrder: 8 },
    { title: "増強担当", category: "増強", memberId: uchiyama.id, sortOrder: 9 },
    { title: "広報担当", category: "委員会・部会", memberId: tanaka.id, sortOrder: 10 },
    { title: "事務局", category: "事務局", memberId: office.id, sortOrder: 11 },
  ];
  for (const p of positions) {
    await prisma.orgPosition.create({ data: { ...p, fiscalYearId: fy2026.id } });
  }
  // 2025年度(過去)は簡易的に支部長のみ
  await prisma.orgPosition.create({
    data: { title: "支部長", category: "役員", memberId: homma.id, sortOrder: 0, fiscalYearId: fy2025.id },
  });

  // -------------------------------------------------------------------
  // 例会・なじら会・チームMTG
  // -------------------------------------------------------------------
  const julyMeeting = await prisma.event.create({
    data: {
      year: 2026,
      month: 7,
      title: "7月例会「金属加工業の生きた経営に学ぶ」",
      type: EventType.REGULAR_MEETING,
      teamId: teamKouryu.id,
      chairMemberId: igarashi.id,
      roomLeaderMemberId: tanaka.id,
      speakerName: "田中 亮 (田中製作所)",
      startAt: d(2026, 7, 24, 18, 30),
      endAt: d(2026, 7, 24, 20, 30),
      venue: "三条市東公民館 大ホール",
      socialVenue: "居酒屋 三條家",
      purpose: "自社の強みを再発見し、他業種との連携のヒントを得る",
      theme: "金属加工業の生きた経営に学ぶ",
      description: "田中製作所の事業承継と技術継承の実践報告。",
      discussionTheme: "自社の強みをどう社外に伝えるか",
      targetAudience: "全会員・入会候補者",
      guestStrategy: "各会員1名以上のゲスト同伴を目標にする",
      edoyuUrl: "https://e-doyu.example.jp/events/2026-07",
      driveFolderUrl: "https://drive.google.com/drive/folders/2026-07-example",
      status: EventStatus.ANNOUNCING,
      notes: "プロジェクター使用。懇親会は例会終了後30分後開始。",
    },
  });

  const augMeeting = await prisma.event.create({
    data: {
      year: 2026,
      month: 8,
      title: "8月合同例会「三条・燕 ものづくり合同例会」",
      type: EventType.REGULAR_MEETING,
      teamId: teamManabi.id,
      chairMemberId: homma.id,
      roomLeaderMemberId: koyama.id,
      speakerName: "調整中",
      startAt: d(2026, 8, 28, 18, 30),
      endAt: d(2026, 8, 28, 20, 30),
      venue: "燕三条地場産業振興センター",
      socialVenue: "未定",
      purpose: "燕支部との合同開催による会員増強と交流",
      theme: "ものづくりのまちの経営指針",
      description: "燕支部と合同で企画中。",
      discussionTheme: "地域を超えた連携のつくり方",
      targetAudience: "三条支部・燕支部全会員",
      guestStrategy: "各社2名までゲスト招待可",
      status: EventStatus.SCHEDULED,
      notes: "燕支部幹事会と日程調整中。",
    },
  });

  const juneMeetingDone = await prisma.event.create({
    data: {
      year: 2026,
      month: 6,
      title: "6月例会「事業承継のリアル」",
      type: EventType.REGULAR_MEETING,
      teamId: teamFriendship.id,
      chairMemberId: saito.id,
      roomLeaderMemberId: uchiyama.id,
      speakerName: "小林 誠一 (小林建設)",
      startAt: d(2026, 6, 26, 18, 30),
      endAt: d(2026, 6, 26, 20, 30),
      venue: "三条市東公民館 大ホール",
      socialVenue: "居酒屋 三條家",
      purpose: "事業承継の実体験から学ぶ",
      theme: "事業承継のリアル",
      edoyuUrl: "https://e-doyu.example.jp/events/2026-06",
      driveFolderUrl: "https://drive.google.com/drive/folders/2026-06-example",
      status: EventStatus.COMPLETED,
      notes: "参加28名、ゲスト3名。振り返り実施済み。",
    },
  });

  const najiraJuly = await prisma.event.create({
    data: {
      year: 2026,
      month: 7,
      title: "7月なじら会",
      type: EventType.NAJIRA,
      startAt: d(2026, 7, 3, 18, 30),
      endAt: d(2026, 7, 3, 20, 30),
      venue: "三条商工会議所 会議室A",
      status: EventStatus.COMPLETED,
    },
  });

  const najiraAug = await prisma.event.create({
    data: {
      year: 2026,
      month: 8,
      title: "8月なじら会",
      type: EventType.NAJIRA,
      startAt: d(2026, 8, 4, 18, 30),
      endAt: d(2026, 8, 4, 20, 30),
      venue: "三条商工会議所 会議室A",
      status: EventStatus.SCHEDULED,
    },
  });

  await prisma.najiraDetail.create({
    data: {
      eventId: najiraJuly.id,
      decisions:
        "・7月例会の役割分担を確定\n・8月合同例会は燕支部との共催で調整継続\n・9月例会テーマは「価格転嫁」に決定",
      continuedTopics: "・8月合同例会の会場費按分方法",
      homeworkForNext: "・各チームは9月例会の企画書ドラフトをなじら会前日までに共有",
      guestFollowUp: "候補者3名のフォロー状況を確認済み。詳細は候補者管理を参照。",
    },
  });

  await prisma.najiraAgendaItem.createMany({
    data: [
      { eventId: najiraAug.id, title: "7月例会の振り返り", sortOrder: 0 },
      { eventId: najiraAug.id, title: "8月合同例会の最終確認", sortOrder: 1 },
      { eventId: najiraAug.id, title: "9月例会企画書の協議", sortOrder: 2 },
      { eventId: najiraAug.id, title: "候補者フォロー状況の共有", sortOrder: 3 },
    ],
  });

  await prisma.event.create({
    data: {
      year: 2026,
      month: 7,
      title: "学びチーム定例ミーティング",
      type: EventType.TEAM_MEETING,
      teamId: teamManabi.id,
      startAt: d(2026, 7, 10, 19, 0),
      endAt: d(2026, 7, 10, 20, 30),
      venue: "本間デザイン事務所 会議室",
      status: EventStatus.COMPLETED,
    },
  });

  // -------------------------------------------------------------------
  // 例会計画書
  // -------------------------------------------------------------------
  await prisma.plan.create({
    data: {
      eventId: julyMeeting.id,
      title: "7月例会 企画書 v3",
      status: PlanStatus.ANNOUNCING,
      version: 3,
      isLatest: true,
      fileUrl: "https://drive.google.com/file/d/2026-07-plan-v3/view",
      comments: "なじら会でのゲスト誘致方針の指摘を反映済み。",
      approvalNotes: "承認済み(7/3なじら会)",
      submittedAt: d(2026, 6, 20),
      approvedAt: d(2026, 7, 3),
    },
  });
  await prisma.plan.create({
    data: {
      eventId: julyMeeting.id,
      title: "7月例会 企画書 v2",
      status: PlanStatus.REVISION_REQUIRED,
      version: 2,
      isLatest: false,
      fileUrl: "https://drive.google.com/file/d/2026-07-plan-v2/view",
      comments: "グループ討論テーマをもう少し具体化してほしい、との指摘。",
    },
  });
  await prisma.plan.create({
    data: {
      eventId: augMeeting.id,
      title: "8月合同例会 企画書 v1",
      status: PlanStatus.WAITING_FOR_NAJIRA,
      version: 1,
      isLatest: true,
      fileUrl: "https://drive.google.com/file/d/2026-08-plan-v1/view",
      comments: "燕支部との調整中のため8月なじら会で協議予定。",
      submittedAt: d(2026, 7, 20),
    },
  });
  await prisma.plan.create({
    data: {
      eventId: juneMeetingDone.id,
      title: "6月例会 企画書 v2",
      status: PlanStatus.REVIEW_DONE,
      version: 2,
      isLatest: true,
      fileUrl: "https://drive.google.com/file/d/2026-06-plan-v2/view",
      approvalNotes: "承認済み。振り返りも完了。",
      submittedAt: d(2026, 5, 20),
      approvedAt: d(2026, 6, 5),
    },
  });

  // -------------------------------------------------------------------
  // 資料 (Google Drive連携)
  // -------------------------------------------------------------------
  await prisma.fileAsset.createMany({
    data: [
      {
        title: "7月例会チラシ_最新版.pdf",
        type: FileType.FLYER,
        relatedEventId: julyMeeting.id,
        driveUrl: "https://drive.google.com/file/d/2026-07-flyer/view",
        isLatest: true,
        uploadedById: tanaka.id,
      },
      {
        title: "7月例会 企画書v3.pdf",
        type: FileType.PLAN,
        relatedEventId: julyMeeting.id,
        driveUrl: "https://drive.google.com/file/d/2026-07-plan-v3/view",
        isLatest: true,
        uploadedById: igarashi.id,
      },
      {
        title: "7月なじら会 次第.pdf",
        type: FileType.NAJIRA_MATERIAL,
        relatedEventId: najiraJuly.id,
        driveUrl: "https://drive.google.com/file/d/2026-07-najira-agenda/view",
        isLatest: true,
        uploadedById: office.id,
      },
      {
        title: "6月例会 議事録.docx",
        type: FileType.MINUTES,
        relatedEventId: juneMeetingDone.id,
        driveUrl: "https://drive.google.com/file/d/2026-06-minutes/view",
        isLatest: true,
        uploadedById: office.id,
      },
      {
        title: "6月例会 集合写真.jpg",
        type: FileType.PHOTO,
        relatedEventId: juneMeetingDone.id,
        driveUrl: "https://drive.google.com/file/d/2026-06-photo/view",
        isLatest: true,
        uploadedById: uchiyama.id,
      },
      {
        title: "2026年度 組織図.pdf",
        type: FileType.ORGANIZATION,
        driveUrl: "https://drive.google.com/file/d/2026-orgchart/view",
        isLatest: true,
        uploadedById: office.id,
      },
      {
        title: "入会候補者ゲスト管理表.xlsx",
        type: FileType.GUEST_LIST,
        driveUrl: "https://drive.google.com/file/d/guest-list/view",
        isLatest: true,
        uploadedById: saito.id,
      },
    ],
  });

  // -------------------------------------------------------------------
  // タスク
  // -------------------------------------------------------------------
  await prisma.task.createMany({
    data: [
      {
        title: "7月例会 e-doyu登録内容の最終確認",
        relatedEventId: julyMeeting.id,
        assignedToId: office.id,
        dueDate: d(2026, 7, 15),
        status: TaskStatus.DOING,
        priority: TaskPriority.HIGH,
      },
      {
        title: "7月例会 LINE一次案内を投稿",
        relatedEventId: julyMeeting.id,
        assignedToId: igarashi.id,
        dueDate: d(2026, 7, 3),
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
      },
      {
        title: "8月合同例会 燕支部との会場費按分を確定",
        relatedEventId: augMeeting.id,
        assignedToId: hasegawa.id,
        dueDate: d(2026, 8, 4),
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
      },
      {
        title: "8月合同例会 チラシ最終稿をDriveに保存",
        relatedEventId: augMeeting.id,
        assignedToId: tanaka.id,
        dueDate: d(2026, 8, 10),
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      },
      {
        title: "6月例会 お礼メール送信",
        relatedEventId: juneMeetingDone.id,
        assignedToId: saito.id,
        dueDate: d(2026, 6, 28),
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
      },
      {
        title: "9月例会テーマ案をチームMTGで検討",
        assignedToId: homma.id,
        dueDate: d(2026, 7, 31),
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      },
    ],
  });

  // -------------------------------------------------------------------
  // 候補者フォロー
  // -------------------------------------------------------------------
  const candidate1 = await prisma.candidate.create({
    data: {
      name: "外山 賢一",
      companyName: "外山電気工事",
      position: "代表",
      email: "toyama@example.com",
      phone: "0256-00-1111",
      introducedById: kobayashi.id,
      assignedToId: saito.id,
      firstContactDate: d(2026, 5, 10),
      lastContactDate: d(2026, 6, 26),
      nextActionDate: d(2026, 7, 20),
      status: CandidateStatus.ATTENDED,
      interests: "経営指針づくり、資金繰り",
      notes: "6月例会にゲスト参加。反応良好。次回7月例会にも誘う。",
    },
  });
  const candidate2 = await prisma.candidate.create({
    data: {
      name: "桜井 美咲",
      companyName: "さくらいカフェ",
      position: "オーナー",
      email: "sakurai@example.com",
      introducedById: uchiyama.id,
      assignedToId: uchiyama.id,
      firstContactDate: d(2026, 6, 1),
      nextActionDate: d(2026, 7, 24),
      status: CandidateStatus.INVITED,
      interests: "同業種以外との交流",
      notes: "7月例会に招待メール送付済み。返信待ち。",
    },
  });
  const candidate3 = await prisma.candidate.create({
    data: {
      name: "村上 健太",
      companyName: "村上鉄工所",
      position: "専務",
      email: "murakami@example.com",
      introducedById: hasegawa.id,
      assignedToId: hasegawa.id,
      firstContactDate: d(2026, 3, 5),
      lastContactDate: d(2026, 6, 26),
      nextActionDate: d(2026, 7, 10),
      status: CandidateStatus.CONSIDERING,
      interests: "後継者育成、海外展開",
      notes: "入会に前向き。9月総会での入会を目標にフォロー中。",
    },
  });
  await prisma.candidate.create({
    data: {
      name: "橋本 直美",
      companyName: "はしもと歯科医院",
      position: "院長",
      status: CandidateStatus.NOT_CONTACTED,
      introducedById: watanabe.id,
      assignedToId: watanabe.id,
      notes: "紹介のみでまだ声がけできていない。",
    },
  });

  await prisma.emailLog.createMany({
    data: [
      {
        candidateId: candidate1.id,
        subject: "【御礼】6月例会へのご参加ありがとうございました",
        body: "外山様\n\n先日は三条支部6月例会にご参加いただき誠にありがとうございました。\n引き続き7月例会もぜひご参加ください。",
        status: EmailStatus.SENT,
        sentAt: d(2026, 6, 27),
      },
      {
        candidateId: candidate2.id,
        subject: "【ご案内】三条支部7月例会のご案内",
        body: "桜井様\n\n三条支部の7月例会をご案内いたします。\n日時:7月24日(金)18:30〜\nテーマ:金属加工業の生きた経営に学ぶ",
        status: EmailStatus.SENT,
        sentAt: d(2026, 7, 1),
      },
      {
        candidateId: candidate3.id,
        subject: "【ご相談】入会についてのご相談",
        body: "村上様\n\n先日はお時間をいただきありがとうございました。\n入会についてご不明点があればいつでもご連絡ください。",
        status: EmailStatus.DRAFT,
      },
    ],
  });

  // -------------------------------------------------------------------
  // LINE投稿文
  // -------------------------------------------------------------------
  await prisma.linePost.createMany({
    data: [
      {
        relatedEventId: julyMeeting.id,
        title: "7月例会 一次案内",
        body: "【7月例会のご案内】\n三条支部7月例会を開催します。\n日時:7/24(金) 18:30〜20:30\n会場:三条市東公民館 大ホール\nテーマ:金属加工業の生きた経営に学ぶ\n報告者:田中亮氏(田中製作所)\n詳細・出欠はこちら:https://e-doyu.example.jp/events/2026-07\nぜひご参加ください!",
        status: LinePostStatus.POSTED,
        postedAt: d(2026, 7, 3),
        postedById: igarashi.id,
      },
      {
        relatedEventId: julyMeeting.id,
        title: "7月例会 前日リマインド",
        body: "【明日開催】三条支部7月例会\n明日7/24(金)18:30〜、三条市東公民館にて開催します。\nお忘れなくご参加ください!懇親会もぜひ。",
        status: LinePostStatus.SCHEDULED,
        scheduledDate: d(2026, 7, 23),
      },
      {
        relatedEventId: najiraAug.id,
        title: "8月なじら会 案内",
        body: "【8月なじら会のご案内】\n日時:8/4(火) 18:30〜20:30\n会場:三条商工会議所 会議室A\n議題:7月例会振り返り、8月合同例会確認、9月例会企画書、候補者フォロー",
        status: LinePostStatus.DRAFT,
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
