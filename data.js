// data.js

const QUIZ_DATA = {

  /* ───── FRAME 001–009 ───── */
  frames: [
    {
      id: 'f001', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 001', tagClass: 'tag-f',
      question: 'I ( ) in France for three years when I was a child, but I can\'t speak French at all.',
      options: ['have been', 'lived', 'have once stayed', 'went'],
      answer: 1, source: '奥羽大',
      translation: '私は子どものころ、3年間フランスに住んでいたが、フランス語はまったく話せない。',
      explanation: 'when以下より過去の内容であることがわかるので、過去形②livedを選ぶ。現在完了形は今の状況を示すので、①、③は誤り。④went「行った」はfor three years「3年間」と合わないので、誤り。'
    },
    {
      id: 'f002', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 002', tagClass: 'tag-f',
      question: 'He ( ) the book when I came here.',
      options: ['will read', 'was reading', 'has read', 'has been reading'],
      answer: 1, source: '東京農業大',
      translation: '私がここに来たとき、彼は本を読んでいた。',
      explanation: '空所に入る語はwhen以下が表す過去のある時点で進行していた動作を表すので、過去進行形②was readingを選ぶ。'
    },
    {
      id: 'f003', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 003', tagClass: 'tag-f',
      question: 'We will go outside when it ( ) raining.',
      options: ['stop', 'stops', 'stopping', 'stopped'],
      answer: 1, source: '東海大',
      translation: '雨があがったら、私たちは出かけるだろう。',
      explanation: 'when節は時を表す副詞節なので、未来のことでも現在形を用いる。主語itが3人称単数なので、②stopsを選ぶ。'
    },
    {
      id: 'f004', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 004', tagClass: 'tag-f',
      question: 'She ( ) the flower arrangement club.',
      options: ['belongs', 'belongs to', 'is belonging', 'is belonging to'],
      answer: 1, source: '共立女子大',
      translation: '彼女は華道部に所属している。',
      explanation: 'belong「所属する」は〈状態〉を表す動詞であり、原則として進行形にはできないので、現在形②belongs toを選ぶ。belongs to〜で「〜に所属する」という意味。'
    },
    {
      id: 'f005', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 005', tagClass: 'tag-f',
      question: 'She was ( ) to go out when it started raining.',
      options: ['almost', 'anyway', 'all', 'about'],
      answer: 3, source: '駒澤大',
      translation: '雨が降り出したとき、彼女は外出しようとしていたところだった。',
      explanation: 'be about to doで「まさに…するところだ」という意味を表すので、④aboutを選ぶ。'
    },
    {
      id: 'f006', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 006', tagClass: 'tag-f',
      question: 'It ( ) three years since the severe drought caused damage in the area.',
      options: ['has', 'is being', 'has been', 'has being'],
      answer: 2, source: '大東文化大',
      translation: '深刻な干ばつがその地域に被害を与えてから3年になる。',
      explanation: '「深刻な干ばつがその地域に被害を与えて」から現在までの〈状態の継続〉を表すように、現在完了形③has beenを選ぶ。'
    },
    {
      id: 'f007', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 007', tagClass: 'tag-f',
      question: 'Since Bob graduated from college last year, he ( ) around Asia.',
      options: ['is traveling', 'had been traveling', 'has been traveling', 'was traveling'],
      answer: 2, source: '玉川大',
      translation: 'ボブは去年大学を卒業して以来、アジア中をずっと旅行している。',
      explanation: '「ボブが去年大学を卒業して」から現在まで、「旅行する」という動作が継続していることを表すように、現在完了進行形③has been travelingを選ぶ。'
    },
    {
      id: 'f008', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 008', tagClass: 'tag-f',
      question: 'Before I arrived at the airport, the plane ( ).',
      options: ['had left', 'has left', 'will be left', 'will have left'],
      answer: 0, source: '奥羽大',
      translation: '私が空港に着く前に、飛行機は出発してしまっていた。',
      explanation: '「私が空港に着いた」ときより前に、飛行機が「出発してしまっていた」ということなので、過去のある時点までの〈完了〉を表す、過去完了形①had leftを選ぶ。'
    },
    {
      id: 'f009', type: 'choice', section: 'frames', sectionName: 'FRAME',
      label: 'FRAME 009', tagClass: 'tag-f',
      question: 'By next week you ( ) the package.',
      options: ['will have received', 'receiving', 'received', 'have received'],
      answer: 0, source: '南山大',
      translation: '来週までに、あなたは小包を受け取っているだろう。',
      explanation: 'By next weekより、未来のある時点までの〈完了〉を表す、未来完了形①will have receivedを選ぶ。'
    }
  ],

  /* ───── EXERCISE A 01–02 ───── */
  exA: [
    {
      id: 'a01', type: 'choice', section: 'exA', sectionName: 'Exercise A',
      label: 'Ex. A 01', tagClass: 'tag-a',
      question: 'The famous author ( ) the science fiction novel two years ago.',
      options: ['has been writing', 'writes', 'wrote', 'has written'],
      answer: 2, source: '東海大',
      translation: 'その有名な作家は2年前にそのSF小説を書いた。',
      explanation: 'two years agoと過去のある時点を表す表現があるので、過去形③wroteを選ぶ。現在完了形を用いることはできないので、④has writtenは不可。'
    },
    {
      id: 'a02', type: 'choice', section: 'exA', sectionName: 'Exercise A',
      label: 'Ex. A 02', tagClass: 'tag-a',
      question: 'Sandy ( ) in the library when I saw her two hours ago.',
      options: ['was studying', 'has studied', 'has been studying', 'is studying'],
      answer: 0, source: '北里大',
      translation: '私がサンディーを2時間前に見かけたとき、彼女は図書館で勉強していた。',
      explanation: 'when以下が過去のある時点を表しているので、その時点で進行していた動作を表すように、過去進行形①was studyingを選ぶ。'
    }
  ],

  exB: [],
  exC: []
};

