import type { Question } from '@/types'

type SeedQuestion = Omit<Question, 'id'>

type OptionValue = string | number

function choiceQuestion(question_type: '计算' | '公式', grade: number, difficulty: number, stem: string, options: OptionValue[], correctIndex: number, explanation: string): SeedQuestion {
  return {
    subject: '数学',
    question_type,
    grade,
    difficulty,
    content: {
      stem,
      options: options.map((text, index) => ({ key: String.fromCharCode(65 + index), text: String(text) }))
    },
    answer: { type: 'choice', value: String.fromCharCode(65 + correctIndex) },
    explanation
  }
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)))
}

const grade1Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  const a = 6 + (index % 9)
  const b = 2 + (index % 6)
  if (index < 10) {
    const answer = a + b
    return choiceQuestion('计算', 1, 1, `${a} + ${b} = ?`, [answer, answer + 1, answer - 1, answer + 2], 0, `${a}+${b}=${answer}，计算时可以先凑十再加剩下的数。`)
  }
  const minuend = 12 + (index % 8)
  const subtrahend = 3 + (index % 6)
  const answer = minuend - subtrahend
  return choiceQuestion('计算', 1, 1, `${minuend} - ${subtrahend} = ?`, [answer, answer + 1, answer - 1, answer + 2], 0, `${minuend}-${subtrahend}=${answer}，退位减法可先破十。`)
})

const grade2Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  if (index < 12) {
    const a = 2 + (index % 8)
    const b = 2 + ((index * 2) % 7)
    const answer = a * b
    return choiceQuestion('计算', 2, 1, `${a} × ${b} = ?`, [answer, answer + a, answer - b, answer + 2], 0, `根据乘法口诀，${a}×${b}=${answer}。`)
  }
  const divisor = 2 + (index % 6)
  const quotient = 3 + (index % 5)
  const dividend = divisor * quotient
  return choiceQuestion('计算', 2, 2, `${dividend} ÷ ${divisor} = ?`, [quotient, quotient + 1, quotient - 1, quotient + 2], 0, `因为${divisor}×${quotient}=${dividend}，所以${dividend}÷${divisor}=${quotient}。`)
})

const grade3Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  if (index < 7) {
    const a = 23 + index * 3
    const b = 4 + (index % 5)
    const answer = a * b
    return choiceQuestion('计算', 3, 2, `${a} × ${b} = ?`, [answer, answer + b, answer - b, answer + 10], 0, `多位数乘一位数，按位相乘并注意进位：${a}×${b}=${answer}。`)
  }
  if (index < 14) {
    const length = 6 + (index % 6)
    const width = 3 + (index % 4)
    const answer = (length + width) * 2
    return choiceQuestion('计算', 3, 1, `长方形长 ${length}cm，宽 ${width}cm，周长是多少？`, [`${answer}cm`, `${length * width}cm`, `${answer / 2}cm`, `${answer + 2}cm`], 0, `长方形周长=(长+宽)×2=(${length}+${width})×2=${answer}cm。`)
  }
  const side = 4 + (index % 7)
  const answer = side * side
  return choiceQuestion('计算', 3, 1, `正方形边长 ${side}cm，面积是多少？`, [`${answer}cm²`, `${side * 4}cm²`, `${answer + side}cm²`, `${answer - side}cm²`], 0, `正方形面积=边长×边长=${side}×${side}=${answer}cm²。`)
})

const grade4Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  if (index < 7) {
    const a = 25 + index
    const b = 4
    const c = 25
    const answer = a * b + c * b
    return choiceQuestion('计算', 4, 2, `用简便方法计算：${a} × ${b} + ${c} × ${b} = ?`, [answer, answer + 20, answer - 20, a * c], 0, `运用乘法分配律：${a}×${b}+${c}×${b}=(${a}+${c})×${b}=${answer}。`)
  }
  if (index < 14) {
    const speed = 45 + (index % 6) * 5
    const time = 2 + (index % 4)
    const answer = speed * time
    return choiceQuestion('计算', 4, 1, `一辆车每小时行 ${speed} 千米，行 ${time} 小时，共行多少千米？`, [`${answer}千米`, `${speed + time}千米`, `${speed - time}千米`, `${answer + speed}千米`], 0, `路程=速度×时间=${speed}×${time}=${answer}千米。`)
  }
  const price = 12 + (index % 5) * 3
  const count = 3 + (index % 4)
  const answer = price * count
  return choiceQuestion('计算', 4, 1, `每本练习本 ${price} 元，买 ${count} 本需要多少元？`, [`${answer}元`, `${price + count}元`, `${answer - price}元`, `${answer + count}元`], 0, `总价=单价×数量=${price}×${count}=${answer}元。`)
})

