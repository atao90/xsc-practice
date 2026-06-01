import type { MathFormula } from '@/types'

export const mathFormulas: Omit<MathFormula, 'id'>[] = [
  { grade: 1, category: '加减法', name: '加法交换律', formula: 'a + b = b + a', description: '两个数相加，交换加数的位置，和不变。' },
  { grade: 1, category: '加减法', name: '凑十法', formula: '9+几 → 凑成10+(几-1)', description: '计算9加几时，先把几分成1和另一个数，9+1=10再加剩下的数。' },
  { grade: 2, category: '乘法', name: '乘法口诀', formula: '一一得一 ~ 九九八十一', description: '九九乘法口诀表是计算乘除法的基础。' },
  { grade: 2, category: '乘法', name: '乘法交换律', formula: 'a × b = b × a', description: '两个数相乘，交换因数的位置，积不变。' },
  { grade: 3, category: '几何', name: '长方形周长', formula: 'C = (a + b) × 2', description: '长方形周长 = (长 + 宽) × 2' },
  { grade: 3, category: '几何', name: '正方形周长', formula: 'C = 4a', description: '正方形周长 = 边长 × 4' },
  { grade: 3, category: '几何', name: '长方形面积', formula: 'S = a × b', description: '长方形面积 = 长 × 宽' },
  { grade: 3, category: '几何', name: '正方形面积', formula: 'S = a²', description: '正方形面积 = 边长 × 边长' },
  { grade: 4, category: '运算律', name: '乘法分配律', formula: '(a + b) × c = a × c + b × c', description: '两个数的和与一个数相乘，可以先把它们分别与这个数相乘，再相加。' },
  { grade: 4, category: '运算律', name: '加法结合律', formula: '(a + b) + c = a + (b + c)', description: '三个数相加，先把前两个数相加再加第三个数，或先把后两个数相加再加第一个数，和不变。' },
  { grade: 4, category: '几何', name: '三角形面积', formula: 'S = a × h ÷ 2', description: '三角形面积 = 底 × 高 ÷ 2' },
  { grade: 4, category: '几何', name: '平行四边形面积', formula: 'S = a × h', description: '平行四边形面积 = 底 × 高' },
  { grade: 4, category: '几何', name: '梯形面积', formula: 'S = (a + b) × h ÷ 2', description: '梯形面积 = (上底 + 下底) × 高 ÷ 2' },
  { grade: 5, category: '几何', name: '长方体体积', formula: 'V = a × b × h', description: '长方体体积 = 长 × 宽 × 高' },
  { grade: 5, category: '几何', name: '正方体体积', formula: 'V = a³', description: '正方体体积 = 棱长 × 棱长 × 棱长' },
  { grade: 5, category: '分数', name: '分数加减法', formula: 'a/b ± c/d = (ad ± bc) / bd', description: '异分母分数相加减，先通分再计算。' },
  { grade: 5, category: '分数', name: '分数乘法', formula: 'a/b × c/d = ac/bd', description: '分数乘分数，分子乘分子，分母乘分母。' },
  { grade: 5, category: '小数', name: '小数乘法', formula: '先按整数乘，再点小数点', description: '因数中一共有几位小数，就从积的右边起数出几位，点上小数点。' },
  { grade: 6, category: '几何', name: '圆的周长', formula: 'C = πd = 2πr', description: '圆周长 = 圆周率 × 直径 = 2 × 圆周率 × 半径，π≈3.14' },
  { grade: 6, category: '几何', name: '圆的面积', formula: 'S = πr²', description: '圆面积 = 圆周率 × 半径的平方' },
  { grade: 6, category: '几何', name: '圆柱体积', formula: 'V = πr²h', description: '圆柱体积 = 底面积(πr²) × 高' },
  { grade: 6, category: '几何', name: '圆锥体积', formula: 'V = πr²h ÷ 3', description: '圆锥体积 = 同底等高圆柱体积的 1/3' },
  { grade: 6, category: '比例', name: '比例的基本性质', formula: 'a : b = c : d → ad = bc', description: '在比例里，两个外项的积等于两个内项的积。' },
  { grade: 6, category: '百分数', name: '百分率公式', formula: '百分率 = 数量 ÷ 总数 × 100%', description: '出勤率、合格率、成活率等百分率的通用公式。' }
]
