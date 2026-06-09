import type { Question } from '@/types'

type SeedQuestion = Omit<Question, 'id'>

function word(stem: string, value: string, hint: string, explanation: string, difficulty = 1): SeedQuestion {
  return { subject: '英语', question_type: '单词', grade: 6, difficulty, content: { stem, hint }, answer: { type: 'text', value }, explanation }
}

function sentence(stem: string, options: string[], answer: string, explanation: string, difficulty = 1): SeedQuestion {
  return {
    subject: '英语', question_type: '句子', grade: 6, difficulty,
    content: { stem, options: options.map((text, index) => ({ key: String.fromCharCode(65 + index), text })) },
    answer: { type: 'choice', value: answer }, explanation
  }
}

function reading(passageTitle: string, passage: string, questions: { stem: string; options: string[]; answer: string }[], explanation: string, difficulty = 2): SeedQuestion {
  return {
    subject: '英语', question_type: '英语阅读', grade: 6, difficulty,
    content: {
      passageTitle,
      passage,
      questions: questions.map(q => ({ stem: q.stem, options: q.options.map((text, index) => ({ key: String.fromCharCode(65 + index), text })) }))
    },
    answer: { type: 'reading', value: questions.map(q => q.answer) }, explanation
  }
}

const wordQuestions: SeedQuestion[] = [
  word('请拼写单词：苹果', 'apple', 'a____e', 'apple 是苹果，注意中间有两个 p。'),
  word('请拼写单词：香蕉', 'banana', 'b_____', 'banana 是香蕉，注意 a 和 n 的数量。'),
  word('请拼写单词：学生', 'student', 's______', 'student 是学生，结尾是 -ent。'),
  word('请拼写单词：图书馆', 'library', 'l______', 'library 是图书馆，注意 brar 的顺序。', 2),
  word('请拼写单词：天气', 'weather', 'w______', 'weather 是天气，不要和 whether 混淆。', 2),
  word('请拼写单词：老师', 'teacher', 't______', 'teacher 是老师，teach 加 -er 表示教的人。'),
  word('请拼写单词：教室', 'classroom', 'c________', 'classroom 是教室，由 class 和 room 组成。'),
  word('请拼写单词：铅笔', 'pencil', 'p_____', 'pencil 是铅笔，注意 c 发 /s/ 音。'),
  word('请拼写单词：家庭', 'family', 'f_____', 'family 是家庭，也可指家人。'),
  word('请拼写单词：朋友', 'friend', 'f_____', 'friend 是朋友，ie 的顺序要记牢。'),
  word('请拼写单词：早晨', 'morning', 'm______', 'morning 是早晨，常见短语 good morning。'),
  word('请拼写单词：晚上', 'evening', 'e______', 'evening 是晚上，常见短语 good evening。'),
  word('请拼写单词：星期一', 'Monday', 'M_____', 'Monday 是星期一，星期首字母要大写。'),
  word('请拼写单词：星期五', 'Friday', 'F_____', 'Friday 是星期五，首字母大写。'),
  word('请拼写单词：黄色', 'yellow', 'y_____', 'yellow 是黄色，注意双写 l。'),
  word('请拼写单词：绿色', 'green', 'g____', 'green 是绿色，也可表示绿色的。'),
  word('请拼写单词：动物', 'animal', 'a_____', 'animal 是动物，注意结尾 -mal。', 2),
  word('请拼写单词：季节', 'season', 's_____', 'season 是季节，一年有 four seasons。', 2),
  word('请拼写单词：早餐', 'breakfast', 'b________', 'breakfast 是早餐，常见短语 have breakfast。', 2),
  word('请拼写单词：重要的', 'important', 'i________', 'important 是重要的，注意 -tant 结尾。', 2)
]

