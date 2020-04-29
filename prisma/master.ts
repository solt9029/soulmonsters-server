import { prisma } from './generated/index';

async function main() {
  await prisma.createCard({
    name: '天気の神　ルテルテ改',
    kind: 'MONSTER',
    type: 'CIRCLE',
    attribute: 'BLUE',
    attack: 600,
    defence: 500,
    cost: 2,
    detail: '◼1ターンに1度\n●エナジー1\nデッキからカードを1枚ドローする。',
    picture:
      'https://lh3.googleusercontent.com/tlMRbToeDRfwYVdts_wbuxWgnjAfAZzbhSSMeilsaMLxY4HDRC5V9J04Ol_aVWky9hGmwjdzxiysfphAfJHiUveNneOAqYEwkZE6PyUdRONb5y5Zhp3R_AA1yT7dDFXabclypbbeFp57pB6YUBZq04SZyQbe-QrLCrRCAQxiPV5hSfWbYIeDX42fQTAXZPyDnnv0_xSkJzFHv0s8I4PylNpnUPlc9XfBy7A_ksRv5iJC6q6ouXmmmAmk06HHCuZD1xGv3KB6iA0rYLn66pqQsTn1mE_IhDsP3kiUQtMv7oaTYAKSJ71YyeJ-ZC3NMjCh7-uYV93pctb7ipHmmgBc5fBy8N6r2DTYX4EO8PLOmaIN93RhcgQYD5TXPSHxfBhomA3HT7oyYFfOXeULM39FJ8PuNErZs1RpMMzFByT1QpjQLuxFqd68a7SWw7AQpOpWWsi9LhRCC7dnoamOq1-sZzffTAxEzwquYVR1cOZewPeB7zTFqGYsR1xZe95tx0I3fARgsz220WE-eL7k-5E0jXjv15rGqKwvTd7KWAl8dQ1-fgWn7Sx-UNcYUtFHmkVejvhW5hS-oTL8Tlhmw4K1O9Joa4k1Y1zIkFj7-T5CtEdfyD0XVe4ghtXozP-5ydKxbOSNSOt_7NExdlyrBtlgqTK783-koLFWpXFbZRHzFvmazE4x2S_nYGlrshyLcw7RDd0L746LeRoZSEeKgDGaPDmcV0LbBEWpr0AHulW0Ej-EmkIYqvBiT6s=w238-h219-no',
  });

  await prisma.createCard({
    name: '再復活したタキビー',
    kind: 'MONSTER',
    type: 'TRIANGLE',
    attribute: 'RED',
    attack: 1600,
    defence: 300,
    cost: 4,
    detail:
      '◼このカードが相手を直接攻撃したとき\n相手ライフに1000ダメージを与える。',
    picture:
      'https://lh3.googleusercontent.com/7kJa-TFJx9qb0DOgSLH_cZGOLW__tOipQ80FnOAxXO0eTLUjW6HTFuKPoYuOBBjzIvYNWtKBNU_LI2hX1xMUfyFyBPjt25wpOpm_60eRdGWqfGBB6JiI-d2w8v-A157Kxx22ipBpb5uN4ayJScTXPNvY4fUhYIUfHw0MP7H4DHJXSgEcp0f3i-lryPzFFOUM0c38AwNHj46b7WGhSe3O07ipCCXUMs3xOBJ0y7DLBoTTOXwReyU0KWqmIwU1eyUAof0cjChWsgFeHGg9mWgw1wqHmqQilFW6IJk7XhKrddGatSXTeyVoBoLB5rBPUefjYIAoLkIzGjkzt8LzziUb9JR47xxwS_Hle1zLaD_VCsDpKbRDyK8mW2mmyKHAKfjbRAFvaQgdXq0kmwTwTRaFlTjkqfqAiZZYUcrRsfTpWLamnpGKVwD3pgARN1dMdMoCu6JxgZvk7GrgiZfu0vq7uqdKfIi4xeR0PwemtbiRBpSqpaV8VcXEUevlGZlWS10-htGSown_6s6rOMQOm0n-4glGkiRPPe0T0Xw1-qDusdbSfnghXZJg2a73id8fH-7ppg7aaqHocf-zbMVEp7jHoJigQ5bHpLU-XLCQ84Rbsk2u_V5H3mtXrfJDxbzqYPT-zwkHus1qmaCY5U1weOeeId1j5taGpW1nn9OVvg8FJC5knivjakrmEBgQsARIOTePTSBwJCLXkdD-QYWpJaforBaAlV06EQm70Fi_Z-0nvCYSFQSfre_5Llo=w239-h218-no',
  });

  await prisma.createCard({
    name: 'スピードラゴン＆スピーバード',
    kind: 'MONSTER',
    type: 'CIRCLE',
    attribute: 'WHITE',
    attack: 0,
    defence: 0,
    cost: 0,
    detail: '●ソウル3\n相手モンスター1枚の表示形式を変更する。',
    picture:
      'https://lh3.googleusercontent.com/9A_zuuXJ9BUEQa9njSARMOt5PWUlUKGUS2n8csxa_NcvclkdoOoI1FFE-OESv_0zu2yfVGdN-JEUi1rMY5ALLiTY133nqXFpsDpCk4QhXu81EO9-psA2LHNAdN5yLqFf9Ilek8WLKfsY6dHkC44Bz-frV49S8AAgIk3nySKChVzDJ3NQbK6CMDy_jRyr4LzZTYsHIODPlDBVbqHBHqZeUXPH66G-bOpZjRtJ9Ty0kAdxFiqYYVWXa7m6CHebvpYXG2jAJa-7Fg6-fBMqYBIdgvwt-XOEFxqgK01bXaM1Pz0LollA151HQOZTKa3SEbvYSg_Umf6V0oBK6PAErJvAgriTaFchmYiJ1kxUGV25bYn2On2xGmnCvoCqH3dWADLN5BNl45Nl64s9i7fTUngk1onIJEjeq2UYsk3R_79ISBr4rXTvZDqUIeZWpZ73bTMuo98H0vL-HxcTAjtRKhbQ8lbk0MOw_D6nnxhZ0uAgdwyx40143pLglcTyYpvE_KrnSwYxDaalV5vXNFhzIF7D2ZcaZnbO4HyIk2yQ6ffyDqfHfzEMUoXC9FKAgADddzuFH0fM3d2xgKu2lbH5cUer6OcrTyPqM7k0GiPDFxFE9VtrxriuwJ3xw6Ljf0HetNMyYb4FyBNYgEXVB7Hi3JRQskkTbb2RYOCORn6WKpPTeJfL9sZv92EI35dzfEhHpFlyxFfSjh8zD85b45ZC5mWJS824J8w3DnwBBK-YM4vKk3hWBNIHvPwvQGE=w239-h218-no',
  });

  await prisma.createCard({
    name: '森の村長　エメラル',
    kind: 'MONSTER',
    type: 'RECTANGLE',
    attribute: 'GREEN',
    attack: 1200,
    defence: 1700,
    cost: 4,
    detail: '◼1ターンに1度\n自分のエナジーを1増やす。',
    picture:
      'https://lh3.googleusercontent.com/3G5hYOzcHBpGpeKfONEJ_nbaenzrGkD48X51LYGcorA5ZNDeqAhqSmJzZLdST0AaoMqM5T9DIGWlfKipVaosRems4XvoQAtrLlAMAFQrmZYH4y5eFyT2fKd5G-1udLldp3JDPpsz_cEJrKIDFqKgDDzqYJIhMZdW1qP8iVi02hIxwz5bGH-gCOnDM5h0XXndypKtkOw43M8kbRMPhyasm41aojbSnSjTGvldP9cH_slwldgrWGHgCgv5Dh6NIg83IhT4cD4l99kR9S3SX-igVDLPKT81aoSqCU8ZEOGMSXdZtePqVQD1UsMlCCyaHNBfX1_T4lbqA43paiK683tqVwdKRqZffP89mdm27BGKycgp-MUXFslNBO-os30ID5MZ60eCBR_rWYxnVbIkxmyfVNfmErP7itkJCHmDEACjZ-w2rI1q8qL_-Kd1CBu0eI2ezcahXRknkQsC7_Yu5_XjO48605Ld5HPLLcqlvimELlV3vV0yK8ZRj_mjavUBbBjuofcd5L8F0T4V9t5yyovA4r-MFRXJwNjVl-Z5PWiFxwx10zCt9Cus6gNTOaYe0hL1pdHqi-z02SQNLx2W3Fxe6l5v8owq2aLw6wJCCPFX1YeBOwFp9qPfuGjyF_nkzb_NShNAVnX2NXsKSUGZpbHmUrIAV7eepPBMv-UQWzmZtWsR4NCO6RCLFYZNtUfBF_sk94PMnLUOH6jTi1A39vOzr0X21WcSk_1hIVJAx_8ANHwt7cNEuoPi14I=w239-h218-no',
  });
}

main().catch(err => console.error(err));