const grade5Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  if (index < 7) {
    const a = Number((1.2 + index * 0.3).toFixed(1))
    const b = 4 + (index % 4)
    const answer = a * b
    return choiceQuestion('计算', 5, 2, `${a} × ${b} = ?`, [formatNumber(answer), formatNumber(answer + 1), formatNumber(answer - 0.5), formatNumber(a + b)], 0, `小数乘整数，先按整数乘法算，再确定小数点：${a}×${b}=${formatNumber(answer)}。`)
  }
  if (index < 14) {
    const upper = 6 + (index % 5)
    const lower = upper + 4
    const height = 4 + (index % 4)
    const answer = (upper + lower) * height / 2
    return choiceQuestion('计算', 5, 2, `梯形上底 ${upper}cm，下底 ${lower}cm，高 ${height}cm，面积是多少？`, [`${formatNumber(answer)}cm²`, `${upper * lower}cm²`, `${(upper + lower) * height}cm²`, `${formatNumber(answer + height)}cm²`], 0, `梯形面积=(上底+下底)×高÷2=(${upper}+${lower})×${height}÷2=${formatNumber(answer)}cm²。`)
  }
  const a = 1 + (index % 5)
  const b = 2 + (index % 4)
  const numerator = a * 2 + b
  const denominator = 6
  const answer = `${numerator}/${denominator}`
  return choiceQuestion('计算', 5, 2, `${a}/3 + ${b}/6 = ?`, [answer, `${a + b}/9`, `${a + b}/6`, `${numerator}/9`], 0, `先通分：${a}/3=${a * 2}/6，所以${a}/3+${b}/6=${answer}。`)
})

const grade6Calc: SeedQuestion[] = Array.from({ length: 20 }, (_, index) => {
  if (index < 5) {
    const price = 80 + index * 20
    const rate = 25
    const answer = price * rate / 100
    return choiceQuestion('计算', 6, 1, `${price} 元的商品降价 ${rate}%，降价多少元？`, [`${answer}元`, `${price - answer}元`, `${answer + 5}元`, `${price + answer}元`], 0, `降价金额=原价×降价百分率=${price}×25%=${answer}元。`)
  }
  if (index < 10) {
    const r = 3 + (index % 5)
    const answer = Number((3.14 * r * r).toFixed(2))
    return choiceQuestion('计算', 6, 1, `圆的半径是 ${r}cm，面积是多少？(π取3.14)`, [`${answer}cm²`, `${formatNumber(2 * 3.14 * r)}cm²`, `${formatNumber(3.14 * r)}cm²`, `${answer + 3.14}cm²`], 0, `圆面积S=πr²=3.14×${r}²=${answer}cm²。`)
  }
  if (index < 15) {
    const r = 2 + (index % 4)
    const h = 5 + (index % 5)
    const answer = Number((3.14 * r * r * h).toFixed(2))
    return choiceQuestion('计算', 6, 2, `圆柱底面半径 ${r}cm，高 ${h}cm，体积是多少？(π取3.14)`, [`${answer}cm³`, `${formatNumber(3.14 * r * h)}cm³`, `${formatNumber(answer / 3)}cm³`, `${formatNumber(answer + h)}cm³`], 0, `圆柱体积V=πr²h=3.14×${r}²×${h}=${answer}cm³。`)
  }
  const a = 2 + (index % 4)
  const b = 3 + (index % 5)
  const answer = `${a * 2}:${b * 2}`
  return choiceQuestion('计算', 6, 2, `把比 ${a}:${b} 的前项和后项同时扩大到原来的2倍，结果是？`, [answer, `${a + 2}:${b + 2}`, `${a}:${b * 2}`, `${a * 2}:${b}`], 0, `比的前项和后项同时乘同一个不为0的数，比值不变，结果是${answer}。`)
})