const sentenceQuestions: SeedQuestion[] = [
  sentence('选择正确的句子：', ['She are a student.', 'She is a student.', 'She am a student.', 'She be a student.'], 'B', '主语 She 是第三人称单数，be 动词用 is。'),
  sentence('“他每天骑自行车上学”的正确翻译是：', ['He go to school by bike every day.', 'He goes to school by bike every day.', 'He going to school by bike every day.', 'He went to school by bike every day.'], 'B', 'every day 表示一般现在时，He 是第三人称单数，go 变 goes。'),
  sentence('选择正确的一般疑问句：', ['Do you like apples?', 'Does you like apples?', 'Are you like apples?', 'You like apples?'], 'A', '主语 you 的一般疑问句用 Do 开头。'),
  sentence('There ______ a book on the desk.', ['is', 'are', 'am', 'be'], 'A', 'a book 是单数，there be 结构用 is。'),
  sentence('There ______ many students in the classroom.', ['is', 'are', 'am', 'be'], 'B', 'many students 是复数，there be 结构用 are。'),
  sentence('I can ______ English songs.', ['sing', 'sings', 'singing', 'sang'], 'A', '情态动词 can 后面接动词原形。'),
  sentence('My mother ______ breakfast every morning.', ['make', 'makes', 'making', 'made'], 'B', '一般现在时中 My mother 是第三人称单数，动词加 s。'),
  sentence('______ is your birthday?', ['When', 'Where', 'What', 'Who'], 'A', '询问生日时间用 When。'),
  sentence('The cat is ______ the chair. 它在椅子下面。', ['under', 'on', 'in', 'near'], 'A', 'under 表示“在……下面”。'),
  sentence('This is ______ orange.', ['a', 'an', 'the a', '不填'], 'B', 'orange 以元音音素开头，前面用 an。'),
  sentence('I like ______ books after school.', ['read', 'reads', 'reading', 'to reading'], 'C', 'like doing sth. 表示喜欢做某事。'),
  sentence('选择正确翻译：我昨天去了公园。', ['I go to the park yesterday.', 'I went to the park yesterday.', 'I goes to the park yesterday.', 'I am go to the park yesterday.'], 'B', 'yesterday 表示过去，go 的过去式是 went。', 2),
  sentence('______ are my pencils. 这些是我的铅笔。', ['This', 'That', 'These', 'It'], 'C', 'pencils 是复数，近处多个用 These。'),
  sentence('How ______ apples do you have?', ['many', 'much', 'old', 'long'], 'A', 'apples 是可数名词复数，询问数量用 how many。'),
  sentence('选择正确答语：What is your favourite subject?', ['I like English best.', 'I am twelve.', 'It is sunny.', 'She is my sister.'], 'A', '问最喜欢的科目，应回答 I like ... best。'),
  sentence('We ______ football on Sundays.', ['play', 'plays', 'playing', 'played every'], 'A', '主语 We 是复数，一般现在时动词用原形。'),
  sentence('Look! The boys ______ basketball.', ['play', 'plays', 'are playing', 'played'], 'C', 'Look 提示正在发生，用现在进行时 are playing。', 2),
  sentence('选择正确句子：', ['He has two foots.', 'He has two feet.', 'He have two feet.', 'He having two feet.'], 'B', 'foot 的复数是 feet，He 后用 has。', 2),
  sentence('Would you like some water? 正确答语是：', ['Yes, please.', 'I am water.', 'No, I do.', 'Yes, I can.'], 'A', 'Would you like...? 的肯定回答常用 Yes, please。'),
  sentence('The library is next ______ the school.', ['to', 'in', 'on', 'under'], 'A', 'next to 表示“紧挨着，在……旁边”。')
]

