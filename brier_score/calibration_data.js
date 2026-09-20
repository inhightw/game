const QUESTIONS = [
  {
    "id": 1,
    "text": "大象是世界上最大的哺乳動物。",
    "answer": false,
    "explanation": "Blue whale is the largest mammal."
  },
  {
    "id": 2,
    "text": "海獺有時會在睡覺時牽著手。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 3,
    "text": "蜈蚣的腳比任何動物都多。",
    "answer": false,
    "explanation": "Centipede have up to 354 legs. But millipedes have as amny as 750 legs."
  },
  {
    "id": 4,
    "text": "哺乳動物和恐龍曾經共存。",
    "answer": true,
    "explanation": "The first mammals appeared roughly 200 million years ago. Dinosaurs went extinct 65 million years ago."
  },
  {
    "id": 5,
    "text": "熊不能爬樹。",
    "answer": false,
    "explanation": ""
  },
  {
    "id": 6,
    "text": "駱駝把水儲存在駝峰中。",
    "answer": false,
    "explanation": "Fat, not water."
  },
  {
    "id": 7,
    "text": "火烈鳥因為吃蝦而變成粉紅色。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 8,
    "text": "大貓熊主要吃竹子。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 9,
    "text": "鴨嘴獸是唯一會下蛋的哺乳動物。",
    "answer": false,
    "explanation": "The other one is echidna."
  },
  {
    "id": 10,
    "text": "騾子是公驢和母馬的雜交品種。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 11,
    "text": "馬的馬力通常大於一馬力。",
    "answer": true,
    "explanation": "A horse has about 18 KW or 24 HP."
  },
  {
    "id": 12,
    "text": "鱷魚的咬合力可達每平方英吋5000磅。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 13,
    "text": "蝴蝶用腳來品嚐味道。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 14,
    "text": "同卵雙胞胎擁有相同的指紋。",
    "answer": false,
    "explanation": ""
  },
  {
    "id": 15,
    "text": "你的大腦會不斷地“吃掉自己”。",
    "answer": true,
    "explanation": "The process is called phagocytosis where immune cells consume damaged cells, waste, and weak neural connections"
  },
  {
    "text": "Moxa (四零四科技) 成立於 1987 年?",
    "answer": true,
    "explanation": "",
    "id": 16
  },
  {
    "text": "QMD (Quality Management Division) 目前有四個部門?",
    "answer": true,
    "explanation": "",
    "id": 17
  },
  {
    "text": "QRM (Quality & Reliability Management) 目前有三個課?",
    "answer": true,
    "explanation": "",
    "id": 18
  },
  {
    "text": "第一屆可靠度科學論壇 (Reliability circle) 辦在 2021 年?",
    "answer": true,
    "explanation": "",
    "id": 19
  },
  {
    "text": "今年 (2026) 的可靠度科學論壇 (Reliability circle) 是\"第六屆\"?",
    "answer": true,
    "explanation": "",
    "id": 20
  },
  {
    "id": 21,
    "text": "2024-2025 年總人口數：德國 > 英國",
    "answer": true,
    "explanation": "Germany (84 M); United Kingdom (69 M)"
  },
  {
    "id": 22,
    "text": "2024-2025 年總人口數：義大利 > 埃及",
    "answer": false,
    "explanation": "Italy (59 M); Egypt (118 M)"
  },
  {
    "id": 23,
    "text": "2024-2025 年總人口數：南韓 > 臺灣",
    "answer": true,
    "explanation": "South Korea (51 M); Taiwan (23 M)"
  },
  {
    "id": 24,
    "text": "2024-2025 年總人口數：泰國 > 越南",
    "answer": false,
    "explanation": "Thailand (71 M); Vietnam (101 M)"
  },
  {
    "id": 25,
    "text": "2024-2025 年總人口數：阿根廷 > 法國",
    "answer": false,
    "explanation": "Argentina (45 M); France (66 M)"
  },
  {
    "id": 26,
    "text": "2024-2025 年總人口數：俄羅斯 > 巴西",
    "answer": false,
    "explanation": "Russia (144 M); Brazil (212 M)"
  },
  {
    "id": 27,
    "text": "2024-2025 年總人口數：伊朗 > 伊拉克",
    "answer": true,
    "explanation": "Iraq (47 M); Iran (92 M)"
  },
  {
    "id": 28,
    "text": "2024-2025 年總人口數：中國 > 印度",
    "answer": false,
    "explanation": "China (1416 M); India (1463 M)"
  },
  {
    "id": 29,
    "text": "2024-2025 年總人口數：美國 > 墨西哥",
    "answer": true,
    "explanation": "USA (347 M); Mexico (131 M)"
  },
  {
    "id": 30,
    "text": "2024-2025 年總人口數：丹麥 > 以色列",
    "answer": false,
    "explanation": "Denmark (6 M); Israel (9 M)"
  },
  {
    "id": 31,
    "text": "火星和地球一樣只有一個衛星。",
    "answer": false,
    "explanation": "mars has two moons, Phobos and Deimos."
  },
  {
    "id": 32,
    "text": "壞血病是因為缺乏維他命C引起的。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 33,
    "text": "黃銅是由鐵和銅製成的。",
    "answer": false,
    "explanation": "Brass is mad of zinc and copper."
  },
  {
    "id": 34,
    "text": "一湯匙油的熱量比一湯匙奶油高。",
    "answer": true,
    "explanation": "One tablespoon of oil has about 120 calories. For butter, up to 110 calories."
  },
  {
    "id": 35,
    "text": "氦是最輕的元素。",
    "answer": false,
    "explanation": "It's hydrogen, not helium."
  },
  {
    "id": 36,
    "text": "普通感冒是由細菌引起的。",
    "answer": false,
    "explanation": "By virus."
  },
  {
    "id": 37,
    "text": "地球上最深的地方位於太平洋。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 38,
    "text": "季節的變化是地球繞太陽橢圓軌道造成的。",
    "answer": false,
    "explanation": "Seasons are caused by the tilt of earth's axis."
  },
  {
    "id": 39,
    "text": "木星是太陽系中最大的行星。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 40,
    "text": "固體中的原子比氣體中的原子排列更密集。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 41,
    "text": "地球自轉速度正在變慢。",
    "answer": false,
    "explanation": "It's going faster since 2020 possibly due to melting glaciers, atmospheric pressures, and ocean currents."
  },
  {
    "id": 42,
    "text": "第一種人造塑膠是在19世紀發明的。",
    "answer": true,
    "explanation": "It's called Parkesine  invetned by British chemist Alexander Parkes in 1862."
  },
  {
    "id": 43,
    "text": "火星呈橄欖球形狀。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": 44,
    "text": "在量子力學中，粒子不能同時具有波與粒子的特性。",
    "answer": false,
    "explanation": ""
  },
  {
    "id": 45,
    "text": "無塵室具有高熵值。",
    "answer": false,
    "explanation": "Entropy is a measure of how messy or disorganized something is. When things are neat and orderly, entropy is low. Otherwise, it's high."
  }
];