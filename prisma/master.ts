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
      'https://lh3.googleusercontent.com/k23uZNlje2ER4DxaHKr_HSnd0slrRQHXk8BfhO2umxfzHUm0WiHZdXI71momtKrl9BkSIAjElb0HehDdzv98uCQxAUCJ84iyB5zTpuINGzL7-bpo-jvj1z3iiJ4pP-VQkC8o5PXBQlhFhSaCpMfHxLBzIJyTvBYz76BwsKvtRgFXqkHYMy901rK7E_xkLsF1_fXq0Cy51fVUZvIT9grXLQz3r1y_Ma9CigYPJWlt63gWTfM_yZSlqxXwflSMV9_r98EpZjtqwN-2hnYnWI29sOl62VjQiw__08vWxHz3Cj-5Tr5ioZbRxcyRcPZfRtC_l9OoCBiR2QrzRBJbQy7ieF7hcinSBk53vrXTLfPf-B1fSd7KzKl71O9k-9xcilNhzcc4xniIiHal5M8gl-nqV3EP7ytxfEMsFw03eyjd9O3RSVne0JBeb2oEyONqz0EPmrcau17hxz-piPpFozs8gw2mLOHvaG7CUuC1WWQqnp68vCTi5PRjYQWyIEIwZTuVhuQXMXuzuLpK9L76t-OwA4k5nUyubtrXRzzL1Zg0HVD3Z6fjw4c03DZ5wHlIG0CMN-lhCaJbe_8BB0rm9NQW1WjMpORz_xJfPtB-WPWAYt8uyheJ62ISEoNwUEed85KFys06j5K0lewrLXKyJyriRkSabyMnhRw9BoMScamRNhJVzMVB35NHF5hxsX9HUC1T4rImFTuzfHHM1YuttSe8fW-f5i7hYqcHOHvssBv39c_StQ0I6qJ3EZI=w500-h715-no',
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
      'https://lh3.googleusercontent.com/uYjzOEd05jKFgB91cQveSJGQE5U_F1lS4dHqdITsl3iAcvN_WcMsLUmmU6jxnla7k0zBv4cN4F7WWbUh4AR39UXPYM0_qeYmTQdTQo91vaXykgkT0in1eWrEtRMug4GVgd3ECrAoySFo2b2ORl3o71GmFQPLTnECHtHcGW9u_p9yv-5EUC5pv8_43TLBOO_uAryj6dMbxi4xvG0hlZYWZJ_noe_zegN_Mx-yu-ALu6H8Yj_rzV6meRNpGmNvUulMsS0Ic1Jn8iAJOb1jNRzoBdspYqLwF9ebsBelT2ydIsIZRuTIx6uOCCiXpN_bfX8CnX4btMQn9J5aK40zIWI60Yrnb617vsiy3MFZFGjHnJaH52me0HyIEfXk-vzI9kVIejbcXHtEZe0Hq_Phqx8edGGAfz8YQ-DUjruFhwvG83qKtMxvnQCnjtBKJ5lJdodv1APHGtihhE0OVIEmrpo8WRitvuMpU-XnKCxqv2QprTz0IX0Yst2LJn8Sn7dI7SHe00Zk7FeGYqitsqYFLw21va4TL8MHVKSBt2qibU5Swsx3jvbonQyk0urbHjojgdw7vp93tx-dJSxozyabLXzC5IORas_xktNWUt_zrztK4IY8Z1sNxUERYHq0rTpKkRBpxf4lU36BE5q-AMvrYrFqNRUegBPjqYrUTrpXiYrDEMYrBuK-6lYdBRjnOSeKrzvJZ7eZfoKgGOfbj_R1L0F3ypFdUILf5KblPPR9EDXhgRgiERYEy4nSM0I=w500-h715-no',
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
      'https://lh3.googleusercontent.com/_TwywpThKA7eHDdfU9O6j3veuXOznmlHq6Dh3vVht2PFK44P5RUiyUTtmg-1ty5W197W7E0UrFYd1KlWGKfkEHd8nUtVKDYvXFgHqTnoivCtNyigeONKHWIzQmgPR-g3fvsfk5uN96RnEg4cSZkraY5yddrCqiZY0PYVZPIxyhomvOaVvlwI7LmRz0Uh7LD_ZEIxxGwv8MvmVwQOUQ7szTuAlVE3_ATphtgwY7tZg2KL8H_IwQPgTZ9wrDJZkTcSvxeF7hCxaUoJLE9YsBSm5aIW4uGfcK4r9PT3ZD_t48hsCW1VUwNPHOv6l4uSMP_m_AL9BD2xpUB1L1U1hyMlFn3s6yxUiVuM0gMWuwwMwGQwaOziwVGJeJbyPgcst9pvKDXTnn1xqk90gQMJsxrQPqnRvfbLHSHame-kDHNWwlZJh2amuWOhLnT4jH7lvHpRQ0JttvX7k5rtIjVsife34ZQ1rdOjtjTS-DGexuCaYBbSKymHRTUowD1iuPQaMeiCL5RSJ2eFY46nOG4E-MBTLyIyjj1tT93M_P9WIQeLmVhhw-x-89mrg30_OaxeIG8eKa1jLbGI-EjNH3Q0k3-j9H71yO-DClMI-mt8I1YwXhTcoRu4ordabryLTLyu5sSt2298JPkRoHHsM93-6HZmL053OjDPtCqST8m1zLc9z0lkZr96kRdR79YyBvJg6mZ1DWT9BENpZqbUDm3a93leAQ_Juh3Aq-Ku_9xXiCaZhdwoSSbnUsIwxGU=w500-h715-no',
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
      'https://lh3.googleusercontent.com/sY5qrKrdQYNakOlTcPuv5m6dy5EJEqqfa1dqYDwh8lVseTO1DOwkVU9MCQ3YMsHsHSI7azX56jwaMMr7K9VeLIzrJ0NEZtu21kD085txpSYZ2pAKg-sAbtp3D4A4uBpB7A6GsCeHwODOoUOK4Va_GIWCRrpFQB3t0zGg6zZNUev0oWhLF-QP2UtG42RSY_sFZj-ACO3d8vqqoN_EG3hTFSZ4UtvdnYTHlltxJj6X-pONkfGpMD5QcotCkkyNEBbCqaw2NItpyDtHjjvPjQkQRlLvs-hXskX_kvzDCqH8iD-GK6GupPmaH0BCgbRUZMWrlNHu0iaTnWLtV-TWMNqswr9jwDKk_IGOOc4U0eMr_d_6hSSlWYanctZcHxAltraeZJj7VmsN2y6s9FKSzMvwX3yXoRw7FGKHD08o3JUuTp5uzWXStjpL_gdLvn_579yIpYXM4P2F11Psb685FPFr8pJkSge2KhkaBUyBVI0eAHFiBz87J3-zp9GuzbgL7weBKL6vnJhfo76Kx4Oy0nxUlTfHtlhWCp93Me0rSSmXw4uAtqshgdkjlGRi-j3OHr6m40iKY-y1RlGpt2iWfi1mquTn24mIVv0be8w4qAiHPRJJtqHXpo-_wvA6iUBOff374fu3oYDFL1OYl4n8pT3h72F4rVPrtCAhh0lR_MLMt2Cp3Tz0PsmWZjevBzGQDLX0bSXe44pFDYt4b3qNC1JSK-gdnk4DIyIfeuLfaJ5xsXYcIl1gRgkUyJE=w500-h715-no',
  });

  await prisma.createCard({
    name: 'ヘドロン',
    kind: 'MONSTER',
    type: 'TRIANGLE',
    attribute: 'PURPLE',
    attack: 1000,
    defence: 600,
    cost: 3,
    detail:
      '●ソウル3\n自分のモルグゾーンに置かれている紫属性モンスター1枚をバトルゾーンに置く。',
    picture:
      'https://lh3.googleusercontent.com/pw/ACtC-3c_vpDDbjkMxQGTi775hHbMJd64WC6bmnUcWrzUike63NK5Pk1i7137-4Mgybrr-K2WZ2PjLIDfeQy1tH9n2ubll6QttANkX_xn1IiwATO33jkqxXsHFud8e5sm6jy7dbp7nuw8NTT-XDGOQ8SAhSblWg=w500-h715-no?authuser=0',
  });

  await prisma.createCard({
    name: 'さらにみずみずしい魚',
    kind: 'MONSTER',
    type: 'RECTANGLE',
    attribute: 'BLUE',
    attack: 200,
    defence: 300,
    cost: 1,
    detail: '■1ターンに1度\n●ソウル3\nデッキからカードを2枚ドローする。',
    picture:
      'https://lh3.googleusercontent.com/pw/ACtC-3ex6FRzBJnI7fAHy4gDdFZV-Apj_FklVwDFfBmms5bhHRxy4acRQoWz3Lu4mAvaQJDCscuU1l4OtTtAXRKLz4RDWJQzaBSTz7P8lvXvCSpZOsw6clTlRGJ7MKW65lCupLAXVzsdT3h8SGoGAYV4W3wzOg=w500-h715-no?authuser=0',
  });

  await prisma.createCard({
    name: '進化したバクボムダン',
    kind: 'MONSTER',
    type: 'TRIANGLE',
    attribute: 'RED',
    attack: 1500,
    defence: 600,
    cost: 4,
    detail:
      '■バトルゾーンからソウルゾーンに置かれたとき\n相手ライフに600のダメージを与える。',
    picture:
      'https://lh3.googleusercontent.com/pw/ACtC-3dfaWOlzhjbywPk6iTahvugdfz5z87OflHR7D4SiWKisdv2-EpjP6eeSbOHyiutCr3PXSb6_pJMm4SuW-cNpX-rg-51vF6i2DCicQLfNgtC5TB4ep5_XQ8TUsQp9G2sCmexKD4ZjQCgJNu2t8Lm_wOEBw=w500-h715-no?authuser=0',
  });

  await prisma.createCard({
    name: '懐かしのルード',
    kind: 'MONSTER',
    type: 'CIRCLE',
    attribute: 'WHITE',
    attack: 300,
    defence: 300,
    cost: 1,
    detail:
      '●エナジー2\n相手モンスター1枚の攻撃力をこのターンのエンドタイムまで700下げる。',
    picture:
      'https://lh3.googleusercontent.com/pw/ACtC-3e_TwurBT8oL0wbI1qD8Vw6fkZrqu1xGbcEFb0kHH_JGXbLyh3oyOhSJb53C_kgtIBwlBWOIB1MANxe3Kv3Nu5d5HXlBfa4dYUF_sTSRVrkg8VQovzxWH65l1GzRx7M3seYi3AnMBb2Blu19e6gkhCEMw=w500-h715-no?authuser=0',
  });
}

main().catch(err => console.error(err));
