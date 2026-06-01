import type { Question } from '@/types'

export const chineseQuestions: Omit<Question, 'id'>[] = [
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
    content: { stem: '看拼音写汉字：tài yáng', hint: '天上发光的那个' },
    answer: { type: 'text', value: '太阳' },
    explanation: '"太"表示程度，"阳"表示阳光。太阳是地球最近的恒星。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
    content: { stem: '看拼音写汉字：shū fǎ', hint: '写字的艺术' },
    answer: { type: 'text', value: '书法' },
    explanation: '"书"指书写，"法"指法则方法。书法是写字的艺术。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 2,
    content: { stem: '看拼音写汉字：qín miǎn', hint: '勤奋努力' },
    answer: { type: 'text', value: '勤勉' },
    explanation: '"勤"指勤劳不偷懒，"勉"指勉励努力。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 2,
    content: { stem: '看拼音写汉字：kuí wú', hint: '形容身材高大' },
    answer: { type: 'text', value: '魁梧' },
    explanation: '"魁"指高大，"梧"指梧桐树高大挺拔。'
  },
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 1,
    content: { stem: '床前明月光，\n疑是______霜。\n举头望明月，\n低头思故乡。' },
    answer: { type: 'text', value: '地上' },
    explanation: '出自李白《静夜思》。月光照在床前，诗人怀疑是地上结了霜。'
  },
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 1,
    content: { stem: '春眠不觉晓，\n处处闻______。\n夜来风雨声，\n花落知多少。' },
    answer: { type: 'text', value: '啼鸟' },
    explanation: '出自孟浩然《春晓》。春天的早晨，到处都能听到鸟鸣声。'
  },
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 2,
    content: { stem: '______一何怒，\n妇啼一何苦。' },
    answer: { type: 'text', value: '吏呼' },
    explanation: '出自杜甫《石壕吏》。官吏的呼喝多么愤怒，老妇的啼哭多么悲苦。'
  },
  {
    subject: '语文', question_type: '改错', grade: 6, difficulty: 1,
    content: {
      stem: '下面句子有什么问题？请选出正确的修改方式。',
      sentence: '通过这次活动，使我受到了很大的教育。',
      options: [
        { key: 'A', text: '删除"通过"' },
        { key: 'B', text: '删除"使"' },
        { key: 'C', text: '删除"这次活动"' },
        { key: 'D', text: '不用修改' }
      ]
    },
    answer: { type: 'choice', value: 'B' },
    explanation: '句子缺主语。"通过……使……"句式同时出现导致主语缺失，删除"使"即可让"我"成为主语。'
  },
  {
    subject: '语文', question_type: '改错', grade: 6, difficulty: 2,
    content: {
      stem: '下面句子有什么问题？请选出正确的修改方式。',
      sentence: '他经常回忆过去的往事。',
      options: [
        { key: 'A', text: '改为"他经常回忆过去"' },
        { key: 'B', text: '改为"他经常回忆往事"' },
        { key: 'C', text: 'A和B都可以' },
        { key: 'D', text: '不用修改' }
      ]
    },
    answer: { type: 'choice', value: 'C' },
    explanation: '"过去"和"往事"语义重复，删掉任意一个即可。'
  },
  {
    subject: '语文', question_type: '课内阅读', grade: 6, difficulty: 2,
    content: {
      passageTitle: '《少年闰土》节选',
      passage: '深蓝的天空中挂着一轮金黄的圆月，下面是海边的沙地，都种着一望无际的碧绿的西瓜。其间有一个十一二岁的少年，项带银圈，手捏一柄钢叉，向一匹猹尽力地刺去。那猹却将身一扭，反从他的胯下逃走了。',
      questions: [
        {
          stem: '这段文字描写的是什么时间?',
          options: [{ key: 'A', text: '清晨' }, { key: 'B', text: '正午' }, { key: 'C', text: '夜晚' }, { key: 'D', text: '傍晚' }]
        },
        {
          stem: '少年手里拿的是什么?',
          options: [{ key: 'A', text: '木棍' }, { key: 'B', text: '钢钗' }, { key: 'C', text: '钢叉' }, { key: 'D', text: '渔网' }]
        }
      ]
    },
    answer: { type: 'reading', value: ['C', 'C'] },
    explanation: '1. "深蓝的天空""金黄的圆月"表明是夜晚。2. 原文明确写到"手捏一柄钢叉"。'
  },
  {
    subject: '语文', question_type: '课外阅读', grade: 6, difficulty: 2,
    content: {
      passageTitle: '《小草》',
      passage: '春天来了，小草从土里钻了出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。',
      questions: [
        { stem: '这段文字描写的是什么季节?', options: [{ key: 'A', text: '春天' }, { key: 'B', text: '夏天' }, { key: 'C', text: '秋天' }, { key: 'D', text: '冬天' }] },
        { stem: '小草给人什么感觉?', options: [{ key: 'A', text: '硬硬的' }, { key: 'B', text: '软绵绵的' }, { key: 'C', text: '扎手的' }, { key: 'D', text: '干枯的' }] }
      ]
    },
    answer: { type: 'reading', value: ['A', 'B'] },
    explanation: '1. 原文第一句"春天来了"。2. 原文最后一句"草软绵绵的"。'
  }
]