const formulaQuestions: SeedQuestion[] = [
  ['长方形面积公式是？', ['S = 长 × 宽', 'C = 长 + 宽', 'S = 边长 × 4', 'V = 长 × 宽 × 高'], 0, '长方形面积=长×宽。'],
  ['正方形周长公式是？', ['C = 4a', 'S = a²', 'V = a³', 'C = 2πr'], 0, '正方形四条边相等，周长=边长×4。'],
  ['三角形面积公式是？', ['S = 底 × 高 ÷ 2', 'S = 底 × 高', 'S = (上底+下底)×高÷2', 'C = 3a'], 0, '三角形面积=底×高÷2。'],
  ['梯形面积公式是？', ['S = (上底 + 下底) × 高 ÷ 2', 'S = 上底 × 下底', 'S = 长 × 宽', 'V = Sh'], 0, '梯形面积=(上底+下底)×高÷2。'],
  ['长方体体积公式是？', ['V = 长 × 宽 × 高', 'S = 长 × 宽', 'V = a³', 'C = 4a'], 0, '长方体体积=长×宽×高。'],
  ['正方体体积公式是？', ['V = a³', 'S = 6a²', 'C = 4a', 'S = a²'], 0, '正方体体积=棱长×棱长×棱长。'],
  ['圆的周长公式是？', ['C = 2πr', 'S = πr²', 'V = πr²h', 'S = ab'], 0, '圆周长=2πr，也等于πd。'],
  ['圆的面积公式是？', ['S = πr²', 'C = πd', 'V = Sh', 'S = ah'], 0, '圆面积=π×半径²。'],
  ['圆柱体积公式是？', ['V = Sh', 'V = Sh ÷ 3', 'S = 2πr', 'C = πd'], 0, '圆柱体积=底面积×高。'],
  ['圆锥体积公式是？', ['V = Sh ÷ 3', 'V = Sh', 'S = πr²', 'C = 2πr'], 0, '圆锥体积=与它等底等高圆柱体积的三分之一。'],
  ['速度、时间、路程的关系是？', ['速度 × 时间 = 路程', '速度 + 时间 = 路程', '路程 × 时间 = 速度', '时间 ÷ 路程 = 速度'], 0, '路程=速度×时间。'],
  ['单价、数量、总价的关系是？', ['单价 × 数量 = 总价', '单价 + 数量 = 总价', '总价 × 数量 = 单价', '数量 - 单价 = 总价'], 0, '买东西常用关系：总价=单价×数量。'],
  ['工作效率、工作时间、工作总量的关系是？', ['效率 × 时间 = 总量', '效率 + 时间 = 总量', '总量 × 时间 = 效率', '时间 - 效率 = 总量'], 0, '工作总量=工作效率×工作时间。'],
  ['比例的基本性质是？', ['外项积等于内项积', '前项一定大于后项', '两个比必须相同数字', '比例没有等号'], 0, '在比例里，两个外项的积等于两个内项的积。'],
  ['百分率的通用计算方法是？', ['部分量 ÷ 总量 × 100%', '总量 ÷ 部分量', '部分量 + 总量', '总量 × 100'], 0, '百分率通常用部分量除以总量再乘100%。'],
  ['加法交换律是？', ['a + b = b + a', '(a+b)+c=a+(b+c)', 'a×b=b×a', '(a+b)×c=a×c+b×c'], 0, '两个数相加，交换加数位置，和不变。'],
  ['乘法分配律是？', ['(a+b)×c=a×c+b×c', 'a+b=b+a', 'a×b=b×a', '(a+b)+c=a+(b+c)'], 0, '一个数乘两个数的和，可以分别相乘再相加。'],
  ['分数的基本性质是？', ['分子分母同时乘或除以同一个非0数，分数大小不变', '分子加1分数不变', '分母越大分数越大', '分子分母随意变化'], 0, '分数基本性质是约分和通分的依据。'],
  ['小数乘法确定小数点的方法是？', ['因数一共有几位小数，积就有几位小数', '小数点永远在最后', '只看第一个因数', '不需要小数点'], 0, '小数乘法先按整数乘，再按因数小数位数确定积的小数位数。'],
  ['正比例关系可以怎样判断？', ['两种量的比值一定', '两种量的和一定', '两种量的差一定', '两种量没有关系'], 0, '正比例关系中，两种相关联的量比值一定。']
].map(([stem, options, correctIndex, explanation], index) => choiceQuestion('公式', index < 3 ? 3 : index < 8 ? 5 : 6, index < 10 ? 1 : 2, stem as string, options as string[], correctIndex as number, explanation as string))

export const mathQuestions: SeedQuestion[] = [
  ...grade1Calc,
  ...grade2Calc,
  ...grade3Calc,
  ...grade4Calc,
  ...grade5Calc,
  ...grade6Calc,
  ...formulaQuestions
]