const readingQuestions: SeedQuestion[] = [
  reading('Tom’s Day', 'Tom is a student. He is twelve years old. He gets up at 6:30 every morning. He goes to school at 7:30. He likes English and math. After school, he often plays basketball with his friends.', [
    { stem: 'How old is Tom?', options: ['Ten', 'Eleven', 'Twelve', 'Thirteen'], answer: 'C' },
    { stem: 'What does Tom often do after school?', options: ['Watch TV', 'Play basketball', 'Play football', 'Go shopping'], answer: 'B' }
  ], '答案均可从短文原句中找到。'),
  reading('My Family', 'I am Lily. There are four people in my family: my father, my mother, my brother and me. My father is a doctor. My mother is a teacher. My brother likes drawing.', [
    { stem: 'How many people are there in Lily’s family?', options: ['Three', 'Four', 'Five', 'Six'], answer: 'B' },
    { stem: 'What does Lily’s mother do?', options: ['A doctor', 'A teacher', 'A nurse', 'A driver'], answer: 'B' }
  ], '根据 four people 和 teacher 判断。'),
  reading('A Sunny Day', 'It is sunny today. Mike puts on his cap and goes to the park. He flies a kite with his sister. They are very happy.', [
    { stem: 'How is the weather?', options: ['Sunny', 'Rainy', 'Snowy', 'Windless'], answer: 'A' },
    { stem: 'What does Mike do in the park?', options: ['Reads books', 'Flies a kite', 'Swims', 'Cooks'], answer: 'B' }
  ], '短文第一句和第三句给出答案。'),
  reading('School Lunch', 'Our school lunch starts at 12:00. Today we have rice, fish, vegetables and soup. I like the vegetables best because they are fresh.', [
    { stem: 'When does lunch start?', options: ['11:00', '12:00', '1:00', '2:00'], answer: 'B' },
    { stem: 'What does the writer like best?', options: ['Rice', 'Fish', 'Vegetables', 'Soup'], answer: 'C' }
  ], '抓住时间和 like ... best。'),
  reading('The New Library', 'There is a new library near our school. It is big and quiet. Students can read books there after class, but they must keep quiet.', [
    { stem: 'Where is the new library?', options: ['Near the school', 'Near the zoo', 'In the park', 'At home'], answer: 'A' },
    { stem: 'What must students do?', options: ['Run', 'Sing', 'Keep quiet', 'Eat food'], answer: 'C' }
  ], 'library near our school 和 keep quiet 是关键词。'),
  reading('A Birthday Party', 'Today is Ann’s birthday. Her friends come to her home. They eat a cake, sing songs and play games. Ann gets a storybook from her best friend.', [
    { stem: 'Whose birthday is it?', options: ['Ann’s', 'Tom’s', 'Lily’s', 'Mike’s'], answer: 'A' },
    { stem: 'What gift does Ann get?', options: ['A toy', 'A storybook', 'A pen', 'A bag'], answer: 'B' }
  ], '答案来自第一句和最后一句。'),
  reading('At the Zoo', 'Lucy goes to the zoo with her parents. She sees pandas, monkeys and elephants. The pandas are eating bamboo. The monkeys are jumping in the trees.', [
    { stem: 'Who goes to the zoo with Lucy?', options: ['Her friends', 'Her parents', 'Her teacher', 'Her brother'], answer: 'B' },
    { stem: 'What are the pandas eating?', options: ['Bananas', 'Apples', 'Bamboo', 'Grass'], answer: 'C' }
  ], '根据 with her parents 和 eating bamboo 判断。'),
  reading('My Weekend', 'On Saturday morning, Jack cleans his room. In the afternoon, he visits his grandparents. On Sunday, he reads books and does his homework.', [
    { stem: 'What does Jack do on Saturday morning?', options: ['Cleans his room', 'Plays football', 'Goes swimming', 'Watches TV'], answer: 'A' },
    { stem: 'When does he read books?', options: ['On Friday', 'On Saturday morning', 'On Sunday', 'Every night'], answer: 'C' }
  ], '注意时间 Saturday morning 和 Sunday。'),
  reading('A Small Shop', 'There is a small shop beside my house. It sells milk, bread, eggs and fruit. I often buy milk there after school.', [
    { stem: 'Where is the shop?', options: ['Beside the house', 'Behind the school', 'In the library', 'Near the river'], answer: 'A' },
    { stem: 'What does the writer often buy?', options: ['Bread', 'Milk', 'Eggs', 'Fruit'], answer: 'B' }
  ], 'beside my house 和 buy milk 是关键信息。'),
  reading('The Lost Dog', 'A little dog is lost. It is white and has black ears. Ben finds it near the gate and calls the phone number on its collar.', [
    { stem: 'What color is the dog?', options: ['Black', 'White with black ears', 'Brown', 'Yellow'], answer: 'B' },
    { stem: 'Where does Ben find it?', options: ['Near the gate', 'In the classroom', 'At the zoo', 'On the bus'], answer: 'A' }
  ], '颜色和地点都在短文中直接出现。'),
  reading('Planting Trees', 'Our class plants trees on Tree Planting Day. Some students dig holes. Some students water the young trees. We hope the trees will grow tall and strong.', [
    { stem: 'What does the class do?', options: ['Plants trees', 'Cooks dinner', 'Buys books', 'Washes cars'], answer: 'A' },
    { stem: 'What do some students water?', options: ['Flowers', 'Young trees', 'Animals', 'Desks'], answer: 'B' }
  ], 'plants trees 和 water the young trees 是答案依据。'),
  reading('A Note', 'Dear Mum, I am going to the school library with Linda. I will come back at 5:00. Please do not worry. Love, Amy', [
    { stem: 'Where is Amy going?', options: ['To the library', 'To the cinema', 'To the park', 'To the shop'], answer: 'A' },
    { stem: 'When will Amy come back?', options: ['At 4:00', 'At 5:00', 'At 6:00', 'At 7:00'], answer: 'B' }
  ], '便条中直接说明地点和时间。'),
  reading('Four Seasons', 'Spring is warm and flowers come out. Summer is hot and children like swimming. Autumn is cool and leaves turn yellow. Winter is cold and it often snows.', [
    { stem: 'Which season is hot?', options: ['Spring', 'Summer', 'Autumn', 'Winter'], answer: 'B' },
    { stem: 'What happens in autumn?', options: ['Flowers come out', 'Leaves turn yellow', 'It often snows', 'Children swim'], answer: 'B' }
  ], '根据每个季节的描述作答。'),
  reading('My Hobby', 'Peter likes collecting stamps. He has stamps from China, Canada and the UK. He learns a lot about different countries from the stamps.', [
    { stem: 'What is Peter’s hobby?', options: ['Collecting stamps', 'Playing chess', 'Drawing pictures', 'Running'], answer: 'A' },
    { stem: 'What can he learn from stamps?', options: ['Different countries', 'Cooking', 'Dancing', 'Driving'], answer: 'A' }
  ], '第一句和最后一句说明答案。'),
  reading('On the Farm', 'My uncle has a farm. There are cows, sheep and chickens on it. Every morning, he feeds the animals and collects eggs.', [
    { stem: 'Who has a farm?', options: ['My uncle', 'My aunt', 'My teacher', 'My friend'], answer: 'A' },
    { stem: 'What does he collect?', options: ['Milk', 'Eggs', 'Apples', 'Books'], answer: 'B' }
  ], '短文说明 uncle has a farm 和 collects eggs。'),
  reading('A Rainy Morning', 'It is raining this morning. Mary takes an umbrella to school. Her shoes are wet, but she is not sad because she likes listening to the rain.', [
    { stem: 'What does Mary take?', options: ['An umbrella', 'A kite', 'A camera', 'A ball'], answer: 'A' },
    { stem: 'Why is Mary not sad?', options: ['She likes the rain', 'She has new shoes', 'She stays at home', 'She misses school'], answer: 'A' }
  ], 'take an umbrella 和 likes listening to the rain 是关键。'),
  reading('The Music Room', 'The music room is on the second floor. We have music lessons there every Tuesday. There is a piano and many drums in the room.', [
    { stem: 'Where is the music room?', options: ['On the first floor', 'On the second floor', 'On the third floor', 'Near the gate'], answer: 'B' },
    { stem: 'When do they have music lessons?', options: ['Every Monday', 'Every Tuesday', 'Every Friday', 'Every Sunday'], answer: 'B' }
  ], '地点和时间都在前两句。'),
  reading('Buying Shoes', 'Kate goes shopping with her mother. She wants a pair of white shoes. The shoes are nice, but they are too small. At last, she buys a bigger pair.', [
    { stem: 'What color shoes does Kate want?', options: ['White', 'Black', 'Red', 'Blue'], answer: 'A' },
    { stem: 'Why does she not buy the first pair?', options: ['Too small', 'Too dirty', 'Too old', 'Too cheap'], answer: 'A' }
  ], 'white shoes 和 too small 是答案依据。'),
  reading('A Good Helper', 'Sam helps his father wash the car. He brings water and cleans the windows. His father says, “You are a good helper.” Sam feels proud.', [
    { stem: 'What does Sam help wash?', options: ['The car', 'The bike', 'The dog', 'The floor'], answer: 'A' },
    { stem: 'How does Sam feel?', options: ['Proud', 'Angry', 'Hungry', 'Tired and sad'], answer: 'A' }
  ], 'help wash the car 和 feels proud 是关键信息。'),
  reading('The Email', 'Hi Mike, I am in Beijing now. I visited the Great Wall yesterday. It was long and old. Tomorrow I will go to a museum. Yours, John', [
    { stem: 'Where is John now?', options: ['Beijing', 'Shanghai', 'London', 'New York'], answer: 'A' },
    { stem: 'What did John visit yesterday?', options: ['The Great Wall', 'A zoo', 'A museum', 'A shop'], answer: 'A' }
  ], '邮件中说明地点和昨天参观的地方。')
]

export const englishQuestions: SeedQuestion[] = [
  ...wordQuestions,
  ...sentenceQuestions,
  ...readingQuestions
]