const EIGO_SENTENCES = [
  { en: "An endangered species is a group of animals or plants which could soon become extinct.", ja: "絶滅危惧種とは、まもなく絶滅しそうな動物や植物の一群です。", grammar: "which could soon become extinct は関係代名詞節で a group of animals or plants を修飾。could は「〜するかもしれない」。" },
  { en: "Extinction happens when the last animal of the species has died out and there will be no more.", ja: "絶滅は、その種の最後の動物が死に絶え、もう存在しなくなったときに起こります。", grammar: "when ～ は「〜するとき」。has died out は現在完了「死に絶えてしまった」。there will be no more は「もう存在しないだろう」。" },
  { en: "Many species are nearly extinct and could disappear from the Earth very soon if we don't do anything to save them.", ja: "多くの種はほとんど絶滅しかけており、私たちが救うために何もしなければ、まもなく地球上から消えてしまうかもしれません。", grammar: "nearly extinct は「ほとんど絶滅している」。if we don't do anything to save them は条件節。to save them は「それらを救うために」（目的を表す不定詞）。" },
  { en: "There are many reasons why species become endangered, but most harm to species is due to human activities such as habitat destruction, hunting and overfishing.", ja: "種が絶滅危惧種になる理由はたくさんありますが、種への害のほとんどは生息地の破壊、狩猟、乱獲などの人間の活動によるものです。", grammar: "reasons why ～ は「〜する理由」。be due to ～ は「〜が原因である」。such as ～ は「〜などの」。" },
  { en: "Habitat destruction is the main reason why animals become endangered.", ja: "生息地の破壊が、動物が絶滅危惧種になる主な理由です。", grammar: "the main reason why ～ は「〜する主な理由」。become endangered は「絶滅危惧種になる」。" },
  { en: "First, when humans move into a new area, they cut down trees to build houses and farms.", ja: "まず、人間が新しい地域に移り住むと、家や農場を建てるために木を切り倒します。", grammar: "when ～ は「〜するとき」。cut down は「切り倒す」。to build ～ は目的を表す不定詞「〜を建てるために」。" },
  { en: "This destroys the animals' habitat – the natural environment where plants or animals usually live – and leaves them without food.", ja: "これは動物の生息地（植物や動物が通常生息する自然環境）を破壊し、食べ物を失わせます。", grammar: "destroy + 目的語 で「〜を破壊する」。leave A without B は「AをBなしの状態にする」。where ～ は関係副詞節。" },
  { en: "Animal habitats are also destroyed because of pollution.", ja: "動物の生息地は汚染によっても破壊されます。", grammar: "are destroyed は受け身「破壊される」。because of + 名詞 は「〜のために」。" },
  { en: "Dirty water from factories, which contains chemicals, ends up in rivers, and poisons used on farmland may even kill animals which live in the area.", ja: "工場からの汚れた水は化学物質を含み、川に流れ込み、農地で使われる毒物はその地域に住む動物を殺すことさえあります。", grammar: "which contains chemicals は非制限用法の関係代名詞節。end up in ～ は「最終的に〜に行き着く」。may は「〜かもしれない」。" },
  { en: "Animals such as the Arabian oryx are nearly extinct because of the high price of their meat.", ja: "アラビアオリックスのような動物は、その肉が高値であるため、ほとんど絶滅しかけています。", grammar: "such as ～ は「〜のような」。nearly extinct は「ほとんど絶滅した」。because of + 名詞 は「〜のために」。" },
  { en: "Other animals are killed for their fur, bones or skin – or just for sport.", ja: "他の動物は毛皮、骨、皮のために、あるいはスポーツのためだけに殺されます。", grammar: "are killed は受け身。for ～ は「〜のために」。just for sport は「ただスポーツのためだけに」。" },
  { en: "Large sea creatures like whales, tuna and sharks have all become endangered species because of overfishing – too many are caught to make special dishes that people like to eat, such as shark's fin soup or sushi.", ja: "クジラ、マグロ、サメのような大型海洋生物はすべて、乱獲のせいで絶滅危惧種になっています。フカヒレスープや寿司など、人々が好む特別な料理を作るために多く捕らえられすぎています。", grammar: "have become は現在完了。because of overfishing は「乱獲のために」。that people like to eat は関係代名詞節。such as ～ は「〜などの」。" },
  { en: "What steps can individuals and governments take to protect more animal and plant species from becoming endangered?", ja: "個人や政府はより多くの動物や植物の種を絶滅危惧種から守るために、どのような対策を取ることができるでしょうか。", grammar: "What + 名詞 + can 主語 + 動詞？の疑問文。to protect ～ from becoming は「〜が〜になるのを守るために」。" },
  { en: "We should try not to pollute natural areas, and farmers or companies who destroy animal habitats should face a financial penalty.", ja: "私たちは自然地域を汚染しないように努めるべきであり、動物の生息地を破壊する農家や企業は金銭的な罰を受けるべきです。", grammar: "try not to ～ は「〜しないように努める」。who destroy ～ は関係代名詞節。face a penalty は「罰を受ける」。" },
  { en: "The public can help out by refusing to buy products made from animals' body parts, such as seal fur coats or crocodile bags.", ja: "一般の人々は、アザラシの毛皮のコートやワニ革のバッグのような動物の体の一部から作られた製品を買わないことで助けることができます。", grammar: "by ～ing は「〜することによって」。refuse to ～ は「〜することを拒む」。made from ～ は過去分詞句で products を修飾。" },
  { en: "Governments can make it against the law to hunt, fish or trade in endangered species, and can also provide funding for animal sanctuaries and zoos.", ja: "政府は絶滅危惧種を狩ったり、捕ったり、取引したりすることを違法にし、動物保護区や動物園への資金提供もできます。", grammar: "make it against the law to ～ は「〜することを違法にする」。provide funding for ～ は「〜に資金を提供する」。" },
  { en: "These places protect animals from extinction by breeding more endangered animals, which can later be released into the wild.", ja: "これらの場所は絶滅危惧動物をより多く繁殖させることで動物を絶滅から守り、後に野生に放すことができます。", grammar: "protect A from B は「AをBから守る」。by ～ing は「〜することによって」。which can later be released は非制限用法の関係代名詞節。" },
  { en: "If we all cooperate by taking these steps, we will protect our planet so that our children and their children can enjoy it, too.", ja: "もし私たち全員がこれらの対策を取ることで協力すれば、私たちの子どもたちやその子どもたちも地球を楽しめるよう、地球を守ることができます。", grammar: "If + 現在形, will + 動詞の原形 で「もし〜なら、〜するだろう」。so that ～ can は「〜できるように」。by taking ～ は「〜することによって」。" }
];
